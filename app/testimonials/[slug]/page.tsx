import type { Metadata } from "next";
import TestimonialDetail from "@/components/public/pages/TestimonialDetail";
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
      .from("testimonials")
      .select("name, role, message, avatar")
      .eq("slug", slug)
      .eq("status", "approved")
      .eq("is_archived", false)
      .maybeSingle();

    if (!data) return {};
    return buildShareMetadata({
      title: `Testimonial by ${data.name}`,
      description: data.message || fallback.description,
      path: `/testimonials/${slug}`,
      imageUrl: data.avatar?.url || fallback.imageUrl,
    });
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TestimonialDetail slug={slug} />;
}
