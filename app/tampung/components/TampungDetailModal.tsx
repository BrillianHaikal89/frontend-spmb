"use client";

import { X, Building, Users, School, CheckCircle } from "lucide-react";

interface TampungDetailModalProps {
  kabupaten: string;
  onClose: () => void;
}

const getDetailData = (kabupaten: string) => {
  const details: Record<string, any> = {
    "Kab. Bogor": {
      totalSekolahNegeri: 1643,
      totalRombel: 3525,
      totalDayaTampung: 118125,
      sekolahSwastaTerlibat: 25,
      persentasePendaftar: 85,
      rataRombelPerSekolah: "2.1",
      catatan: "Kabupaten Bogor memiliki daya tampung terbesar dengan fokus pada pendidikan dasar. Kolaborasi dengan 25 sekolah swasta berjalan optimal.",
      dataTerakhirDiperbarui: "15 Januari 2024",
      kontakPetugas: "Budi Santoso - 0812-3456-7890"
    },
    "Kab. Sukabumi": {
      totalSekolahNegeri: 1292,
      totalRombel: 2099,
      totalDayaTampung: 74261,
      sekolahSwastaTerlibat: 18,
      persentasePendaftar: 78,
      rataRombelPerSekolah: "1.6",
      catatan: "Kolaborasi aktif dengan sekolah swasta untuk meningkatkan daya tampung. Program bantuan pendidikan swasta telah menjangkau 78% peserta didik.",
      dataTerakhirDiperbarui: "12 Januari 2024",
      kontakPetugas: "Siti Rahayu - 0813-4567-8901"
    },
    "Kab. Cianjur": {
      totalSekolahNegeri: 1341,
      totalRombel: 2359,
      totalDayaTampung: 76842,
      sekolahSwastaTerlibat: 22,
      persentasePendaftar: 82,
      rataRombelPerSekolah: "1.8",
      catatan: "Program bantuan pendidikan swasta berjalan dengan baik. Terdapat peningkatan 15% partisipasi sekolah swasta dalam penerimaan siswa baru.",
      dataTerakhirDiperbarui: "10 Januari 2024",
      kontakPetugas: "Ahmad Wijaya - 0814-5678-9012"
    },
    "Kab. Bandung": {
      totalSekolahNegeri: 1298,
      totalRombel: 2811,
      totalDayaTampung: 94907,
      sekolahSwastaTerlibat: 30,
      persentasePendaftar: 88,
      rataRombelPerSekolah: "2.2",
      catatan: "Kabupaten Bandung menjadi model kolaborasi negeri-swasta dengan tingkat keberhasilan 95% dalam penempatan siswa.",
      dataTerakhirDiperbarui: "18 Januari 2024",
      kontakPetugas: "Dewi Lestari - 0815-6789-0123"
    }
  };

  return details[kabupaten] || {
    totalSekolahNegeri: 0,
    totalRombel: 0,
    totalDayaTampung: 0,
    sekolahSwastaTerlibat: 0,
    persentasePendaftar: 0,
    rataRombelPerSekolah: "0",
    catatan: "Data tidak tersedia untuk kabupaten ini.",
    dataTerakhirDiperbarui: "-",
    kontakPetugas: "-"
  };
};

export default function TampungDetailModal({ kabupaten, onClose }: TampungDetailModalProps) {
  const detailData = getDetailData(kabupaten);

  // Fungsi untuk menutup modal saat klik di luar
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-4xl mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-xl bg-white shadow-2xl overflow-hidden">
          {/* Header Modal */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Detail Data - {kabupaten}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Informasi lengkap daya tampung dan kolaborasi sekolah
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Tutup"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Body Modal */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Statistik Utama */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  Statistik Pendidikan
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-gray-700">Sekolah Negeri</span>
                    <span className="text-xl font-bold text-blue-700">
                      {detailData.totalSekolahNegeri.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-gray-700">Total Rombel</span>
                    <span className="text-xl font-bold text-blue-700">
                      {detailData.totalRombel.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-gray-700">Rata-rata Rombel/Sekolah</span>
                    <span className="text-xl font-bold text-blue-700">
                      {detailData.rataRombelPerSekolah}
                    </span>
                  </div>
                </div>
              </div>

              {/* Daya Tampung & Swasta */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Daya Tampung & Swasta
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-gray-700">Total Daya Tampung</span>
                    <span className="text-xl font-bold text-green-700">
                      {detailData.totalDayaTampung.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-gray-700">Sekolah Swasta Terlibat</span>
                    <span className="text-xl font-bold text-green-700">
                      {detailData.sekolahSwastaTerlibat}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                    <span className="text-gray-700">Persentase Pendaftar</span>
                    <span className="text-xl font-bold text-green-700">
                      {detailData.persentasePendaftar}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar Persentase */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tingkat Pendaftaran</span>
                <span className="text-sm font-bold text-blue-700">{detailData.persentasePendaftar}%</span>
              </div>
              <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${detailData.persentasePendaftar}%` }}
                />
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 mb-3">Informasi Kontak</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Petugas Penanggung Jawab</p>
                      <p className="text-gray-900 font-medium">{detailData.kontakPetugas}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Data Terakhir Diperbarui</p>
                      <p className="text-gray-900 font-medium">{detailData.dataTerakhirDiperbarui}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h4 className="font-medium text-gray-900 mb-3">Distribusi Jenjang</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Sekolah Dasar (SD)</span>
                      <span className="text-sm font-medium text-gray-900">60%</span>
                    </div>
                    <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Sekolah Menengah (SMP)</span>
                      <span className="text-sm font-medium text-gray-900">40%</span>
                    </div>
                    <div className="h-2.5 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/5 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-3">Catatan & Analisis</h4>
              <p className="text-gray-700 leading-relaxed">{detailData.catatan}</p>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}