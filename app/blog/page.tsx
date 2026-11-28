import type { Metadata } from "next";
import BlogPage from "@/components/public/pages/BlogPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "My Blogs — Preethika Poojary",
    description:
      "Technical writing, learnings, and project reflections by Preethika Poojary.",
    path: "/blog",
  });
}

export default function Page() {
  return <BlogPage />;
}
