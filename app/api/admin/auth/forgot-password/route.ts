import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase, fail } from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 3;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = checkRateLimit(`forgot-pwd:ip:${ip}`, MAX_ATTEMPTS, WINDOW_MS);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many recovery requests. Please wait ${ipLimit.retryAfterSec}s before trying again.`,
        },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return fail("Valid email address is required", 400);
    }

    const emailLimit = checkRateLimit(`forgot-pwd:email:${email}`, MAX_ATTEMPTS, WINDOW_MS);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many recovery requests for this email. Please wait ${emailLimit.retryAfterSec}s.`,
        },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSec) } }
      );
    }

    const supabase = getServiceSupabase();

    // Verify strictly in admin_users + Supabase Auth app_metadata.is_admin
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id, email")
      .ilike("email", email)
      .maybeSingle();

    if (adminRow) {
      const { data: userRes } = await supabase.auth.admin.getUserById(adminRow.id);
      const isAdminFlag = userRes?.user?.app_metadata?.is_admin === true;

      if (userRes?.user && isAdminFlag) {
        const appUrl = (
          process.env.NEXT_PUBLIC_APP_URL ||
          "https://preethika-poojary.vercel.app"
        ).replace(/\/+$/, "");

        const anonClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );

        await anonClient.auth.resetPasswordForEmail(adminRow.email, {
          redirectTo: `${appUrl}/admin/update-password`,
        });
      }
    }

    // Always return generic success to prevent email enumeration via Burp Suite
    return NextResponse.json({
      success: true,
      message: "If this email is registered as an administrator, a recovery link has been sent.",
    });
  } catch (err: any) {
    return fail(err.message || "Unable to process recovery request", 500);
  }
}
