"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setAdmin(null);
        return;
      }

      const isAdmin = await checkIsAdmin(supabase, session.user.id, session.user.email);
      if (!isAdmin) {
        await supabase.auth.signOut();
        setAdmin(null);
        return;
      }

      const nextAdmin = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Admin",
      };
      setAdmin((prev) =>
        prev?.id === nextAdmin.id && prev?.email === nextAdmin.email && prev?.name === nextAdmin.name
          ? prev
          : nextAdmin
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      if (!session?.user) {
        setAdmin(null);
        setLoading(false);
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        loadSession();
      }
    });
    return () => subscription.unsubscribe();
  }, [loadSession]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const isAdmin = await checkIsAdmin(supabase, data.user.id, data.user.email);
    if (!isAdmin) {
      await supabase.auth.signOut();
      throw new Error("Unauthorized: not an admin account");
    }
    const adminObj = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Admin",
    };
    setAdmin(adminObj);
    return adminObj;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, isAuthenticated: !!admin, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAuth = () => useContext(AdminAuthContext);
