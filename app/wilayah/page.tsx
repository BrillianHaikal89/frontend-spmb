"use client";

import { MapPin, Plus } from "lucide-react";

export default function WilayahPage() {
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Penetapan Wilayah
          </h1>
          <p className="mt-1 text-sm text-gray-700">
            Pengelolaan data wilayah penetapan SPMB
          </p>
        </div>

        <button
          className="
            flex items-center gap-2
            rounded-lg bg-blue-600 px-4 py-2
            text-sm font-medium text-white
            hover:bg-blue-700
            transition
          "
        >
          <Plus className="h-4 w-4" />
          Tambah Wilayah
        </button>
      </div>

      {/* CARD */}
      <div className="rounded-xl border border-blue-200 bg-white shadow-sm">
        {/* CARD HEADER */}
        <div className="flex items-center gap-2 border-b border-blue-200 bg-blue-100 px-5 py-4 rounded-t-xl">
          <MapPin className="h-5 w-5 text-blue-700" />
          <h2 className="text-base font-semibold text-gray-900">
            Daftar Wilayah
          </h2>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">No</th>
                <th className="px-4 py-3 text-left font-semibold">Provinsi</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Kabupaten / Kota
                </th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-100 text-gray-900">
              <tr className="hover:bg-blue-50 transition">
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">Jawa Barat</td>
                <td className="px-4 py-3">Kab. Bandung Barat</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Aktif
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-blue-700 hover:underline">
                    Detail
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-blue-50 transition">
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3">Jawa Barat</td>
                <td className="px-4 py-3">Kota Cimahi</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                    Nonaktif
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-blue-700 hover:underline">
                    Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="border-t border-blue-200 bg-blue-50 px-4 py-3 text-xs text-gray-700 rounded-b-xl">
          Total wilayah terdaftar: <span className="font-semibold">2</span>
        </div>
      </div>
    </div>
  );
}
