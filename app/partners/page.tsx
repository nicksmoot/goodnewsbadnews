"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { cityCfg } from "@/lib/data";

const darkInput: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff",
  padding: 12, borderRadius: 11, fontSize: 14.5,
};

// A centered small-caps section label with a hairline rule on each side.
function Rule({ label }: { label: string }) {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ flex: 1, height: 1, background: "#d8cab2" }} />
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: "2.4px", textTransform: "uppercase", color: "#8a5e0f" }}>{label} ◆</span>
      <span style={{ flex: 1, height: 1, background: "#d8cab2" }} />
    </div>
  );
}

function PillarColumn({ accent, kicker, title, body }: { accent: string; kicker: string; title: string; body: string }) {
  return (
    <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderTop: `4px double ${accent}`, borderRadius: "4px 4px 14px 14px", padding: 24 }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "1.8px", fontSize: 11.5, color: accent === "#c99a2e" ? "#9a6a12" : accent, textTransform: "uppercase", marginBottom: 12 }}>{kicker}</div>
      <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 24, margin: "0 0 10px", lineHeight: 1.08, letterSpacing: "-0.4px" }}>{title}</h3>
      <p style={{ fontFamily: "'Spectral',serif", fontSize: 15.5, lineHeight: 1.55, color: "#3a362e", margin: 0 }}>{body}</p>
    </div>
  );
}

const stepCard = (n: string, title: string, body: string) => (
  <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 22 }}>
    <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, color: "#9a6a12", lineHeight: 1, marginBottom: 12 }}>{n}</div>
    <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>{title}</h3>
    <p style={{ fontSize: 14, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>{body}</p>
  </div>
);

export default function PartnersPage() {
  const { city } = useStore();
  const cfg = cityCfg(city);
  const [partner, setPartner] = useState({ org: "", city: "Spokane", interest: "Annual newsroom license", email: "", note: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => { setPartner((s) => ({ ...s, [k]: v })); setSent(false); setError(""); };

  const send = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partner),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not send your inquiry. Please try again.");
      } else {
        setSent(true);
        try { window.scrollTo(0, 0); } catch {}
      }
    } catch {
      setError("Network problem. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div>
      {/* ============ MASTHEAD ============ */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "34px 24px 0" }}>
        <div style={{ borderTop: "3px double #161616", borderBottom: "3px double #161616", padding: "14px 0" }}>
          {/* dateline */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: "1.6px", textTransform: "uppercase", color: "#6b675e", marginBottom: 10 }}>
            <span>Est. MMXXVI</span>
            <span style={{ color: "#8a5e0f" }}>The Partners Edition</span>
            <span>All the signal fit to print</span>
          </div>
          {/* wordmark */}
          <div style={{ textAlign: "center", fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,5.4vw,54px)", letterSpacing: "-1.4px", lineHeight: 1 }}>
            <span style={{ color: "#19734a" }}>Good News</span> <span style={{ color: "#a33429" }}>Bad News</span>
          </div>
          {/* motto */}
          <div style={{ textAlign: "center", fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 15, color: "#6b675e", marginTop: 8 }}>
            A civic broadsheet built with the newsrooms who cover the city best.
          </div>
        </div>
      </section>

      {/* ============ FRONT-PAGE SPLASH ============ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "34px 24px 6px", textAlign: "center" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "2.2px", fontSize: 12, color: "#a33429", marginBottom: 14 }}>Founding press partners wanted</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(40px,6vw,72px)", lineHeight: 0.96, letterSpacing: "-2.2px", margin: "0 0 16px" }}>Partner with the people who see it first.</h1>
        <p style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: "clamp(18px,2.4vw,23px)", lineHeight: 1.4, color: "#3a362e", margin: "0 auto", maxWidth: 660 }}>
          A reviewed stream of resident signals for your newsroom - and the reach, mentorship, and byline for the residents who spotted the story.
        </p>
      </section>

      {/* ============ LEDE (columned, drop cap) ============ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "22px 24px 8px" }}>
        <p style={{ fontFamily: "'Spectral',serif", fontSize: 17, lineHeight: 1.62, color: "#2b2820", margin: 0, columns: "20rem 2", columnGap: 34 }}>
          <span style={{ float: "left", fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 62, lineHeight: 0.72, paddingRight: 10, paddingTop: 6, color: "#a33429" }}>G</span>
          ood News Bad News gives local newsrooms a steady, moderated, location-tagged feed of what residents are actually seeing on the ground - wins, concerns, patterns, and opportunities, each labeled by verification status. It is, in effect, a running tip line built by the whole city. And it gives citizen journalists something newsrooms rarely can: guidance, fact-checking support, distribution, and credit for the person who noticed the story before anyone else. Together you cover the city more completely than either can alone - the resident who lives it, and the reporter who can carry it the rest of the way.
        </p>
      </section>

      <div style={{ padding: "26px 0 6px" }}><Rule label="Why partner" /></div>

      {/* ============ PILLARS ============ */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "22px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          <PillarColumn accent="#19734a" kicker="For newsrooms" title="A reviewed signal feed." body="Browse emerging stories before they break. Every signal is moderated, location-tagged, and labeled by verification status - a running tip line built by residents across the city." />
          <PillarColumn accent="#285d83" kicker="For citizen journalists" title="Reach, mentorship & a byline." body="Residents who submit a signal can be paired with a partner reporter to expand it into a full story - with editorial guidance, fact-checking support, and credit for the person who saw it first." />
          <PillarColumn accent="#c99a2e" kicker="For the community" title="Patterns get real reporting." body="The trends residents surface get the depth they deserve instead of disappearing into a feed - and the public gets reporting grounded in what people are actually living." />
        </div>
      </section>

      <div style={{ padding: "40px 0 6px" }}><Rule label="The process" /></div>

      {/* ============ HOW IT WORKS ============ */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "22px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {stepCard("1", "Claim a signal", "Editors browse the reviewed feed and flag the signals worth expanding into reporting.")}
          {stepCard("2", "Co-report with the resident", "The original contributor is invited to work with a reporter - sharing context, photos, and sources.")}
          {stepCard("3", "Publish & credit", "The expanded story runs in the partner outlet and links back, crediting the citizen journalist.")}
          {stepCard("4", "Track the pattern", "Related signals are bundled so one story can document a citywide pattern, not a single incident.")}
        </div>
      </section>

      <div style={{ padding: "40px 0 6px" }}><Rule label="The licensing desk" /></div>

      {/* ============ LICENSING & TALENT (the business model) ============ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "22px 24px 2px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.05, letterSpacing: "-1.2px", margin: "0 0 12px" }}>License the stories. Hire the talent. Pay the writers.</h2>
        <p style={{ fontFamily: "'Spectral',serif", fontStyle: "italic", fontSize: 17, lineHeight: 1.5, color: "#5a564d", margin: "0 auto", maxWidth: 620 }}>
          Every license pays the resident who reported the story. That&apos;s the deal that keeps the signal coming.
        </p>
      </section>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, alignItems: "stretch" }}>
          {/* Annual license */}
          <div style={{ background: "#fffaf1", border: "2px solid #19734a", borderRadius: 16, padding: 26, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#19734a", marginBottom: 12 }}>Annual newsroom license</div>
            <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, letterSpacing: "-1px", lineHeight: 1, marginBottom: 4 }}>Priced per market</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#8a857a", marginBottom: 16 }}>billed annually · talk to us</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.75, color: "#3a362e", flex: 1 }}>
              <li>License and reprint stories from your market, all year</li>
              <li>We handle writer payments on every story you run</li>
              <li><strong>Direct hiring rights</strong> from the contributor community, included</li>
              <li>Early access to pattern reports and the full signal feed</li>
            </ul>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#19734a", marginTop: 16, fontWeight: 700 }}>Best for dailies &amp; broadcast</div>
          </div>
          {/* Per-story */}
          <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 16, padding: 26, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 12 }}>Per-story exclusive</div>
            <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, letterSpacing: "-1px", lineHeight: 1, marginBottom: 4 }}>$100 <span style={{ fontSize: 18, fontWeight: 700, color: "#6b675e" }}>/ story</span></div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#8a857a", marginBottom: 16 }}>no commitment · pay as you print</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.75, color: "#3a362e", flex: 1 }}>
              <li>Pick from the stories getting traction on the feed</li>
              <li><strong>Exclusive print rights in your market</strong></li>
              <li><strong>The full $100 goes directly to the journalist who reported it</strong></li>
              <li>Full story, photos, and contributor context included</li>
            </ul>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#9a6a12", marginTop: 16, fontWeight: 700 }}>Best for weeklies &amp; independents</div>
          </div>
          {/* Talent */}
          <div style={{ background: "#161616", color: "#fff", border: "1px solid #161616", borderRadius: 16, padding: 26, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 12 }}>Talent placement</div>
            <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, letterSpacing: "-1px", lineHeight: 1, marginBottom: 4 }}>$10,000 <span style={{ fontSize: 18, fontWeight: 700, color: "#8a857a" }}>/ hire</span></div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: "#8a857a", marginBottom: 16 }}>waived for annual partners</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.75, color: "#e7e1d4", flex: 1 }}>
              <li>Hire journalists we&apos;ve trained inside this community</li>
              <li>Contributors with a public record: real bylines, real beats</li>
              <li>Vetted through our editorial standards and moderation</li>
              <li><strong>Included free</strong> with an annual newsroom license</li>
            </ul>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#c99a2e", marginTop: 16, fontWeight: 700 }}>The farm team for local news</div>
          </div>
        </div>
      </section>

      {/* Writers get paid strip */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 24px 8px" }}>
        <div style={{ background: "#19734a10", border: "1px solid #19734a40", borderRadius: 14, padding: "18px 22px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Spectral',serif", fontSize: 16.5, lineHeight: 1.55, color: "#161616", margin: 0 }}>
            <strong style={{ color: "#19734a" }}>Residents: your story can pay you.</strong> When a newsroom licenses a story you reported, you get paid. Write enough of them well, and a newsroom may hire you outright. <Link href="/signin?join=1" style={{ color: "#19734a", fontWeight: 700 }}>Join and start your byline &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ============ WHAT PARTNERS GET + FORM ============ */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 24px 8px" }}>
        <div className="gnbn-dark-panel" style={{ background: "#161616", color: "#fff", borderRadius: 24, padding: 42, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.8px", margin: "0 0 14px" }}>What partners get</h2>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.9, color: "#e7e1d4" }}>
              <li>A moderated, location-tagged signal feed for your city</li>
              <li>Story licensing with market-exclusive print rights</li>
              <li>Early access to pattern reports before they&apos;re public</li>
              <li>Hiring rights to journalists trained in this community</li>
              <li>Writer payments handled by us on every license</li>
              <li>Co-branded &quot;In partnership with&quot; labeling on stories</li>
            </ul>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16, padding: 24 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "14px 4px" }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#7fcfa5", marginBottom: 12 }}>Inquiry received</div>
                <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 24, margin: "0 0 10px" }}>Thanks - we&apos;ll be in touch.</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#cfc8b9", margin: 0 }}>A member of the partnerships team will reach out about bringing your newsroom into the {cfg.name} pilot.</p>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 16 }}>Become a launch partner</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input value={partner.org} onChange={(e) => set("org", e.target.value)} placeholder="Newsroom or organization" style={darkInput} />
                  <select value={partner.city} onChange={(e) => set("city", e.target.value)} style={darkInput}>
                    <option style={{ color: "#161616" }}>Spokane</option>
                    <option style={{ color: "#161616" }}>Honolulu</option>
                    <option style={{ color: "#161616" }}>Another city</option>
                  </select>
                  <select value={partner.interest} onChange={(e) => set("interest", e.target.value)} style={darkInput} aria-label="What are you interested in?">
                    <option style={{ color: "#161616" }}>Annual newsroom license</option>
                    <option style={{ color: "#161616" }}>Per-story licensing ($100/story)</option>
                    <option style={{ color: "#161616" }}>Hiring from the community</option>
                    <option style={{ color: "#161616" }}>Co-reporting partnership</option>
                  </select>
                  <input value={partner.email} onChange={(e) => set("email", e.target.value)} placeholder="Work email" style={darkInput} />
                  <textarea value={partner.note} onChange={(e) => set("note", e.target.value)} placeholder="What kind of stories does your newsroom cover?" style={{ ...darkInput, minHeight: 84, resize: "vertical", fontFamily: "'Public Sans',sans-serif" }} />
                  {error && (
                    <div style={{ background: "rgba(163,52,41,0.25)", border: "1px solid rgba(232,154,143,0.5)", borderRadius: 11, padding: "11px 13px", fontSize: 13.5, color: "#e89a8f" }}>{error}</div>
                  )}
                  <button onClick={send} disabled={busy} style={{ border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 22px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>{busy ? "Sending…" : "Request a partnership call"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ============ CLOSING BAND ============ */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "34px 24px 64px" }}>
        <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: "22px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.8px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 10 }}>In conversation with newsrooms in Spokane &amp; Honolulu</div>
          <p style={{ fontFamily: "'Spectral',serif", fontSize: 16, lineHeight: 1.6, color: "#3a362e", margin: "0 auto", maxWidth: 720 }}>We&apos;re onboarding founding press partners in both launch cities - daily papers, weeklies, public radio, and independent local reporters. If your newsroom covers a community we&apos;re in, there&apos;s a seat at the table.</p>
        </div>
      </section>
    </div>
  );
}
