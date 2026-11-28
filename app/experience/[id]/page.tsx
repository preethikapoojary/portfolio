import type { Metadata } from "next";
import ExperienceDetail from "@/components/public/pages/ExperienceDetail";
import { getServiceSupabase } from "@/lib/adminAuth";
import { buildShareMetadata, getSiteProfileSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fallback = await getSiteProfileSeo();
  try {
    const supabase = getServiceSupabase();
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );
    let query = supabase
      .from("experience")
      .select("role, company, description, cover_image, attachments, certificate, proof_file")
      .eq("is_archived", false);
    query = isUuid ? query.eq("id", id) : query.eq("slug", id);
    const { data } = await query.maybeSingle();

    if (!data) return {};
    const plainDesc = String(data.description || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
    const imageUrl =
      data.cover_image?.url ||
      data.attachments?.[0]?.url ||
      data.certificate?.url ||
      data.proof_file?.url ||
      fallback.imageUrl;

    return buildShareMetadata({
      title: data.company ? `${data.role} — ${data.company}` : data.role,
      description: plainDesc || fallback.description,
      path: `/experience/${id}`,
      imageUrl,
    });
  } catch {
    return {};
  }
}

export default function Page() {
  return <ExperienceDetail />;
}
