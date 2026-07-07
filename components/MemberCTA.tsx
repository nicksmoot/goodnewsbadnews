"use client";

import { useState } from "react";

async function go(endpoint: string, setBusy: (b: boolean) => void, setError: (e: string) => void) {
  setError("");
  setBusy(true);
  try {
    const res = await fetch(endpoint, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setError(data.error || "Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    window.location.href = data.url;
  } catch {
    setError("Network problem. Please try again.");
    setBusy(false);
  }
}

/** Starts Stripe Checkout for the $5/month membership. */
export function CheckoutButton({ label = "Become a member - $5/month", variant = "solid" }: { label?: string; variant?: "solid" | "dark" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const style: React.CSSProperties =
    variant === "dark"
      ? { border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }
      : { border: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 };
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}>
      <button onClick={() => go("/api/billing/checkout", setBusy, setError)} disabled={busy} style={style}>
        {busy ? "Opening checkout…" : label}
      </button>
      {error && <span style={{ fontSize: 12.5, color: variant === "dark" ? "#e89a8f" : "#a33429" }}>{error}</span>}
    </span>
  );
}

/** Opens the Stripe customer portal (manage / cancel). */
export function PortalButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={() => go("/api/billing/portal", setBusy, setError)}
        disabled={busy}
        style={{ border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}
      >
        {busy ? "Opening…" : "Manage subscription"}
      </button>
      {error && <span style={{ fontSize: 12.5, color: "#a33429" }}>{error}</span>}
    </span>
  );
}
