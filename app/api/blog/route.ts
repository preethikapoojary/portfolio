import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowsToCamel } from "@/lib/mappers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const supabase = getServiceSupabase();
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (category && category !== "All") query = query.eq("category", category);

    const { data, error } = await query;
    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch blog posts", 500);
  }
}
