export async function verifyTurnstileToken(
  token?: string | null,
  remoteIp?: string
): Promise<{ ok: boolean; message?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!secret) {
    if (siteKey) {
      return { ok: false, message: "Turnstile verification is not configured on the server." };
    }
    return { ok: true };
  }

  if (!token) {
    return { ok: false, message: "Bot verification required" };
  }

  const form = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp && remoteIp !== "unknown") {
    form.set("remoteip", remoteIp);
  }

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }
  );

  const verifyData = await verifyRes.json();
  if (!verifyData?.success) {
    return { ok: false, message: "Bot verification failed" };
  }

  return { ok: true };
}
