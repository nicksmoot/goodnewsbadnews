import { ImageResponse } from "next/og";
import { hoodFromSlug, allHoodSlugs } from "@/lib/slug";
import { OG_SIZE, ogFonts, Tile } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Good News Bad News neighborhood";

export function generateStaticParams() {
  return allHoodSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const hood = hoodFromSlug(params.slug) || "Neighborhood";
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <Tile
        accent="#c99a2e"
        kicker="Neighborhood signal"
        kickerColor="#8a5e0f"
        headline={`What ${hood} is seeing.`}
        headlineSize={78}
        footerRight="Reviewed local signal"
      />
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
