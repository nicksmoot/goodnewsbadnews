"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaces in Vercel logs; swap for Sentry/console reporting if added.
    console.error(error);
  }, [error]);

  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "90px 24px 110px", textAlign: "center" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "2px", fontSize: 12, color: "#a33429", marginBottom: 16 }}>Something broke</div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,5.4vw,54px)", lineHeight: 1.04, letterSpacing: "-1.6px", margin: "0 0 16px" }}>
        We hit a snag loading this.
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: "#5a564d", maxWidth: 460, margin: "0 auto 30px" }}>
        This one is on us, not you. Try again, and if it keeps happening the team is already seeing it in the logs.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => reset()} style={{ border: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Try again</button>
        <Link href="/" style={{ textDecoration: "none", border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Back to the front page</Link>
      </div>
    </section>
  );
}
