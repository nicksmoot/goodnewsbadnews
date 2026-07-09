"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { CAT, CatKey, cityCfg } from "@/lib/data";

// Client-side search over the loaded feed (seed stories + published resident
// submissions), scoped to the active city. Instant, no round-trip. Matches
// across title, summary, body, topics, and neighborhood, and ranks title hits
// first.
export default function SearchPage() {
  const { posts, city, ready } = useStore();
  const [q, setQ] = useState("");
  const cfg = cityCfg(city);

  // Seed the box from ?q= on first load (client-only; avoids Suspense).
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("q");
      if (p) setQ(p);
    } catch {}
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const inCity = posts.filter((p) => p.city === city);
    if (!term) return [];
    const scored = inCity
      .map((p) => {
        const hay = [p.title, p.summary, p.hood, ...(p.topics || []), (p.body || []).join(" ")]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(term)) return null;
        // Title hits rank first, then neighborhood/topic, then body.
        const score = p.title.toLowerCase().includes(term) ? 0 : hay.indexOf(term);
        return { p, score };
      })
      .filter(Boolean) as { p: (typeof inCity)[number]; score: number }[];
    return scored.sort((a, b) => a.score - b.score).map((s) => s.p);
  }, [q, posts, city]);

  const term = q.trim();

  return (
    <section style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Search · {cfg.name}</div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,4.4vw,48px)", lineHeight: 1.02, letterSpacing: "-1.4px", margin: "0 0 20px" }}>Search the {cfg.name} feed</h1>

      <div style={{ position: "relative", marginBottom: 10 }}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search stories, neighborhoods, topics in ${cfg.name}…`}
          aria-label="Search stories"
          style={{ width: "100%", border: "1px solid #d8cab2", background: "#fffdf8", padding: "15px 44px 15px 16px", borderRadius: 12, fontSize: 16 }}
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Clear search" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#8a857a", lineHeight: 1 }}>×</button>
        )}
      </div>

      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#8a857a", marginBottom: 22 }}>
        {!term ? "Type to search the city's stories." : `${results.length} ${results.length === 1 ? "result" : "results"} for “${term}”`}
      </div>

      {!ready && !posts.length && (
        <p style={{ color: "#8a857a", fontSize: 15 }}>Loading the feed…</p>
      )}

      {term && results.length === 0 && ready && (
        <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: 26, color: "#6b675e", fontSize: 15 }}>
          No stories match “{term}” in {cfg.name} yet. Try a neighborhood, a topic, or a broader word — or <Link href="/submit" style={{ color: "#19734a", fontWeight: 700 }}>file the first one</Link>.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {results.map((p) => {
          const c = CAT[p.cat as CatKey] || CAT.signal;
          return (
            <Link key={p.id} href={`/post/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <article style={{ background: "#fffdf8", border: "1px solid #e0d4be", borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 9 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "0.8px", fontSize: 10, textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>{c.label}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a" }}>{p.hood} · {p.by}</span>
                </div>
                <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, margin: "0 0 6px" }}>{p.title}</h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>{p.summary}</p>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
