// app/home/components/tampungDashboard.tsx
'use client'

export default function TampungDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dashboard Daya Tampung
        </h2>
        <p className="text-gray-700">
          Ini adalah dashboard untuk menampilkan data daya tampung sekolah.
        </p>
        <p className="text-gray-600 mt-2">
          Fitur ini sedang dalam pengembangan. Data daya tampung akan ditampilkan di sini.
        </p>
      </div>
    </div>
  )
}