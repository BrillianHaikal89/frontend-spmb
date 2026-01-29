"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

/* ================= HELPER ================= */
function toInputDate(date?: string) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/* ================= COMPONENT ================= */
export default function JuknisEditModal({
  data,
  onClose,
  onSuccess,
}: {
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    wilayah: data.wilayah,
    jenjang: data.jenjang,
    pejabat_penandatangan: data.pejabat_penandatangan,
    tgl_penetapan_juknis: toInputDate(data.tgl_penetapan_juknis),
    tgl_mulai_pendaftaran: toInputDate(data.tgl_mulai_pendaftaran),
    tgl_penetapan_kelulusan: toInputDate(data.tgl_penetapan_kelulusan),
    tgl_daftar_ulang: toInputDate(data.tgl_daftar_ulang),
    persen_domisili: data.persen_domisili,
    persen_afirmasi: data.persen_afirmasi,
    persen_prestasi: data.persen_prestasi,
    persen_mutasi: data.persen_mutasi,
    data_dukung_lainnya: data.data_dukung_lainnya || "",
  });

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

    setLoading(true);
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, String(v))
    );

    if (e.target.juknis_file.files[0]) {
      formData.append("juknis_file", e.target.juknis_file.files[0]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/${data.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      alert("Data juknis berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 sm:p-4">
      <div
        className="
          w-full max-w-5xl rounded-xl bg-white shadow-xl flex flex-col
          max-h-[90vh] overflow-hidden
          lg:max-h-none lg:overflow-visible
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-blue-100 px-4 py-3 sm:px-6 rounded-t-xl">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Edit Juknis
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-blue-200">
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-blue-50 p-4 sm:p-6
            grid grid-cols-1 gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            flex-1 overflow-y-auto
            lg:flex-none lg:overflow-visible
          "
        >
          <Input label="Wilayah" value={form.wilayah} disabled />
          <Select label="Jenjang" name="jenjang" value={form.jenjang} onChange={handleChange} options={["SD", "SMP", "SMA"]} />
          <Input label="Pejabat Penandatangan" name="pejabat_penandatangan" value={form.pejabat_penandatangan} onChange={handleChange} />

          <Input type="date" label="Tgl Penetapan" name="tgl_penetapan_juknis" value={form.tgl_penetapan_juknis} onChange={handleChange} />
          <Input type="date" label="Tgl Mulai" name="tgl_mulai_pendaftaran" value={form.tgl_mulai_pendaftaran} onChange={handleChange} />
          <Input type="date" label="Tgl Kelulusan" name="tgl_penetapan_kelulusan" value={form.tgl_penetapan_kelulusan} onChange={handleChange} />
          <Input type="date" label="Tgl Daftar Ulang" name="tgl_daftar_ulang" value={form.tgl_daftar_ulang} onChange={handleChange} />

          <Input type="number" label="% Domisili" name="persen_domisili" value={form.persen_domisili} onChange={handleChange} />
          <Input type="number" label="% Afirmasi" name="persen_afirmasi" value={form.persen_afirmasi} onChange={handleChange} />
          <Input type="number" label="% Prestasi" name="persen_prestasi" value={form.persen_prestasi} onChange={handleChange} />
          <Input type="number" label="% Mutasi" name="persen_mutasi" value={form.persen_mutasi} onChange={handleChange} />

          {/* TOTAL */}
          <div className="lg:col-span-3">
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

          {/* DATA DUKUNG */}
          <div className="lg:col-span-3">
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Data Dukung Lainnya
            </label>
            <textarea
              name="data_dukung_lainnya"
              value={form.data_dukung_lainnya}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <Input type="file" name="juknis_file" label="Ganti File Juknis" />

          {/* ACTION */}
          <div className="lg:col-span-3 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-blue-300 bg-white px-5 py-2 text-gray-900 hover:bg-blue-100">
              Batal
            </button>
            <button type="submit" disabled={loading || total !== 100} className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= INPUT & SELECT ================= */
function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        {...props}
        min={0}
        max={100}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-300 disabled:bg-blue-100"
      />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Pilih</option>
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
