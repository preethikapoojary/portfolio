import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();
    let query = supabase
      .from("experience")
      .select("*")
      .eq("entry_type", "experience")
      .eq("is_visible", true)
      .eq("is_archived", false);

    query = UUID_RE.test(id) ? query.eq("id", id) : query.eq("slug", id);

    const { data, error } = await query.maybeSingle();

    if (error) return fail(error.message, 500);
    if (!data) return fail("Experience not found", 404);
    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch experience", 500);
  }
}
