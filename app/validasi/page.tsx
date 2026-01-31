'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/store/useAuthStore'
import JuknisDetailModalReadOnly from '../juknis/components/JuknisDetailModalReadOnly'
import { Filter, X } from 'lucide-react'

/* ================= TYPE ================= */
type StatusValidasi = 'diajukan' | 'disetujui' | 'ditolak'

type Juknis = {
  id: string
  wilayah: string
  jenjang: string
  pejabat_penandatangan?: string
  tgl_penetapan_juknis?: string
  tgl_mulai_pendaftaran?: string
  tgl_penetapan_kelulusan?: string
  persen_domisili: number
  persen_afirmasi: number
  persen_prestasi: number
  persen_mutasi: number
  status_validasi: StatusValidasi
  keterangan?: string
  juknis_file?: string
  data_dukung_lainnya?: string
}

type FilterState = {
  jenjang: string
  status: string
}

/* ================= HELPER ================= */
const statusColorClass = (status: StatusValidasi) => {
  switch (status) {
    case 'disetujui':
      return 'bg-green-100 text-green-700 border-green-300'
    case 'ditolak':
      return 'bg-red-100 text-red-700 border-red-300'
    case 'diajukan':
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }
}

/**
 * PRIORITAS TAMPILAN:
 * 1 = PALING ATAS
 */
const statusPriority: Record<StatusValidasi, number> = {
  diajukan: 1,
  disetujui: 2,
  ditolak: 3
}

/* ================= COMPONENT ================= */
export default function AdminValidasiJuknisPage () {
  const router = useRouter()
  const { token, user, isAuthReady } = useAuthStore()

  const [data, setData] = useState<Juknis[]>([])
  const [filteredData, setFilteredData] = useState<Juknis[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [detailData, setDetailData] = useState<Juknis | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedJuknis, setSelectedJuknis] = useState<{
    id: string
    status: StatusValidasi
  } | null>(null)

  const [keterangan, setKeterangan] = useState('')
  const [error, setError] = useState('')

  // State untuk filter
  const [filters, setFilters] = useState<FilterState>({
    jenjang: '',
    status: ''
  })
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  /* ================= GUARD ADMIN ================= */
  useEffect(() => {
    if (!isAuthReady) return
    if (!token || user?.role !== 'admin') {
      router.replace('/home')
    }
  }, [isAuthReady, token, user, router])

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setData(json.data)
        setFilteredData(json.data) // Set initial filtered data
      }
    } catch {
      alert('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  /* ================= APPLY FILTERS ================= */
  useEffect(() => {
    let result = [...data]

    // Filter berdasarkan jenjang
    if (filters.jenjang) {
      result = result.filter(item => item.jenjang === filters.jenjang)
    }

    // Filter berdasarkan status
    if (filters.status) {
      result = result.filter(item => item.status_validasi === filters.status)
    }

    setFilteredData(result)
  }, [data, filters])

  /* ================= GET UNIQUE VALUES FOR FILTERS ================= */
  const uniqueJenjang = Array.from(new Set(data.map(item => item.jenjang))).sort()
  const uniqueStatus = Array.from(new Set(data.map(item => item.status_validasi))).sort()

  /* ================= RESET FILTERS ================= */
  const resetFilters = () => {
    setFilters({
      jenjang: '',
      status: ''
    })
  }

  /* ================= DOWNLOAD FILE ================= */
  const handleDownloadFile = async (id: string, filename?: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/download/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) throw new Error('Gagal download file')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'juknis.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Download gagal')
    }
  }

  /* ================= OPEN VALIDASI ================= */
  const handleChangeStatus = (id: string, status: StatusValidasi) => {
    setSelectedJuknis({ id, status })
    setKeterangan('')
    setError('')
    setShowModal(true)
  }

  /* ================= SUBMIT VALIDASI ================= */
  const submitStatus = async () => {
    if (!selectedJuknis) return

    if (!keterangan.trim()) {
      setError('Keterangan wajib diisi')
      return
    }

    setUpdatingId(selectedJuknis.id)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/${selectedJuknis.id}/status-validasi`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status_validasi: selectedJuknis.status,
            keterangan
          })
        }
      )

      if (!res.ok) {
        const json = await res.json()
        alert(json.message || 'Gagal memperbarui status')
        return
      }

      setShowModal(false)
      fetchData()
    } catch {
      alert('Terjadi kesalahan saat menyimpan')
    } finally {
      setUpdatingId(null)
    }
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-blue-50'>
        <span className='text-gray-900'>Memuat data...</span>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-blue-50 p-6'>
      <div className='rounded-xl bg-white p-6 shadow-md'>
        {/* HEADER DENGAN FILTER */}
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <h1 className='text-xl font-bold text-gray-900'>
            Validasi Juknis (Admin)
          </h1>

          <div className='flex items-center gap-3'>
            {/* INFO FILTER AKTIF */}
            {(filters.jenjang || filters.status) && (
              <div className='flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm'>
                <span className='text-gray-700'>Filter aktif:</span>
                {filters.jenjang && (
                  <span className='rounded bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800'>
                    Jenjang: {filters.jenjang}
                  </span>
                )}
                {filters.status && (
                  <span className='rounded bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800'>
                    Status: {filters.status}
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className='ml-1 text-gray-500 hover:text-gray-700'
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* TOMBOL FILTER */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showFilterPanel ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* PANEL FILTER */}
        {showFilterPanel && (
          <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {/* FILTER JENJANG */}
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-900'>
                  Jenjang
                </label>
                <select
                  value={filters.jenjang}
                  onChange={(e) => setFilters({ ...filters, jenjang: e.target.value })}
                  className='w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300'
                >
                  <option value=''>Semua Jenjang</option>
                  {uniqueJenjang.map(jenjang => (
                    <option key={jenjang} value={jenjang}>
                      {jenjang}
                    </option>
                  ))}
                </select>
              </div>

              {/* FILTER STATUS */}
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-900'>
                  Status Validasi
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className='w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300'
                >
                  <option value=''>Semua Status</option>
                  {uniqueStatus.map(status => (
                    <option key={status} value={status}>
                      {status === 'diajukan' ? 'Diajukan' : 
                       status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                    </option>
                  ))}
                </select>
              </div>

              {/* INFO JUMLAH DATA */}
              <div className='md:col-span-2 flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>
                    Menampilkan {filteredData.length} dari {data.length} data
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={resetFilters}
                    className='rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50'
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setShowFilterPanel(false)}
                    className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABEL DATA */}
        <div className='overflow-x-auto rounded-lg border border-blue-200'>
          {filteredData.length === 0 ? (
            <div className='p-8 text-center'>
              <p className='text-gray-500'>Tidak ada data yang sesuai dengan filter</p>
              {filters.jenjang || filters.status ? (
                <button
                  onClick={resetFilters}
                  className='mt-2 text-sm text-blue-600 hover:text-blue-800'
                >
                  Reset filter untuk melihat semua data
                </button>
              ) : null}
            </div>
          ) : (
            <table className='w-full text-sm text-gray-900'>
              <thead className='bg-blue-100'>
                <tr>
                  <Th>Wilayah</Th>
                  <Th>Jenjang</Th>
                  <Th align='center'>Domisili</Th>
                  <Th align='center'>Afirmasi</Th>
                  <Th align='center'>Prestasi</Th>
                  <Th align='center'>Mutasi</Th>
                  <Th>Status & Aksi</Th>
                </tr>
              </thead>

              <tbody>
                {[...filteredData]
                  .sort(
                    (a, b) =>
                      statusPriority[a.status_validasi] -
                      statusPriority[b.status_validasi]
                  )
                  .map(j => (
                    <tr
                      key={j.id}
                      className='border-t border-blue-100 hover:bg-blue-50'
                    >
                      <Td>{j.wilayah}</Td>
                      <Td>{j.jenjang}</Td>
                      <Td align='center'>{j.persen_domisili}%</Td>
                      <Td align='center'>{j.persen_afirmasi}%</Td>
                      <Td align='center'>{j.persen_prestasi}%</Td>
                      <Td align='center'>{j.persen_mutasi}%</Td>

                      <Td>
                        <div className='flex items-center gap-2'>
                          {j.juknis_file && (
                            <button
                              onClick={() =>
                                handleDownloadFile(j.id, j.juknis_file)
                              }
                              className='rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200'
                            >
                              Download
                            </button>
                          )}

                          <button
                            onClick={() => setDetailData(j)}
                            className='rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-gray-900 hover:bg-blue-50'
                          >
                            Detail
                          </button>

                          <select
                            value={j.status_validasi}
                            disabled={updatingId === j.id}
                            onChange={e =>
                              handleChangeStatus(
                                j.id,
                                e.target.value as StatusValidasi
                              )
                            }
                            className={`rounded-md px-3 py-1 text-xs font-semibold border ${statusColorClass(j.status_validasi)} disabled:bg-gray-100 disabled:opacity-60`}
                          >
                            <option value='diajukan'>Diajukan</option>
                            <option value='disetujui'>Disetujui</option>
                            <option value='ditolak'>Ditolak</option>
                          </select>
                        </div>
                      </Td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {detailData && (
        <JuknisDetailModalReadOnly
          data={detailData}
          onClose={() => setDetailData(null)}
        />
      )}

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30'>
          <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-lg'>
            <h2 className='mb-2 text-lg font-semibold text-gray-900'>
              Keterangan Validasi
            </h2>

            {error && <p className='mb-2 text-sm text-red-600'>{error}</p>}

            <textarea
              className='w-full rounded-md border border-blue-300 bg-white p-2 text-sm text-gray-900'
              rows={4}
              value={keterangan}
              onChange={e => setKeterangan(e.target.value)}
              placeholder='Isi keterangan validasi...'
            />

            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => setShowModal(false)}
                className='rounded-md bg-gray-200 px-4 py-2 text-sm'
              >
                Batal
              </button>
              <button
                onClick={submitStatus}
                className='rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700'
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= TABLE HELPER ================= */
function Th ({ children, align = 'left' }: any) {
  return (
    <th
      className={`border-b border-blue-200 px-4 py-3 font-semibold text-gray-900 ${
        align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      {children}
    </th>
  )
}

function Td ({ children, align = 'left' }: any) {
  return (
    <td
      className={`px-4 py-3 text-gray-800 ${
        align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      {children}
    </td>
  )
}