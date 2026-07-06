import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Good News Bad News — a civic signal platform";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#f4ecdd", padding: "76px", justifyContent: "space-between",
          borderTop: "16px solid #19734a",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, color: "#8a5e0f", fontWeight: 700 }}>
          A CIVIC SIGNAL PLATFORM · NOW LIVE IN SPOKANE & HONOLULU
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, color: "#161616", lineHeight: 1.0, letterSpacing: -3 }}>
          Every city has two stories. Both matter.
        </div>
        <div style={{ display: "flex", fontSize: 46, fontWeight: 800, letterSpacing: -1 }}>
          <span style={{ color: "#19734a" }}>Good News</span>
          <span>&nbsp;</span>
          <span style={{ color: "#a33429" }}>Bad News</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
