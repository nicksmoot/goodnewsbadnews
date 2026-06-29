"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { cityCfg } from "@/lib/data";

const DIG_DEFS: [string, string][] = [
  ["Good Signals Only", "Wins, youth stories, generosity, progress."],
  ["Warning Signals Only", "Public-safety concerns, broken systems, rising needs."],
  ["Opportunity Signals Only", "Places to volunteer, mentor, fund, or help."],
  ["All Signals", "A balanced weekly view of Spokane."],
];

export default function DigestPage() {
  const { city, digestPref, setDigestPref, subscribed, subscribe } = useStore();
  const cfg = cityCfg(city);
  const [email, setEmail] = useState("");

  return (
    <div>
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 70px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>The Saturday Digest</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.6vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", margin: "0 0 14px" }}>The Good, the Bad, and the Real {cfg.name}.</h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: "#5a564d", maxWidth: 640, margin: "0 0 30px" }}>Every Saturday, a city briefing built from what residents are seeing on the ground: three wins, three concerns, one complicated story, three ways to help, and one question for the community.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {DIG_DEFS.map(([title, desc]) => {
            const active = digestPref === title;
            return (
              <button key={title} onClick={() => setDigestPref(title)} style={{ textAlign: "left", border: `1px solid ${active ? "#c99a2e" : "#d8cab2"}`, background: active ? "#fff8eb" : "#fffaf1", borderRadius: 14, padding: "16px 18px", cursor: "pointer", boxShadow: active ? "inset 0 0 0 1px #c99a2e" : "none" }}>
                <strong style={{ display: "block", fontFamily: "'Spectral',serif", fontSize: 18, marginBottom: 4, color: "#161616" }}>{title}</strong>
                <span style={{ fontSize: 13.5, color: "#5a564d", lineHeight: 1.45 }}>{desc}</span>
              </button>
            );
          })}
        </div>

        <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 16, padding: 22, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ flex: 1, minWidth: 220, border: "1px solid #d8cab2", background: "#fffdf8", padding: 13, borderRadius: 11, fontSize: 15 }} />
          <button onClick={subscribe} style={{ border: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>{subscribed ? "Update subscription" : "Subscribe"}</button>
        </div>
        {subscribed && (
          <div style={{ marginTop: 14, background: "#19734a14", border: "1px solid #19734a59", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#19734a" }}>You&apos;re subscribed to: <strong>{digestPref}</strong>. Look for the first Saturday briefing in your inbox.</div>
        )}

        <div style={{ background: "#161616", color: "#fff", borderRadius: 18, padding: 26, marginTop: 30 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 14 }}>Issue 01 preview - &quot;The Good, the Bad, and the Real {cfg.name}: Week One&quot;</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14.5, lineHeight: 1.5, color: "#e7e1d4" }}>
            <div><strong style={{ color: "#7fcfa5" }}>3 wins</strong><br />Breakfast club, Sunday open gym, robotics mentors.</div>
            <div><strong style={{ color: "#e89a8f" }}>3 concerns</strong><br />Streetlights near Monroe, downtown theft pattern, bus-stop safety.</div>
            <div><strong style={{ color: "#e8c46f" }}>1 complicated story</strong><br />New shelter opened - more beds, poor neighbor communication.</div>
            <div><strong style={{ color: "#9fb8d6" }}>1 question</strong><br />Where should Spokane add its next safe place for kids after school?</div>
          </div>
        </div>
      </section>
    </div>
  );
}
