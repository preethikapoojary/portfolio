import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
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
  const { data: existing } = await supabase
    .from("contact_messages")
    .select("id, is_read")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return fail("Message not found", 404);

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read: !existing.is_read, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return fail(error.message, 400);
  return ok(rowToCamel(data));
}
