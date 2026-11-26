import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { rowToCamel } from "@/lib/mappers";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { id } = await context.params;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Testimonial not found", 404);

  await logAdminActivity(admin, "APPROVE", "Testimonial", `Approved testimonial from ${data.name}`, id);
  return ok(rowToCamel(data));
}
