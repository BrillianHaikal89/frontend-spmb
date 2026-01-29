"use client";

import { X } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useState } from "react";

/* ================= HELPER ================= */
function formatKabupaten(username?: string) {
  if (!username) return "";

  return username
    .replace(/^kab_/, "Kabupaten ")
    .replace(/^kota_/, "Kota ")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ================= COMPONENT ================= */
export default function JuknisModal({ onClose }: { onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore.getState().token;
  const [loading, setLoading] = useState(false);

  const kabupaten = formatKabupaten(user?.username);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const f = e.target;
    const formData = new FormData();

    // kabupaten dari username login
    formData.append("kabupaten_kota", kabupaten);

    formData.append("jenjang", f.jenjang.value);
    formData.append("pejabat_penandatangan", f.pejabat.value);
    formData.append("tgl_penetapan", f.tgl_penetapan.value);
    formData.append("tgl_mulai", f.tgl_mulai.value);
    formData.append("tgl_kelulusan", f.tgl_kelulusan.value);
    formData.append("tgl_daftar_ulang", f.tgl_daftar_ulang.value);

    // persen
    formData.append("persen_domisili", f.domisili.value);
    formData.append("persen_afirmasi", f.afirmasi.value);
    formData.append("persen_prestasi", f.prestasi.value);
    formData.append("persen_mutasi", f.mutasi.value);

    if (f.juknis.files[0]) {
      formData.append("file_juknis", f.juknis.files[0]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/juknis`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan juknis");

      alert("Juknis berhasil disimpan");
      onClose();
      window.location.reload();
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl rounded-xl border border-blue-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Tambah Juknis
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Kabupaten otomatis */}
          <Field label="Kabupaten / Kota">
            <input
              value={kabupaten}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-gray-800"
            />
          </Field>

          <Select name="jenjang" label="Jenjang" options={["SD", "SMP"]} />
          <Input name="pejabat" label="Pejabat Penandatangan" />
          <Input name="tgl_penetapan" type="date" label="Tgl Penetapan Juknis" />

          <Input name="tgl_mulai" type="date" label="Tgl Mulai Pendaftaran" />
          <Input name="tgl_kelulusan" type="date" label="Tgl Penetapan Kelulusan" />
          <Input name="tgl_daftar_ulang" type="date" label="Tgl Daftar Ulang" />

          <Input name="domisili" type="number" label="% Domisili" />
          <Input name="afirmasi" type="number" label="% Afirmasi" />
          <Input name="prestasi" type="number" label="% Prestasi" />
          <Input name="mutasi" type="number" label="% Mutasi" />

          <FileInput name="juknis" label="Unggah Juknis (PDF)" />

          <div className="md:col-span-4 mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-blue-200 bg-white px-5 py-2 text-gray-700 hover:bg-blue-50"
            >
              Batal
            </button>
            <button
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
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
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ label, name, type = "text" }: any) {
  return (
    <Field label={label}>
      <input
        name={name}
        type={type}
        required
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-800"
      >
        <option value="">Pilih</option>
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Field>
  );
}

function FileInput({ label, name }: any) {
  return (
    <Field label={label}>
      <input
        type="file"
        name={name}
        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-800"
      />
    </Field>
  );
}
