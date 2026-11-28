import type { Metadata } from "next";
import BlogPost from "@/components/public/pages/BlogPost";
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
      .from("blog_posts")
      .select("title, excerpt, cover_image")
      .eq("slug", slug)
      .eq("is_archived", false)
      .maybeSingle();

    if (!data) return {};
    return buildShareMetadata({
      title: data.title,
      description: data.excerpt || fallback.description,
      path: `/blog/${slug}`,
      imageUrl: data.cover_image?.url || fallback.imageUrl,
      type: "article",
    });
  } catch {
    return {};
  }
}

export default function Page() {
  return <BlogPost />;
}
