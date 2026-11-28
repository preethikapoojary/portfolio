import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
} from "@/lib/adminAuth";
import { processUploadedFile } from "@/lib/imageUpload";

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    if (!file) return fail("No file provided", 400);

    const supabase = getServiceSupabase();
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-media";
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const { buffer, ext, contentType } = await processUploadedFile(file, folder);
    const path = `${cleanFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) return fail(error.message, 500);

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return ok({ url: pub.publicUrl, publicId: path, alt: file.name });
  } catch (err: any) {
    return fail(err.message || "Upload failed", 500);
  }
}
