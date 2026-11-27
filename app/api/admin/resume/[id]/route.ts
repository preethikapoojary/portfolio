import {
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const { supabase, row } = await getSingletonRow("about");
    const versions: any[] = Array.isArray(row.resume_versions) ? row.resume_versions : [];
    const idx = versions.findIndex((v) => v._id === id || v.id === id);
    if (idx === -1) return fail("Resume not found", 404);

    const now = new Date().toISOString();
    const target = versions[idx];
    versions[idx] = { ...target, isArchived: true, isActive: false, archivedAt: now, updatedAt: now };

    const { error } = await supabase
      .from("about")
      .update({ resume_versions: versions, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(admin, "ARCHIVE", "ResumeVersion", `Moved resume to trash: ${target.label || id}`, id);
    return ok({ archived: true });
  } catch (err: any) {
    return fail(err.message || "Failed to delete resume", 500);
  }
}
