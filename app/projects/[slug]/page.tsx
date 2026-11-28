import type { Metadata } from "next";
import ProjectDetail from "@/components/public/pages/ProjectDetail";
import { getServiceSupabase } from "@/lib/adminAuth";
import { buildShareMetadata, getSiteProfileSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fallback = await getSiteProfileSeo();
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("projects")
      .select("title, short_description, cover_image, screenshots")
      .eq("slug", slug)
      .eq("is_archived", false)
      .maybeSingle();

    if (!data) return {};
    return buildShareMetadata({
      title: data.title,
      description: data.short_description || fallback.description,
      path: `/projects/${slug}`,
      imageUrl:
        data.cover_image?.url ||
        data.screenshots?.[0]?.url ||
        fallback.imageUrl,
    });
  } catch {
    return {};
  }
}

export default function Page() {
  return <ProjectDetail />;
}
