"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, useCityEffect, SubmitForm } from "@/lib/store";
import { CAT, TOPICS, HOODS, cityCfg, typeToCat } from "@/lib/data";
import { config } from "@/lib/config";

const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase",
  letterSpacing: "1px", color: "#8a857a", marginBottom: 7, fontWeight: 600,
};
const fieldStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #d8cab2", background: "#fffdf8", padding: 12, borderRadius: 11, fontSize: 15,
};

function blankForm(hood: string): SubmitForm {
  return { title: "", type: "Good News", topic: "Schools", neighborhood: hood, cross: "", body: "", tags: "", photo: "", photoName: "", c0: false, c1: false, c2: false };
}

const TYPES = ["Good News", "Bad News", "Both", "Opportunity", "Signal", "Pattern / Trend", "Question"];

// Substance floor: this is a platform for real civic stories, not one-line posts.
const MIN_TITLE = 8;
const MIN_BODY = 300;

export default function SubmitPage() {
  const { city, submitSignal } = useStore();
  const cfg = cityCfg(city);

  const [form, setForm] = useState<SubmitForm>(() => blankForm(cfg.hoods[0]));
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [safetyWarn, setSafetyWarn] = useState(false);
  const [substanceWarn, setSubstanceWarn] = useState(false);

  useCityEffect(city, () => {
    setForm(blankForm(cityCfg(city).hoods[0]));
    setStep(1);
    setSubmitted(false);
  });

  const setF = (k: keyof SubmitForm, v: string | boolean) => { setForm((s) => ({ ...s, [k]: v })); setSafetyWarn(false); setSubstanceWarn(false); };
  const goStep = (n: number) => { setStep(n); setSafetyWarn(false); try { window.scrollTo(0, 0); } catch {} };

  const bodyLen = form.body.trim().length;
  const hasSubstance = form.title.trim().length >= MIN_TITLE && bodyLen >= MIN_BODY;
  const toSafety = () => {
    if (!hasSubstance) { setSubstanceWarn(true); return; }
    goStep(2);
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, photo: reader.result as string, photoName: file.name }));
    reader.readAsDataURL(file);
  };

  const toReview = () => {
    const okSafety = config.requireSafetyCheck ? form.c0 && form.c1 && form.c2 : true;
    if (!okSafety) { setSafetyWarn(true); return; }
    goStep(3);
  };

  const doSubmit = () => {
    const { scanMessage } = submitSignal(form);
    setScanMessage(scanMessage);
    setSubmitted(true);
    try { window.scrollTo(0, 0); } catch {}
  };

  const resetForm = () => { setForm(blankForm(cfg.hoods[0])); setStep(1); setSubmitted(false); };

  const submitFeeLine = config.paidModel ? "Submitting a signal costs $0.50 to reduce spam." : "Submitting is free.";
  const submitButtonLabel = config.paidModel ? "Pay $0.50 & submit for review" : "Submit for review";
  const submitButtonNote = config.paidModel
    ? "In the live product this opens checkout, then the signal enters moderation."
    : "Your signal goes straight to the moderation queue - nothing publishes automatically.";

  const reviewCat = CAT[typeToCat(form.type)] || CAT.signal;

  const stepPill = (n: number, label: string) => {
    const active = step === n;
    return (
      <span key={n} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, borderRadius: 999, padding: "8px 12px", border: `1px solid ${active ? "#161616" : "#d8cab2"}`, background: active ? "#161616" : "#fffdf8", color: active ? "#fff" : "#6b675e" }}>{label}</span>
    );
  };

  return (
    <div>
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 70px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Submit a Signal</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.6vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", margin: "0 0 14px" }}>What are you seeing in {cfg.name}?</h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: "#5a564d", maxWidth: 640, margin: "0 0 22px" }}>Share real stories about public life in {cfg.name} - a good thing happening, a problem that needs attention, a pattern, a resource, or an opportunity. {submitFeeLine} Add a photo and tags if you have them.</p>

        <div style={{ background: "#fff8eb", border: "1px solid #c99a2e80", borderRadius: 14, padding: "16px 18px", marginBottom: 26 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 8 }}>Real stories, real substance</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>This is a platform for reported stories about the public life of the city - not quick posts and not personal disputes. Tell us what you saw, where, and why it matters; submissions need enough substance to review. No cheaters, divorces, or private individuals. No doxxing, threats, or private personal information.</p>
        </div>

        {submitted ? (
          <div style={{ background: "#19734a", color: "#fff", borderRadius: 20, padding: 36, textAlign: "center" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: "1.6px", textTransform: "uppercase", color: "#bfe6d3", marginBottom: 12 }}>Signal received</div>
            <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 30, margin: "0 0 12px" }}>Thanks - it&apos;s in the queue.</h2>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "#e7f2ec", maxWidth: 520, margin: "0 auto 12px" }}>Our team will review it before anything is published. Some submissions become public stories, some become background signals, and some are combined with other reports to identify patterns.</p>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, maxWidth: 520, margin: "0 auto 22px", textAlign: "left" }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase", color: "#bfe6d3", marginBottom: 8 }}>Automated safety scan</div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "#fff", margin: 0 }}>{scanMessage}</p>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/latest" style={{ textDecoration: "none", background: "#fff", color: "#19734a", borderRadius: 999, padding: "12px 22px", fontWeight: 700 }}>Read the feed</Link>
              <button onClick={resetForm} style={{ border: "1px solid rgba(255,255,255,0.6)", background: "transparent", color: "#fff", borderRadius: 999, padding: "12px 22px", fontWeight: 700, cursor: "pointer" }}>Submit another</button>
              {config.showAdmin && <Link href="/admin" style={{ textDecoration: "none", border: "1px solid rgba(255,255,255,0.6)", background: "transparent", color: "#fff", borderRadius: 999, padding: "12px 22px", fontWeight: 700 }}>See it in moderation</Link>}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {stepPill(1, "1. Story")}
              {stepPill(2, "2. Safety")}
              {stepPill(3, "3. Review")}
            </div>

            {step === 1 && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>Signal title</label>
                    <input value={form.title} onChange={(e) => setF("title", e.target.value)} placeholder="A short, specific headline" style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>What kind of signal?</label>
                    <select value={form.type} onChange={(e) => setF("type", e.target.value)} style={fieldStyle}>
                      {TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Topic</label>
                    <select value={form.topic} onChange={(e) => setF("topic", e.target.value)} style={fieldStyle}>
                      {TOPICS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Neighborhood</label>
                    <select value={form.neighborhood} onChange={(e) => setF("neighborhood", e.target.value)} style={fieldStyle}>
                      {HOODS.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Cross-streets (optional)</label>
                    <input value={form.cross} onChange={(e) => setF("cross", e.target.value)} placeholder="e.g. Monroe & Montgomery" style={fieldStyle} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>What did you observe?</label>
                    <textarea value={form.body} onChange={(e) => setF("body", e.target.value)} placeholder="Tell the story with real substance: what you saw, where, when, and why it matters to the community. Be specific about the place and situation. Keep it about public life, not private individuals." style={{ ...fieldStyle, minHeight: 170, resize: "vertical", fontFamily: "'Public Sans',sans-serif" }} />
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, marginTop: 6, color: bodyLen >= MIN_BODY ? "#19734a" : "#8a857a" }}>
                      {bodyLen >= MIN_BODY ? "✓ Enough substance to review" : `${bodyLen} / ${MIN_BODY} characters minimum. Real stories, not one-liners.`}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>Tags (comma separated, optional)</label>
                    <input value={form.tags} onChange={(e) => setF("tags", e.target.value)} placeholder="e.g. downtown, cleanup, youth" style={fieldStyle} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>Photo (optional)</label>
                    {form.photo ? (
                      <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#fffdf8", border: "1px solid #d8cab2", borderRadius: 12, padding: 12 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.photo} alt="preview" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 9, border: "1px solid #d8cab2" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, color: "#3a362e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.photoName}</div>
                          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a", marginTop: 2 }}>Only upload photos of public places or conditions you have the right to share.</div>
                        </div>
                        <button onClick={() => setForm((s) => ({ ...s, photo: "", photoName: "" }))} style={{ border: "1px solid #a3342959", background: "#a3342914", color: "#a33429", borderRadius: 9, padding: "8px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Remove</button>
                      </div>
                    ) : (
                      <label style={{ display: "flex", alignItems: "center", gap: 12, border: "1px dashed #c2b294", background: "#fffdf8", borderRadius: 12, padding: 16, cursor: "pointer" }}>
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#9a6a12", border: "1px solid #c99a2e80", borderRadius: 8, padding: "8px 12px", fontWeight: 600 }}>Choose photo</span>
                        <span style={{ fontSize: 13, color: "#8a857a" }}>JPG or PNG. Public conditions only - no faces of minors, license plates, or private details.</span>
                        <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
                      </label>
                    )}
                  </div>
                </div>
                {substanceWarn && (
                  <div style={{ marginTop: 16, background: "#a3342914", border: "1px solid #a3342959", borderRadius: 12, padding: "13px 15px", fontSize: 13.5, color: "#a33429" }}>
                    Give your signal a real headline (at least {MIN_TITLE} characters) and a story with substance (at least {MIN_BODY} characters). This is a place for reported stories about the city, not quick posts.
                  </div>
                )}
                <div style={{ marginTop: 22 }}>
                  <button onClick={toSafety} style={{ border: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Next: Safety check &rarr;</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {[
                    ["c0", "I did not name a minor or identify them in a sensitive context."],
                    ["c1", "I did not include private medical, addiction, or family details about an identifiable person."],
                    ["c2", "This is a public, civic story - not a personal dispute or a complaint about a private individual."],
                  ].map(([k, text]) => (
                    <label key={k} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: 14, border: "1px solid #d8cab2", borderRadius: 13, background: "#fffdf8", fontSize: 14.5, color: "#3a362e", cursor: "pointer" }}>
                      <input type="checkbox" checked={form[k as keyof SubmitForm] as boolean} onChange={(e) => setF(k as keyof SubmitForm, e.target.checked)} style={{ width: "auto", marginTop: 2 }} />
                      {text}
                    </label>
                  ))}
                </div>
                {safetyWarn && (
                  <div style={{ marginTop: 14, background: "#a3342914", border: "1px solid #a3342959", borderRadius: 12, padding: "13px 15px", fontSize: 13.5, color: "#a33429" }}>Please confirm all three before continuing - these protect you and the people in your story.</div>
                )}
                <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => goStep(1)} style={{ border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "13px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>&larr; Back</button>
                  <button onClick={toReview} style={{ border: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Next: Review &rarr;</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 16, padding: 24 }}>
                  {form.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.photo} alt="preview" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #d8cab2", marginBottom: 16 }} />
                  )}
                  <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 24, margin: "0 0 8px" }}>{form.title || "(untitled signal)"}</h3>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#8a857a", marginBottom: 14 }}>{reviewCat.label} · {form.topic} · {form.neighborhood}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3a362e", margin: "0 0 8px" }}>{form.body || "No description entered."}</p>
                </div>
                <p style={{ fontSize: 13.5, color: "#6b675e", margin: "16px 0 0" }}>{submitButtonNote}</p>
                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => goStep(2)} style={{ border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "13px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>&larr; Back</button>
                  <button onClick={doSubmit} style={{ border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 26px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>{submitButtonLabel}</button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
