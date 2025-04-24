"use client";

import AdminHeaderDashboard from "@/components/admin/AdminHeaderDashboard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AppWrapper, useMyContext } from "@/context";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useMyContext();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Sidebar uses context internally */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-grow">
        <AdminHeaderDashboard toggleSidebar={toggleSidebar} />
        <main className="p-2 sm:p-3 lg:p-6 !pt-16">{children}</main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <LayoutContent>{children}</LayoutContent>
    </AppWrapper>
  );
}
