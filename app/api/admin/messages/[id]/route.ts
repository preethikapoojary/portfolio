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
  const now = new Date().toISOString();
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_archived: true, archived_at: now, updated_at: now })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Message not found", 404);

  await logAdminActivity(admin, "ARCHIVE", "ContactMessage", `Moved message from ${data.email} to trash`, id);
  return ok({ archived: true });
}
