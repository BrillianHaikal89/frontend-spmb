'use client'

import { X } from 'lucide-react'
import { useAuthStore } from '@/app/store/useAuthStore'

/* ================= HELPER ================= */
function formatTanggal (dateString?: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export default function JuknisDetailModal ({
  data,
  onClose
}: {
  data: any
  onClose: () => void
}) {
  const token = useAuthStore(s => s.token)

  /* ================= DOWNLOAD (FIXED) ================= */
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/download/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.ok) {
        throw new Error('Gagal download file')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url

      // ✅ FALLBACK NAMA FILE (INI KUNCINYA)
      if (data.juknis_file) {
        a.download = data.juknis_file
      }

      document.body.appendChild(a)
      a.click()

      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || 'Download gagal')
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-5xl rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh] overflow-hidden'>
        {/* HEADER */}
        <div className='flex items-center justify-between bg-blue-100 px-6 py-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Detail Juknis</h2>
          <button onClick={onClose}>
            <X className='text-gray-700' />
          </button>
        </div>

        {/* CONTENT */}
        <div className='flex-1 overflow-y-auto bg-blue-50 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
          <Detail label='Wilayah' value={data.wilayah} />
          <Detail label='Jenjang' value={data.jenjang} />
          <Detail
            label='Pejabat Penandatangan'
            value={data.pejabat_penandatangan}
          />

          <Detail
            label='Tgl Penetapan'
            value={formatTanggal(data.tgl_penetapan_juknis)}
          />
          <Detail
            label='Tgl Mulai Pendaftaran'
            value={formatTanggal(data.tgl_mulai_pendaftaran)}
          />
          <Detail
            label='Tgl Kelulusan'
            value={formatTanggal(data.tgl_penetapan_kelulusan)}
          />

          <Detail label='% Domisili' value={`${data.persen_domisili}%`} />
          <Detail label='% Afirmasi' value={`${data.persen_afirmasi}%`} />
          <Detail label='% Prestasi' value={`${data.persen_prestasi}%`} />
          <Detail label='% Mutasi' value={`${data.persen_mutasi}%`} />

          {data.data_dukung_lainnya && (
            <div className='lg:col-span-3'>
              <Detail
                label='Data Dukung Lainnya'
                value={data.data_dukung_lainnya}
              />
            </div>
          )}

          {/* DOWNLOAD BUTTON */}
          <div className='lg:col-span-3'>
            <button
              onClick={handleDownload}
              className='w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700'
            >
              Download File Juknis
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className='flex justify-end bg-blue-100 px-6 py-3'>
          <button
            onClick={onClose}
            className='rounded-lg border border-blue-300 bg-white px-5 py-2 text-gray-900 hover:bg-blue-50'
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= DETAIL CARD ================= */
function Detail ({ label, value }: { label: string; value: any }) {
  return (
    <div className='rounded-lg border border-blue-200 bg-white p-4'>
      <p className='mb-1 text-xs font-medium text-gray-600'>{label}</p>
      <p className='font-semibold text-gray-900 break-words'>{value || '-'}</p>
    </div>
  )
}
