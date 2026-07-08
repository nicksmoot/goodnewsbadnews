"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckoutButton } from "@/components/MemberCTA";

// The three ways to pay, shown side by side so the pay-as-you-go micro-payments
// are a first-class choice next to the membership, not a hidden fallback.
//  - Read one story ....... $0.50 (micro-payment to read past the paywall)
//  - Post one signal ...... $0.50 (micro-payment to publish without a plan)
//  - Membership ........... $5/month (read everything + 15 posts included)

const GREEN = "#19734a";
const GOLD = "#9a6a12";
const BLUE = "#285d83";

const cardBase: React.CSSProperties = {
  background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18,
  padding: 26, display: "flex", flexDirection: "column",
};
const priceStyle: React.CSSProperties = {
  fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 38, letterSpacing: "-1px", lineHeight: 1, margin: "2px 0 2px",
};
const unit: React.CSSProperties = { fontSize: 17, fontWeight: 700, color: "#8a857a" };
const kicker = (color: string): React.CSSProperties => ({
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px",
  textTransform: "uppercase", color, marginBottom: 12,
});
const ctaGhost = (color: string): React.CSSProperties => ({
  textDecoration: "none", textAlign: "center", border: `1px solid ${color}`, color,
  borderRadius: 999, padding: "12px 20px", fontWeight: 700, fontSize: 14.5, marginTop: "auto",
});

export default function Pricing({ heading = true }: { heading?: boolean }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  return (
    <div>
      {heading && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#6b675e", marginBottom: 10 }}>Simple pricing</div>
          <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(28px,3.6vw,42px)", letterSpacing: "-1px", lineHeight: 1.05, margin: 0 }}>Pay by the story, or read it all.</h2>
          <p style={{ fontSize: 16, color: "#5a564d", lineHeight: 1.55, maxWidth: 620, margin: "12px auto 0" }}>
            No subscription required. Unlock a single story or post a single signal for 50 cents, or become a member for everything.
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, alignItems: "stretch" }}>
        {/* Read one story */}
        <div style={cardBase}>
          <div style={kicker(BLUE)}>Pay per read</div>
          <div style={priceStyle}>$0.50 <span style={unit}>/ story</span></div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#3a362e", margin: "10px 0 18px" }}>
            Unlock any single story past the paywall, no membership needed. Open a locked story and tap <strong>Unlock this story</strong>. It stays unlocked on your account.
          </p>
          <Link href="/latest" style={ctaGhost(BLUE)}>Browse the feed</Link>
        </div>

        {/* Post one signal */}
        <div style={cardBase}>
          <div style={kicker(GOLD)}>Pay per post</div>
          <div style={priceStyle}>$0.50 <span style={unit}>/ signal</span></div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#3a362e", margin: "10px 0 18px" }}>
            Publish a single signal without a plan. Every post carries your byline, and when a newsroom licenses your story, <strong>you get paid</strong>.
          </p>
          <Link href="/submit" style={ctaGhost(GOLD)}>Submit a signal</Link>
        </div>

        {/* Membership */}
        <div style={{ ...cardBase, background: "#161616", border: "2px solid #19734a", color: "#fff", position: "relative" }}>
          <span style={{ position: "absolute", top: -11, right: 18, background: "#19734a", color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999 }}>Best value</span>
          <div style={kicker("#c99a2e")}>Membership</div>
          <div style={priceStyle}>$5 <span style={{ ...unit, color: "#9a958a" }}>/ month</span></div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#cfc8b9", margin: "10px 0 16px" }}>
            Read <strong style={{ color: "#fff" }}>every</strong> full story and pattern report, and post up to <strong style={{ color: "#fff" }}>15 signals a month</strong> included (then $0.50 each).
          </p>
          <div style={{ marginTop: "auto" }}>
            {signedIn ? (
              <CheckoutButton variant="dark" label="Become a member - $5/month" />
            ) : (
              <Link href="/signin?join=1&callbackUrl=/account" style={{ textDecoration: "none", display: "inline-block", textAlign: "center", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 22px", fontWeight: 700, fontSize: 14.5, width: "100%" }}>
                Join &amp; get full access
              </Link>
            )}
          </div>
        </div>
      </div>

      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#8a857a", letterSpacing: "0.3px", textAlign: "center", margin: "18px 0 0" }}>
        Apple Pay and all major cards · Cancel anytime · Writers are paid when their stories are licensed
      </p>
    </div>
  );
}
