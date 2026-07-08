"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { cityCfg } from "@/lib/data";

const GREEN = "#19734a";
const GOLD = "#9a6a12";
const BLUE = "#285d83";

function Rule({ label }: { label: string }) {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ flex: 1, height: 1, background: "#d8cab2" }} />
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: "2.4px", textTransform: "uppercase", color: GOLD }}>{label} ◆</span>
      <span style={{ flex: 1, height: 1, background: "#d8cab2" }} />
    </div>
  );
}

const stepCard = (n: string, title: string, body: string, accent: string) => (
  <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 22 }}>
    <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, color: accent, lineHeight: 1, marginBottom: 12 }}>{n}</div>
    <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>{title}</h3>
    <p style={{ fontSize: 14, lineHeight: 1.5, color: "#5a564d", margin: 0 }}>{body}</p>
  </div>
);

const CURRICULUM: [string, string][] = [
  ["Verification & sourcing", "How to confirm a tip before it becomes a story: corroboration, primary sources, and telling a pattern from a rumor."],
  ["Interviewing", "Getting people on the record, asking the follow-up that matters, and protecting a source who needs it."],
  ["Public records & data", "Requesting records, reading a budget or a police log, and turning documents into a story residents can use."],
  ["Media law & ethics", "The lines that keep you and the platform safe: libel, privacy, fairness, and special care around minors."],
  ["Writing with substance", "Structure, the lede, and giving a story real length without padding. Clear, useful, and honest."],
  ["Photography & the field", "Shooting a scene responsibly, capturing what words can't, and staying safe while you report."],
];

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616",
  padding: 12, borderRadius: 11, fontSize: 14.5,
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "#8a5e0f", marginBottom: 6, display: "block",
};

export default function AcademyPage() {
  const { city } = useStore();
  const cfg = cityCfg(city);
  const [form, setForm] = useState({
    name: "", email: "", city: cfg.name, experience: "New to this",
    interest: "Reporting", note: "",
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => { setForm((s) => ({ ...s, [k]: v })); setSent(false); setError(""); };

  const send = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/academy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      setSent(true);
      setBusy(false);
    } catch {
      setError("Network problem. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "54px 24px 20px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.8px", fontSize: 12, color: "#6b675e", marginBottom: 16 }}>The Academy · Journalism training</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(38px,5.4vw,66px)", lineHeight: 1.0, letterSpacing: "-2px", margin: "0 0 18px", maxWidth: 16 + "ch" }}>
          Learn to report<br />your own city.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#3a362e", maxWidth: 640, margin: "0 0 26px" }}>
          You already notice what is happening on your block. The Academy teaches you to turn that into real journalism: how to verify it, write it, and get paid for it. No degree required. You start as a contributor and, if you want it, we train you into a working reporter that newsrooms hire.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#apply" style={{ textDecoration: "none", background: GREEN, color: "#fff", borderRadius: 999, padding: "14px 26px", fontWeight: 700, fontSize: 15.5 }}>Apply to train</a>
          <Link href="/submit" style={{ textDecoration: "none", border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "14px 26px", fontWeight: 700, fontSize: 15.5 }}>Start by filing a signal</Link>
        </div>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#8a857a", letterSpacing: "0.3px", margin: "18px 0 0" }}>
          Free to begin · You earn when your stories are licensed · Top reporters get placed with partner newsrooms
        </p>
      </section>

      {/* Why */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "30px 24px 10px" }}>
        <div style={{ background: "#161616", color: "#fff", borderRadius: 20, padding: "30px 30px 26px" }} className="gnbn-dark-panel">
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 12 }}>Why we train residents</div>
          <p style={{ fontFamily: "'Spectral',serif", fontSize: "clamp(19px,2.3vw,26px)", lineHeight: 1.45, margin: 0, color: "#f4ecdd" }}>
            Local newsrooms lost the reporters who used to watch your city. We think the next generation of them already lives here. The people closest to a story are often the best ones to tell it. They just need the training, the editorial backup, and a way to get paid. That is what the Academy is.
          </p>
        </div>
      </section>

      {/* The path */}
      <section style={{ padding: "44px 0 8px" }}>
        <Rule label="The path" />
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {stepCard("1", "Contributor", "You sign up and start filing signals: real reports from your neighborhood. Every one carries your byline and goes through our review desk.", GREEN)}
            {stepCard("2", "Trained reporter", "You opt into training. We pair you with an editor, work real stories together with guidance and fact-checking, and build your public portfolio.", GOLD)}
            {stepCard("3", "Placed journalist", "Your best work gets licensed and you get paid. Prove yourself and you become eligible to be hired directly by a partner newsroom.", BLUE)}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section style={{ padding: "44px 0 8px" }}>
        <Rule label="What you'll learn" />
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {CURRICULUM.map(([title, body]) => (
              <div key={title} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 16, padding: 22 }}>
                <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 19, margin: "0 0 8px", lineHeight: 1.12 }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The deal / how it works */}
      <section style={{ padding: "44px 0 8px" }}>
        <Rule label="How the program works" />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "26px 24px 0" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Free to start.", "There is no tuition to begin. You learn by doing, on stories that matter to your own city."],
              ["You are paired with an editor.", "A working editor mentors you: story selection, verification, and line edits on real pieces, not homework."],
              ["You build a public byline.", "Your published work becomes a portfolio with a real track record, visible on the Contributors' Ledger."],
              ["You earn when your work is licensed.", "When a newsroom licenses one of your stories, you are paid. Reporting becomes income, not a hobby."],
              ["You become hireable.", "Proven reporters are placed with partner newsrooms looking to hire from this community first."],
            ].map(([b, t]) => (
              <li key={b} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 999, background: GREEN, color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, marginTop: 2 }}>✓</span>
                <span style={{ fontSize: 16, lineHeight: 1.55, color: "#3a362e" }}><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 14.5, color: "#6b675e", lineHeight: 1.6, margin: "22px 0 0" }}>
            Newsrooms hire trained reporters out of this community. See the{" "}
            <Link href="/partners" style={{ color: BLUE, fontWeight: 600 }}>partner program</Link> for how placement works.
          </p>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" style={{ padding: "48px 0 70px" }}>
        <Rule label="Apply to train" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 0" }}>
          <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 20, padding: "28px 26px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "18px 0" }}>
                <div style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 26, marginBottom: 10 }}>You&apos;re on the list.</div>
                <p style={{ fontSize: 15.5, color: "#3a362e", lineHeight: 1.55, margin: "0 auto", maxWidth: 460 }}>
                  Thanks for applying to the Academy. We review applications by city and will reach out with next steps. In the meantime, the best first move is to file a signal.
                </p>
                <Link href="/submit" style={{ display: "inline-block", marginTop: 18, textDecoration: "none", background: GREEN, color: "#fff", borderRadius: 999, padding: "12px 24px", fontWeight: 700, fontSize: 15 }}>File your first signal</Link>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.6px", margin: "0 0 6px" }}>Start your training.</h2>
                <p style={{ fontSize: 14.5, color: "#5a564d", lineHeight: 1.55, margin: "0 0 20px" }}>
                  Tell us a little about you. No experience needed. We train complete beginners and sharpen working writers alike.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle} htmlFor="ac-name">Your name</label>
                    <input id="ac-name" style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jordan Rivera" />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="ac-email">Email</label>
                    <input id="ac-email" style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="ac-city">Your city</label>
                    <select id="ac-city" style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)}>
                      <option>Spokane</option>
                      <option>Honolulu</option>
                      <option>Somewhere else</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="ac-exp">Experience</label>
                    <select id="ac-exp" style={inputStyle} value={form.experience} onChange={(e) => set("experience", e.target.value)}>
                      <option>New to this</option>
                      <option>Some writing experience</option>
                      <option>Working or former journalist</option>
                      <option>Student</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle} htmlFor="ac-interest">What pulls you in most?</label>
                    <select id="ac-interest" style={inputStyle} value={form.interest} onChange={(e) => set("interest", e.target.value)}>
                      <option>Reporting</option>
                      <option>Photography</option>
                      <option>Investigative / records</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle} htmlFor="ac-note">Why do you want to do this? (optional)</label>
                    <textarea id="ac-note" style={{ ...inputStyle, minHeight: 96, resize: "vertical" }} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="A story in your neighborhood you wish someone was covering..." />
                  </div>
                </div>
                {error && <div style={{ color: "#a33429", fontSize: 13.5, marginTop: 12 }}>{error}</div>}
                <button onClick={send} disabled={busy} style={{ marginTop: 18, border: "none", background: GREEN, color: "#fff", borderRadius: 999, padding: "14px 28px", fontWeight: 700, fontSize: 15.5, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
                  {busy ? "Sending…" : "Apply to the Academy"}
                </button>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a", letterSpacing: "0.3px", margin: "14px 0 0" }}>
                  We review by city and reach out with next steps. No spam.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
