"use client";

import Link from "next/link";
import { DecoratedPost } from "@/lib/data";

export function CatBadge({ post, small }: { post: DecoratedPost; small?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: small ? "0.8px" : "1px",
        fontSize: small ? 10 : 10.5, textTransform: "uppercase",
        padding: small ? "3px 7px" : "4px 8px", borderRadius: 999,
        color: post.catColor, background: post.catBg, border: `1px solid ${post.catBorder}`,
      }}
    >
      {post.catLabel}
    </span>
  );
}

export function StatusBadge({ post }: { post: DecoratedPost }) {
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "0.6px",
        fontSize: 10.5, textTransform: "uppercase", padding: "4px 8px", borderRadius: 999,
        color: post.statusColor, border: `1px solid ${post.statusBorder}`,
      }}
    >
      {post.status}
    </span>
  );
}

const cardBase: React.CSSProperties = {
  cursor: "pointer", background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 16,
  padding: 20, display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit",
};

export function HomeCard({ post }: { post: DecoratedPost }) {
  return (
    <Link href={`/post/${post.id}`} style={{ ...cardBase, gap: 10, minHeight: 210 }}>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <CatBadge post={post} />
        <StatusBadge post={post} />
      </div>
      <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 20, lineHeight: 1.15, margin: 0 }}>{post.title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.45, color: "#5a564d", margin: 0, flex: 1 }}>{post.summary}</p>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a", letterSpacing: "0.3px" }}>{post.metaLine}</div>
    </Link>
  );
}

export function FeedCard({ post }: { post: DecoratedPost }) {
  return (
    <Link href={`/post/${post.id}`} style={{ ...cardBase, gap: 11, minHeight: 230 }}>
      {post.hasPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.photo}
          alt=""
          style={{ width: "calc(100% + 40px)", height: 150, objectFit: "cover", margin: "-20px -20px 0", borderRadius: "16px 16px 0 0" }}
        />
      )}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        <CatBadge post={post} />
        <StatusBadge post={post} />
      </div>
      <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 21, lineHeight: 1.15, margin: 0 }}>{post.title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.45, color: "#5a564d", margin: 0, flex: 1 }}>{post.summary}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {post.topics.map((topic) => (
          <span key={topic} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: "#6b675e", border: "1px solid #e0d4be", borderRadius: 999, padding: "4px 8px", background: "#fffdf8" }}>
            {topic}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ece1cd", paddingTop: 10 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a" }}>{post.metaLine}</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#19734a", fontWeight: 600 }}>{post.helpfulLine}</span>
      </div>
    </Link>
  );
}
