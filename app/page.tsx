"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { cityCfg, CITIES } from "@/lib/data";
import { cityPosts, decorateList } from "@/lib/selectors";
import { HomeCard, SkeletonCards } from "@/components/cards";
import Pricing from "@/components/Pricing";

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
  const { posts, city, stats, seenLocal, setCity, ready } = useStore();
  const router = useRouter();
  const cfg = cityCfg(city);

  const cp = cityPosts(posts, city);
  const homePosts = decorateList([...cp].sort((a, b) => a.age - b.age).slice(0, 6), seenLocal);
  const trending = decorateList([...cp].sort((a, b) => b.helpful - a.helpful).slice(0, 5), seenLocal);
  const statPublished = cp.length;
  const statQueue = stats[city]?.queue ?? 0;

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
            Local newsrooms are vanishing, and the stories didn&apos;t stop happening. They just stopped being told. Good News Bad News is where residents put their city back on the record: the wins, the warnings, the patterns, and the opportunities, reviewed and organized so the community can act. Now live in <strong>Spokane</strong> and <strong>Honolulu</strong>.
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

      {/* The unreported city (why this exists) */}
      <section style={{ background: "#161616", color: "#fff" }}>
        <div className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "58px 24px 54px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "2.2px", textTransform: "uppercase", color: "#e89a8f", marginBottom: 18 }}>The unreported city</div>
          <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,4.6vw,54px)", lineHeight: 1.04, letterSpacing: "-1.6px", margin: "0 0 18px", maxWidth: 940 }}>
            In your city, a bank robbery can go unreported.<br />
            <span style={{ color: "#7fcfa5" }}>So can a Little League grand slam.</span>
          </h2>
          <p style={{ fontFamily: "'Spectral',serif", fontSize: 19, lineHeight: 1.55, color: "#cfc8b9", maxWidth: 720, margin: "0 0 34px" }}>
            When a city loses its newsroom, the news keeps happening; it just stops being written down. The break-in and the breakthrough get the same coverage: none. Rumor fills the vacuum, trust goes with it, and the people doing the quiet good work never get their name in the paper. We&apos;re changing that.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 22px", margin: "0 0 34px" }}>
            <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.8px" }}>19,500 U.S. cities.</span>
            <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.8px", color: "#e89a8f" }}>76 independent daily papers left.</span>
            <Link href="/about" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: "#7fcfa5", fontWeight: 700, textDecoration: "none", letterSpacing: "0.4px" }}>See what&apos;s at stake &rarr;</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.13)", borderTop: "3px solid #a33429", borderRadius: 14, padding: 22 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#e89a8f", marginBottom: 10 }}>What goes unreported</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#e7e1d4", margin: 0 }}>The dark blocks, the repeat break-ins, the failing systems. The warnings neighbors whisper to each other but never get to file anywhere.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.13)", borderTop: "3px solid #19734a", borderRadius: 14, padding: 22 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#7fcfa5", marginBottom: 10 }}>What goes uncelebrated</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#e7e1d4", margin: 0 }}>First jobs, warming centers, the coach who opens the gym every Sunday, the grand slam nobody outside the bleachers heard about.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.13)", borderTop: "3px solid #c99a2e", borderRadius: 14, padding: 22 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#e8c46f", marginBottom: 10 }}>What it costs</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#e7e1d4", margin: 0 }}>A city that can&apos;t see itself runs on rumor. Problems fester in the dark, good work goes unfunded, and trust quietly leaves town.</p>
            </div>
          </div>
          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/submit" style={{ textDecoration: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Put it on the record</Link>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#8a857a", letterSpacing: "0.4px" }}>Every signal reviewed. Patterns, not rumors.</span>
          </div>
        </div>
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

      {/* Trending this week */}
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 24px 10px" }}>
        <div style={{ ...kicker(""), borderBottom: "1px solid #d8cab2", paddingBottom: 12, marginBottom: 22 }}>Trending this week in {cfg.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
          {(ready ? trending : []).map((p, i) => (
            <Link key={p.id} href={`/post/${p.id}`} style={{ textDecoration: "none", color: "inherit", background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, minHeight: 150 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 22, color: p.catColor, lineHeight: 1 }}>{i + 1}</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#19734a", fontWeight: 600 }}>{p.helpfulLine}</span>
              </div>
              <span style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{p.title}</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#8a857a", marginTop: "auto" }}>{p.catLabel} · {p.hood}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ledger band */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 24px 0" }}>
        <Link href="/leaderboard" style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", background: "#fff8eb", border: "1px solid #c99a2e80", borderLeft: "5px solid #c99a2e", borderRadius: 14, padding: "16px 20px" }}>
          <span style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 17, color: "#161616" }}>
            The Contributors&apos; Ledger: who&apos;s putting {cfg.name} on the record
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 700, color: "#19734a", whiteSpace: "nowrap" }}>See the board &rarr;</span>
        </Link>
      </section>

      {/* Latest signals */}
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 24px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #d8cab2", paddingBottom: 12, marginBottom: 26, gap: 16, flexWrap: "wrap" }}>
          <div style={kicker("")}>Latest signals</div>
          <Link href="/latest" style={{ textDecoration: "none", fontSize: 13.5, fontWeight: 700, color: "#19734a" }}>See the full feed &rarr;</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {ready ? homePosts.map((p) => <HomeCard key={p.id} post={p} />) : <SkeletonCards count={6} minHeight={210} />}
        </div>
      </section>

      {/* Pricing */}
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 6px" }}>
        <Pricing />
      </section>

      {/* Submit CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "52px 24px" }}>
        <div className="gnbn-dark-panel" style={{ background: "#161616", color: "#fff", borderRadius: 24, padding: 46, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 38, lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 14px" }}>Seen something {cfg.name} should know?</h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "#cfc8b9", margin: "0 0 14px", maxWidth: 520 }}>Submit a signal. It can be a good story, a concern, a trend, a resource, or something you think people are missing.</p>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#e8c46f", margin: "0 0 22px", maxWidth: 520 }}><strong>And it can pay you:</strong> when a partner newsroom licenses your story, you get paid, with your byline on it.</p>
            <div className="gnbn-cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/submit" style={{ textDecoration: "none", display: "inline-block", background: "#19734a", color: "#fff", borderRadius: 999, padding: "14px 26px", fontWeight: 700, fontSize: 16 }}>Submit a Signal</Link>
              <Link href="/signin?join=1" style={{ textDecoration: "none", display: "inline-block", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: 999, padding: "14px 26px", fontWeight: 700, fontSize: 16 }}>Join &amp; get paid</Link>
            </div>
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
