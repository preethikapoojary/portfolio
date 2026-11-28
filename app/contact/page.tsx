import type { Metadata } from "next";
import ContactPage from "@/components/public/pages/ContactPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Contact — Preethika Poojary",
    description:
      "Get in touch with Preethika Poojary for collaborations, internships, and opportunities.",
    path: "/contact",
  });
}

export default function Page() {
  return <ContactPage />;
}
