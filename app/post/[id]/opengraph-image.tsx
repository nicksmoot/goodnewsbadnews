import { ImageResponse } from "next/og";
import { seedPosts, CAT } from "@/lib/data";

export const size = { width: 1200, height: 630 };
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
  const meta = p ? `${cat.label.toUpperCase()} · ${p.hood} · ${cityName}` : "NOW LIVE IN SPOKANE & HONOLULU";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#f4ecdd", padding: "70px 76px", justifyContent: "space-between",
          borderTop: `16px solid ${cat.color}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#8a5e0f", fontWeight: 700 }}>
            {meta}
          </div>
          <div
            style={{
              display: "flex", fontSize: title.length > 70 ? 60 : 74, fontWeight: 800,
              color: "#161616", lineHeight: 1.05, marginTop: 34, letterSpacing: -2,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: "#19734a" }}>Good News</span>
            <span style={{ color: "#161616" }}>&nbsp;</span>
            <span style={{ color: "#a33429" }}>Bad News</span>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#6b675e", letterSpacing: 2 }}>
            A CIVIC SIGNAL PLATFORM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
