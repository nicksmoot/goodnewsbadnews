"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, useCityEffect } from "@/lib/store";
import { CatKey, CAT, TOPICS, HOODS, cityCfg } from "@/lib/data";
import { filterPosts, decorateList, FeedFilters } from "@/lib/selectors";
import { FeedCard, SkeletonCards } from "@/components/cards";

const PAGE_SIZE = 12;

const CHIP_DEFS: [string, string][] = [
  ["all", "All"], ["good", "Good"], ["bad", "Bad"], ["both", "Both"],
  ["opportunity", "Opportunity"], ["signal", "Signal"], ["pattern", "Pattern"],
];

const FEED_META: Record<string, { kicker: string; title: string; desc: string }> = {
  good: { kicker: "Good News", title: "The wins worth celebrating.", desc: "Improvements, inspiring people, promising programs, and the local momentum that usually goes unseen." },
  bad: { kicker: "Bad News", title: "The problems that need attention.", desc: "Risks, gaps, failures, and early warning signs - surfaced constructively, reported as patterns rather than rumors." },
  both: { kicker: "Both", title: "Where progress and problems coexist.", desc: "The complicated stories that don't fit a single label. Most real civic stories live here." },
};

const selectStyle: React.CSSProperties = {
  border: "1px solid #d8cab2", background: "#fffdf8", padding: "11px 13px",
  borderRadius: 10, fontSize: 14, color: "#161616",
};

const BLANK: FeedFilters = { fCat: "all", fTopic: "All topics", fHood: "All neighborhoods", fSearch: "", fSort: "latest" };

interface FeedProps {
  routeCat: CatKey | null;
  fixedTopic?: string;
  fixedHood?: string;
  heading?: { kicker: string; title: string; desc: string };
}

export default function Feed({ routeCat, fixedTopic, fixedHood, heading }: FeedProps) {
  const { posts, city, seenLocal, ready } = useStore();
  const initial: FeedFilters = {
    ...BLANK,
    fTopic: fixedTopic || BLANK.fTopic,
    fHood: fixedHood || BLANK.fHood,
  };
  const [f, setF] = useState<FeedFilters>(initial);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Reset filters / pagination when the active city changes.
  useCityEffect(city, () => { setF(initial); setVisible(PAGE_SIZE); });
  // Reset pagination whenever the filters change.
  const filterKey = `${routeCat}|${f.fCat}|${f.fTopic}|${f.fHood}|${f.fSearch}|${f.fSort}`;
  useEffect(() => { setVisible(PAGE_SIZE); }, [filterKey]);

  const cfg = cityCfg(city);
  const meta = heading
    ? heading
    : routeCat
    ? FEED_META[routeCat]
    : { kicker: "The " + cfg.name + " Feed", title: "What residents are seeing.", desc: "Every signal reviewed before publication and labeled with its verification status. A submitted signal is not a verified fact." };

  const allPosts = decorateList(filterPosts(posts, city, routeCat, f), seenLocal);
  const feedPosts = allPosts.slice(0, visible);
  const showChips = !routeCat;

  return (
    <div>
      <section className="gnbn-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>{meta.kicker}</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(38px,5vw,60px)", lineHeight: 1, letterSpacing: "-1.8px", margin: "0 0 14px" }}>{meta.title}</h1>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: "#5a564d", maxWidth: 720, margin: "0 0 28px" }}>{meta.desc}</p>
      </section>

      {/* Filter bar */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 12px" }}>
        <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 18, padding: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <input value={f.fSearch} onChange={(e) => setF({ ...f, fSearch: e.target.value })} placeholder="Search signals…" style={{ flex: 1, minWidth: 200, border: "1px solid #d8cab2", background: "#fffdf8", padding: "11px 13px", borderRadius: 10, fontSize: 14.5, color: "#161616" }} />
          <select value={f.fTopic} onChange={(e) => setF({ ...f, fTopic: e.target.value })} style={selectStyle}>
            {["All topics", ...TOPICS].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={f.fHood} onChange={(e) => setF({ ...f, fHood: e.target.value })} style={selectStyle}>
            {["All neighborhoods", ...HOODS].map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          <select value={f.fSort} onChange={(e) => setF({ ...f, fSort: e.target.value })} style={selectStyle}>
            <option value="latest">Newest first</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>
      </section>

      {/* Category chips (latest only) */}
      {showChips && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 24px 0" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CHIP_DEFS.map(([key, label]) => {
              const active = f.fCat === key;
              const c = key === "all" ? { color: "#161616" } : (CAT[key as CatKey] || CAT.signal);
              return (
                <button
                  key={key}
                  onClick={() => setF({ ...f, fCat: key })}
                  style={{
                    border: `1px solid ${active ? c.color : "#d8cab2"}`,
                    background: active ? c.color : "#fffdf8",
                    color: active ? "#fff" : c.color,
                    borderRadius: 999, padding: "9px 14px", fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", cursor: "pointer", textTransform: "uppercase",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Grid */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 24px 64px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#8a857a", letterSpacing: "0.4px", marginBottom: 18 }}>
          {ready ? `${allPosts.length} ${allPosts.length === 1 ? "signal" : "signals"}` : "Loading signals…"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {ready ? feedPosts.map((p) => <FeedCard key={p.id} post={p} />) : <SkeletonCards count={6} />}
        </div>
        {ready && allPosts.length > visible && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ border: "1px solid #161616", background: "transparent", color: "#161616", borderRadius: 999, padding: "12px 26px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Load more signals ({allPosts.length - visible} more)
            </button>
          </div>
        )}
        {ready && allPosts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#8a857a", fontSize: 16 }}>
            No signals match these filters yet. <Link href="/submit" style={{ color: "#19734a", fontWeight: 700 }}>Submit one &rarr;</Link>
          </div>
        )}
      </section>
    </div>
  );
}
