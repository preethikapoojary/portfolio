import type { Metadata } from "next";
import AboutPage from "@/components/public/pages/AboutPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "About — Preethika Poojary",
    description:
      "Learn about Preethika Poojary — education, technical skills, coding profiles, and achievements.",
    path: "/about",
  });
}

export default function Page() {
  return <AboutPage />;
}
