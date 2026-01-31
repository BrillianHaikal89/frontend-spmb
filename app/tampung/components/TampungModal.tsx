"use client";

import { useState } from "react";
import { X, Save, Building2, School, Users, BookOpen, Hash, CheckCircle } from "lucide-react";

interface TampungModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TampungModal({ onClose, onSuccess }: TampungModalProps) {
  const [formData, setFormData] = useState({
    kabupaten: "",
    jenjang: "",
    sekolahNegeri: "",
    rombel: "",
    dayaTampungIsian: "",
    dayaTampungDiumumkan: "",
    jumlahPendaftar: "",
    jumlahLulus: "",
    sekolahSwastaDilibatkan: "",
    dayaTampungSwasta: "",
    bantuanPendidikan: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simpan data ke API
      console.log("Form submitted:", formData);
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Fungsi untuk menutup modal saat klik di luar
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const kabupatenOptions = [
    "Kab. Bogor",
    "Kab. Sukabumi",
    "Kab. Cianjur",
    "Kab. Bandung",
    "Kab. Garut",
    "Kab. Tasikmalaya",
    "Kab. Ciamis",
    "Kab. Kuningan",
    "Kab. Majalengka",
    "Kab. Sumedang",
    "Kab. Indramayu",
    "Kab. Subang",
    "Kab. Purwakarta",
    "Kab. Karawang",
    "Kab. Bekasi"
  ];

  const dayaTampungSwastaOptions = [
    { value: "Tidak Ada Bantuan", label: "Tidak Ada Bantuan", color: "text-gray-600" },
    { value: "Personal Siswa", label: "Personal Siswa", color: "text-blue-600" },
    { value: "Bantuan Penuh", label: "Bantuan Penuh", color: "text-green-600" },
    { value: "Bantuan Parsial", label: "Bantuan Parsial", color: "text-yellow-600" },
    { value: "Pilih Bentuk Bantuan Pendidikan", label: "Pilih Bentuk Bantuan Pendidikan", color: "text-purple-600" }
  ];

  const jenjangOptions = [
    { value: "SD", label: "Sekolah Dasar (SD)", icon: <School className="h-4 w-4" /> },
    { value: "SMP", label: "Sekolah Menengah Pertama (SMP)", icon: <School className="h-4 w-4" /> },
    { value: "SMA", label: "Sekolah Menengah Atas (SMA)", icon: <School className="h-4 w-4" /> },
    { value: "SMK", label: "Sekolah Menengah Kejuruan (SMK)", icon: <School className="h-4 w-4" /> }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-6xl mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header Modal */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Save className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Tambah Data Daya Tampung
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Isi form untuk menambahkan data daya tampung baru
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

          {/* Body Modal - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Informasi Dasar */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Informasi Dasar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Kabupaten/Kota
                    </label>
                    <div className="relative">
                      <select
                        name="kabupaten"
                        value={formData.kabupaten}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                      >
                        <option value="">Pilih Kabupaten/Kota</option>
                        {kabupatenOptions.map(kab => (
                          <option key={kab} value={kab}>{kab}</option>
                        ))}
                      </select>
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Jenjang Pendidikan
                    </label>
                    <div className="relative">
                      <select
                        name="jenjang"
                        value={formData.jenjang}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                      >
                        <option value="">Pilih Jenjang</option>
                        {jenjangOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Statistik Sekolah Negeri */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Statistik Sekolah Negeri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Jumlah Sekolah Negeri
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="sekolahNegeri"
                        value={formData.sekolahNegeri}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Jumlah Rombel
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="rombel"
                        value={formData.rombel}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Daya Tampung (Isian Disdik)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="dayaTampungIsian"
                        value={formData.dayaTampungIsian}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Data Pendaftaran */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Data Pendaftaran & Kelulusan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Daya Tampung Diumumkan
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="dayaTampungDiumumkan"
                        value={formData.dayaTampungDiumumkan}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Jumlah Murid Pendaftar
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="jumlahPendaftar"
                        value={formData.jumlahPendaftar}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Jumlah Murid Lulus
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="jumlahLulus"
                        value={formData.jumlahLulus}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Data Sekolah Swasta */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-yellow-600" />
                  Data Sekolah Swasta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Jumlah Sekolah Swasta Dilibatkan
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="sekolahSwastaDilibatkan"
                        value={formData.sekolahSwastaDilibatkan}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                        min="0"
                      />
                      <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Daya Tampung Sekolah Swasta
                    </label>
                    <div className="relative">
                      <select
                        name="dayaTampungSwasta"
                        value={formData.dayaTampungSwasta}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 pl-10"
                        required
                      >
                        <option value="">Pilih Jenis Bantuan</option>
                        {dayaTampungSwastaOptions.map(opt => (
                          <option key={opt.value} value={opt.value} className={opt.color}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Checkbox Bantuan Pendidikan */}
                <div className="mt-6">
                  <label className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="bantuanPendidikan"
                      checked={formData.bantuanPendidikan}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bantuanPendidikan: e.target.checked
                      }))}
                      className="h-5 w-5 mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Bantuan Pendidikan Swasta
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Centang jika terdapat program bantuan pendidikan dari pihak swasta untuk mendukung operasional sekolah
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 5: Catatan Tambahan (Opsional) */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Catatan Tambahan (Opsional)
                </h3>
                <textarea
                  name="catatan"
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tambahkan catatan atau keterangan khusus jika diperlukan..."
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>
            </form>
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Pastikan semua data yang diisi sudah benar dan valid.
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}