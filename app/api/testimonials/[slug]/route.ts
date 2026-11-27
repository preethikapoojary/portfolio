import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const supabase = getServiceSupabase();

    let query = supabase
      .from("testimonials")
      .select("*")
      .eq("status", "approved")
      .eq("is_visible", true)
      .eq("is_archived", false);

    query = UUID_RE.test(slug) ? query.eq("id", slug) : query.eq("slug", slug);

    const { data, error } = await query.maybeSingle();
    if (error) return fail(error.message, 500);
    if (!data) return fail("Testimonial not found", 404);

    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch testimonial", 500);
  }
}
