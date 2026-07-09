"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function UnsubscribePage() {
  const [state, setState] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("e");
    const t = params.get("t");
    // The GET link already unsubscribed and redirected with done=1.
    if (params.get("done") === "1") { setState("done"); return; }
    if (!e || !t) { setState("error"); return; }
    fetch(`/api/unsubscribe?e=${encodeURIComponent(e)}&t=${encodeURIComponent(t)}`, { method: "POST" })
      .then((r) => setState(r.ok ? "done" : "error"))
      .catch(() => setState("error"));
  }, []);

  return (
    <section style={{ maxWidth: 620, margin: "0 auto", padding: "80px 24px 110px", textAlign: "center" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.8px", fontSize: 12, color: "#6b675e", marginBottom: 16 }}>Saturday Digest</div>
      {state === "working" && <p style={{ fontSize: 17, color: "#5a564d" }}>Updating your preferences…</p>}
      {state === "done" && (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,5vw,48px)", lineHeight: 1.05, letterSpacing: "-1.4px", margin: "0 0 14px" }}>You&apos;re unsubscribed.</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#5a564d", maxWidth: 460, margin: "0 auto 28px" }}>You won&apos;t get the Saturday Digest anymore. No hard feelings, the signal will be here if you want it back.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Back to the front page</Link>
            <Link href="/digest" style={{ textDecoration: "none", border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Re-subscribe</Link>
          </div>
        </>
      )}
      {state === "error" && (
        <>
          <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,4.6vw,44px)", lineHeight: 1.06, letterSpacing: "-1.2px", margin: "0 0 14px" }}>That link didn&apos;t work.</h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#5a564d", maxWidth: 460, margin: "0 auto 28px" }}>The unsubscribe link may be incomplete. Email <a href="mailto:nick@innovationcollective.co" style={{ color: "#19734a", fontWeight: 700 }}>nick@innovationcollective.co</a> and we&apos;ll take you off the list right away.</p>
          <Link href="/" style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Back to the front page</Link>
        </>
      )}
    </section>
  );
}
