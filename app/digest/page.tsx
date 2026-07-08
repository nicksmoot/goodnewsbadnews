"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";
import { cityCfg } from "@/lib/data";

const DIG_DEFS: [string, string][] = [
  ["Good Signals Only", "Wins, youth stories, generosity, progress."],
  ["Warning Signals Only", "Public-safety concerns, broken systems, rising needs."],
  ["Opportunity Signals Only", "Places to volunteer, mentor, fund, or help."],
  ["All Signals", "A balanced weekly view of Spokane."],
];

export default function DigestPage() {
  const { city, digestPref, setDigestPref, subscribed, markSubscribed } = useStore();
  const { data: session } = useSession();
  const isMember = session?.user?.plan === "member";
  const cfg = cityCfg(city);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const subscribe = async () => {
    setError("");
    if (!/.+@.+\..+/.test(email)) { setError("Enter a valid email address."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, preference: digestPref }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not subscribe. Please try again.");
      } else {
        markSubscribed();
      }
    } catch {
      setError("Network problem. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div>
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 70px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>The Saturday Digest</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.6vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", margin: "0 0 14px" }}>The Good, the Bad, and the Real {cfg.name}.</h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: "#5a564d", maxWidth: 640, margin: "0 0 24px" }}>Every Saturday, a city briefing built from what residents are seeing on the ground: three wins, three concerns, one complicated story, three ways to help, and one question for the community.</p>

        {/* Two tiers: free teaser for everyone, full briefing for members */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 26 }}>
          <div style={{ border: "1px solid #d8cab2", borderTop: "3px solid #285d83", borderRadius: 14, padding: "16px 18px", background: "#fffaf1" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: "1.4px", textTransform: "uppercase", color: "#285d83", marginBottom: 8 }}>Free edition</div>
            <strong style={{ display: "block", fontFamily: "'Spectral',serif", fontSize: 18, marginBottom: 4 }}>The Saturday teaser</strong>
            <span style={{ fontSize: 13.5, color: "#5a564d", lineHeight: 1.45 }}>The headlines and the shape of the week, with links into the stories. Free for anyone who subscribes.</span>
          </div>
          <div style={{ border: "1px solid #19734a", borderTop: "3px solid #19734a", borderRadius: 14, padding: "16px 18px", background: "#19734a0d" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: "1.4px", textTransform: "uppercase", color: "#19734a", marginBottom: 8 }}>Members&apos; edition</div>
            <strong style={{ display: "block", fontFamily: "'Spectral',serif", fontSize: 18, marginBottom: 4 }}>The full briefing</strong>
            <span style={{ fontSize: 13.5, color: "#3a362e", lineHeight: 1.45 }}>Every story written out in full, no paywall, in your inbox Saturday morning. Included with membership.</span>
          </div>
        </div>

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
          <button onClick={subscribe} disabled={busy} style={{ border: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : subscribed ? "Update subscription" : "Subscribe"}</button>
        </div>
        <p style={{ fontSize: 13, color: "#6b675e", lineHeight: 1.5, margin: "12px 2px 0" }}>
          {isMember ? (
            <>You&apos;re a member, so you&apos;ll receive the <strong style={{ color: "#19734a" }}>full Saturday edition</strong>. Confirm your email above to start.</>
          ) : (
            <>Subscribing gets you the free teaser edition. Want every story in full? <Link href="/pricing" style={{ color: "#19734a", fontWeight: 700 }}>Become a member for the full briefing</Link>.</>
          )}
        </p>
        {error && (
          <div style={{ marginTop: 14, background: "#a3342914", border: "1px solid #a3342959", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#a33429" }}>{error}</div>
        )}
        {subscribed && (
          <div style={{ marginTop: 14, background: "#19734a14", border: "1px solid #19734a59", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#19734a" }}>You&apos;re subscribed to: <strong>{digestPref}</strong>. Look for the first Saturday briefing in your inbox.</div>
        )}

        <div style={{ background: "#161616", color: "#fff", borderRadius: 18, padding: 26, marginTop: 30 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 14 }}>Issue 01 {isMember ? "" : "teaser "}preview - &quot;The Good, the Bad, and the Real {cfg.name}: Week One&quot;</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14.5, lineHeight: 1.5, color: "#e7e1d4" }}>
            <div><strong style={{ color: "#7fcfa5" }}>3 wins</strong><br />Breakfast club, Sunday open gym, robotics mentors.</div>
            <div><strong style={{ color: "#e89a8f" }}>3 concerns</strong><br />Streetlights near Monroe, downtown theft pattern, bus-stop safety.</div>
            <div><strong style={{ color: "#e8c46f" }}>1 complicated story</strong><br />New shelter opened - more beds, poor neighbor communication.</div>
            <div><strong style={{ color: "#9fb8d6" }}>1 question</strong><br />Where should Spokane add its next safe place for kids after school?</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)", marginTop: 18, paddingTop: 16, fontSize: 13.5, lineHeight: 1.55, color: "#b3a892" }}>
            {isMember ? (
              <>As a member you get all of this <strong style={{ color: "#7fcfa5" }}>written out in full</strong> every Saturday, no paywall.</>
            ) : (
              <>Free subscribers get these headlines. Members get every story <strong style={{ color: "#fff" }}>written out in full</strong>, no paywall. <Link href="/pricing" style={{ color: "#e8c46f", fontWeight: 700, textDecoration: "underline" }}>Get the full edition &rarr;</Link></>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
