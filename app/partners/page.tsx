"use client";

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
  const [partner, setPartner] = useState({ org: "", city: "Spokane", email: "", note: "" });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => { setPartner((s) => ({ ...s, [k]: v })); setSent(false); };

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

      {/* ============ WHAT PARTNERS GET + FORM ============ */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 24px 8px" }}>
        <div className="gnbn-dark-panel" style={{ background: "#161616", color: "#fff", borderRadius: 24, padding: 42, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.8px", margin: "0 0 14px" }}>What partners get</h2>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.9, color: "#e7e1d4" }}>
              <li>A moderated, location-tagged signal feed for your city</li>
              <li>Early access to pattern reports before they&apos;re public</li>
              <li>A pipeline of resident contributors and tips</li>
              <li>Co-branded &quot;In partnership with&quot; labeling on stories</li>
              <li>Shared editorial standards that protect contributors</li>
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
                  <input value={partner.email} onChange={(e) => set("email", e.target.value)} placeholder="Work email" style={darkInput} />
                  <textarea value={partner.note} onChange={(e) => set("note", e.target.value)} placeholder="What kind of stories does your newsroom cover?" style={{ ...darkInput, minHeight: 84, resize: "vertical", fontFamily: "'Public Sans',sans-serif" }} />
                  <button onClick={() => { setSent(true); try { window.scrollTo(0, 0); } catch {} }} style={{ border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Request a partnership call</button>
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
