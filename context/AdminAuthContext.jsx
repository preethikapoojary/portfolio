"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user || !session?.access_token) {
        setAdmin(null);
        return;
      }

      // Server-side verification so localStorage/URL tampering cannot bypass auth
      const res = await fetch("/api/admin/auth/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        await supabase.auth.signOut();
        setAdmin(null);
        return;
      }

      const json = await res.json();
      if (!json?.success || !json?.data?.id) {
        await supabase.auth.signOut();
        setAdmin(null);
        return;
      }

      const nextAdmin = {
        id: json.data.id,
        email: json.data.email || session.user.email,
        name:
          session.user.user_metadata?.name ||
          (json.data.email || session.user.email)?.split("@")[0] ||
          "Admin",
      };
      setAdmin((prev) =>
        prev?.id === nextAdmin.id && prev?.email === nextAdmin.email && prev?.name === nextAdmin.name
          ? prev
          : nextAdmin
      );
    } catch {
      setAdmin(null);
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
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.message || "Invalid email or password.");
    }

    const { error } = await supabase.auth.setSession(json.data.session);
    if (error) throw error;

    setAdmin(json.data.admin);
    return json.data.admin;
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
