import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Good News Bad News — A civic signal platform",
  description:
    "A civic signal platform where residents submit the wins, concerns, patterns, and opportunities they're seeing. Now live in Spokane and Honolulu.",
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
      </head>
      <body>
        <StoreProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
