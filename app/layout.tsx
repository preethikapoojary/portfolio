import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/public/PublicShell";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://preethika-poojary.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Preethika Poojary — Portfolio",
    template: "%s | Preethika Poojary",
  },
  description:
    "Personal portfolio of Preethika Poojary — Information Science & Engineering student at NMAMIT, aspiring Software Engineer, and AI/ML & Full-Stack enthusiast.",
  keywords: [
    "Preethika Poojary",
    "Software Engineer",
    "Information Science and Engineering",
    "NMAMIT",
    "AI ML Portfolio",
    "Full-Stack Developer",
  ],
  authors: [{ name: "Preethika Poojary", url: siteUrl }],
  creator: "Preethika Poojary",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Preethika Poojary — Portfolio",
    title: "Preethika Poojary — Portfolio",
    description:
      "Information Science & Engineering student, aspiring Software Engineer, and AI/ML & Full-Stack enthusiast.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preethika Poojary — Portfolio",
    description:
      "Information Science & Engineering student, aspiring Software Engineer, and AI/ML & Full-Stack enthusiast.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link id="favicon" rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
