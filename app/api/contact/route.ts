import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject = "", message, turnstileToken } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return fail("Name, email, and message are required", 400);
    }

    // Optional Turnstile verification
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return fail("Bot verification required", 400);
      }
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return fail("Bot verification failed", 400);
      }
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      })
      .select()
      .single();

    if (error) return fail(error.message, 500);
    return ok(rowToCamel(data), 201);
  } catch (err: any) {
    return fail(err.message || "Failed to send message", 500);
  }
}
