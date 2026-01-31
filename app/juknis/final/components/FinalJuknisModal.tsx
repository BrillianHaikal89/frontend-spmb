"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

/* ================= HELPER ================= */
function formatWilayah(username?: string) {
  if (!username) return "";
  return username
    .replace(/^kab_/, "Kabupaten ")
    .replace(/^kota_/, "Kota ")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

// Jenjang berdasarkan role
const JENJANG_BY_ROLE = {
  provinsi: ["SD", "SMP", "SMA"],
  kabupaten: ["SD", "SMP"],
  kota: ["SD", "SMP"],
};

/* ================= COMPONENT ================= */
export default function JuknisModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const wilayah = formatWilayah(user?.username);
  const userRole = user?.role?.toLowerCase() || "";

  // Dapatkan jenjang yang diizinkan berdasarkan role
  const getJenjangByRole = () => {
    if (userRole.includes("provinsi")) return JENJANG_BY_ROLE.provinsi;
    if (userRole.includes("kabupaten")) return JENJANG_BY_ROLE.kabupaten;
    if (userRole.includes("kota")) return JENJANG_BY_ROLE.kota;
    return [];
  };

  const allowedJenjang = getJenjangByRole();

  const [loading, setLoading] = useState(false);
  const [usedJenjang, setUsedJenjang] = useState<string[]>([]);
  const [availableJenjang, setAvailableJenjang] = useState<string[]>(allowedJenjang);

  const [form, setForm] = useState({
    jenjang: "",
    pejabat_penandatangan: "",
    tgl_penetapan_juknis: "",
    tgl_mulai_pendaftaran: "",
    tgl_penetapan_kelulusan: "",
    tgl_daftar_ulang: "",
    persen_domisili: 0,
    persen_afirmasi: 0,
    persen_prestasi: 0,
    persen_mutasi: 0,
    data_dukung_lainnya: "",
  });

  /* ================= AMBIL JENJANG YANG SUDAH ADA ================= */
  useEffect(() => {
    if (!token) return;

    const fetchUsedJenjang = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/used-jenjang`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (!json.success) return;

        setUsedJenjang(json.data);

        // Filter jenjang yang tersedia berdasarkan role dan jenjang yang sudah digunakan
        const filtered = allowedJenjang.filter(
          (j) => !json.data.includes(j)
        );

        setAvailableJenjang(filtered);

        // reset jenjang kalau sudah tidak valid
        if (!filtered.includes(form.jenjang)) {
          setForm((f) => ({ ...f, jenjang: "" }));
        }
      } catch {
        // diamkan, tidak mengganggu UI
      }
    };

    fetchUsedJenjang();
  }, [token, allowedJenjang]); // Tambahkan allowedJenjang ke dependencies

  const total =
    Number(form.persen_domisili) +
    Number(form.persen_afirmasi) +
    Number(form.persen_prestasi) +
    Number(form.persen_mutasi);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("persen_")) {
      const nextValue = clamp(Number(value));
      const next = { ...form, [name]: nextValue };

      const nextTotal =
        Number(next.persen_domisili) +
        Number(next.persen_afirmasi) +
        Number(next.persen_prestasi) +
        Number(next.persen_mutasi);

      if (nextTotal > 100) return;

      setForm(next);
      return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (total !== 100) {
      alert("Total persentase harus tepat 100%");
      return;
    }

    if (!token) {
      alert("Sesi login berakhir, silakan login ulang");
      return;
    }

    // Validasi tambahan untuk role dan jenjang
    if (!allowedJenjang.includes(form.jenjang)) {
      alert("Jenjang ini tidak diizinkan untuk role Anda");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, String(v))
    );
    formData.append("wilayah", wilayah);

    if (e.target.juknis_file.files[0]) {
      formData.append("juknis_file", e.target.juknis_file.files[0]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      alert("Data juknis berhasil disimpan");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between rounded-t-xl bg-blue-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Tambah Juknis
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 bg-blue-50 p-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Select
            label="Jenjang"
            name="jenjang"
            value={form.jenjang || ""} // Pastikan selalu string
            onChange={handleChange}
            options={availableJenjang}
            disabled={availableJenjang.length === 0}
          />

          {availableJenjang.length === 0 && (
            <div className="lg:col-span-4">
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                Semua jenjang untuk wilayah Anda sudah terisi. Tidak ada jenjang tersedia untuk ditambahkan.
              </p>
            </div>
          )}

          <Input 
            label="Pejabat Penandatangan" 
            name="pejabat_penandatangan" 
            value={form.pejabat_penandatangan || ""} 
            onChange={handleChange} 
          />
          <Input 
            type="date" 
            label="Tgl Penetapan Juknis" 
            name="tgl_penetapan_juknis" 
            value={form.tgl_penetapan_juknis || ""} 
            onChange={handleChange} 
          />
          <Input 
            type="date" 
            label="Tgl Mulai Pendaftaran" 
            name="tgl_mulai_pendaftaran" 
            value={form.tgl_mulai_pendaftaran || ""} 
            onChange={handleChange} 
          />
          <Input 
            type="date" 
            label="Tgl Penetapan Kelulusan" 
            name="tgl_penetapan_kelulusan" 
            value={form.tgl_penetapan_kelulusan || ""} 
            onChange={handleChange} 
          />
          <Input 
            type="date" 
            label="Tgl Daftar Ulang" 
            name="tgl_daftar_ulang" 
            value={form.tgl_daftar_ulang || ""} 
            onChange={handleChange} 
          />

          <Input 
            type="number" 
            label="% Domisili" 
            name="persen_domisili" 
            value={form.persen_domisili || 0} 
            onChange={handleChange} 
          />
          <Input 
            type="number" 
            label="% Afirmasi" 
            name="persen_afirmasi" 
            value={form.persen_afirmasi || 0} 
            onChange={handleChange} 
          />
          <Input 
            type="number" 
            label="% Prestasi" 
            name="persen_prestasi" 
            value={form.persen_prestasi || 0} 
            onChange={handleChange} 
          />
          <Input 
            type="number" 
            label="% Mutasi" 
            name="persen_mutasi" 
            value={form.persen_mutasi || 0} 
            onChange={handleChange} 
          />

          {/* TOTAL */}
          <div className="lg:col-span-4">
            <p
              className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                total === 100
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-orange-300 bg-orange-50 text-orange-700"
              }`}
            >
              Total Persentase: {total}%
            </p>
          </div>

          <Input type="file" name="juknis_file" label="File Juknis" />

          <div className="lg:col-span-4">
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Data Dukung Lainnya
            </label>
            <textarea
              name="data_dukung_lainnya"
              value={form.data_dukung_lainnya || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="lg:col-span-4 flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-blue-300 bg-white px-5 py-2 text-gray-800 hover:bg-blue-100">
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading || total !== 100 || availableJenjang.length === 0 || !form.jenjang}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= INPUT & SELECT ================= */
function Input({ label, type = "text", value, ...props }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      {type === "file" ? (
        <input
          type="file"
          {...props}
          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-300
          disabled:bg-blue-100 disabled:cursor-not-allowed"
        />
      ) : (
        <input
          type={type}
          value={value}
          {...props}
          min={type === "number" ? 0 : undefined}
          max={type === "number" ? 100 : undefined}
          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-300
          disabled:bg-blue-100 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );
}

function Select({ label, options, disabled, value = "", ...props }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <select
        {...props}
        value={value}
        disabled={disabled}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-100 disabled:cursor-not-allowed"
      >
        <option value="">Pilih</option>
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}