'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/app/store/useAuthStore'
import JuknisDetailModal from './FinalJuknisDetailModal'
import JuknisEditModal from './FinalJuknisEditModal'

/* ✅ PERBAIKAN UTAMA: props ditambahkan */
type FinalJuknisTableProps = {
  reload: boolean
  isAdmin?: boolean
}

export default function FinalJuknisTable({
  reload,
  isAdmin: isAdminFromProps
}: FinalJuknisTableProps) {
  const token = useAuthStore(s => s.token)
  const user = useAuthStore(s => s.user)

  /* ✅ fallback aman */
  const isAdmin = isAdminFromProps ?? user?.role === 'admin'

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [detailData, setDetailData] = useState<any>(null)
  const [editData, setEditData] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/all?page=1&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: 'no-store'
        }
      )

      const json = await res.json()

      if (json.success && Array.isArray(json.data)) {
        setData(json.data)
      } else {
        setData([])
      }
    } catch (error) {
      console.error(error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [reload])

  if (loading) {
    return (
      <div className='rounded-xl bg-white p-6 text-center shadow'>
        Loading...
      </div>
    )
  }

  return (
    <>
      <div className='overflow-x-auto rounded-xl border border-blue-200 bg-white shadow'>
        <table className='w-full text-sm text-gray-900'>
          <thead className='bg-blue-100'>
            <tr>
              <th className='p-3 text-left'>Wilayah</th>
              <th className='p-3 text-center'>Jenjang</th>
              <th className='p-3 text-center'>Dom</th>
              <th className='p-3 text-center'>Afirmasi</th>
              <th className='p-3 text-center'>Prestasi</th>
              <th className='p-3 text-center'>Mutasi</th>
              <th className='p-3 text-center'>Status</th>
              <th className='p-3 text-left'>Keterangan</th>
              <th className='p-3 text-center'>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr
                key={item.id}
                className='border-t border-blue-100 hover:bg-blue-50'
              >
                <td className='p-3'>{item.wilayah}</td>
                <td className='p-3 text-center'>{item.jenjang}</td>
                <td className='p-3 text-center'>{item.persen_domisili}%</td>
                <td className='p-3 text-center'>{item.persen_afirmasi}%</td>
                <td className='p-3 text-center'>{item.persen_prestasi}%</td>
                <td className='p-3 text-center'>{item.persen_mutasi}%</td>

                {/* STATUS */}
                <td className='p-3 text-center'>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status_validasi === 'disetujui'
                        ? 'bg-green-100 text-green-700'
                        : item.status_validasi === 'ditolak'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.status_validasi || 'diajukan'}
                  </span>
                </td>

                {/* KETERANGAN */}
                <td className='p-3 text-gray-700 max-w-md break-words'>
                  {item.keterangan?.trim()
                    ? item.keterangan
                    : 'Tidak ada keterangan'}
                </td>

                <td className='p-3 text-center space-x-3'>
                  <button
                    onClick={() => setDetailData(item)}
                    className='text-blue-600 hover:underline'
                  >
                    Detail
                  </button>

                  {!isAdmin && (
                    <button
                      onClick={() => setEditData(item)}
                      className='text-green-600 hover:underline'
                    >
                      Upload Ulang
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailData && (
        <JuknisDetailModal
          data={detailData}
          onClose={() => setDetailData(null)}
        />
      )}

      {!isAdmin && editData && (
        <JuknisEditModal
          data={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            setEditData(null)
            fetchData()
          }}
        />
      )}
    </>
  )
}
