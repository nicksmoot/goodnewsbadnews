"use client";

import Link from "next/link";
import { useState } from "react";

const field: React.CSSProperties = { width: "100%", border: "1px solid #d8cab2", background: "#fffdf8", padding: 12, borderRadius: 11, fontSize: 15 };
const label: React.CSSProperties = { display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#8a857a", marginBottom: 7, fontWeight: 600 };

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) { setError("Too many requests. Please wait a minute and try again."); setBusy(false); return; }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  return (
    <section style={{ maxWidth: 460, margin: "0 auto", padding: "56px 24px 90px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Reset password</div>
      {sent ? (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,4.4vw,42px)", lineHeight: 1.05, letterSpacing: "-1.2px", margin: "0 0 12px" }}>Check your email.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5a564d", margin: "0 0 24px" }}>If an account exists for <strong>{email}</strong>, we just sent a link to reset your password. It works once and expires in an hour.</p>
          <Link href="/signin" style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "12px 22px", fontWeight: 700, fontSize: 15 }}>Back to sign in</Link>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,4.4vw,42px)", lineHeight: 1.05, letterSpacing: "-1.2px", margin: "0 0 10px" }}>Forgot your password?</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#5a564d", margin: "0 0 26px" }}>Enter your email and we&apos;ll send you a link to set a new one.</p>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={label} htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={field} autoComplete="email" />
            </div>
            {error && <div style={{ background: "#a3342914", border: "1px solid #a3342959", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#a33429" }}>{error}</div>}
            <button type="submit" disabled={busy} style={{ border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <div style={{ marginTop: 22, fontSize: 14, color: "#5a564d" }}>
            Remembered it? <Link href="/signin" style={{ color: "#19734a", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </div>
        </>
      )}
    </section>
  );
}
