"use client";

import { Plus, FileCheck } from "lucide-react";
import { useEffect, useState } from "react";
import FinalJuknisTable from "./components/FinalJuknisTable";
import FinalJuknisModal from "./components/FinalJuknisModal";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function FinalJuknisPage() {
  const [openModal, setOpenModal] = useState(false);
  const [reload, setReload] = useState(false);

  const { loadFromStorage, isAuthReady, user } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        Loading...
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mb-8">
        <div className="rounded-lg bg-gradient-to-r from-green-100 to-green-50 p-6 shadow-sm relative">
          {/* Konten Header */}
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-500 p-3">
              <FileCheck className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Final Juknis SPMB
              </h1>
              <p className="mt-2 text-gray-700">
                Dokumen petunjuk teknis SPMB yang sudah disetujui dan dipublikasikan
              </p>
            </div>
          </div>
          
          {/* Tombol Tambah Final Juknis - hanya untuk non-admin */}
          {!isAdmin && (
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-white hover:bg-green-700 transition-colors duration-200 shadow-sm"
              >
                <Plus size={18} />
                Tambah Final Juknis
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <FinalJuknisTable 
          reload={reload} 
          isAdmin={isAdmin}
        />
      </div>

      {/* Modal untuk menambah Final Juknis */}
      {openModal && !isAdmin && (
        <FinalJuknisModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setReload(!reload);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}