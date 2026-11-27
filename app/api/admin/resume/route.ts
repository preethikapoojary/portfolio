import crypto from "crypto";
import {
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { row } = await getSingletonRow("about");
    const versions: any[] = Array.isArray(row.resume_versions) ? row.resume_versions : [];
    const sorted = versions
      .filter((v) => !v?.isArchived)
      .sort(
        (a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
      );
    return ok(sorted);
  } catch (err: any) {
    return fail(err.message || "Failed to fetch resumes", 500);
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const label = (formData.get("label") as string) || "";
    if (!file) return fail("Resume PDF file is required", 400);

    const { supabase, row } = await getSingletonRow("about");
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-media";
    const ext = file.name.split(".").pop() || "pdf";
    const path = `resumes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type || "application/pdf",
      upsert: false,
    });
    if (uploadErr) return fail(uploadErr.message, 500);

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const newVersion = {
      _id: id,
      id,
      file: { url: pub.publicUrl, publicId: path, alt: file.name },
      label: label || file.name,
      isActive: true,
      uploadedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const prev: any[] = Array.isArray(row.resume_versions) ? row.resume_versions : [];
    const updated = [newVersion, ...prev.map((v) => ({ ...v, isActive: false }))];

    const { error } = await supabase
      .from("about")
      .update({ resume_versions: updated, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(admin, "CREATE", "ResumeVersion", `Uploaded resume: ${newVersion.label}`, id);
    return ok(newVersion, 201);
  } catch (err: any) {
    return fail(err.message || "Resume upload failed", 500);
  }
}
