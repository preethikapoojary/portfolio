import {
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { id } = await context.params;
    const { supabase, row } = await getSingletonRow("about");
    const versions: any[] = Array.isArray(row.resume_versions) ? row.resume_versions : [];
    const target = versions.find((v) => v._id === id || v.id === id);
    if (!target) return fail("Resume not found", 404);

    const now = new Date().toISOString();
    let activatedItem = null;
    const nextVersions = versions.map((v) => {
      const isMatch = v._id === id || v.id === id;
      const updated = { ...v, isActive: isMatch, updatedAt: isMatch ? now : v.updatedAt };
      if (isMatch) activatedItem = updated;
      return updated;
    });

    const { error } = await supabase
      .from("about")
      .update({ resume_versions: nextVersions, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(admin, "ACTIVATE", "ResumeVersion", `Activated resume: ${target.label || id}`, id);
    return ok(activatedItem);
  } catch (err: any) {
    return fail(err.message || "Failed to activate resume", 500);
  }
}
