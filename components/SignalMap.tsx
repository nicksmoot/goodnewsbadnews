"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { useStore, useCityEffect } from "@/lib/store";
import { CAT, CatKey, cityCfg } from "@/lib/data";
import { cityPosts, decorateList } from "@/lib/selectors";

type LegendKey = "all" | CatKey;

const LEGEND_DEFS: [LegendKey, string, string][] = [
  ["all", "All", "#161616"],
  ["good", "Good", CAT.good.color],
  ["bad", "Bad", CAT.bad.color],
  ["both", "Both", CAT.both.color],
  ["opportunity", "Opportunity", CAT.opportunity.color],
  ["pattern", "Pattern", CAT.pattern.color],
];

export default function SignalMap() {
  const { posts, city, seenLocal } = useStore();
  const [filter, setFilter] = useState<LegendKey>("all");
  const mapRef = useRef<LeafletMap | null>(null);

  useCityEffect(city, () => setFilter("all"));

  const cfg = cityCfg(city);
  const decoratedAll = decorateList(cityPosts(posts, city), seenLocal);
  const mapPosts = decoratedAll.filter((p) => filter === "all" || p.cat === filter);

  // Build / rebuild the Leaflet map whenever the inputs change.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      const el = document.getElementById("gnbn-map");
      if (!el) return;

      // Always tear down any prior instance and recreate cleanly.
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((el as any)._leaflet_id) (el as any)._leaflet_id = null;
      } catch {}
      el.innerHTML = "";

      const map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
      map.setView(cfg.center, cfg.zoom);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd", attribution: "© OpenStreetMap · © CARTO",
      }).addTo(map);

      const pins = posts.filter(
        (p) => p.city === city && typeof p.lat === "number" && (filter === "all" || p.cat === filter)
      );
      pins.forEach((p) => {
        const c = CAT[p.cat] || CAT.signal;
        const m = L.circleMarker([p.lat, p.lng], {
          radius: 9, color: "#fffaf1", weight: 2.5, fillColor: c.color, fillOpacity: 0.95,
        });
        m.addTo(map);
        const safe = String(p.title || "").replace(/</g, "&lt;");
        m.bindPopup(
          `<div style="font-family:'Public Sans',sans-serif;max-width:230px"><div style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.6px;text-transform:uppercase;color:${c.color};margin-bottom:4px">${c.label} · ${p.hood}</div><div style="font-family:'Spectral',serif;font-weight:700;font-size:15px;line-height:1.2;margin-bottom:8px;color:#161616">${safe}</div><a href="/post/${p.id}" style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#19734a;font-weight:600;text-decoration:none">Read the signal →</a></div>`
        );
      });

      mapRef.current = map;
      setTimeout(() => { try { map.invalidateSize(); } catch {} }, 150);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, filter, posts.length]);

  // Final teardown on unmount.
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
      }
    };
  }, []);

  const mapCountLine =
    mapPosts.length + (mapPosts.length === 1 ? " story mapped" : " stories mapped") + " across " + cfg.name;

  return (
    <div>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "46px 24px 8px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>{cfg.short} · Signal Map</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(38px,5vw,60px)", lineHeight: 1, letterSpacing: "-1.8px", margin: "0 0 14px" }}>Where {cfg.name}&apos;s stories are coming from.</h1>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: "#5a564d", maxWidth: 760, margin: "0 0 8px" }}>Every published story mapped to where it was reported. Pins are color-coded by type, so you can see at a glance where wins, concerns, and opportunities are clustering across the city.</p>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, lineHeight: 1.6, color: "#8a857a", maxWidth: 760, margin: "10px 0 0", letterSpacing: "0.2px" }}>How it works: residents submit <strong style={{ color: "#5a564d" }}>signals</strong> (raw reports). Reviewed signals publish as <strong style={{ color: "#5a564d" }}>stories</strong>. Related signals combine into <strong style={{ color: "#6b3fa0" }}>pattern reports</strong>.</p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 24px 64px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {LEGEND_DEFS.map(([key, label, color]) => {
            const active = filter === key;
            const count = key === "all" ? decoratedAll.length : decoratedAll.filter((p) => p.cat === key).length;
            return (
              <button key={key} onClick={() => setFilter(key)} style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${active ? color : "#d8cab2"}`, background: active ? "#fff" : "#fffaf1", borderRadius: 999, padding: "8px 14px", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.4px", color: "#3a362e" }}>
                <span style={{ width: 11, height: 11, borderRadius: 999, background: color, display: "inline-block", flexShrink: 0 }} />
                {label} <span style={{ color: "#8a857a" }}>{count}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
          <div style={{ border: "1px solid #d8cab2", borderRadius: 18, overflow: "hidden", boxShadow: "0 10px 34px rgba(0,0,0,0.05)" }}>
            <div id="gnbn-map" style={{ width: "100%", height: 600, background: "#eee7d8" }} />
          </div>
          <aside className="gnbn-map-aside" style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 18, maxHeight: 633, overflow: "auto" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "#8a857a", marginBottom: 14 }}>{mapCountLine}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {mapPosts.map((p) => (
                <a key={p.id} href={`/post/${p.id}`} style={{ textAlign: "left", cursor: "pointer", display: "flex", gap: 11, alignItems: "flex-start", background: "#fffdf8", border: "1px solid #e4d8c2", borderRadius: 12, padding: "11px 12px", textDecoration: "none" }}>
                  <span style={{ flexShrink: 0, width: 11, height: 11, borderRadius: 999, background: p.catColor, marginTop: 4 }} />
                  <span style={{ minWidth: 0, display: "block" }}>
                    <span style={{ display: "block", fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 15, lineHeight: 1.2, color: "#161616" }}>{p.title}</span>
                    <span style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: "#8a857a", marginTop: 3 }}>{p.hood} · {p.catLabel}</span>
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
