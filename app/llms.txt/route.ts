import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/adminAuth";

export const revalidate = 3600;

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://preethika-poojary.netlify.app";

  try {
    const supabase = getServiceSupabase();
    const [profileRes, eduRes, projRes, expRes, achRes, skillRes, blogRes] =
      await Promise.all([
        supabase.from("profile").select("*").limit(1).maybeSingle(),
        supabase.from("education").select("*").eq("is_visible", true).order("order"),
        supabase.from("projects").select("*").eq("is_visible", true).order("order"),
        supabase.from("experience").select("*").eq("is_visible", true).order("order"),
        supabase.from("achievements").select("*").eq("is_visible", true).order("order"),
        supabase.from("skills").select("*").eq("is_visible", true).order("order"),
        supabase.from("blog_posts").select("title, slug, excerpt").eq("status", "published"),
      ]);

    const profile = profileRes.data;
    const lines: string[] = [
      `# ${profile?.name ? `${profile.name} Poojary` : "Preethika Poojary"}`,
      "",
      `> ${profile?.title || "Information Science & Engineering Student | Aspiring Software Engineer"}`,
      "",
      `Website: ${baseUrl}`,
      profile?.email ? `Email: ${profile.email}` : "",
      "",
      "## About",
      profile?.about_me || "",
      "",
      "## Education",
      ...(eduRes.data || []).map(
        (e) =>
          `- ${e.institution} — ${[e.degree, e.field_of_study].filter(Boolean).join(" ")}${e.grade ? ` (${e.grade})` : ""}`
      ),
      "",
      "## Projects",
      ...(projRes.data || []).map(
        (p) => `- [${p.title}](${baseUrl}/projects/${p.slug}): ${p.short_description}`
      ),
      "",
      "## Experience",
      ...(expRes.data || []).map(
        (e) => `- ${e.role} at ${e.company}: ${e.description}`
      ),
      "",
      "## Achievements",
      ...(achRes.data || []).map(
        (a) => `- ${a.title}${a.description ? `: ${a.description}` : ""}`
      ),
      "",
      "## Skills",
      (skillRes.data || []).map((s) => s.name).join(", "),
      "",
      ...(blogRes.data?.length
        ? [
            "## Articles",
            ...blogRes.data.map(
              (b) => `- [${b.title}](${baseUrl}/blog/${b.slug}): ${b.excerpt}`
            ),
            "",
          ]
        : []),
      "## Pages",
      `- Home: ${baseUrl}/`,
      `- About: ${baseUrl}/about`,
      `- Projects: ${baseUrl}/projects`,
      `- Experience: ${baseUrl}/experience`,
      `- Certificates: ${baseUrl}/certificates`,
      `- Testimonials: ${baseUrl}/testimonials`,
      `- Contact: ${baseUrl}/contact`,
    ];

    return new NextResponse(lines.filter((l) => l !== undefined).join("\n"), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(
      `# Preethika Poojary\n\nPersonal portfolio: ${baseUrl}\n`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
