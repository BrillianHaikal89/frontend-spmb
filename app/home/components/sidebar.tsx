"use client";

import {
  Home,
  MapPin,
  Users,
  FileText,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ PERUBAHAN DI SINI
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/home" },
    { id: "penetapan-wilayah", label: "Penetapan Wilayah", icon: MapPin, path: "/wilayah" },
    { id: "daya-tampung", label: "Daya Tampung (Swasta)", icon: Users, path: "/daya-tampung" },
    { id: "penetapan-juknis", label: "Penetapan Juknis", icon: FileText, path: "/juknis" },
    { id: "sk", label: "SK", icon: BookOpen, path: "/sk" },
    { id: "logout", label: "Logout", icon: LogOut, path: "#" },
  ];

  const getActiveMenu = () => {
    const currentItem = menuItems.find(item =>
      pathname?.startsWith(item.path)
    );
    return currentItem?.id || "dashboard";
  };

  // ✅ PERUBAHAN DI SINI
  const handleConfirmLogout = () => {
    clearAuth();
    router.replace("/");
  };

  if (!isMounted) {
    return (
      <aside className="w-16 md:w-64 flex flex-col bg-white border-r border-blue-100 shadow-lg" />
    );
  }

  return (
    <>
      {/* SIDEBAR */}
      <aside
        className={`
          flex flex-col bg-white border-r border-blue-100 shadow-lg
          ${isCollapsed ? "w-16" : "w-64"}
          transition-all duration-300
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-100">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <Link href="/home" className="flex items-center space-x-2">
                <div className="relative h-8 w-8">
                  <Image
                    src="/logo_bbpmp.png"
                    alt="Logo BBPMP"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  SPMB
                </span>
              </Link>
            ) : (
              <Link href="/home" className="relative h-8 w-8 mx-auto">
                <Image
                  src="/logo_bbpmp.png"
                  alt="Logo BBPMP"
                  fill
                  className="object-contain"
                />
              </Link>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg p-1 hover:bg-blue-50"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* MENU */}
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = getActiveMenu() === item.id;

              return (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    onClick={(e) => {
                      if (item.id === "logout") {
                        e.preventDefault();
                        setShowLogoutModal(true);
                      }
                    }}
                    className={`
                      flex items-center rounded-lg px-3 py-2.5 text-sm font-medium
                      ${item.id === "logout"
                        ? "text-red-600 hover:bg-red-50"
                        : isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-blue-50"}
                      ${isCollapsed ? "justify-center" : ""}
                      transition-colors
                    `}
                  >
                    <Icon className={`h-5 w-5 ${!isCollapsed ? "mr-3" : ""}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Konfirmasi Logout
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              Apakah Anda yakin ingin logout dari sistem?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
