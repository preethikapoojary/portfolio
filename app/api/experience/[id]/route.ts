import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("id", id)
      .eq("is_visible", true)
      .maybeSingle();

    if (error) return fail(error.message, 500);
    if (!data) return fail("Experience not found", 404);
    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch experience", 500);
  }
}
