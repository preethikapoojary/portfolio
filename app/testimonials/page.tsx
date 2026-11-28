import type { Metadata } from "next";
import TestimonialsPage from "@/components/public/pages/TestimonialsPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Testimonials — Preethika Poojary",
    description:
      "Words from collaborators, peers, and mentors about working with Preethika Poojary.",
    path: "/testimonials",
  });
}

export default function Page() {
  return <TestimonialsPage />;
}
