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
    const [
      projects,
      skills,
      experience,
      education,
      certificates,
      achievements,
      blog,
      unreadMessages,
      pendingTestimonials,
      analytics,
    ] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("experience").select("id", { count: "exact", head: true }),
      supabase.from("education").select("id", { count: "exact", head: true }),
      supabase.from("certificates").select("id", { count: "exact", head: true }),
      supabase.from("achievements").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
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

    return ok({
      counts: {
        projects: projects.count || 0,
        skills: skills.count || 0,
        experience: experience.count || 0,
        education: education.count || 0,
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
