import { ImageResponse } from "next/og";
import { seedPosts, CAT } from "@/lib/data";
import { OG_SIZE, ogFonts, Tile } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Good News Bad News";

export function generateStaticParams() {
  return seedPosts().map((p) => ({ id: p.id }));
}

export default async function Image({ params }: { params: { id: string } }) {
  const p = seedPosts().find((x) => x.id === params.id);
  const cat = p ? CAT[p.cat] || CAT.signal : CAT.signal;
  const title = p ? p.title : "A civic signal platform";
  const cityName = p ? (p.city === "honolulu" ? "Honolulu, HI" : "Spokane, WA") : "Spokane & Honolulu";
  const kicker = p ? `${cat.label} · ${p.hood} · ${cityName}` : "Now live in Spokane & Honolulu";
  const fonts = await ogFonts();

  return new ImageResponse(
    (
      <Tile
        accent={cat.color}
        kicker={kicker}
        kickerColor={cat.color === "#c99a2e" ? "#8a5e0f" : cat.color}
        headline={title}
        headlineSize={title.length > 75 ? 56 : title.length > 45 ? 64 : 76}
        footerRight="Reviewed local signal"
      />
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
