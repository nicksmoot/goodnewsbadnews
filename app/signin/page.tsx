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

  const benefit = (n: string, color: string, title: string, body: string) => (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 30, lineHeight: 1, color, flexShrink: 0 }}>{n}</span>
      <span>
        <strong style={{ display: "block", fontFamily: "'Spectral',serif", fontSize: 18, marginBottom: 3, color: "#161616" }}>{title}</strong>
        <span style={{ fontSize: 14, lineHeight: 1.5, color: "#5a564d" }}>{body}</span>
      </span>
    </div>
  );

  return (
    <section style={{ maxWidth: mode === "signup" ? 980 : 460, margin: "0 auto", padding: "56px 24px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: mode === "signup" ? "1fr 1fr" : "1fr", gap: 48, alignItems: "start" }}>
      {mode === "signup" && (
        <aside style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 20, padding: 28, boxShadow: "0 10px 34px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 18 }}>Why join</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {benefit("1", "#19734a", "Put your city on the record", "Your reporting becomes part of the public record: reviewed, mapped, and impossible to ignore. The wins and the warnings your city would otherwise miss.")}
            {benefit("2", "#a33429", "Get paid for your stories", "Local newsrooms license stories straight from this feed - $100 exclusives and annual deals - and every license pays the resident who reported it. Your story, your byline, your money.")}
            {benefit("3", "#8a5e0f", "Turn reporting into a career", "Partner newsrooms hire directly from this community. Strong contributors get co-reporting invitations, editorial mentorship, and real job offers.")}
          </div>
          <div style={{ borderTop: "1px solid #e4d8c2", marginTop: 22, paddingTop: 14, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a", letterSpacing: "0.5px", lineHeight: 1.7 }}>
            Free to join · Byline on everything you publish · The first 250 members are founding contributors, and the number is yours forever
          </div>
        </aside>
      )}
      <div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>
        {mode === "signin" ? "Sign in" : "Create your account"}
      </div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,4.4vw,44px)", lineHeight: 1.03, letterSpacing: "-1.4px", margin: "0 0 10px" }}>
        {mode === "signin" ? "Welcome back." : "Join the signal. Get paid for it."}
      </h1>
      <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "#5a564d", margin: "0 0 26px" }}>
        {mode === "signin"
          ? "Sign in to submit signals, follow stories, and manage your membership."
          : "Report what you see, help your city see itself clearly, and earn real money when newsrooms license your stories."}
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
          {mode === "signin" && (
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <Link href="/forgot" style={{ fontSize: 13, color: "#19734a", fontWeight: 600, textDecoration: "none" }}>Forgot password?</Link>
            </div>
          )}
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
      </div>
      </div>
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
