import { NextResponse } from "next/server";
import { getServiceSupabase, fail } from "@/lib/adminAuth";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return fail(error.message, 500);
    const url = data?.file?.url;
    if (!url) return fail("No active resume uploaded", 404);

    // Non-blocking analytics log
    await supabase.from("analytics_events").insert({
      type: "resume_download",
      ref_id: data.id,
      visitor_hash: "anonymous",
      path: "/api/resume/download",
    });

    return NextResponse.redirect(url);
  } catch (err: any) {
    return fail(err.message || "Failed to download resume", 500);
  }
}
