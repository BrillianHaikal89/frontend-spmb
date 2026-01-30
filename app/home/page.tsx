// app/home/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import JuknisDashboard from "./components/juknisDashboard";
import TampungDashboard from "./components/tampungDashboard";

export default function HomePage() {
  const router = useRouter();
  const [activeDashboard, setActiveDashboard] = useState<'juknis' | 'tampung'>('juknis');

  const {
    token,
    user,
    isAuthReady,
    loadFromStorage,
  } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // tunggu auth siap
  useEffect(() => {
    if (!isAuthReady) return;

    if (!token) {
      router.replace("/");
    }
  }, [isAuthReady, token, router]);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <span className="text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="flex-1 m-4 rounded-xl bg-white p-6 shadow-sm">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-700">
                Selamat datang, {user?.username}
              </p>
            </div>
            
            {/* Tombol navigasi dashboard */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDashboard('juknis')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDashboard === 'juknis'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard Juknis
              </button>
              <button
                onClick={() => setActiveDashboard('tampung')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDashboard === 'tampung'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard Daya Tampung
              </button>
            </div>
          </div>
        </header>

        {/* Konten dashboard berdasarkan pilihan */}
        {activeDashboard === 'juknis' ? <JuknisDashboard /> : <TampungDashboard />}
      </div>
    </div>
  );
}