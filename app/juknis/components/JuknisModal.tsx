"use client";

import { X } from "lucide-react";
import { useState } from "react";
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

  const [loading, setLoading] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  const [totalPersen, setTotalPersen] = useState(0);
  const [infoPersen, setInfoPersen] = useState("");

  const wilayah = formatWilayah(user?.username);

  /* ================= HITUNG PERSEN ================= */
  const hitungTotalPersen = (form: HTMLFormElement) => {
    const total =
      Number(form.persen_domisili.value || 0) +
      Number(form.persen_afirmasi.value || 0) +
      Number(form.persen_prestasi.value || 0) +
      Number(form.persen_mutasi.value || 0);

    setTotalPersen(total);

    if (total < 100) {
      setInfoPersen(`Masih kurang ${100 - total}%`);
    } else if (total > 100) {
      setInfoPersen(`Kelebihan ${total - 100}%`);
    } else {
      setInfoPersen("Total persentase sudah tepat 100%");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (totalPersen !== 100) {
      alert("Total persentase harus tepat 100%");
      return;
    }

    if (!token) {
      alert("Sesi login berakhir, silakan login ulang");
      return;
    }

    setLoading(true);
    const f = e.target;
    const formData = new FormData();

    formData.append("wilayah", wilayah);
    formData.append("jenjang", f.jenjang.value);
    formData.append("pejabat_penandatangan", f.pejabat_penandatangan.value);

    formData.append("tgl_penetapan_juknis", f.tgl_penetapan_juknis.value);
    formData.append("tgl_mulai_pendaftaran", f.tgl_mulai_pendaftaran.value);
    formData.append("tgl_penetapan_kelulusan", f.tgl_penetapan_kelulusan.value);
    formData.append("tgl_daftar_ulang", f.tgl_daftar_ulang.value);

    formData.append("persen_domisili", f.persen_domisili.value);
    formData.append("persen_afirmasi", f.persen_afirmasi.value);
    formData.append("persen_prestasi", f.persen_prestasi.value);
    formData.append("persen_mutasi", f.persen_mutasi.value);

    if (f.juknis_file.files[0]) {
      formData.append("juknis_file", f.juknis_file.files[0]);
    }

    if (f.data_dukung_lainnya?.value) {
      formData.append("data_dukung_lainnya", f.data_dukung_lainnya.value);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const ct = res.headers.get("content-type");
      if (!ct?.includes("application/json")) {
        throw new Error(await res.text());
      }

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal menyimpan data");
      }

      alert("Data juknis berhasil disimpan");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative w-full max-w-5xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-blue-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Tambah Juknis
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          onChange={(e: any) => hitungTotalPersen(e.currentTarget)}
          className="grid grid-cols-1 gap-4 bg-blue-50 p-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Field label="Wilayah">
            <input
              value={wilayah}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-blue-200 bg-blue-100 px-3 py-2 text-gray-900"
            />
          </Field>

          <Select name="jenjang" label="Jenjang" options={["SD", "SMP", "SMA"]} />
          <Input name="pejabat_penandatangan" label="Pejabat Penandatangan" />

          <Input name="tgl_penetapan_juknis" type="date" label="Tgl Penetapan Juknis" />
          <Input name="tgl_mulai_pendaftaran" type="date" label="Tgl Mulai Pendaftaran" />
          <Input
            name="tgl_penetapan_kelulusan"
            type="date"
            label="Tgl Penetapan Kelulusan"
          />
          <Input name="tgl_daftar_ulang" type="date" label="Tgl Daftar Ulang" />

          <Input name="persen_domisili" type="number" label="% Domisili" />
          <Input name="persen_afirmasi" type="number" label="% Afirmasi" />
          <Input name="persen_prestasi" type="number" label="% Prestasi" />
          <Input name="persen_mutasi" type="number" label="% Mutasi" />

          {/* INFO TOTAL */}
          <div className="md:col-span-4">
            <p
              className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                totalPersen === 100
                  ? "border-green-300 bg-green-50 text-green-700"
                  : totalPersen > 100
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-orange-300 bg-orange-50 text-orange-700"
              }`}
            >
              Total: {totalPersen}% — {infoPersen}
            </p>
          </div>

          <Input
            name="juknis_file"
            type="file"
            label="File Juknis"
            onChange={(e: any) => setHasFile(e.target.files?.length > 0)}
          />

          {hasFile && (
            <Field label="Data Dukung Lainnya">
              <textarea
                name="data_dukung_lainnya"
                rows={3}
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900"
              />
            </Field>
          )}

          {/* ACTION */}
          <div className="md:col-span-4 mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-blue-300 bg-white px-5 py-2 text-gray-800 hover:bg-blue-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || totalPersen !== 100}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */
function Field({ label, children }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ label, name, type = "text", ...props }: any) {
  return (
    <Field label={label}>
      <input
        name={name}
        type={type}
        min={0}
        max={100}
        required={type !== "file"}
        {...props}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </Field>
  );
}

function Select({ label, name, options }: any) {
  return (
    <Field label={label}>
      <select
        name={name}
        required
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Pilih</option>
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Field>
  );
}
