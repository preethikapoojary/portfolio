import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { id } = await context.params;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Message not found", 404);

  await logAdminActivity(admin, "DELETE", "ContactMessage", `Deleted message from ${data.email}`, id);
  return ok({ deleted: true });
}
