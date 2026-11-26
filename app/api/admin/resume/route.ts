import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { rowToCamel, rowsToCamel } from "@/lib/mappers";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("resume_versions")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) return fail(error.message, 500);
  return ok(rowsToCamel(data));
}

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const label = (formData.get("label") as string) || "";
    if (!file) return fail("Resume PDF file is required", 400);

    const supabase = getServiceSupabase();
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

    // Deactivate previous versions if this is the first or auto-activate
    await supabase.from("resume_versions").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");

    const { data, error } = await supabase
      .from("resume_versions")
      .insert({
        file: { url: pub.publicUrl, publicId: path, alt: file.name },
        label: label || file.name,
        is_active: true,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error.message, 400);
    await logAdminActivity(admin, "CREATE", "ResumeVersion", `Uploaded resume: ${label || file.name}`, data.id);
    return ok(rowToCamel(data), 201);
  } catch (err: any) {
    return fail(err.message || "Resume upload failed", 500);
  }
}
