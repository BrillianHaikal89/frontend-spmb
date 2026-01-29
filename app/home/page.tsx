// app/home/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import HomeContent from "./components/home-content";

export default function HomePage() {
  const router = useRouter();

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
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-700">
            Selamat datang, {user?.username}
          </p>
        </header>

        <HomeContent />
      </div>
    </div>
  );
}
