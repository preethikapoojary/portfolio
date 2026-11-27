import { NextResponse } from "next/server";
import { fail } from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

export async function GET() {
  try {
    const { supabase, row } = await getSingletonRow("about");
    const versions: any[] = Array.isArray(row.resume_versions) ? row.resume_versions : [];
    const active = versions
      .filter((v) => v?.isActive && !v?.isArchived)
      .sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime())[0];

    const url = active?.file?.url;
    if (!url) return fail("No active resume uploaded", 404);

    // Non-blocking analytics log
    await supabase.from("analytics_events").insert({
      type: "resume_download",
      ref_id: active._id || active.id || null,
      visitor_hash: "anonymous",
      path: "/api/resume/download",
    });

    return NextResponse.redirect(url);
  } catch (err: any) {
    return fail(err.message || "Failed to download resume", 500);
  }
}
