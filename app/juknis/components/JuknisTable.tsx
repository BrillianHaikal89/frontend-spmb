export default function JuknisTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
      <table className="w-full text-sm text-gray-800">
        <thead className="bg-blue-100 text-gray-900">
          <tr>
            <th className="p-3 text-left">Kab/Kota</th>
            <th className="p-3 text-center">Jenjang</th>
            <th className="p-3 text-center">Tahun</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-blue-50">
            <td className="p-3">Kabupaten Bandung Barat</td>
            <td className="p-3 text-center">SD</td>
            <td className="p-3 text-center">2025</td>
            <td className="p-3 text-center font-medium">
              Detail
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
