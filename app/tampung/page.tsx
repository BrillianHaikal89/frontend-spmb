"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import TampungTable from "./components/TampungTable";
import TampungModal from "./components/TampungModal";

export default function TampungPage() {
  const [openModal, setOpenModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState<string | null>(null);

  const { loadFromStorage, isAuthReady, user } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-700">Loading...</div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  const handleViewDetail = (kabupaten: string) => {
    setSelectedKabupaten(kabupaten);
  };

  const handleAddData = () => {
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="mb-8">
        <div className="rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 p-6 shadow-sm relative">
          {/* Konten Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Form Daya Tampung (Pelibatan Sekolah Swasta)
            </h1>
            <p className="mt-2 text-gray-700">
              Monitoring daya tampung sekolah negeri dan swasta
            </p>
          </div>
          
          {/* Tombol Tambah Data - hanya untuk non-admin, diposisikan di kanan atas */}
          {!isAdmin && (
            <div className="absolute top-6 right-6">
              <button
                onClick={handleAddData}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Plus size={18} />
                Tambah Data
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <TampungTable 
          reload={reload} 
          onViewDetail={handleViewDetail}
          isAdmin={isAdmin}
        />
      </div>

      {/* Modal untuk menambah data */}
      {openModal && !isAdmin && (
        <TampungModal
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