import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    let { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (error) return fail(error.message, 500);
    if (!data) {
      const created = await supabase.from("site_settings").insert({}).select().single();
      data = created.data;
    }
    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch settings", 500);
  }
}
