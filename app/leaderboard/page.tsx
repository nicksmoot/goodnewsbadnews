"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cityCfg, CityKey } from "@/lib/data";

interface Row {
  name: string;
  published: number;
  founding: boolean;
  latestTitle: string | null;
  latestId: string | null;
}

const MEDAL = ["#c99a2e", "#8a857a", "#a3652e"]; // gold, silver-ish, bronze-ish

export default function LeaderboardPage() {
  const { city } = useStore();
  const cfg = cityCfg(city);
  const [board, setBoard] = useState<Record<CityKey, Row[]> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        if (res.ok) setBoard(await res.json());
        else setBoard({ spokane: [], honolulu: [], postfalls: [] });
      } catch {
        setBoard({ spokane: [], honolulu: [], postfalls: [] });
      }
    })();
  }, []);

  const rows = board ? board[city] || [] : null;

  return (
    <div>
      <section className="gnbn-section" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 8px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>{cfg.short} · The Contributors&apos; Ledger</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(36px,5vw,58px)", lineHeight: 1, letterSpacing: "-1.8px", margin: "0 0 14px" }}>The people putting {cfg.name} on the record.</h1>
        <p style={{ fontSize: 17.5, lineHeight: 1.5, color: "#5a564d", maxWidth: 680, margin: "0 0 10px" }}>
          Every published story earns its reporter a place on the ledger. Newsrooms browse this board when they license stories and hire contributors.
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, lineHeight: 1.6, color: "#8a857a", maxWidth: 680, margin: 0, letterSpacing: "0.2px" }}>
          Every signal carries a real byline, and every published story counts here. <Link href="/signin?join=1" style={{ color: "#19734a", fontWeight: 700 }}>Join free</Link> and start yours.
        </p>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "26px 24px 70px" }}>
        {/* double rule, newspaper style */}
        <div style={{ height: 3, background: "#161616" }} />
        <div style={{ height: 1, background: "#161616", marginTop: 4, marginBottom: 18 }} />

        {rows === null && (
          <div style={{ color: "#8a857a", fontSize: 15, padding: "30px 0" }}>Opening the ledger…</div>
        )}

        {rows !== null && rows.length === 0 && (
          <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 32, textAlign: "center" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 12 }}>The board is open</div>
            <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 28, lineHeight: 1.1, margin: "0 0 10px" }}>No bylines on the {cfg.name} ledger yet.</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5a564d", maxWidth: 520, margin: "0 auto 20px" }}>
              The first published story claims the top spot. Founding members keep their member number forever - and newsrooms are watching this board.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signin?join=1" style={{ textDecoration: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Claim a founding byline</Link>
              <Link href="/submit" style={{ textDecoration: "none", border: "1px solid #161616", color: "#161616", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Submit the first story</Link>
            </div>
          </div>
        )}

        {rows !== null && rows.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map((r, i) => (
              <div key={r.name + i} style={{ display: "flex", gap: 18, alignItems: "center", background: "#fffaf1", border: i === 0 ? "2px solid #c99a2e" : "1px solid #d8cab2", borderRadius: 14, padding: "16px 20px" }}>
                <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, lineHeight: 1, color: MEDAL[i] || "#d8cab2", minWidth: 44, textAlign: "center", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                    <strong style={{ fontFamily: "'Spectral',serif", fontSize: 19, color: "#161616" }}>{r.name}</strong>
                    {r.founding && (
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#8a5e0f", background: "#c99a2e21", border: "1px solid #c99a2e80", borderRadius: 999, padding: "3px 8px" }}>Founding</span>
                    )}
                  </span>
                  {r.latestTitle && (
                    r.latestId
                      ? <Link href={`/post/${r.latestId}`} style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#6b675e", marginTop: 3, textDecoration: "none" }}>Latest: {r.latestTitle}</Link>
                      : <span style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#6b675e", marginTop: 3 }}>Latest: {r.latestTitle}</span>
                  )}
                </span>
                <span style={{ textAlign: "right", flexShrink: 0 }}>
                  <strong style={{ display: "block", fontFamily: "'Spectral',serif", fontSize: 24, lineHeight: 1, color: "#19734a" }}>{r.published}</strong>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: "0.8px", textTransform: "uppercase", color: "#8a857a" }}>{r.published === 1 ? "story" : "stories"}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: "#161616", color: "#fff", borderRadius: 18, padding: 26, marginTop: 28 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 10 }}>Why the ledger matters</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#e7e1d4", margin: 0 }}>
            This is the roster newsrooms hire from. Every story you publish builds a public record of your reporting - and when a partner newsroom licenses your work, <strong>you get paid</strong>. The first 250 members carry a founding mark forever.
          </p>
        </div>
      </section>
    </div>
  );
}
