"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import JuknisDetailModalReadOnly from "../juknis/components/JuknisDetailModalReadOnly";

/* ================= TYPE ================= */
type StatusValidasi = "diajukan" | "disetujui" | "ditolak";

type Juknis = {
  id: string;
  wilayah: string;
  jenjang: string;
  pejabat_penandatangan?: string;
  tgl_penetapan_juknis?: string;
  tgl_mulai_pendaftaran?: string;
  tgl_penetapan_kelulusan?: string;
  persen_domisili: number;
  persen_afirmasi: number;
  persen_prestasi: number;
  persen_mutasi: number;
  status_validasi: StatusValidasi;
  keterangan?: string;
  juknis_file?: string;
  data_dukung_lainnya?: string;
};

/* ================= COMPONENT ================= */
export default function AdminValidasiJuknisPage() {
  const router = useRouter();
  const { token, user, isAuthReady } = useAuthStore();

  const [data, setData] = useState<Juknis[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [detailData, setDetailData] = useState<Juknis | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedJuknis, setSelectedJuknis] = useState<{
    id: string;
    status: StatusValidasi;
  } | null>(null);

  const [keterangan, setKeterangan] = useState("");
  const [error, setError] = useState("");

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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      }
    } catch {
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  /* ================= DOWNLOAD FILE ================= */
  const handleDownloadFile = async (id: string, filename?: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/download/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Gagal download file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "juknis.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download gagal");
    }
  };

  /* ================= OPEN VALIDASI ================= */
  const handleChangeStatus = (id: string, status: StatusValidasi) => {
    setSelectedJuknis({ id, status });
    setKeterangan("");
    setError("");
    setShowModal(true);
  };

  /* ================= SUBMIT VALIDASI ================= */
  const submitStatus = async () => {
    if (!selectedJuknis) return;

    if (!keterangan.trim()) {
      setError("Keterangan wajib diisi");
      return;
    }

    setUpdatingId(selectedJuknis.id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/juknis/${selectedJuknis.id}/status-validasi`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status_validasi: selectedJuknis.status,
            keterangan,
          }),
        }
      );

      if (!res.ok) {
        const json = await res.json();
        alert(json.message || "Gagal memperbarui status");
        return;
      }

      setShowModal(false);
      fetchData();
    } catch {
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <span className="text-gray-900">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-xl font-bold text-gray-900">
          Validasi Juknis (Admin)
        </h1>

        <div className="overflow-x-auto rounded-lg border border-blue-200">
          <table className="w-full text-sm text-gray-900">
            <thead className="bg-blue-100">
              <tr>
                <Th>Wilayah</Th>
                <Th>Jenjang</Th>
                <Th align="center">Dom</Th>
                <Th align="center">Afirmasi</Th>
                <Th align="center">Prestasi</Th>
                <Th align="center">Mutasi</Th>
                <Th>Status & Aksi</Th>
              </tr>
            </thead>

            <tbody>
              {data.map((j) => (
                <tr
                  key={j.id}
                  className="border-t border-blue-100 hover:bg-blue-50"
                >
                  <Td>{j.wilayah}</Td>
                  <Td>{j.jenjang}</Td>
                  <Td align="center">{j.persen_domisili}%</Td>
                  <Td align="center">{j.persen_afirmasi}%</Td>
                  <Td align="center">{j.persen_prestasi}%</Td>
                  <Td align="center">{j.persen_mutasi}%</Td>

                  {/* STATUS + DOWNLOAD + DETAIL */}
                  <Td>
                    <div className="flex items-center gap-2">
                      {j.juknis_file && (
                        <button
                          onClick={() =>
                            handleDownloadFile(j.id, j.juknis_file)
                          }
                          className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                        >
                          Download
                        </button>
                      )}

                      <button
                        onClick={() => setDetailData(j)}
                        className="rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-gray-900 hover:bg-blue-50"
                      >
                        Detail
                      </button>
                      <select
                        value={j.status_validasi}
                        disabled={updatingId === j.id}
                        onChange={(e) =>
                          handleChangeStatus(
                            j.id,
                            e.target.value as StatusValidasi
                          )
                        }
                        className="rounded-md border border-blue-300 bg-white px-3 py-1 text-xs font-semibold text-gray-900"
                      >
                        <option value="diajukan">Diajukan</option>
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                      </select>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL DETAIL ================= */}
      {detailData && (
        <JuknisDetailModalReadOnly
          data={detailData}
          onClose={() => setDetailData(null)}
        />
      )}

      {/* ================= MODAL VALIDASI ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Keterangan Validasi
            </h2>

            {error && (
              <p className="mb-2 text-sm text-red-600">{error}</p>
            )}

            <textarea
              className="w-full rounded-md border border-blue-300 bg-white p-2 text-sm text-gray-900"
              rows={4}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Isi keterangan validasi..."
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-900 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={submitStatus}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= TABLE HELPER ================= */
function Th({ children, align = "left" }: any) {
  return (
    <th
      className={`border-b border-blue-200 px-4 py-3 font-semibold text-gray-900 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: any) {
  return (
    <td
      className={`px-4 py-3 text-gray-800 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      {children}
    </td>
  );
}
