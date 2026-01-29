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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      {/* CONTAINER */}
      <div
        className="
          w-full max-w-5xl
          rounded-xl bg-white shadow-xl
          flex flex-col
          
          /* MOBILE: scroll */
          max-h-[90vh] overflow-hidden
          
          /* DESKTOP: full height, no scroll */
          lg:max-h-none lg:overflow-visible
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between rounded-t-xl bg-blue-100 px-4 py-3 sm:px-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Detail Juknis
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-blue-200"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            bg-blue-50
            p-4 sm:p-6

            /* MOBILE scroll */
            flex-1 overflow-y-auto

            /* DESKTOP no scroll */
            lg:flex-none lg:overflow-visible
          "
        >
          <div
            className="
              grid grid-cols-1 gap-4 text-sm
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            <Detail label="Wilayah" value={data.wilayah} />
            <Detail label="Jenjang" value={data.jenjang} />
            <Detail label="Pejabat Penandatangan" value={data.pejabat_penandatangan} />

            <Detail label="Tgl Penetapan Juknis" value={formatTanggal(data.tgl_penetapan_juknis)} />
            <Detail label="Tgl Mulai Pendaftaran" value={formatTanggal(data.tgl_mulai_pendaftaran)} />
            <Detail label="Tgl Penetapan Kelulusan" value={formatTanggal(data.tgl_penetapan_kelulusan)} />

            <Detail label="Tgl Daftar Ulang" value={formatTanggal(data.tgl_daftar_ulang)} />
            <Detail label="% Domisili" value={`${data.persen_domisili}%`} />
            <Detail label="% Afirmasi" value={`${data.persen_afirmasi}%`} />

            <Detail label="% Prestasi" value={`${data.persen_prestasi}%`} />
            <Detail label="% Mutasi" value={`${data.persen_mutasi}%`} />

            {data.data_dukung_lainnya && (
              <div className="sm:col-span-2 lg:col-span-3">
                <Detail
                  label="Data Dukung Lainnya"
                  value={data.data_dukung_lainnya}
                />
              </div>
            )}

            {data.juknis_file && (
              <div className="sm:col-span-2 lg:col-span-3">
                <a
                  href={data.juknis_file}
                  target="_blank"
                  className="
                    inline-flex items-center justify-center
                    rounded-lg bg-blue-600
                    px-6 py-2
                    text-sm font-medium text-white
                    hover:bg-blue-700
                  "
                >
                  Download File Juknis
                </a>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end rounded-b-xl bg-blue-100 px-4 py-3 sm:px-6">
          <button
            onClick={onClose}
            className="
              rounded-lg border border-blue-300
              bg-white px-5 py-2
              text-sm font-medium text-gray-900
              hover:bg-blue-50
            "
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= DETAIL CARD ================= */
function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-white p-4">
      <p className="mb-1 text-xs font-medium text-gray-600">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 break-words">
        {value || "-"}
      </p>
    </div>
  );
}
