"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./admin.css";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedRoute from "@/components/admin/layout/ProtectedRoute";
import DashboardLayout from "@/components/admin/layout/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => {
      document.body.classList.remove("admin-body");
    };
  }, []);

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute>
          <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
      )}
    </AdminAuthProvider>
  );
}
