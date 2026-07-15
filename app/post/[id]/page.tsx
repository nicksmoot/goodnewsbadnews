import type { Metadata } from "next";
import PostDetail from "@/components/PostDetail";
import { seedPosts, CAT, CITIES } from "@/lib/data";
import { SITE, siteUrl } from "@/lib/site";

// Pre-render metadata for the seed stories (the real, server-known content).
// User-published demo signals (id starting "p-") live only in the browser, so
// they fall back to generic metadata.
function findSeed(id: string) {
  return seedPosts().find((p) => p.id === id) || null;
}

export function generateStaticParams() {
  return seedPosts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = findSeed(params.id);
  if (!p) {
    return { title: "Signal", description: SITE.description };
  }
  const cat = CAT[p.cat] || CAT.signal;
  const cityName = CITIES[p.city]?.name || "Spokane";
  const desc = p.summary;
  return {
    title: p.title,
    description: desc,
    alternates: { canonical: `/post/${p.id}` },
    openGraph: {
      type: "article",
      title: p.title,
      description: desc,
      url: `${siteUrl()}/post/${p.id}`,
      section: cat.label,
      tags: p.topics,
    },
    twitter: { card: "summary_large_image", title: p.title, description: desc },
    other: { "article:section": `${cat.label} · ${cityName}` },
  };
}

export default function PostPage({ params }: { params: { id: string } }) {
  const p = findSeed(params.id);
  const jsonLd = p
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: p.title,
        description: p.summary,
        articleSection: (CAT[p.cat] || CAT.signal).label,
        keywords: p.topics.join(", "),
        image: p.photo ? [p.photo] : undefined,
        author: { "@type": "Person", name: p.by },
        publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: `${siteUrl()}/post/${p.id}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <PostDetail id={params.id} />
    </>
  );
}
