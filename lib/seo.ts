import type { Metadata } from "next";
import { getServiceSupabase } from "@/lib/adminAuth";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://preethika-poojary.vercel.app";

export const DEFAULT_TITLE = "Preethika Poojary — Portfolio";
export const DEFAULT_DESCRIPTION =
  "Personal portfolio of Preethika Poojary — Information Science & Engineering student at NMAMIT, aspiring Software Engineer, and AI/ML & Full-Stack enthusiast.";

export async function getSiteProfileSeo(): Promise<{
  name: string;
  description: string;
  imageUrl: string;
}> {
  const fallbackImage = `${SITE_URL}/assets/preethika-poojary-profile.webp`;
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("about")
      .select("name, title, profile_photo")
      .limit(1)
      .maybeSingle();

    const imageUrl = data?.profile_photo?.url || fallbackImage;
    return {
      name: data?.name ? `${data.name} Poojary` : "Preethika Poojary",
      description: data?.title || DEFAULT_DESCRIPTION,
      imageUrl,
    };
  } catch {
    return {
      name: "Preethika Poojary",
      description: DEFAULT_DESCRIPTION,
      imageUrl: fallbackImage,
    };
  }
}

export function buildShareMetadata({
  title,
  description,
  path = "/",
  imageUrl,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  imageUrl: string;
  type?: "website" | "article";
}): Metadata {
  const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type,
      locale: "en_US",
      url: canonicalUrl,
      siteName: DEFAULT_TITLE,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Promise<Metadata> {
  const profile = await getSiteProfileSeo();
  return buildShareMetadata({
    title,
    description,
    path,
    imageUrl: profile.imageUrl,
  });
}
