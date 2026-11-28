import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/public/PublicShell";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  getSiteProfileSeo,
  SITE_URL,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getSiteProfileSeo();
  const previewImage = profile.imageUrl;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: "%s | Preethika Poojary",
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "Preethika Poojary",
      "Software Engineer",
      "Information Science and Engineering",
      "NMAMIT",
      "AI ML Portfolio",
      "Full-Stack Developer",
    ],
    authors: [{ name: "Preethika Poojary", url: SITE_URL }],
    creator: "Preethika Poojary",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: DEFAULT_TITLE,
      title: DEFAULT_TITLE,
      description: profile.description || DEFAULT_DESCRIPTION,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: "Preethika Poojary — Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: profile.description || DEFAULT_DESCRIPTION,
      images: [previewImage],
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('editorial-theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}`,
          }}
        />
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
