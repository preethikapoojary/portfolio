import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const supabase = getServiceSupabase();
    const [
      aboutRes,
      projects,
      experience,
      achievements,
      certificates,
      blog,
      unreadMessages,
      pendingTestimonials,
      analytics,
    ] = await Promise.all([
      getSingletonRow("about"),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_archived", false),
      supabase.from("experience").select("id", { count: "exact", head: true }).eq("entry_type", "experience").eq("is_archived", false),
      supabase.from("experience").select("id", { count: "exact", head: true }).eq("entry_type", "achievement").eq("is_archived", false),
      supabase.from("certificates").select("id", { count: "exact", head: true }).eq("is_archived", false),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_archived", false),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false)
        .eq("is_archived", false),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .eq("is_archived", false),
      supabase
        .from("analytics_events")
        .select("type, created_at")
        .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    const days: Record<string, { date: string; views: number; downloads: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      days[d] = { date: d, views: 0, downloads: 0 };
    }
    for (const ev of analytics.data || []) {
      const d = String(ev.created_at).slice(0, 10);
      if (!days[d]) continue;
      if (ev.type === "resume_download") days[d].downloads += 1;
      else days[d].views += 1;
    }

    const skillsArr = (Array.isArray(aboutRes.row?.skills) ? aboutRes.row.skills : []).filter((s: any) => !s?.isArchived);
    const eduArr = (Array.isArray(aboutRes.row?.education) ? aboutRes.row.education : []).filter((e: any) => !e?.isArchived);

    return ok({
      counts: {
        projects: projects.count || 0,
        skills: skillsArr.length,
        experience: experience.count || 0,
        education: eduArr.length,
        certificates: certificates.count || 0,
        achievements: achievements.count || 0,
        blog: blog.count || 0,
        unreadMessages: unreadMessages.count || 0,
        pendingTestimonials: pendingTestimonials.count || 0,
      },
      chart: Object.values(days),
    });
  } catch (err: any) {
    return fail(err.message || "Failed to fetch dashboard stats", 500);
  }
}
