"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import JuknisModal from "./components/JuknisModal";
import JuknisTable from "./components/JuknisTable";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function JuknisPage() {
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const { loadFromStorage, isAuthReady } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-bold text-gray-900">
          Data Juknis SPMB
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Tambah Juknis
        </button>
      </div>

      <JuknisTable reload={reload} />

      {open && (
        <JuknisModal
          onClose={() => setOpen(false)}
          onSuccess={() => setReload(!reload)}
        />
      )}
    </div>
  );
}
