"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./admin.css";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedRoute from "@/components/admin/layout/ProtectedRoute";
import DashboardLayout from "@/components/admin/layout/DashboardLayout";

const AUTH_ROUTES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/update-password",
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname || "");

  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => {
      document.body.classList.remove("admin-body");
    };
  }, []);

  return (
    <AdminAuthProvider>
      {isAuthPage ? (
        children
      ) : (
        <ProtectedRoute>
          <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
      )}
    </AdminAuthProvider>
  );
}
