import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { checkIsAdmin } from "@/lib/admin";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)
  .replace(/"/g, "")
  .trim();

export function getServiceSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface AdminUser {
  id: string;
  email: string;
}

export async function verifyAdminRequest(req: Request): Promise<AdminUser | null> {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error,
  } = await userClient.auth.getUser();

  if (error || !user || !user.id) return null;

  const serviceClient = getServiceSupabase();
  const isAdmin =
    user.app_metadata?.is_admin === true ||
    (await checkIsAdmin(serviceClient, user.id, user.email));

  if (!isAdmin) return null;

  return { id: user.id, email: user.email || "" };
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function logAdminActivity(
  admin: Partial<AdminUser> | null,
  action: string,
  resource: string,
  description: string,
  resourceId?: string | null
) {
  try {
    const supabase = getServiceSupabase();
    await supabase.from("activity_logs").insert({
      admin_id: admin?.id || null,
      admin_email: admin?.email || "",
      action,
      resource,
      resource_id: resourceId || null,
      description,
    });
  } catch {
    // Non-fatal
  }
}
