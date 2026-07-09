import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "90px 24px 110px", textAlign: "center" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "2px", fontSize: 12, color: "#8a857a", marginBottom: 16 }}>Error 404</div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(36px,6vw,60px)", lineHeight: 1.02, letterSpacing: "-1.8px", margin: "0 0 16px" }}>
        This story isn&apos;t on the board.
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: "#5a564d", maxWidth: 460, margin: "0 auto 30px" }}>
        The page you&apos;re looking for moved, was removed, or never existed. The signal, though, is still out there.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Back to the front page</Link>
        <Link href="/search" style={{ textDecoration: "none", border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "13px 24px", fontWeight: 700, fontSize: 15 }}>Search the feed</Link>
      </div>
    </section>
  );
}
