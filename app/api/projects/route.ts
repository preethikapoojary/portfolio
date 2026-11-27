import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowsToCamel } from "@/lib/mappers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const supabase = getServiceSupabase();
    let query = supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .eq("is_archived", false)
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    if (category && category !== "All") query = query.eq("category", category);
    if (featured === "true") query = query.eq("is_featured", true);

    const { data, error } = await query;
    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch projects", 500);
  }
}
