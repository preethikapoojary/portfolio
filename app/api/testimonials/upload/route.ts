import { getServiceSupabase, ok, fail } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return fail("No file uploaded", 400);

    const supabase = getServiceSupabase();
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-media";
    const ext = file.name.split(".").pop() || "png";
    const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type || "image/png",
      upsert: false,
    });

    if (error) return fail(error.message, 500);

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return ok({ url: pub.publicUrl, publicId: path, alt: file.name });
  } catch (err: any) {
    return fail(err.message || "Upload failed", 500);
  }
}
