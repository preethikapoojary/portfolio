import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kind, payload } = body || {};
    if (!kind || !payload) return fail("Invalid analytics payload", 400);

    const supabase = getServiceSupabase();

    if (kind === "page_view") {
      await supabase.from("page_views").insert({
        session_id: String(payload.session_id || "anonymous"),
        path: String(payload.path || "/"),
        title: String(payload.title || ""),
        referrer: String(payload.referrer || "Direct"),
        browser: String(payload.browser || "Unknown"),
        os: String(payload.os || "Unknown"),
        device_type: String(payload.device_type || "Desktop"),
        country: String(payload.country || "Unknown"),
      });
    } else if (kind === "section_view") {
      await supabase.from("section_views").insert({
        session_id: String(payload.session_id || "anonymous"),
        section_id: String(payload.section_id || ""),
        time_spent_ms: Number(payload.time_spent_ms || 0),
        max_scroll_depth_percent: Number(payload.max_scroll_depth_percent || 0),
      });
    } else if (kind === "event") {
      await supabase.from("analytics_events").insert({
        type: String(payload.event_type || "event"),
        event_type: String(payload.event_type || "event"),
        session_id: String(payload.session_id || "anonymous"),
        target_id: payload.target_id ? String(payload.target_id) : null,
        metadata: payload.metadata || {},
        visitor_hash: String(payload.session_id || "anonymous"),
        path: String(payload.path || ""),
      });
    }

    return ok({ tracked: true });
  } catch (err: any) {
    return fail(err.message || "Analytics tracking failed", 500);
  }
}
