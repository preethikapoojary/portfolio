import type { Metadata } from "next";
import ProjectsPage from "@/components/public/pages/ProjectsPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Projects — Preethika Poojary",
    description:
      "Selected software engineering, AI/ML, and full-stack projects built by Preethika Poojary.",
    path: "/projects",
  });
}

export default function Page() {
  return <ProjectsPage />;
}
