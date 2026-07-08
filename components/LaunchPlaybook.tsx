"use client";

import { useEffect, useMemo, useState } from "react";

// Internal, admin-only playbook for standing up a new market. Reference
// strategy plus a checkable launch checklist that persists per market in
// localStorage (no backend needed; it's an operator's worksheet).

const GREEN = "#19734a";
const GOLD = "#9a6a12";
const BLUE = "#285d83";
const RED = "#a33429";

type Phase = { title: string; note: string; items: string[] };

const PHASES: Phase[] = [
  {
    title: "1 · Seed the supply",
    note: "An empty feed looks dead. Load the market with real, verified stories before anyone else sees it.",
    items: [
      "Recruit 15 to 30 founding contributors before public launch",
      "Sign 2 to 3 ex / laid-off local journalists (pay one as market editor)",
      "Enroll 6 to 8 journalism or comms students (partner with a j-school class)",
      "Line up 4 to 5 community connectors (association leaders, coaches, business owners, faith leaders)",
      "Identify 2 to 3 confidential first-responder / insider sources (pattern-only, no public bylines)",
      "Seed 30 to 50 verified stories and map pins so the feed looks alive on day one",
    ],
  },
  {
    title: "2 · Lock a launch newsroom partner",
    note: "One paper or station signed before launch gives you distribution and credibility.",
    items: [
      "Sign one annual-license newsroom with market exclusivity",
      "Set up co-reporting between partner reporters and contributors",
      "Confirm the $100-per-story fee goes directly to the journalist",
      "Agree on hiring rights out of the contributor pool",
    ],
  },
  {
    title: "3 · Open with the founding hook",
    note: "Early status is what pulls the second wave in.",
    items: [
      "Turn on founding-member (first 250) for the market",
      "Enable the Contributors' Ledger for the city",
      "Announce with the good/bad drama framing (the unreported win and the unreported crime)",
      "Brief every founding contributor on Community Standards before go-live",
    ],
  },
  {
    title: "4 · Run the loop",
    note: "The desk has to turn every day or the market stalls.",
    items: [
      "Assign an editor to the moderation desk with a daily review SLA",
      "Set a weekly cadence (Saturday digest + review turnaround)",
      "Track signals filed, stories published, stories licensed, and writers paid",
      "Review the contributor mix monthly and refill thin beats",
    ],
  },
];

const TIERS: { label: string; color: string; who: string; why: string }[] = [
  { label: "Tier 1 · recruit first", color: GREEN, who: "Laid-off / retired local journalists", why: "Instant credibility, publishable on day one, and they can be your editor and Academy mentors. Your single best launch partner." },
  { label: "Tier 1 · recruit first", color: GREEN, who: "Journalism & comms students", why: "Hungry for bylines and a portfolio, cheap to activate, high volume. The j-school itself is a partner. Your farm team." },
  { label: "Tier 2 · high value, with guardrails", color: GOLD, who: "EMTs, firefighters, ER nurses", why: "See the bad news first. Use as anonymous, privately-verified pattern sources, never public incident bylines. HIPAA, employer policy, and trust are at stake." },
  { label: "Tier 3 · approach carefully", color: RED, who: "Police", why: "Risky for a trust-based platform: reads as the official narrative and invites bias claims. Keep them as a records source and an accountability subject, not an author." },
  { label: "Round it out", color: BLUE, who: "Community connectors", why: "Neighborhood associations, coaches and sports parents (best good-news engine), teachers, faith leaders, librarians, and local Facebook-group admins already aggregating civic signal." },
];

function useChecklist(market: string) {
  const key = useMemo(() => `gnbn_playbook_${(market || "market").trim().toLowerCase()}`, [market]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    try {
      const raw = localStorage.getItem(key);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
    setLoaded(true);
  }, [key]);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return { checked, toggle, loaded };
}

export default function LaunchPlaybook() {
  const [market, setMarket] = useState("");
  useEffect(() => {
    try {
      setMarket(localStorage.getItem("gnbn_playbook_current") || "");
    } catch {
      /* ignore */
    }
  }, []);
  const setMarketPersist = (v: string) => {
    setMarket(v);
    try {
      localStorage.setItem("gnbn_playbook_current", v);
    } catch {
      /* ignore */
    }
  };

  const { checked, toggle } = useChecklist(market);

  const allItems = PHASES.flatMap((p) => p.items);
  const done = allItems.filter((i) => checked[i]).length;
  const pct = allItems.length ? Math.round((done / allItems.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ borderBottom: "1px solid #d8cab2", paddingBottom: 18, marginBottom: 22 }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 10 }}>Growth · Internal · Playbook</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(28px,3.6vw,42px)", lineHeight: 1, letterSpacing: "-1.4px", margin: "0 0 8px" }}>Launch a new market</h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "#5a564d", maxWidth: 720, margin: 0 }}>
          A market launch is a cold-start problem: nobody files into an empty feed. Seed the supply, lock a newsroom partner, open with the founding hook, then run the loop. Track a specific launch below. Progress saves in this browser.
        </p>
      </div>

      {/* Market tracker */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <label htmlFor="pb-market" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "#8a5e0f" }}>Market</label>
          <input
            id="pb-market"
            value={market}
            onChange={(e) => setMarketPersist(e.target.value)}
            placeholder="e.g. Tacoma, WA"
            style={{ border: "1px solid #d8cab2", background: "#fffdf8", borderRadius: 10, padding: "9px 12px", fontSize: 14.5, minWidth: 200 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 220, flex: "1 1 220px", maxWidth: 360 }}>
          <div style={{ flex: 1, height: 8, background: "#e4d8c2", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: GREEN, transition: "width 0.2s" }} />
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#6b675e", whiteSpace: "nowrap" }}>{done}/{allItems.length} · {pct}%</span>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 30 }}>
        {PHASES.map((phase) => (
          <div key={phase.title} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 19, margin: "0 0 4px", letterSpacing: "-0.4px" }}>{phase.title}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.45, color: "#8a857a", margin: "0 0 14px" }}>{phase.note}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phase.items.map((item) => {
                const on = !!checked[item];
                return (
                  <label key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 14, lineHeight: 1.45, color: on ? "#9a958a" : "#2b2820" }}>
                    <span style={{ flexShrink: 0, width: 19, height: 19, borderRadius: 6, border: `1.5px solid ${on ? GREEN : "#c4b790"}`, background: on ? GREEN : "#fffdf8", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, marginTop: 1 }}>{on ? "✓" : ""}</span>
                    <input type="checkbox" checked={on} onChange={() => toggle(item)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                    <span style={{ textDecoration: on ? "line-through" : "none" }}>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Who to recruit */}
      <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.6px", margin: "0 0 14px" }}>The launch cohort, ranked by fit</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {TIERS.map((t, i) => (
          <div key={i} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderLeft: `4px solid ${t.color}`, borderRadius: "4px 12px 12px 4px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
              <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 17 }}>{t.who}</span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: "0.8px", textTransform: "uppercase", color: t.color }}>{t.label}</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: "#3a362e", margin: "6px 0 0" }}>{t.why}</p>
          </div>
        ))}
      </div>

      {/* Target mix + guardrails */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 10 }}>
        <div style={{ background: "#161616", color: "#fff", borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 10 }}>Target cohort · ~20 people</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: "#e7e1d4" }}>
            <li>2 to 3 ex-journalists (paid, one as editor)</li>
            <li>6 to 8 students</li>
            <li>4 to 5 community connectors</li>
            <li>2 to 3 confidential insider sources</li>
            <li>1 launch newsroom partner</li>
          </ul>
        </div>
        <div style={{ background: "#a3342910", border: "1px solid #a3342940", borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: RED, marginBottom: 10 }}>Guardrails</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.65, color: "#3a362e" }}>
            <li>First responders are pattern sources, not public bylines. No HIPAA-protected detail, no naming.</li>
            <li>Police as a records source and accountability subject, not an author.</li>
            <li>No doxxing, no private disputes. Standards brief before anyone files.</li>
          </ul>
        </div>
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6b675e", marginTop: 20, borderTop: "1px solid #e4d8c2", paddingTop: 16 }}>
        <strong>Wiring a new market in the product</strong> is a small config change (city center, zoom, neighborhoods, geocode box) plus a seed set. Two cities run that way today. Ping the dev with the market and target neighborhoods to spin it up.
      </p>
    </div>
  );
}
