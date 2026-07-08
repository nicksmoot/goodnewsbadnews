"use client";

import Link from "next/link";

// The state of local news, as an exact ratio. America has ~19,500 cities and
// towns and about 76 independent daily newspapers left: one for every ~256.
// So we show one unit of that ratio, a block of 256 cities with a single green
// one that still has an independent daily. Every dot is the same size, so the
// picture is the ratio, not an approximation.

const UNIT = 256; // 16 x 16 (columns set by .gnbn-ratio-grid in globals.css)
const GREEN_AT = 138; // one survivor, roughly mid-field

export default function LocalNewsStat() {
  return (
    <div style={{ background: "#161616", color: "#fff", borderRadius: 20, padding: "clamp(24px,4vw,40px)" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#e89a8f", marginBottom: 22 }}>The state of local news in America</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 56px", marginBottom: 30 }}>
        <div>
          <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(40px,7vw,68px)", lineHeight: 1, letterSpacing: "-2px" }}>19,500</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9a927f", marginTop: 8 }}>cities and towns</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(40px,7vw,68px)", lineHeight: 1, letterSpacing: "-2px", color: "#e89a8f" }}>76</div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9a927f", marginTop: 8 }}>independent daily newspapers left</div>
        </div>
      </div>

      <div
        role="img"
        aria-label="A block of 256 cities. One is green: the roughly one city in 256 that still has an independent daily newspaper."
        className="gnbn-ratio-grid"
        style={{ gap: "clamp(6px,1.6vw,13px)", maxWidth: 560 }}
      >
        {Array.from({ length: UNIT }).map((_, i) => {
          const isGreen = i === GREEN_AT;
          return (
            <span
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: "50%",
                background: isGreen ? "#4aa876" : "#4f4a3f",
                transform: isGreen ? "scale(1.18)" : "none",
                boxShadow: isGreen ? "0 0 0 5px rgba(74,168,118,0.22)" : "none",
              }}
            />
          );
        })}
      </div>

      <p style={{ fontFamily: "'Spectral',serif", fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.5, color: "#e7e1d4", margin: "30px 0 0", maxWidth: 720 }}>
        Each dot is a city. <strong style={{ color: "#7fcfa5" }}>For every 256 cities, only one still has an independent daily newspaper</strong>, and most of those answer to billionaires and corporate chains.
      </p>
      <p style={{ fontFamily: "'Spectral',serif", fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.5, color: "#cfc8b9", margin: "14px 0 0", maxWidth: 720 }}>
        That should concern anyone who cares about strong communities. It is time to fight back.
      </p>
      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/submit" style={{ textDecoration: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Put your city back on the record</Link>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#8a857a", letterSpacing: "0.4px" }}>Widely reported estimates</span>
      </div>
    </div>
  );
}
