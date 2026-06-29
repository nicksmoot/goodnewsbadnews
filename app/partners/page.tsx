"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { cityCfg } from "@/lib/data";

const darkInput: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff",
  padding: 12, borderRadius: 11, fontSize: 14.5,
};

const pillarCard = (accent: string, border: string, kicker: string, title: string, body: string) => (
  <div style={{ background: "#fffaf1", border: `1px solid ${border}`, borderLeft: `5px solid ${accent}`, borderRadius: 16, padding: 24 }}>
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "1.4px", fontSize: 12, color: accent === "#c99a2e" ? "#9a6a12" : accent, textTransform: "uppercase", marginBottom: 10 }}>{kicker}</div>
    <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 23, margin: "0 0 8px", lineHeight: 1.1 }}>{title}</h3>
    <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>{body}</p>
  </div>
);

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
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "46px 24px 8px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>For newsrooms &amp; local press</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(38px,5.2vw,64px)", lineHeight: 0.98, letterSpacing: "-2px", margin: "0 0 18px", maxWidth: 900 }}>Partner with the people who see it first.</h1>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: "#3a362e", maxWidth: 760, margin: "0 0 8px" }}>Good News Bad News gives local newsrooms a steady, reviewed stream of resident signals - and gives citizen journalists the reach, mentorship, and editorial support to turn what they&apos;re seeing into real stories. Together you cover the city more completely than either can alone.</p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {pillarCard("#19734a", "#19734a59", "For newsrooms", "A reviewed signal feed.", "Browse emerging stories before they break. Every signal is moderated, location-tagged, and labeled by verification status - a running tip line built by residents across the city.")}
          {pillarCard("#285d83", "#285d834d", "For citizen journalists", "Reach, mentorship & a byline.", "Residents who submit a signal can be paired with a partner reporter to expand it into a full story - with editorial guidance, fact-checking support, and credit for the person who saw it first.")}
          {pillarCard("#c99a2e", "#c99a2e80", "For the community", "Patterns get real reporting.", "The trends residents surface get the depth they deserve instead of disappearing into a feed - and the public gets reporting grounded in what people are actually living.")}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "50px 24px 8px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", borderBottom: "1px solid #d8cab2", paddingBottom: 12, marginBottom: 26 }}>How a partnership works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {stepCard("1", "Claim a signal", "Editors browse the reviewed feed and flag the signals worth expanding into reporting.")}
          {stepCard("2", "Co-report with the resident", "The original contributor is invited to work with a reporter - sharing context, photos, and sources.")}
          {stepCard("3", "Publish & credit", "The expanded story runs in the partner outlet and links back, crediting the citizen journalist.")}
          {stepCard("4", "Track the pattern", "Related signals are bundled so one story can document a citywide pattern, not a single incident.")}
        </div>
      </section>

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

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "34px 24px 64px" }}>
        <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 10 }}>In conversation with newsrooms in Spokane &amp; Honolulu</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>We&apos;re onboarding founding press partners in both launch cities - daily papers, weeklies, public radio, and independent local reporters. If your newsroom covers a community we&apos;re in, there&apos;s a seat at the table.</p>
        </div>
      </section>
    </div>
  );
}
