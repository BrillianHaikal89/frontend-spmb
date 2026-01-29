// app/home/layout.tsx

import Sidebar from "./components/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white overflow-auto">
        {children}
      </main>
    </div>
  );
}
