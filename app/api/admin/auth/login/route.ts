import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase, fail } from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = checkRateLimit(`login:ip:${ip}`, MAX_ATTEMPTS, WINDOW_MS);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please try again in ${ipLimit.retryAfterSec}s.`,
        },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    if (!email || !password) {
      return fail("Email and password are required", 400);
    }

    const emailLimit = checkRateLimit(`login:email:${email}`, MAX_ATTEMPTS, WINDOW_MS);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts for this account. Please try again in ${emailLimit.retryAfterSec}s.`,
        },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSec) } }
      );
    }

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await anonClient.auth.signInWithPassword({ email, password });
    if (error || !data?.session || !data?.user) {
      return fail("Invalid email or password", 401);
    }

    const serviceClient = getServiceSupabase();
    const { data: adminRow } = await serviceClient
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    const isAdmin = !!adminRow || data.user.app_metadata?.is_admin === true;
    if (!isAdmin) {
      return fail("Unauthorized: not an admin account", 403);
    }

    return NextResponse.json({
      success: true,
      data: {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
        admin: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Admin",
        },
      },
    });
  } catch (err: any) {
    return fail(err.message || "Sign in failed", 500);
  }
}
