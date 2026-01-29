"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

/* ================= HELPER ================= */
function toInputDate(date?: string) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function JuknisEditModal({
  data,
  onClose,
  onSuccess,
}: any) {
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    jenjang: data.jenjang, // SD | SMP | SMA
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

  const totalPersen =
    Number(form.persen_domisili) +
    Number(form.persen_afirmasi) +
    Number(form.persen_prestasi) +
    Number(form.persen_mutasi);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (totalPersen !== 100) {
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

      alert("Juknis berhasil diperbarui");
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/30">
      <div className="my-8 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between rounded-t-xl bg-blue-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Juknis
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-blue-50 p-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input label="Wilayah" value={data.wilayah} disabled />

          {/* ===== SELECT JENJANG ===== */}
          <Select
            label="Jenjang"
            name="jenjang"
            value={form.jenjang}
            onChange={handleChange}
            options={["SD", "SMP", "SMA"]}
          />

          <Input
            label="Pejabat Penandatangan"
            name="pejabat_penandatangan"
            value={form.pejabat_penandatangan}
            onChange={handleChange}
          />

          <Input type="date" label="Tgl Penetapan Juknis" name="tgl_penetapan_juknis" value={form.tgl_penetapan_juknis} onChange={handleChange} />
          <Input type="date" label="Tgl Mulai Pendaftaran" name="tgl_mulai_pendaftaran" value={form.tgl_mulai_pendaftaran} onChange={handleChange} />
          <Input type="date" label="Tgl Penetapan Kelulusan" name="tgl_penetapan_kelulusan" value={form.tgl_penetapan_kelulusan} onChange={handleChange} />
          <Input type="date" label="Tgl Daftar Ulang" name="tgl_daftar_ulang" value={form.tgl_daftar_ulang} onChange={handleChange} />

          <Input type="number" label="% Domisili" name="persen_domisili" value={form.persen_domisili} onChange={handleChange} />
          <Input type="number" label="% Afirmasi" name="persen_afirmasi" value={form.persen_afirmasi} onChange={handleChange} />
          <Input type="number" label="% Prestasi" name="persen_prestasi" value={form.persen_prestasi} onChange={handleChange} />
          <Input type="number" label="% Mutasi" name="persen_mutasi" value={form.persen_mutasi} onChange={handleChange} />

          {/* TOTAL */}
          <div className="md:col-span-2">
            <p
              className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                totalPersen === 100
                  ? "border-green-300 bg-green-50 text-green-700"
                  : totalPersen > 100
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-orange-300 bg-orange-50 text-orange-700"
              }`}
            >
              Total Persentase: {totalPersen}%
            </p>
          </div>

          <Input type="file" label="Ganti File Juknis (Opsional)" name="juknis_file" />

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Data Dukung Lainnya
            </label>
            <textarea
              name="data_dukung_lainnya"
              value={form.data_dukung_lainnya}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* FOOTER */}
          <div className="md:col-span-2 sticky bottom-0 bg-blue-50 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-blue-300 bg-white px-5 py-2 text-gray-800 hover:bg-blue-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */
function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-300
        disabled:bg-blue-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

/* ================= SELECT ================= */
function Select({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Pilih Jenjang</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
