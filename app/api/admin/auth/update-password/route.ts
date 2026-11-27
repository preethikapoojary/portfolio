import { NextResponse } from "next/server";
import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const TEN_MINUTES_MS = 10 * 60 * 1000;

async function isFreshRecoverySession(adminId: string): Promise<boolean> {
  const serviceClient = getServiceSupabase();
  const { data } = await serviceClient.auth.admin.getUserById(adminId);
  const sentAt = data?.user?.recovery_sent_at;
  if (!sentAt) return false;
  const ageMs = Date.now() - new Date(sentAt).getTime();
  return ageMs >= 0 && ageMs <= TEN_MINUTES_MS;
}

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const valid = await isFreshRecoverySession(admin.id);
  if (!valid) {
    return fail("Recovery link has expired or is invalid. Please request a new magic link.", 403);
  }

  return ok({ valid: true });
}

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`update-pwd:${admin.id}:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many password update attempts. Please wait ${rl.retryAfterSec}s.`,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const valid = await isFreshRecoverySession(admin.id);
    if (!valid) {
      return fail("Recovery link has expired or is invalid. Please request a new magic link.", 403);
    }

    const body = await req.json();
    const password = String(body?.password || "");
    if (password.length < 6) {
      return fail("Password must be at least 6 characters.", 400);
    }

    const serviceClient = getServiceSupabase();
    const { error } = await serviceClient.auth.admin.updateUserById(admin.id, { password });
    if (error) return fail(error.message, 400);

    await logAdminActivity(admin, "UPDATE", "Security", "Updated admin password via recovery link", admin.id);
    return ok({ updated: true });
  } catch (err: any) {
    return fail(err.message || "Unable to update password", 500);
  }
}
