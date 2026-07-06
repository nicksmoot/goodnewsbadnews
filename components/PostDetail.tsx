"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { decorate } from "@/lib/data";
import { slugify } from "@/lib/slug";
import ShareRow from "@/components/ShareRow";

const chipLink: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#3a362e", textDecoration: "none",
  border: "1px solid #e0d4be", borderRadius: 999, padding: "5px 11px", background: "#fffdf8",
};

export default function PostDetail({ id }: { id: string }) {
  const { posts, seenLocal, followed, markSeen, toggleFollow, ready } = useStore();
  const [helpOpen, setHelpOpen] = useState(false);

  const raw = posts.find((p) => p.id === id);

  if (!raw) {
    return (
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>
        <Link href="/latest" style={{ textDecoration: "none", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#6b675e", letterSpacing: "0.5px" }}>&larr; Back to feed</Link>
        <p style={{ fontSize: 18, color: "#5a564d", marginTop: 30 }}>
          {ready ? "This signal could not be found. It may have been removed or not yet published." : "Loading signal…"}
        </p>
      </section>
    );
  }

  const detail = decorate(raw, seenLocal);
  const seenCount = seenLocal[id] ? raw.helpful + 1 : raw.helpful;

  return (
    <div>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 70px" }}>
        <Link href="/latest" style={{ textDecoration: "none", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#6b675e", letterSpacing: "0.5px" }}>&larr; Back to feed</Link>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "22px 0 16px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "1px", fontSize: 11, textTransform: "uppercase", padding: "5px 10px", borderRadius: 999, color: detail.catColor, background: detail.catBg, border: `1px solid ${detail.catBorder}` }}>{detail.catLabel}</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "0.6px", fontSize: 11, textTransform: "uppercase", padding: "5px 10px", borderRadius: 999, color: detail.statusColor, border: `1px solid ${detail.statusBorder}` }}>{detail.status}</span>
        </div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,4.4vw,46px)", lineHeight: 1.05, letterSpacing: "-1.4px", margin: "0 0 16px" }}>{detail.title}</h1>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, color: "#8a857a", letterSpacing: "0.3px", borderBottom: "1px solid #d8cab2", paddingBottom: 20, marginBottom: 24 }}>{detail.metaLine}</div>

        {detail.hasPhoto && (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", marginBottom: 26, borderRadius: 14, overflow: "hidden" }}>
            <Image src={detail.photo} alt={detail.title} fill sizes="(max-width: 800px) 100vw, 760px" style={{ objectFit: "cover" }} />
          </div>
        )}

        {detail.body.map((para, i) => (
          <p key={i} style={{ fontFamily: "'Spectral',serif", fontSize: 19, lineHeight: 1.62, color: "#2b2820", margin: "0 0 20px" }}>{para}</p>
        ))}

        <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: 22, margin: "8px 0 24px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 10 }}>What happens next</div>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3a362e", margin: 0 }}>{detail.next}</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 22 }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8a857a", marginRight: 2 }}>Filed under</span>
          <Link href={`/neighborhood/${slugify(detail.hood)}`} style={chipLink}>{detail.hood}</Link>
          {detail.topics.map((t) => (
            <Link key={t} href={`/topic/${slugify(t)}`} style={chipLink}>{t}</Link>
          ))}
        </div>

        <ShareRow title={detail.title} path={`/post/${id}`} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, borderTop: "1px solid #d8cab2", paddingTop: 22, marginTop: 22 }}>
          <button onClick={() => markSeen(id)} aria-pressed={!!seenLocal[id]} style={{ border: "1px solid #19734a", background: "#19734a14", color: "#19734a", borderRadius: 999, padding: "11px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✓ I&apos;ve seen this too · {seenCount}</button>
          <button onClick={() => setHelpOpen((v) => !v)} aria-expanded={helpOpen} style={{ border: "1px solid #285d83", background: "#285d831a", color: "#285d83", borderRadius: 999, padding: "11px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>I can help</button>
          <button onClick={() => toggleFollow(id)} aria-pressed={!!followed[id]} style={{ border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "11px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{followed[id] ? "✓ Following" : "Follow this signal"}</button>
        </div>

        {helpOpen && (
          <div style={{ background: "#fffaf1", border: "1px solid #285d834d", borderRadius: 16, padding: 20, marginTop: 18 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#285d83", marginBottom: 10 }}>Respond to a community need</div>
            <p style={{ fontSize: 14.5, color: "#3a362e", margin: "0 0 12px" }}>Are you part of an organization, business, church, agency, or neighborhood group that can help? Tell us what&apos;s available.</p>
            <label htmlFor="help-kind" className="gnbn-sr-only">How you can help</label>
            <select id="help-kind" style={{ width: "100%", border: "1px solid #d8cab2", background: "#fffdf8", padding: 11, borderRadius: 10, fontSize: 14, marginBottom: 12 }}>
              <option>I can volunteer</option>
              <option>I can mentor</option>
              <option>I can donate supplies</option>
              <option>I know someone who can help</option>
            </select>
            <button onClick={() => setHelpOpen(false)} style={{ border: "none", background: "#285d83", color: "#fff", borderRadius: 999, padding: "11px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Submit response</button>
          </div>
        )}
      </article>
    </div>
  );
}
