import type { Metadata } from "next";
import ExperiencePage from "@/components/public/pages/ExperiencePage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "My Experience — Preethika Poojary",
    description:
      "Internships, hackathons, research, and key milestones by Preethika Poojary.",
    path: "/experience",
  });
}

export default function Page() {
  return <ExperiencePage />;
}
