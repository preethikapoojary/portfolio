import { NextResponse } from "next/server";
import { getServiceSupabase, ok, fail, logAdminActivity } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`contact:ip:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many messages sent. Please wait ${rl.retryAfterSec}s before trying again.`,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      subject = "",
      purpose = "",
      company = "",
      linkedinUrl = "",
      githubUrl = "",
      message,
      turnstileToken,
    } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return fail("Name, email, and message are required", 400);
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstile.ok) {
      return fail(turnstile.message || "Bot verification failed", 400);
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || purpose.trim(),
        purpose: purpose.trim(),
        company: company.trim(),
        linkedin_url: linkedinUrl.trim(),
        github_url: githubUrl.trim(),
        message: message.trim(),
      })
      .select()
      .single();

    if (error) return fail(error.message, 500);

    await logAdminActivity(
      { email: email.trim() },
      "MESSAGE_RECEIVED",
      "ContactMessage",
      `Received message from ${name.trim()} (${email.trim()})`,
      data?.id
    );

    return ok(rowToCamel(data), 201);
  } catch (err: any) {
    return fail(err.message || "Failed to send message", 500);
  }
}
