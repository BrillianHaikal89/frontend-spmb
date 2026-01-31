"use client";

import { Plus, FileEdit } from "lucide-react";
import { useEffect, useState } from "react";
import DraftJuknisTable from "./components/DraftJuknisTable";
import DraftJuknisModal from "./components/DraftJuknisModal";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function DraftJuknisPage() {
  const [openModal, setOpenModal] = useState(false);
  const [reload, setReload] = useState(false);

  const { loadFromStorage, isAuthReady, user } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        Loading...
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="mb-8">
        <div className="relative rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-yellow-500 p-3">
              <FileEdit className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Draft Juknis SPMB
              </h1>
              <p className="mt-2 text-gray-700">
                Dokumen petunjuk teknis SPMB yang masih dalam proses penyusunan dan revisi
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="absolute right-6 top-6">
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 rounded-lg bg-yellow-600 px-5 py-2.5 text-white hover:bg-yellow-700 transition-colors shadow-sm"
              >
                <Plus size={18} />
                Tambah Draft Juknis
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <DraftJuknisTable reload={reload} isAdmin={isAdmin} />
      </div>

      {openModal && !isAdmin && (
        <DraftJuknisModal
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
