"use client";

import { useStore } from "@/lib/store";
import { cityCfg } from "@/lib/data";

export default function AboutPage() {
  const { city } = useStore();
  const cfg = cityCfg(city);

  return (
    <div>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 70px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>About</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.8vw,56px)", lineHeight: 1.02, letterSpacing: "-1.8px", margin: "0 0 24px" }}>A clearer signal for your city.</h1>
        <p style={{ fontFamily: "'Spectral',serif", fontSize: 21, lineHeight: 1.6, color: "#2b2820", margin: "0 0 20px" }}>Cities do not fail because nobody cares. They fail because the signal gets buried. Good work goes unnoticed. Problems become rumors. Residents see patterns long before institutions do - but there is no trusted place to send what they&apos;re seeing.</p>
        <p style={{ fontFamily: "'Spectral',serif", fontSize: 21, lineHeight: 1.6, color: "#2b2820", margin: "0 0 32px" }}>Good News Bad News exists to close that gap.</p>
        <div style={{ borderTop: "1px solid #d8cab2", paddingTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>What it is</h3>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>A moderated, community-powered signal system - part civic newsroom, part neighborhood early-warning system, part public square with rules.</p>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>What it is not</h3>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>Not a complaint board. Not Nextdoor. Not a city portal. Not anonymous gossip. The point isn&apos;t to make {cfg.name} look good or bad - it&apos;s to help the city see clearly.</p>
          </div>
        </div>
        <div style={{ background: "#fff8eb", border: "1px solid #c99a2e80", borderRadius: 16, padding: 24, marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>Open, but not reckless.</h3>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#3a362e", margin: 0 }}>Make it easy for residents to submit raw signal, but hard for unverified claims to become public harm. Local, but not small. Honest, but not cynical. Constructive, but not sanitized.</p>
        </div>
      </section>
    </div>
  );
}
