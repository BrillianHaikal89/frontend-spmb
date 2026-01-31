"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import TampungDetailModal from "./TampungDetailModal";

// Data dummy sesuai gambar
const dummyData = [
  {
    kabupaten: "Kab. Bogor",
    jenjang: "SD",
    sekolahNegeri: 1536,
    rombel: 2715,
    dayaTampungIsian: 85725,
    dayaTampungDiumumkan: 0,
    jumlahPendaftar: 0,
    jumlahLulus: 0,
    sekolahSwastaDilibatkan: 0,
    dayaTampungSwasta: "Tidak Ada Bantuan",
    bantuanPendidikan: "✓"
  },
  {
    kabupaten: "Kab. Bogor",
    jenjang: "SMP",
    sekolahNegeri: 107,
    rombel: 810,
    dayaTampungIsian: 32400,
    dayaTampungDiumumkan: 0,
    jumlahPendaftar: 30275,
    jumlahLulus: 0,
    sekolahSwastaDilibatkan: 0,
    dayaTampungSwasta: "Personal Siswa",
    bantuanPendidikan: "✓"
  },
  {
    kabupaten: "Kab. Sukabumi",
    jenjang: "SD",
    sekolahNegeri: 1132,
    rombel: 1497,
    dayaTampungIsian: 50462,
    dayaTampungDiumumkan: 0,
    jumlahPendaftar: 0,
    jumlahLulus: 0,
    sekolahSwastaDilibatkan: 0,
    dayaTampungSwasta: "Pilih Bentuk Bantuan Pendidikan",
    bantuanPendidikan: "✓"
  },
  {
    kabupaten: "Kab. Sukabumi",
    jenjang: "SMP",
    sekolahNegeri: 160,
    rombel: 602,
    dayaTampungIsian: 23799,
    dayaTampungDiumumkan: 39408,
    jumlahPendaftar: 39000,
    jumlahLulus: 227,
    sekolahSwastaDilibatkan: 15602,
    dayaTampungSwasta: "Tidak Ada Bantuan",
    bantuanPendidikan: "✓"
  },
  {
    kabupaten: "Kab. Cianjur",
    jenjang: "SD",
    sekolahNegeri: 1186,
    rombel: 1688,
    dayaTampungIsian: 52573,
    dayaTampungDiumumkan: 47504,
    jumlahPendaftar: 39597,
    jumlahLulus: 58,
    sekolahSwastaDilibatkan: 2128,
    dayaTampungSwasta: "Tidak Ada Bantuan",
    bantuanPendidikan: "✓"
  },
  {
    kabupaten: "Kab. Bandung",
    jenjang: "SD",
    sekolahNegeri: 1210,
    rombel: 2056,
    dayaTampungIsian: 63102,
    dayaTampungDiumumkan: 64054,
    jumlahPendaftar: 0,
    jumlahLulus: 0,
    sekolahSwastaDilibatkan: 123,
    dayaTampungSwasta: "Tidak Ada Bantuan",
    bantuanPendidikan: "✓"
  },
];

interface TampungTableProps {
  reload: boolean;
  onViewDetail: (kabupaten: string) => void;
  isAdmin: boolean;
}

export default function TampungTable({ reload, onViewDetail, isAdmin }: TampungTableProps) {
  const [data] = useState(dummyData);
  const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (item: any) => {
    setSelectedKabupaten(item.kabupaten);
    setIsDetailOpen(true);
    onViewDetail(item.kabupaten);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-blue-100">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Kabupaten/Kota
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Jenjang
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Sekolah Negeri
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Rombel
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Daya Tampung (Isian Disdik)
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Daya Tampung Diumumkan
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Jumlah Murid Pendaftar
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Jumlah Murid Lulus
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Jumlah Sekolah Swasta Dilibatkan
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Daya Tampung Sekolah Swasta
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Bantuan Pendidikan Swasta
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-blue-200">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50 bg-white">
            {data.map((item, index) => (
              <tr 
                key={index} 
                className={`hover:bg-blue-50 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                }`}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {item.kabupaten}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    item.jenjang === 'SD' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.jenjang}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right font-medium">
                  {item.sekolahNegeri.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right">
                  {item.rombel.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                  {item.dayaTampungIsian.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right">
                  <span className={`${item.dayaTampungDiumumkan === 0 ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                    {item.dayaTampungDiumumkan.toLocaleString()}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right">
                  {item.jumlahPendaftar.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right">
                  {item.jumlahLulus.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right">
                  <span className={`${item.sekolahSwastaDilibatkan === 0 ? 'text-gray-500' : 'text-blue-600 font-medium'}`}>
                    {item.sekolahSwastaDilibatkan.toLocaleString()}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.dayaTampungSwasta === 'Tidak Ada Bantuan' 
                      ? 'bg-gray-100 text-gray-800'
                      : item.dayaTampungSwasta === 'Personal Siswa'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.dayaTampungSwasta}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                    item.bantuanPendidikan === '✓' 
                      ? 'bg-green-100 text-green-600 border border-green-200' 
                      : 'bg-red-100 text-red-600 border border-red-200'
                  }`}>
                    {item.bantuanPendidikan}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="group flex items-center gap-2 rounded-lg px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 border border-blue-200"
                      title="Lihat Detail Data"
                    >
                      <Eye size={16} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Detail</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {isDetailOpen && selectedKabupaten && (
        <TampungDetailModal
          kabupaten={selectedKabupaten}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
}