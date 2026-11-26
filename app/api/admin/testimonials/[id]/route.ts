import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { rowToCamel, camelToRow } from "@/lib/mappers";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await req.json();
  const row = camelToRow(body);
  row.updated_at = new Date().toISOString();

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .update(row)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Testimonial not found", 404);
  return ok(rowToCamel(data));
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { id } = await context.params;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Testimonial not found", 404);

  await logAdminActivity(admin, "DELETE", "Testimonial", `Deleted testimonial from ${data.name}`, id);
  return ok({ deleted: true });
}
