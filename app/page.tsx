// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginForm from "./components/login-form";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { token, isAuthReady, loadFromStorage } = useAuthStore();

  // ambil auth dari storage
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 🔒 jika sudah login → tidak boleh ke halaman login
  useEffect(() => {
    if (!isAuthReady) return;

    if (token) {
      router.replace("/home");
    }
  }, [isAuthReady, token, router]);

  // loading state
  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <span className="text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 font-sans dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="flex w-full max-w-5xl xl:max-w-6xl overflow-hidden rounded-2xl shadow-2xl border border-blue-200 shadow-blue-100 max-h-[90vh] lg:max-h-[85vh]">
        
        {/* Bagian Kiri - Gambar/Ilustrasi */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-6 md:p-8 lg:p-10 text-gray-900 border-r border-blue-200 overflow-y-auto">
          <div className="mb-4 md:mb-6 text-center px-4">
            <h1 className="mb-2 md:mb-3 text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">
              Sistem SPMB
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-blue-500 font-medium">
              Seleksi Penerimaan Murid Baru
            </p>
          </div>

          <div className="relative h-40 w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 mb-4 md:mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-blue-300"></div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 rounded-full bg-white shadow-lg p-2 md:p-3 border-2 border-blue-100">
                <div className="relative h-full w-full">
                  <Image
                    src="/logo_bbpmp.png"
                    alt="Logo BBPMP"
                    fill
                    className="object-contain p-1 md:p-2"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 text-center w-full px-2">
              <p className="text-xs md:text-sm lg:text-base font-bold text-blue-600 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1 rounded-full shadow-sm border border-blue-100 whitespace-nowrap">
                Pendaftaran Online
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-6 max-w-xs text-center px-4">
            <h2 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-blue-600">
              Selamat Datang
            </h2>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
              Masuk ke sistem untuk melanjutkan proses pendaftaran, melihat status seleksi,
              dan mengakses informasi penting lainnya.
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* Bagian Kanan - Form Login */}
        {/* ======= PERSIS ========= */}
        <div className="w-full bg-white p-4 sm:p-6 md:p-8 lg:p-10 dark:bg-gray-900 md:w-1/2 overflow-y-auto">
          <div className="flex flex-col items-center justify-center md:items-start h-full">
            
            {/* Logo dan Judul untuk Mobile */}
            <div className="md:hidden mb-4 text-center">
              <div className="mb-3 flex flex-col items-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 p-2 border border-blue-200">
                  <div className="relative h-8 w-8">
                    <Image
                      src="/logo_bbpmp.png"
                      alt="Logo BBPMP"
                      fill
                      className="object-contain"
                      sizes="32px"
                      priority
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-600">SPMB</h1>
                  <p className="text-xs text-blue-500">
                    Seleksi Penerimaan Murid Baru
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Masuk ke Akun Anda
              </h2>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Silakan masukkan username dan password untuk mengakses sistem
              </p>
            </div>

            {/* Logo dan Judul untuk Desktop */}
            <div className="hidden md:block mb-6 text-center lg:text-left">
              <div className="mb-3 flex items-center justify-center lg:justify-start">
                <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-1.5 border border-blue-200">
                  <div className="relative h-6 w-6">
                    <Image
                      src="/logo_bbpmp.png"
                      alt="Logo BBPMP"
                      fill
                      className="object-contain"
                      sizes="24px"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-600">SPMB</h1>
                  <p className="text-xs text-blue-500">
                    Seleksi Penerimaan Murid Baru
                  </p>
                </div>
              </div>

              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                Masuk ke Akun Anda
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Silakan masukkan username dan password untuk mengakses sistem
              </p>
            </div>

            {/* Form Login */}
            <div className="w-full flex-1">
              <LoginForm />
            </div>

            {/* Footer */}
            <div className="mt-4 md:mt-6 w-full text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} Sistem SPMB. Hak Cipta Dilindungi.</p>
            </div>
          </div>
        </div>
        {/* ========================= */}
      </div>
    </div>
  );
}
