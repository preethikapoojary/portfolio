import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
} from "@/lib/adminAuth";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const supabase = getServiceSupabase();
    const [unreadMessages, pendingTestimonials, unreadSystem] = await Promise.all([
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("system_notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);

    return ok({
      unreadMessages: unreadMessages.count || 0,
      pendingTestimonials: pendingTestimonials.count || 0,
      unreadSystem: unreadSystem.count || 0,
      total:
        (unreadMessages.count || 0) +
        (pendingTestimonials.count || 0) +
        (unreadSystem.count || 0),
    });
  } catch (err: any) {
    return fail(err.message || "Failed to fetch notification summary", 500);
  }
}
