import type { Metadata } from "next";
import CertificateDetail from "@/components/public/pages/CertificateDetail";
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
      .from("certificates")
      .select("title, issuer, image")
      .eq("slug", slug)
      .eq("is_archived", false)
      .maybeSingle();

    if (!data) return {};
    return buildShareMetadata({
      title: data.title,
      description: data.issuer
        ? `Issued by ${data.issuer}`
        : fallback.description,
      path: `/certificates/${slug}`,
      imageUrl: data.image?.url || fallback.imageUrl,
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
  return <CertificateDetail slug={slug} />;
}
