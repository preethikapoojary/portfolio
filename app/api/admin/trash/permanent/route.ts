import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

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

async function verifyAdminPassword(email: string, password: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !email || !password) return false;

  const authClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await authClient.auth.signInWithPassword({ email, password });
  return !error;
}

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`trash-perm:${admin.id}:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many password attempts. Please wait ${rl.retryAfterSec}s.`,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const { module, id, password } = await req.json();
    if (!module || !id) return fail("module and id are required", 400);
    if (!password) return fail("Admin password is required for permanent deletion", 400);

    const validPassword = await verifyAdminPassword(admin.email, password);
    if (!validPassword) return fail("Incorrect admin password", 403);

    if (ABOUT_JSON_MAP[module]) {
      const cfg = ABOUT_JSON_MAP[module];
      const { supabase, row } = await getSingletonRow("about");
      const list: any[] = Array.isArray(row[cfg.column]) ? [...row[cfg.column]] : [];
      const target = list.find((item) => item._id === id || item.id === id);
      if (!target) return fail("Item not found in trash", 404);

      const nextList = list.filter((item) => item._id !== id && item.id !== id);
      const { error } = await supabase
        .from("about")
        .update({ [cfg.column]: nextList, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (error) return fail(error.message, 400);

      if (module === "resume" && target.file?.publicId) {
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-media";
        await supabase.storage.from(bucket).remove([target.file.publicId]);
      }

      await logAdminActivity(admin, "PERMANENT_DELETE", cfg.resource, `Permanently deleted ${cfg.resource}`, id);
      return ok({ deleted: true, id });
    }

    const tableCfg = TABLE_MAP[module];
    if (!tableCfg) return fail(`Unknown module: ${module}`, 400);

    const supabase = getServiceSupabase();
    const { error } = await supabase.from(tableCfg.table).delete().eq("id", id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(admin, "PERMANENT_DELETE", tableCfg.resource, `Permanently deleted ${tableCfg.resource}`, id);
    return ok({ deleted: true, id });
  } catch (err: any) {
    return fail(err.message || "Permanent delete failed", 500);
  }
}
