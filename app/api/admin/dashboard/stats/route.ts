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
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthIso = monthStart.toISOString();

    const [
      projectsAll,
      projectsVisible,
      projectsMonth,
      blogsPublished,
      blogsMonth,
      blogsDraft,
      notesDraft,
      testimonialsAll,
      testimonialsPending,
      certificatesAll,
      unreadMessages,
    ] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_archived", false),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("is_visible", true),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_archived", false).gte("created_at", monthIso),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("status", "published"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("status", "published").gte("created_at", monthIso),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("status", "draft"),
      supabase.from("admin_notes").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("status", "Draft"),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("is_archived", false),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("status", "pending"),
      supabase.from("certificates").select("id", { count: "exact", head: true }).eq("is_archived", false),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_archived", false).eq("is_read", false),
    ]);

    return ok({
      projects: {
        total: projectsAll.count || 0,
        visible: projectsVisible.count || 0,
        thisMonth: projectsMonth.count || 0,
      },
      blogs: {
        published: blogsPublished.count || 0,
        thisMonth: blogsMonth.count || 0,
        drafts: blogsDraft.count || 0,
      },
      testimonials: {
        total: testimonialsAll.count || 0,
        pending: testimonialsPending.count || 0,
      },
      certificates: certificatesAll.count || 0,
      unreadMessages: unreadMessages.count || 0,
      drafts: (blogsDraft.count || 0) + (notesDraft.count || 0),
    });
  } catch (err: any) {
    return fail(err.message || "Failed to fetch dashboard stats", 500);
  }
}
