import type { Metadata } from "next";
import CertificatesPage from "@/components/public/pages/CertificatesPage";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Certificates — Preethika Poojary",
    description:
      "Verified certifications and courses completed by Preethika Poojary.",
    path: "/certificates",
  });
}

export default function Page() {
  return <CertificatesPage />;
}
