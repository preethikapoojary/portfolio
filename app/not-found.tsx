import type { Metadata } from "next";
import NotFound from "@/components/public/pages/NotFound";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist, was moved, or could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <NotFound />;
}
