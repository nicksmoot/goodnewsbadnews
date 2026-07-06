"use client";

import { useState } from "react";

const btn: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.4px",
  border: "1px solid #d8cab2", background: "#fffdf8", color: "#3a362e", borderRadius: 999,
  padding: "8px 13px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
};

export default function ShareRow({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => (typeof window !== "undefined" ? window.location.origin + path : path);

  const native = async () => {
    const link = url();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    if (nav.share) {
      try { await nav.share({ title, url: link }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const enc = (s: string) => encodeURIComponent(s);
  const x = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url())}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`;
  const email = `mailto:?subject=${enc(title)}&body=${enc(url())}`;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8a857a", marginRight: 2 }}>Share</span>
      <button onClick={native} style={btn} aria-label="Share or copy link">{copied ? "✓ Link copied" : "Copy link"}</button>
      <a href={x} target="_blank" rel="noopener noreferrer" style={btn} aria-label="Share on X">X</a>
      <a href={fb} target="_blank" rel="noopener noreferrer" style={btn} aria-label="Share on Facebook">Facebook</a>
      <a href={email} style={btn} aria-label="Share by email">Email</a>
    </div>
  );
}
