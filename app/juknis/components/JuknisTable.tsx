"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import JuknisDetailModal from "./JuknisDetailModal";

export default function JuknisTable({ reload }: { reload: boolean }) {
  const token = useAuthStore((s) => s.token);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/juknis`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-700 shadow">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-blue-200 bg-white shadow">
        <table className="w-full text-sm text-gray-900">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Wilayah</th>
              <th className="p-3 text-center">Jenjang</th>
              <th className="p-3 text-center">Domisili</th>
              <th className="p-3 text-center">Afirmasi</th>
              <th className="p-3 text-center">Prestasi</th>
              <th className="p-3 text-center">Mutasi</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-blue-100 hover:bg-blue-50"
              >
                <td className="p-3">{item.wilayah}</td>
                <td className="p-3 text-center">{item.jenjang}</td>
                <td className="p-3 text-center">{item.persen_domisili}%</td>
                <td className="p-3 text-center">{item.persen_afirmasi}%</td>
                <td className="p-3 text-center">{item.persen_prestasi}%</td>
                <td className="p-3 text-center">{item.persen_mutasi}%</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setSelected(item)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selected && (
        <JuknisDetailModal
          data={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
