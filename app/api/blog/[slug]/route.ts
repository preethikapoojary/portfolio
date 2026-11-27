import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .eq("is_archived", false)
      .maybeSingle();

    if (error) return fail(error.message, 500);
    if (!data) return fail("Blog post not found", 404);
    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch blog post", 500);
  }
}
