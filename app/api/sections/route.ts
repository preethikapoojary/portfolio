import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowsToCamel } from "@/lib/mappers";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("is_visible", true)
      .order("order", { ascending: true });
    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch sections", 500);
  }
}
