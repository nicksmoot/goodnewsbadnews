"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { CAT } from "@/lib/data";

// Client-side activity (follows + confirmations live in the browser today;
// they move to the database with submissions in the posting stage).
export default function ActivityPanel() {
  const { posts, followed, seenLocal, ready } = useStore();
  if (!ready) return null;

  const followedPosts = posts.filter((p) => followed[p.id]);
  const confirmedPosts = posts.filter((p) => seenLocal[p.id]);

  const list = (items: typeof posts) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((p) => {
        const c = CAT[p.cat] || CAT.signal;
        return (
          <Link key={p.id} href={`/post/${p.id}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", textDecoration: "none", background: "#fffdf8", border: "1px solid #e4d8c2", borderRadius: 12, padding: "10px 12px" }}>
            <span style={{ flexShrink: 0, width: 10, height: 10, borderRadius: 999, background: c.color, marginTop: 5 }} />
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 14.5, lineHeight: 1.2, color: "#161616" }}>{p.title}</span>
              <span style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: "#8a857a", marginTop: 2 }}>{p.hood} · {c.label}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 24, marginTop: 22 }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 14 }}>Your activity</div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
        <div><strong style={{ fontFamily: "'Spectral',serif", fontSize: 22 }}>{followedPosts.length}</strong> <span style={{ fontSize: 13.5, color: "#5a564d" }}>signals followed</span></div>
        <div><strong style={{ fontFamily: "'Spectral',serif", fontSize: 22 }}>{confirmedPosts.length}</strong> <span style={{ fontSize: 13.5, color: "#5a564d" }}>confirmed &quot;seen this too&quot;</span></div>
      </div>

      {followedPosts.length > 0 && (
        <>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: "1px", textTransform: "uppercase", color: "#8a857a", margin: "14px 0 8px" }}>Following</div>
          {list(followedPosts)}
        </>
      )}
      {confirmedPosts.length > 0 && (
        <>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: "1px", textTransform: "uppercase", color: "#8a857a", margin: "14px 0 8px" }}>Confirmed</div>
          {list(confirmedPosts)}
        </>
      )}
      {followedPosts.length === 0 && confirmedPosts.length === 0 && (
        <p style={{ fontSize: 14, color: "#8a857a", margin: 0 }}>
          Nothing yet. Follow a signal or confirm one you&apos;ve seen from any story page, and it will show up here. Your published stories will appear here once posting moves to member accounts.
        </p>
      )}
    </div>
  );
}
