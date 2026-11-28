import type { Metadata } from "next";
import GalleryPage from "@/components/public/pages/GalleryPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Gallery — Preethika Poojary",
    description:
      "Moments, hackathons, and project highlights from Preethika Poojary.",
    path: "/gallery",
  });
}

export default function Page() {
  return <GalleryPage />;
}
