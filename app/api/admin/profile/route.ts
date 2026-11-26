import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { rowToCamel, camelToRow } from "@/lib/mappers";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  let { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
  if (error) return fail(error.message, 500);
  if (!data) {
    const created = await supabase.from("profile").insert({}).select().single();
    data = created.data;
  }
  return ok(rowToCamel(data));
}

export async function PUT(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const row = camelToRow(body);
    row.updated_at = new Date().toISOString();

    const supabase = getServiceSupabase();
    let { data: existing } = await supabase.from("profile").select("id").limit(1).maybeSingle();
    if (!existing) {
      const created = await supabase.from("profile").insert(row).select().single();
      if (created.error) return fail(created.error.message, 400);
      await logAdminActivity(admin, "UPDATE", "Profile", "Updated profile", created.data.id);
      return ok(rowToCamel(created.data));
    }

    const { data, error } = await supabase
      .from("profile")
      .update(row)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return fail(error.message, 400);
    await logAdminActivity(admin, "UPDATE", "Profile", "Updated profile", data.id);
    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Update failed", 400);
  }
}
