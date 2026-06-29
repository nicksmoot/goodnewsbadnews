"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { cityCfg, CITIES } from "@/lib/data";
import { cityPosts, cityQueue, decorateList } from "@/lib/selectors";
import { HomeCard } from "@/components/cards";

const TICKERS: Record<string, string[]> = {
  spokane: [
    "GOOD: free Sunday gym opens for North Spokane youth",
    "WARNING: downtown businesses report repeat theft",
    "OPPORTUNITY: mentors needed for after-school robotics",
    "GOOD: a teacher starts a quiet breakfast club",
    "WARNING: responders seeing repeat calls near one corridor",
    "BOTH: new shelter adds beds, neighbors want better communication",
  ],
  honolulu: [
    "GOOD: volunteers clear two tons of debris off Waikīkī",
    "WARNING: repeat flooding hits the same Kalihi streets",
    "OPPORTUNITY: a food-rescue hub needs island-wide drivers",
    "GOOD: a free keiki surf program opens in Hawaiʻi Kai",
    "WARNING: pedestrian near-misses cluster at Ala Moana crosswalks",
    "BOTH: rail extension opens - more access, but fare confusion",
  ],
};

const kicker = (text: string): React.CSSProperties => ({
  fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px",
  fontSize: 12, color: "#6b675e",
});

const howCard = (n: string, title: string, body: string) => (
  <div key={n} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 22 }}>
    <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, color: "#9a6a12", lineHeight: 1, marginBottom: 12 }}>{n}</div>
    <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 21, margin: "0 0 8px" }}>{title}</h3>
    <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>{body}</p>
  </div>
);

export default function HomePage() {
  const { posts, queue, city, seenLocal, setCity } = useStore();
  const router = useRouter();
  const cfg = cityCfg(city);

  const cp = cityPosts(posts, city);
  const homePosts = decorateList([...cp].sort((a, b) => a.age - b.age).slice(0, 6), seenLocal);
  const statPublished = cp.length;
  const statQueue = cityQueue(queue, city).filter((q) => q.wf !== "Published").length;

  const tk = TICKERS[city] || TICKERS.spokane;
  const tickerText = "  ·  " + tk.join("  ·  ") + "  ·  ";

  const goCity = (c: "spokane" | "honolulu") => {
    setCity(c);
    router.push("/map");
  };

  return (
    <div>
      {/* Hero */}
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px 30px", display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 44, alignItems: "end" }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "2px", color: "#9a6a12", textTransform: "uppercase", marginBottom: 18 }}>A civic signal platform · Now live in two cities</div>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(46px,7vw,88px)", lineHeight: 0.93, letterSpacing: "-2.5px", margin: "0 0 22px" }}>Every city has two stories. Both matter.</h1>
          <p style={{ fontSize: 20, lineHeight: 1.5, color: "#3a362e", maxWidth: 660, margin: "0 0 28px" }}>
            Good News Bad News is a civic signal platform where residents submit the wins, concerns, patterns, and opportunities they&apos;re seeing around them. We review and organize those signals so a community can see what&apos;s working, what needs attention, and where to act next. Now launching in <strong>Spokane</strong> and <strong>Honolulu</strong>.
          </p>
          <div className="gnbn-cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
            <Link href="/submit" style={{ textDecoration: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }}>Submit a Signal</Link>
            <Link href="/latest" style={{ textDecoration: "none", background: "transparent", color: "#161616", border: "1px solid #161616", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }}>Read the Latest</Link>
            <Link href="/digest" style={{ textDecoration: "none", background: "transparent", color: "#161616", border: "1px solid #d8cab2", borderRadius: 999, padding: "14px 24px", fontWeight: 700, fontSize: 16 }}>Get the Weekly Digest</Link>
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, color: "#6b675e", lineHeight: 1.5, letterSpacing: "0.2px", maxWidth: 560 }}>No gossip. No doxxing. No unsupported accusations. Just local signal, reviewed and organized.</p>
        </div>
        <aside style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 20, padding: 26, boxShadow: "0 10px 34px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 26, margin: "0 0 6px" }}>This week in {cfg.name}</h3>
          <p style={{ fontSize: 14, color: "#5a564d", lineHeight: 1.5, margin: "0 0 14px" }}>The good, the bad, and the complicated - filtered through verified resident signals and human review.</p>
          {[
            ["Published signals", String(statPublished)],
            ["In moderation queue", String(statQueue)],
            ["Most active area", cfg.activeArea],
            ["Saturday digest", "Good / Bad / Both"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e4d8c2", padding: "12px 0", fontSize: 14 }}>
              <span style={{ color: "#5a564d" }}>{label}</span>
              <strong style={{ fontFamily: "'Spectral',serif", fontSize: 18 }}>{val}</strong>
            </div>
          ))}
        </aside>
      </section>

      {/* Two-city launch cards */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "8px 24px 30px" }}>
        <div style={{ ...kicker(""), borderBottom: "1px solid #d8cab2", paddingBottom: 12, marginBottom: 22 }}>Now launching in two cities</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <button onClick={() => goCity("spokane")} style={{ textAlign: "left", cursor: "pointer", background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 26, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12" }}>Washington</div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 32, margin: 0, letterSpacing: "-0.8px" }}>Spokane</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>Live across {CITIES.spokane.hoods.length} neighborhoods. Explore the signal map, read the latest feed, and submit what you&apos;re seeing.</p>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, color: "#19734a", marginTop: 4 }}>Open the Spokane map &rarr;</span>
          </button>
          <button onClick={() => goCity("honolulu")} style={{ textAlign: "left", cursor: "pointer", background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 26, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12" }}>Hawaiʻi</div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 32, margin: 0, letterSpacing: "-0.8px" }}>Honolulu</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>Live across {CITIES.honolulu.hoods.length} neighborhoods, from Waikīkī to Kalihi. See where the island&apos;s wins and concerns are clustering.</p>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, color: "#19734a", marginTop: 4 }}>Open the Honolulu map &rarr;</span>
          </button>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background: "#161616", color: "#fff", overflow: "hidden", whiteSpace: "nowrap", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, letterSpacing: "0.4px" }}>
        <div style={{ display: "inline-block", padding: "11px 0", animation: "gnbn-ticker 46s linear infinite" }}>{tickerText}{tickerText}</div>
      </div>

      {/* How it works */}
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 10px" }}>
        <div style={{ ...kicker(""), borderBottom: "1px solid #d8cab2", paddingBottom: 12, marginBottom: 26 }}>How it works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {howCard("1", "Residents submit signals", "Share a win, concern, pattern, opportunity, or question from your neighborhood.")}
          {howCard("2", "We review and organize", "Submissions are checked for clarity, safety, location, topic, and possible verification.")}
          {howCard("3", "The community sees the pattern", "Some become public posts, some become stories, some are combined into pattern reports.")}
          {howCard("4", "People respond", "Residents, nonprofits, businesses, churches, and civic leaders see where help is needed.")}
        </div>
      </section>

      {/* Good / Bad / Both */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "46px 24px 10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          <Link href="/good" style={{ textDecoration: "none", display: "block", background: "#fffaf1", border: "1px solid #19734a59", borderLeft: "5px solid #19734a", borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "1.4px", fontSize: 12, color: "#19734a", textTransform: "uppercase", marginBottom: 10 }}>Good News</div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 24, margin: "0 0 8px", color: "#161616" }}>The wins worth celebrating.</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>Improvements, inspiring people, promising programs, and local momentum.</p>
          </Link>
          <Link href="/bad" style={{ textDecoration: "none", display: "block", background: "#fffaf1", border: "1px solid #a3342959", borderLeft: "5px solid #a33429", borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "1.4px", fontSize: 12, color: "#a33429", textTransform: "uppercase", marginBottom: 10 }}>Bad News</div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 24, margin: "0 0 8px", color: "#161616" }}>The problems that need attention.</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>Risks, gaps, failures, and early warnings - surfaced constructively.</p>
          </Link>
          <Link href="/both" style={{ textDecoration: "none", display: "block", background: "#fffaf1", border: "1px solid #c99a2e80", borderLeft: "5px solid #c99a2e", borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "1.4px", fontSize: 12, color: "#9a6a12", textTransform: "uppercase", marginBottom: 10 }}>Both</div>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 24, margin: "0 0 8px", color: "#161616" }}>Where progress and problems coexist.</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>The complicated stories that don&apos;t fit a single label.</p>
          </Link>
        </div>
      </section>

      {/* Latest signals */}
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 24px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #d8cab2", paddingBottom: 12, marginBottom: 26, gap: 16, flexWrap: "wrap" }}>
          <div style={kicker("")}>Latest signals</div>
          <Link href="/latest" style={{ textDecoration: "none", fontSize: 13.5, fontWeight: 700, color: "#19734a" }}>See the full feed &rarr;</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {homePosts.map((p) => <HomeCard key={p.id} post={p} />)}
        </div>
      </section>

      {/* Submit CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "52px 24px" }}>
        <div className="gnbn-dark-panel" style={{ background: "#161616", color: "#fff", borderRadius: 24, padding: 46, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 38, lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 14px" }}>Seen something {cfg.name} should know?</h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "#cfc8b9", margin: "0 0 22px", maxWidth: 520 }}>Submit a signal. It can be a good story, a concern, a trend, a resource, or something you think people are missing.</p>
            <Link href="/submit" style={{ textDecoration: "none", display: "inline-block", background: "#19734a", color: "#fff", borderRadius: 999, padding: "14px 26px", fontWeight: 700, fontSize: 16 }}>Submit a Signal</Link>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 14 }}>We review submissions before publication</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.9, color: "#e7e1d4" }}>
              <li>We report patterns, not rumors.</li>
              <li>We don&apos;t publish private personal information.</li>
              <li>A submitted signal is not a verified fact.</li>
              <li>Some submissions are used only as background intelligence.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
