// app/home/components/juknisDashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const COLOR = {
  sudah: '#86EFAC',
  belum: '#FCA5A5',
}

interface WilayahItem {
  nama: string;
  status: 'SUDAH' | 'BELUM';
}

interface ValidasiWilayahData {
  provinsi: WilayahItem[];
  kabkota: WilayahItem[];
}

interface ValidasiWilayahSummary {
  total_provinsi: number;
  total_kabkota: number;
  provinsi_sudah: number;
  kabkota_sudah: number;
  persentase_provinsi: number;
  persentase_kabkota: number;
  total_wilayah: number;
}

export default function JuknisDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [pemda, setPemda] = useState<any[]>([])
  const [pendaftaran, setPendaftaran] = useState<any[]>([])
  const [pengumuman, setPengumuman] = useState<any[]>([])
  const [daftarUlang, setDaftarUlang] = useState<any[]>([])
  const [validasiWilayah, setValidasiWilayah] = useState<ValidasiWilayahData | null>(null)
  const [validasiSummary, setValidasiSummary] = useState<ValidasiWilayahSummary | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pemdaRes,
          pendaftaranRes,
          pengumumanRes,
          daftarUlangRes,
          validasiWilayahRes,
        ] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/pemda-menetapkan`),
          fetch(`${API_URL}/api/dashboard/pembukaan-pendaftaran`),
          fetch(`${API_URL}/api/dashboard/pengumuman-kelulusan`),
          fetch(`${API_URL}/api/dashboard/daftar-ulang`),
          fetch(`${API_URL}/api/dashboard/status-validasi-wilayah`),
        ])

        const pemdaJson = await pemdaRes.json()
        const pendaftaranJson = await pendaftaranRes.json()
        const pengumumanJson = await pengumumanRes.json()
        const daftarUlangJson = await daftarUlangRes.json()
        const validasiWilayahJson = await validasiWilayahRes.json()

        /* 1️⃣ Pemda Menetapkan */
        setPemda([
          {
            name: 'Provinsi',
            sudah: pemdaJson.data.pemda_menetapkan.prov.sudah,
            belum: pemdaJson.data.pemda_menetapkan.prov.belum,
          },
          {
            name: 'Kab/Kota',
            sudah: pemdaJson.data.pemda_menetapkan.kabkota.sudah,
            belum: pemdaJson.data.pemda_menetapkan.kabkota.belum,
          },
        ])

        /* 2️⃣ Pembukaan Pendaftaran */
        setPendaftaran([
          {
            name: 'SD',
            sudah: pendaftaranJson.data.pembukaan_pendaftaran.SD.sudah,
            belum: pendaftaranJson.data.pembukaan_pendaftaran.SD.belum,
          },
          {
            name: 'SMP',
            sudah: pendaftaranJson.data.pembukaan_pendaftaran.SMP.sudah,
            belum: pendaftaranJson.data.pembukaan_pendaftaran.SMP.belum,
          },
          {
            name: 'SMA',
            sudah: pendaftaranJson.data.pembukaan_pendaftaran.SMA.sudah,
            belum: pendaftaranJson.data.pembukaan_pendaftaran.SMA.belum,
          },
        ])

        /* 3️⃣ Pengumuman Kelulusan */
        setPengumuman([
          {
            name: 'SD',
            sudah: pengumumanJson.data.pengumuman_kelulusan.SD.sudah,
            belum: pengumumanJson.data.pengumuman_kelulusan.SD.belum,
          },
          {
            name: 'SMP',
            sudah: pengumumanJson.data.pengumuman_kelulusan.SMP.sudah,
            belum: pengumumanJson.data.pengumuman_kelulusan.SMP.belum,
          },
          {
            name: 'SMA',
            sudah: pengumumanJson.data.pengumuman_kelulusan.SMA.sudah,
            belum: pengumumanJson.data.pengumuman_kelulusan.SMA.belum,
          },
        ])

        /* 4️⃣ Daftar Ulang */
        setDaftarUlang([
          {
            name: 'SD',
            sudah: daftarUlangJson.data.daftar_ulang.SD.sudah,
            belum: daftarUlangJson.data.daftar_ulang.SD.belum,
          },
          {
            name: 'SMP',
            sudah: daftarUlangJson.data.daftar_ulang.SMP.sudah,
            belum: daftarUlangJson.data.daftar_ulang.SMP.belum,
          },
          {
            name: 'SMA',
            sudah: daftarUlangJson.data.daftar_ulang.SMA.sudah,
            belum: daftarUlangJson.data.daftar_ulang.SMA.belum,
          },
        ])

        /* 5️⃣ Status Validasi Wilayah */
        const validasiData = validasiWilayahJson.data.status_validasi_wilayah.data
        const summaryData = validasiWilayahJson.data.status_validasi_wilayah.summary
        
        setValidasiWilayah(validasiData)
        setValidasiSummary(summaryData)

      } catch {
        setError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center py-10">Memuat data…</p>
  if (error) return <p className="text-center text-red-600">{error}</p>

  /* ===== Reusable Chart ===== */
  const ChartBox = ({ title, data }: any) => (
    <section className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Grafik */}
        <div className="md:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#111827' }} />
              <YAxis tick={{ fill: '#111827' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sudah" fill={COLOR.sudah} />
              <Bar dataKey="belum" fill={COLOR.belum} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Persentase */}
        <div className="space-y-3">
          {data.map((item: any, i: number) => {
            const total = item.sudah + item.belum
            const persen = total ? ((item.sudah / total) * 100).toFixed(1) : 0

            return (
              <div
                key={i}
                className="border rounded-lg p-3 bg-gray-50 text-gray-900"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-sm font-semibold">{persen}% sudah</p>
                <p className="text-xs text-gray-600">
                  {item.sudah} dari {total}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )

  /* ===== Status Badge ===== */
  const StatusBadge = ({ status }: { status: 'SUDAH' | 'BELUM' }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      status === 'SUDAH' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'SUDAH' ? '✓ Sudah' : '✗ Belum'}
    </span>
  )

  return (
    <div className="space-y-8">
      {/* 4 Chart Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartBox title="Pemda Menetapkan" data={pemda} />
        <ChartBox title="Pembukaan Pendaftaran" data={pendaftaran} />
        <ChartBox title="Pengumuman Kelulusan" data={pengumuman} />
        <ChartBox title="Daftar Ulang" data={daftarUlang} />
      </div>

      {/* Tabel Status Validasi Wilayah */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Status Validasi Wilayah</h2>
            <p className="text-sm text-gray-600">Status validasi wilayah untuk PPDB</p>
          </div>
          
          {/* Summary Cards */}
          {validasiSummary && (
            <div className="flex flex-wrap gap-3">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-blue-700">Total Wilayah</p>
                <p className="text-lg font-bold text-blue-900">{validasiSummary.total_wilayah}</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-green-700">Provinsi Tervalidasi</p>
                <p className="text-lg font-bold text-green-900">
                  {validasiSummary.provinsi_sudah}/{validasiSummary.total_provinsi}
                </p>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-purple-700">Kab/Kota Tervalidasi</p>
                <p className="text-lg font-bold text-purple-900">
                  {validasiSummary.kabkota_sudah}/{validasiSummary.total_kabkota}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tabel Provinsi */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-900">
                Provinsi ({validasiSummary?.total_provinsi || 0})
                <span className="ml-2 text-sm font-normal text-gray-600">
                  {validasiSummary?.persentase_provinsi || 0}% tervalidasi
                </span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Provinsi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Validasi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validasiWilayah?.provinsi && validasiWilayah.provinsi.length > 0 ? (
                    validasiWilayah.provinsi.map((item, index) => (
                      <tr key={`prov-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-4 text-center text-sm text-gray-500">
                        Tidak ada data provinsi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Kabupaten/Kota */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-900">
                Kabupaten/Kota ({validasiSummary?.total_kabkota || 0})
                <span className="ml-2 text-sm font-normal text-gray-600">
                  {validasiSummary?.persentase_kabkota || 0}% tervalidasi
                </span>
              </h3>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Kabupaten/Kota
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Validasi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validasiWilayah?.kabkota && validasiWilayah.kabkota.length > 0 ? (
                    validasiWilayah.kabkota.map((item, index) => (
                      <tr key={`kabkota-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-4 text-center text-sm text-gray-500">
                        Tidak ada data kabupaten/kota
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        {validasiSummary && (
          <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Wilayah</p>
              <p className="text-lg font-bold text-gray-900">{validasiSummary.total_wilayah}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Provinsi Tervalidasi</p>
              <p className="text-lg font-bold text-green-600">{validasiSummary.provinsi_sudah}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Kab/Kota Tervalidasi</p>
              <p className="text-lg font-bold text-green-600">{validasiSummary.kabkota_sudah}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Tervalidasi</p>
              <p className="text-lg font-bold text-blue-600">
                {validasiSummary.provinsi_sudah + validasiSummary.kabkota_sudah}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}