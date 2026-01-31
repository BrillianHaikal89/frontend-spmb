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
  ChevronDown,
  CheckCircle,
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
  const [openJuknis, setOpenJuknis] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { clearAuth, user } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);

    // auto open dropdown jika berada di halaman juknis
    if (pathname?.startsWith("/juknis")) {
      setOpenJuknis(true);
    }
  }, [pathname]);

  const isAdmin = user?.role === "admin";

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
        {/* LOGO */}
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
                <span className="text-lg font-bold text-gray-900">SPMB</span>
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
            {/* DASHBOARD */}
            <SidebarLink
              href="/home"
              icon={Home}
              label="Dashboard"
              active={pathname === "/home"}
              collapsed={isCollapsed}
            />

            <SidebarLink
              href="/wilayah"
              icon={MapPin}
              label="Penetapan Wilayah"
              active={pathname.startsWith("/wilayah")}
              collapsed={isCollapsed}
            />

            <SidebarLink
              href="/tampung"
              icon={Users}
              label="Daya Tampung (Swasta)"
              active={pathname.startsWith("/daya-tampung")}
              collapsed={isCollapsed}
            />

            {/* ================= PENETAPAN JUKNIS (DROPDOWN) ================= */}
            <li>
              <button
                onClick={() => !isCollapsed && setOpenJuknis(!openJuknis)}
                className={`
                  flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium
                  ${
                    pathname.startsWith("/juknis")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <FileText className={`h-5 w-5 ${!isCollapsed ? "mr-3" : ""}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">Penetapan Juknis</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openJuknis ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {/* DROPDOWN */}
              {!isCollapsed && openJuknis && (
                <ul className="ml-10 mt-1 space-y-1">
                  <SubMenu
                    href="/juknis/draft"
                    label="Draft"
                    active={pathname === "/juknis/draft"}
                  />
                  <SubMenu
                    href="/juknis/final"
                    label="Final"
                    active={pathname === "/juknis/final"}
                  />
                </ul>
              )}
            </li>

            {/* VALIDASI JUKNIS - ADMIN */}
            {isAdmin && (
              <SidebarLink
                href="/validasi"
                icon={CheckCircle}
                label="Validasi Juknis"
                active={pathname.startsWith("/validasi")}
                collapsed={isCollapsed}
              />
            )}

            <SidebarLink
              href="/sk"
              icon={BookOpen}
              label="SK"
              active={pathname.startsWith("/sk")}
              collapsed={isCollapsed}
            />

            {/* LOGOUT */}
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`
                  flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium
                  text-red-600 hover:bg-red-50
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <LogOut className={`h-5 w-5 ${!isCollapsed ? "mr-3" : ""}`} />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </li>
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
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
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

/* ================= COMPONENT ================= */

function SidebarLink({ href, icon: Icon, label, active, collapsed }: any) {
  return (
    <li>
      <Link
        href={href}
        className={`
          flex items-center rounded-lg px-3 py-2.5 text-sm font-medium
          ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <Icon className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );
}

function SubMenu({ href, label, active }: any) {
  return (
    <li>
      <Link
        href={href}
        className={`
          block rounded-lg px-3 py-2 text-sm
          ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-blue-50"}
        `}
      >
        {label}
      </Link>
    </li>
  );
}
