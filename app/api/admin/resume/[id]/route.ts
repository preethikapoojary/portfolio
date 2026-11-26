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
    .from("resume_versions")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Resume not found", 404);

  if (data.file?.publicId) {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-media";
    await supabase.storage.from(bucket).remove([data.file.publicId]);
  }

  await logAdminActivity(admin, "DELETE", "ResumeVersion", `Deleted resume: ${data.label || id}`, id);
  return ok({ deleted: true });
}
