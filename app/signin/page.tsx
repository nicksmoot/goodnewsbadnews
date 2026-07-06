"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const field: React.CSSProperties = {
  width: "100%", border: "1px solid #d8cab2", background: "#fffdf8",
  padding: 12, borderRadius: 11, fontSize: 15,
};
const label: React.CSSProperties = {
  display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, textTransform: "uppercase",
  letterSpacing: "1px", color: "#8a857a", marginBottom: 7, fontWeight: 600,
};

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";

  const [mode, setMode] = useState<"signin" | "signup">(params.get("join") ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Could not create your account.");
          setBusy(false);
          return;
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("That email and password don't match.");
        setBusy(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <section style={{ maxWidth: 460, margin: "0 auto", padding: "56px 24px 80px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>
        {mode === "signin" ? "Sign in" : "Create your account"}
      </div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,4.4vw,44px)", lineHeight: 1.03, letterSpacing: "-1.4px", margin: "0 0 10px" }}>
        {mode === "signin" ? "Welcome back." : "Join the signal."}
      </h1>
      <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "#5a564d", margin: "0 0 26px" }}>
        {mode === "signin"
          ? "Sign in to submit signals, follow stories, and manage your membership."
          : "An account lets you submit signals, follow stories, and unlock the full feed."}
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {mode === "signup" && (
          <div>
            <label style={label} htmlFor="name">Name (optional)</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={field} autoComplete="name" />
          </div>
        )}
        <div>
          <label style={label} htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={field} autoComplete="email" />
        </div>
        <div>
          <label style={label} htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} style={field} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
        </div>

        {error && (
          <div style={{ background: "#a3342914", border: "1px solid #a3342959", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#a33429" }}>{error}</div>
        )}

        <button type="submit" disabled={busy} style={{ border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
          {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div style={{ marginTop: 22, fontSize: 14, color: "#5a564d" }}>
        {mode === "signin" ? (
          <>New here?{" "}
            <button onClick={() => { setMode("signup"); setError(""); }} style={{ border: "none", background: "none", color: "#19734a", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 14 }}>Create an account</button>
          </>
        ) : (
          <>Already have an account?{" "}
            <button onClick={() => { setMode("signin"); setError(""); }} style={{ border: "none", background: "none", color: "#19734a", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 14 }}>Sign in</button>
          </>
        )}
      </div>

      <p style={{ marginTop: 26, fontSize: 12.5, color: "#8a857a", lineHeight: 1.5 }}>
        By continuing you agree to our <Link href="/standards" style={{ color: "#19734a" }}>community standards</Link>.
      </p>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: "center", color: "#8a857a" }}>Loading…</div>}>
      <SignInInner />
    </Suspense>
  );
}
