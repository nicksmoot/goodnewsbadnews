import { ImageResponse } from "next/og";
import { topicFromSlug, allTopicSlugs } from "@/lib/slug";
import { OG_SIZE, ogFonts, Tile } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Good News Bad News topic";

export function generateStaticParams() {
  return allTopicSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const topic = topicFromSlug(params.slug) || "Topic";
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <Tile
        accent="#285d83"
        kicker={`Topic · Spokane & Honolulu`}
        kickerColor="#285d83"
        headline={`${topic} across the city.`}
        headlineSize={78}
        footerRight="Reviewed local signal"
      />
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) }
  );
}
