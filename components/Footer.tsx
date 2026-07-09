import Link from "next/link";
import { slugify } from "@/lib/slug";
import Wordmark from "@/components/Wordmark";

const linkStyle = { textDecoration: "none", color: "#3a362e" } as const;

const FOOTER_TOPICS = ["Public safety", "Housing", "Schools", "Homelessness", "Business"];
const FOOTER_HOODS = ["Downtown", "Chinatown"];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #d8cab2", marginTop: "auto" }}>
      <div
        style={{
          maxWidth: 1240, margin: "0 auto", padding: "34px 24px",
          display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 340 }}>
          <div style={{ marginBottom: 8 }}>
            <Wordmark size={20} style={{ letterSpacing: "-0.4px" }} />
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: "#6b675e", margin: 0 }}>
            A civic signal platform helping cities see themselves clearly. Now live in Spokane and Honolulu. We review submissions before publication and report patterns, not rumors.
          </p>
        </div>
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap", fontSize: 13.5 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#9a857a", marginBottom: 2 }}>Read</span>
            <Link href="/latest" style={linkStyle}>Latest</Link>
            <Link href="/good" style={linkStyle}>Good News</Link>
            <Link href="/bad" style={linkStyle}>Bad News</Link>
            <Link href="/both" style={linkStyle}>Both</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#9a857a", marginBottom: 2 }}>Participate</span>
            <Link href="/submit" style={linkStyle}>Submit a Signal</Link>
            <Link href="/pricing" style={linkStyle}>Pricing</Link>
            <Link href="/academy" style={linkStyle}>Journalism Training</Link>
            <Link href="/digest" style={linkStyle}>Weekly Digest</Link>
            <Link href="/about" style={linkStyle}>About</Link>
            <Link href="/standards" style={linkStyle}>Community Standards</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#9a857a", marginBottom: 2 }}>Explore</span>
            <Link href="/map" style={linkStyle}>Signal Map</Link>
            <Link href="/partners" style={linkStyle}>For Newsrooms</Link>
            {FOOTER_TOPICS.map((t) => (
              <Link key={t} href={`/topic/${slugify(t)}`} style={linkStyle}>{t}</Link>
            ))}
            {FOOTER_HOODS.map((h) => (
              <Link key={h} href={`/neighborhood/${slugify(h)}`} style={linkStyle}>{h}</Link>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #e4d8c2" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#9a857a", letterSpacing: "0.3px" }}>
          <span>Good News Bad News · A civic signal platform · Now live in Spokane &amp; Honolulu · We review submissions before publication. A submitted signal is not a verified fact.</span>
          <span style={{ display: "flex", gap: 14, flexShrink: 0 }}>
            <Link href="/privacy" style={linkStyle}>Privacy</Link>
            <Link href="/terms" style={linkStyle}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
