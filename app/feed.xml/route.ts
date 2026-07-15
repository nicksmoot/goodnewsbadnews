import { siteUrl, SITE } from "@/lib/site";
import { seedPosts, CAT, CITIES } from "@/lib/data";

export const dynamic = "force-static";

function esc(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));
}

export async function GET() {
  const base = siteUrl();
  const items = seedPosts()
    .slice()
    .sort((a, b) => a.age - b.age)
    .slice(0, 40)
    .map((p) => {
      const cat = CAT[p.cat] || CAT.signal;
      const cityName = CITIES[p.city]?.name || "Spokane";
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/post/${p.id}</link>
      <guid isPermaLink="true">${base}/post/${p.id}</guid>
      <category>${esc(cat.label)}</category>
      <description>${esc(p.summary)}</description>
      <dc:creator>${esc(p.by)}</dc:creator>
      <source url="${base}/feed.xml">${esc(cityName)} · ${esc(p.hood)}</source>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${base}</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(SITE.description)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
