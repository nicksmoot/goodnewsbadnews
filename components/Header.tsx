"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";
import { CityKey } from "@/lib/data";
import { config } from "@/lib/config";

const INK = "#161616";
const MUTED = "#6b675e";

export default function Header() {
  const { city, setCity } = useStore();
  const { status } = useSession();
  const pathname = usePathname() || "/";

  const navColor = (active: boolean) => (active ? INK : MUTED);
  const is = (p: string) => pathname === p;

  const link = (href: string, label: string, active: boolean, extra?: React.CSSProperties) => (
    <Link
      href={href}
      style={{ textDecoration: "none", padding: "7px 11px", borderRadius: 8, color: navColor(active), ...extra }}
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
          gap: 20, flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 9, textDecoration: "none" }}>
            <span style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 25, letterSpacing: "-0.6px", lineHeight: 1 }}>
              <span style={{ color: "#19734a" }}>Good News</span> <span style={{ color: "#a33429" }}>Bad News</span>
            </span>
          </Link>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 600, letterSpacing: "1.4px", color: "#8a857a", textTransform: "uppercase" }}>in</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as CityKey)}
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
        <nav
          style={{
            display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap",
            fontFamily: "'Public Sans',sans-serif", fontSize: 13.5, fontWeight: 600,
          }}
        >
          {link("/latest", "Latest", is("/latest"))}
          {link("/good", "Good", is("/good"))}
          {link("/bad", "Bad", is("/bad"))}
          {link("/both", "Both", is("/both"))}
          {link("/map", "Map", is("/map"))}
          {link("/digest", "Digest", is("/digest"))}
          {link("/about", "About", is("/about"))}
          {link("/standards", "Standards", is("/standards"))}
          {link("/partners", "Partners", is("/partners"))}
          {config.showAdmin &&
            link("/admin", "Moderation", is("/admin"), { fontFamily: "'IBM Plex Mono',monospace", fontSize: 12 })}
          {status === "authenticated"
            ? link("/account", "Account", is("/account"))
            : link("/signin", "Sign in", is("/signin"))}
          <Link
            href="/submit"
            style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "9px 16px", fontWeight: 700, marginLeft: 6 }}
          >
            Submit a Signal
          </Link>
        </nav>
      </div>
    </header>
  );
}
