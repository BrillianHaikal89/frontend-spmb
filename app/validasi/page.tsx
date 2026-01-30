"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";

/* ================= TYPE ================= */
type Juknis = {
  id: string;
  wilayah: string;
  wilayah_kode: string;
  jenjang: string;
  pejabat_penandatangan: string;
  persen_domisili: number;
  persen_afirmasi: number;
  persen_prestasi: number;
  persen_mutasi: number;
  juknis_file: string;
  data_dukung_lainnya: string | null;
  dibuat_oleh: string;
  role_pembuat: string;
  status: string;
};

/* ================= COMPONENT ================= */
export default function ValidasiJuknisPage() {
  const router = useRouter();
  const { token, user, isAuthReady } = useAuthStore();

  const [data, setData] = useState<Juknis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Juknis | null>(null);
  const [alasanTolak, setAlasanTolak] = useState("");

  /* ================= GUARD ADMIN ================= */
  useEffect(() => {
    if (!isAuthReady) return;

    if (!token || user?.role !== "admin") {
      router.replace("/home");
    }
  }, [isAuthReady, token, user, router]);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  /* ================= ACTION ================= */
  const handleApprove = async (id: string) => {
    if (!confirm("Setujui juknis ini?")) return;

    // 🔥 SESUAIKAN API BACKEND
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/${id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchData();
  };

  const handleReject = async () => {
    if (!selected) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/${selected.id}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alasan: alasanTolak,
        }),
      }
    );

    setSelected(null);
    setAlasanTolak("");
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <span className="text-gray-700">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-900">
          Validasi Penetapan Juknis
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-100">
              <tr>
                <Th>Wilayah</Th>
                <Th>Jenjang</Th>
                <Th>Pembuat</Th>
                <Th>Dom</Th>
                <Th>Afirm</Th>
                <Th>Pres</Th>
                <Th>Mut</Th>
                <Th>Status</Th>
                <Th>File</Th>
                <Th>Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((j) => (
                <tr key={j.id} className="border-b hover:bg-blue-50">
                  <Td>{j.wilayah}</Td>
                  <Td>{j.jenjang}</Td>
                  <Td>
                    {j.dibuat_oleh}
                    <div className="text-xs text-gray-500">
                      ({j.role_pembuat})
                    </div>
                  </Td>
                  <Td>{j.persen_domisili}%</Td>
                  <Td>{j.persen_afirmasi}%</Td>
                  <Td>{j.persen_prestasi}%</Td>
                  <Td>{j.persen_mutasi}%</Td>
                  <Td>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      {j.status}
                    </span>
                  </Td>
                  <Td>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${j.juknis_file}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </Td>
                  <Td className="space-x-2">
                    <button
                      onClick={() => setSelected(j)}
                      className="rounded bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => handleApprove(j.id)}
                      className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      Setujui
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TOLAK */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Tolak Juknis
            </h2>
            <p className="mb-2 text-sm text-gray-700">
              Alasan penolakan:
            </p>
            <textarea
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              rows={3}
              className="w-full rounded border px-3 py-2 text-gray-900"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={!alasanTolak}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= TABLE HELPER ================= */
function Th({ children }: any) {
  return (
    <th className="border px-3 py-2 text-left font-semibold text-gray-900">
      {children}
    </th>
  );
}

function Td({ children }: any) {
  return (
    <td className="border px-3 py-2 text-gray-800">
      {children}
    </td>
  );
}
