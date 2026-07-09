"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const field: React.CSSProperties = { width: "100%", border: "1px solid #d8cab2", background: "#fffdf8", padding: 12, borderRadius: 11, fontSize: 15 };
const label: React.CSSProperties = { display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: "#8a857a", marginBottom: 7, fontWeight: 600 };

export default function ResetPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try { setToken(new URLSearchParams(window.location.search).get("token") || ""); } catch {}
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Could not reset your password."); setBusy(false); return; }
      setDone(true);
      setTimeout(() => router.push("/signin"), 2200);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  return (
    <section style={{ maxWidth: 460, margin: "0 auto", padding: "56px 24px 90px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Set a new password</div>
      {done ? (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,4.4vw,42px)", lineHeight: 1.05, letterSpacing: "-1.2px", margin: "0 0 12px" }}>Password updated.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5a564d", margin: "0 0 24px" }}>You&apos;re all set. Taking you to sign in…</p>
          <Link href="/signin" style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "12px 22px", fontWeight: 700, fontSize: 15 }}>Sign in now</Link>
        </>
      ) : !token ? (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(28px,4.2vw,40px)", lineHeight: 1.06, letterSpacing: "-1.1px", margin: "0 0 12px" }}>This link is incomplete.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5a564d", margin: "0 0 24px" }}>Open the reset link straight from your email, or request a new one.</p>
          <Link href="/forgot" style={{ textDecoration: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "12px 22px", fontWeight: 700, fontSize: 15 }}>Request a new link</Link>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,4.4vw,42px)", lineHeight: 1.05, letterSpacing: "-1.2px", margin: "0 0 10px" }}>Choose a new password.</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#5a564d", margin: "0 0 26px" }}>Pick something at least 8 characters long.</p>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={label} htmlFor="password">New password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" style={field} autoComplete="new-password" />
            </div>
            {error && <div style={{ background: "#a3342914", border: "1px solid #a3342959", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#a33429" }}>{error}</div>}
            <button type="submit" disabled={busy} style={{ border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
              {busy ? "Saving…" : "Set new password"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
