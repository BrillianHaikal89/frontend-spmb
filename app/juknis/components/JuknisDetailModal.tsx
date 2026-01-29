"use client";

import { X } from "lucide-react";

/* ================= HELPER ================= */
function formatTanggal(dateString?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function JuknisDetailModal({
  data,
  onClose,
}: {
  data: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-blue-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Detail Juknis
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 text-sm">
          <Detail label="Wilayah" value={data.wilayah} />
          <Detail label="Jenjang" value={data.jenjang} />
          <Detail
            label="Pejabat Penandatangan"
            value={data.pejabat_penandatangan}
          />

          <Detail
            label="Tgl Penetapan Juknis"
            value={formatTanggal(data.tgl_penetapan_juknis)}
          />
          <Detail
            label="Tgl Mulai Pendaftaran"
            value={formatTanggal(data.tgl_mulai_pendaftaran)}
          />
          <Detail
            label="Tgl Penetapan Kelulusan"
            value={formatTanggal(data.tgl_penetapan_kelulusan)}
          />
          <Detail
            label="Tgl Daftar Ulang"
            value={formatTanggal(data.tgl_daftar_ulang)}
          />

          <Detail label="% Domisili" value={`${data.persen_domisili}%`} />
          <Detail label="% Afirmasi" value={`${data.persen_afirmasi}%`} />
          <Detail label="% Prestasi" value={`${data.persen_prestasi}%`} />
          <Detail label="% Mutasi" value={`${data.persen_mutasi}%`} />

          {data.data_dukung_lainnya && (
            <div className="md:col-span-2">
              <Detail
                label="Data Dukung Lainnya"
                value={data.data_dukung_lainnya}
              />
            </div>
          )}

          {data.juknis_file && (
            <div className="md:col-span-2">
              <a
                href={data.juknis_file}
                target="_blank"
                className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Download File Juknis
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end rounded-b-xl bg-blue-50 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900">{value || "-"}</p>
    </div>
  );
}
