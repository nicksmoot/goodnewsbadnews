import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/Providers";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["local news", "civic", "Spokane", "Honolulu", "community", "signals", "neighborhood"],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteUrl()}/feed.xml` },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: siteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4ecdd",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700;800&family=Public+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="application/rss+xml" title="Good News Bad News" href="/feed.xml" />
      </head>
      <body>
        <a href="#main" className="gnbn-skip">Skip to content</a>
        <Providers>
          <StoreProvider>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
              <Header />
              <main id="main" style={{ flex: 1 }}>{children}</main>
              <Footer />
            </div>
          </StoreProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
