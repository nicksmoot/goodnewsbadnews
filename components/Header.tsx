"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";
import { CityKey } from "@/lib/data";

const INK = "#161616";
const MUTED = "#6b675e";

// Desktop section bar (newspaper style). Standards stays reachable via the
// footer and the About page; the bar keeps to the sections readers live in.
const NAV_LINKS: [string, string][] = [
  ["/latest", "Latest"],
  ["/good", "Good"],
  ["/bad", "Bad"],
  ["/both", "Both"],
  ["/map", "Map"],
  ["/leaderboard", "Ledger"],
  ["/digest", "Digest"],
  ["/partners", "Partners"],
  ["/about", "About"],
];

export default function Header() {
  const { city, setCity } = useStore();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => { setOpen(false); }, [pathname]);

  const navColor = (active: boolean) => (active ? INK : MUTED);
  const is = (p: string) => pathname === p;

  const link = (href: string, label: string, active: boolean, extra?: React.CSSProperties) => (
    <Link
      key={href}
      href={href}
      style={{ textDecoration: "none", padding: "7px 11px", borderRadius: 8, color: navColor(active), ...extra }}
    >
      {label}
    </Link>
  );

  const mobileRow = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      style={{
        display: "block", textDecoration: "none", padding: "10px 6px",
        fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 17,
        color: is(href) ? "#19734a" : INK, borderBottom: "1px solid #ece1cd",
      }}
    >
      {label}
    </Link>
  );

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248,242,231,0.92)", backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid #d8cab2",
      }}
    >
      <div
        style={{
          maxWidth: 1240, margin: "0 auto", padding: "13px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0, minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 9, textDecoration: "none" }}>
            <span className="gnbn-wordmark" style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 25, letterSpacing: "-0.6px", lineHeight: 1, whiteSpace: "nowrap" }}>
              <span style={{ color: "#19734a" }}>Good News</span> <span style={{ color: "#a33429" }}>Bad News</span>
            </span>
          </Link>
          <span className="gnbn-in-label" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 600, letterSpacing: "1.4px", color: "#8a857a", textTransform: "uppercase" }}>in</span>
          <select
            className="gnbn-city-select"
            value={city}
            onChange={(e) => setCity(e.target.value as CityKey)}
            aria-label="Choose your city"
            style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "1px",
              color: "#9a6a12", textTransform: "uppercase", border: "1px solid #c99a2e80", borderRadius: 6,
              padding: "5px 8px", background: "#fffaf1", cursor: "pointer",
            }}
          >
            <option value="spokane">Spokane, WA</option>
            <option value="honolulu">Honolulu, HI</option>
          </select>
        </div>

        {/* Desktop: account + primary actions only (sections live in the bar below) */}
        <nav
          className="gnbn-nav-desktop"
          style={{
            display: "flex", gap: 6, alignItems: "center",
            fontFamily: "'Public Sans',sans-serif", fontSize: 13.5, fontWeight: 600,
          }}
        >
          {status === "authenticated" ? (
            link("/account", "Account", is("/account"))
          ) : (
            <>
              {link("/signin", "Sign in", is("/signin"))}
              <Link
                href="/signin?join=1"
                style={{ textDecoration: "none", background: "#19734a", color: "#fff", borderRadius: 999, padding: "9px 16px", fontWeight: 700 }}
              >
                Join
              </Link>
            </>
          )}
          <Link
            href="/submit"
            style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "9px 16px", fontWeight: 700 }}
          >
            Submit a Signal
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="gnbn-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            border: "1px solid #d8cab2", background: "#fffaf1", borderRadius: 10,
            padding: "10px 12px", cursor: "pointer", flexDirection: "column", gap: 4,
            alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ display: "block", width: 20, height: 2, background: INK, transition: "transform 0.2s", transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: 20, height: 2, background: INK, opacity: open ? 0 : 1, transition: "opacity 0.15s" }} />
          <span style={{ display: "block", width: 20, height: 2, background: INK, transition: "transform 0.2s", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
        </button>
      </div>

      {/* Desktop section bar (newspaper masthead second deck) */}
      <div className="gnbn-nav-desktop gnbn-section-bar" style={{ borderTop: "1px solid #e4d8c2" }}>
        <nav
          aria-label="Sections"
          style={{
            maxWidth: 1240, margin: "0 auto", padding: "0 24px",
            display: "flex", alignItems: "center", flexWrap: "wrap",
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, fontWeight: 600,
            letterSpacing: "1.4px", textTransform: "uppercase",
          }}
        >
          {NAV_LINKS.map(([href, label], i) => (
            <span key={href} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span aria-hidden style={{ color: "#d8cab2", padding: "0 2px" }}>·</span>}
              <Link
                href={href}
                style={{
                  textDecoration: "none", padding: "9px 9px", display: "inline-block",
                  color: is(href) ? "#19734a" : MUTED,
                  borderBottom: is(href) ? "2px solid #19734a" : "2px solid transparent",
                }}
              >
                {label}
              </Link>
            </span>
          ))}
          {isAdmin && (
            <span style={{ display: "flex", alignItems: "center" }}>
              <span aria-hidden style={{ color: "#d8cab2", padding: "0 2px" }}>·</span>
              <Link
                href="/admin"
                style={{
                  textDecoration: "none", padding: "9px 9px", display: "inline-block",
                  color: is("/admin") ? "#19734a" : "#a33429",
                  borderBottom: is("/admin") ? "2px solid #19734a" : "2px solid transparent",
                }}
              >
                Moderation
              </Link>
            </span>
          )}
        </nav>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="gnbn-mobile-menu" aria-label="Mobile" style={{ borderTop: "1px solid #d8cab2", background: "#f8f2e7", maxHeight: "calc(100vh - 68px)", overflowY: "auto" }}>
          <div style={{ padding: "4px 24px 22px" }}>
            {([
              ["Read", [["/latest", "Latest"], ["/good", "Good News"], ["/bad", "Bad News"], ["/both", "Both"]]],
              ["Explore", [["/map", "Signal Map"], ["/leaderboard", "The Ledger"], ["/digest", "Saturday Digest"]]],
              ["The paper", [["/about", "About"], ["/standards", "Community Standards"], ["/partners", "For Newsrooms"]]],
            ] as [string, [string, string][]][]).map(([section, links]) => (
              <div key={section}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#9a6a12", margin: "16px 0 2px" }}>{section}</div>
                {links.map(([href, label]) => mobileRow(href, label))}
              </div>
            ))}
            {(isAdmin || status === "authenticated") && (
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#9a6a12", margin: "16px 0 2px" }}>Your desk</div>
                {status === "authenticated" && mobileRow("/account", "Account")}
                {isAdmin && mobileRow("/admin", "Moderation")}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              <Link href="/submit" onClick={() => setOpen(false)} style={{ textDecoration: "none", textAlign: "center", background: "#161616", color: "#fff", borderRadius: 999, padding: "14px 20px", fontWeight: 700, fontSize: 15.5 }}>
                Submit a Signal
              </Link>
              {status !== "authenticated" && (
                <>
                  <Link href="/signin?join=1" onClick={() => setOpen(false)} style={{ textDecoration: "none", textAlign: "center", background: "#19734a", color: "#fff", borderRadius: 999, padding: "14px 20px", fontWeight: 700, fontSize: 15.5 }}>
                    Join &amp; get paid
                  </Link>
                  <Link href="/signin" onClick={() => setOpen(false)} style={{ textDecoration: "none", textAlign: "center", border: "1px solid #d8cab2", color: INK, background: "#fffdf8", borderRadius: 999, padding: "13px 20px", fontWeight: 700, fontSize: 15 }}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#8a857a", letterSpacing: "0.5px", lineHeight: 1.6, margin: "18px 0 0", textAlign: "center" }}>
              No gossip. No doxxing. Just local signal.
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}
