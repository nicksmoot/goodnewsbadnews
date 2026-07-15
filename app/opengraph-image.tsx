import { ImageResponse } from "next/og";
import { OG_SIZE, ogFonts, Tile } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Good News Bad News — a civic signal platform";

export default async function Image() {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <Tile
        accent="#19734a"
        kicker="A civic signal platform · Spokane · Honolulu · Post Falls"
        kickerColor="#8a5e0f"
        headline="Every city has two stories. Both matter."
        headlineSize={84}
        footerRight="Patterns, not rumors"
      />
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
