import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

const TABLE_MAP: Record<string, { table: string; resource: string }> = {
  projects: { table: "projects", resource: "Project" },
  experience: { table: "experience", resource: "Experience" },
  achievements: { table: "experience", resource: "Achievement" },
  certificates: { table: "certificates", resource: "Certificate" },
  blog: { table: "blog_posts", resource: "BlogPost" },
  testimonials: { table: "testimonials", resource: "Testimonial" },
  messages: { table: "contact_messages", resource: "ContactMessage" },
  notes: { table: "admin_notes", resource: "AdminNote" },
};

const ABOUT_JSON_MAP: Record<string, { column: string; resource: string }> = {
  education: { column: "education", resource: "Education" },
  skills: { column: "skills", resource: "Skill" },
  "coding-profiles": { column: "coding_profiles", resource: "CodingProfile" },
  resume: { column: "resume_versions", resource: "ResumeVersion" },
};

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { module, id } = await req.json();
    if (!module || !id) return fail("module and id are required", 400);

    const now = new Date().toISOString();

    if (ABOUT_JSON_MAP[module]) {
      const cfg = ABOUT_JSON_MAP[module];
      const { supabase, row } = await getSingletonRow("about");
      const list: any[] = Array.isArray(row[cfg.column]) ? [...row[cfg.column]] : [];
      const idx = list.findIndex((item) => item._id === id || item.id === id);
      if (idx === -1) return fail("Item not found in trash", 404);

      list[idx] = { ...list[idx], isArchived: false, archivedAt: null, updatedAt: now };
      const { error } = await supabase
        .from("about")
        .update({ [cfg.column]: list, updated_at: now })
        .eq("id", row.id);
      if (error) return fail(error.message, 400);

      await logAdminActivity(admin, "RESTORE", cfg.resource, `Restored ${cfg.resource} from trash`, id);
      return ok({ restored: true, id });
    }

    const tableCfg = TABLE_MAP[module];
    if (!tableCfg) return fail(`Unknown module: ${module}`, 400);

    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from(tableCfg.table)
      .update({ is_archived: false, archived_at: null, updated_at: now })
      .eq("id", id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(admin, "RESTORE", tableCfg.resource, `Restored ${tableCfg.resource} from trash`, id);
    return ok({ restored: true, id });
  } catch (err: any) {
    return fail(err.message || "Restore failed", 500);
  }
}
