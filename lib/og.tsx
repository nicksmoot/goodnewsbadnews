// Shared helpers for the social share tiles (OpenGraph images).
// Loads the brand fonts once per build; falls back to system fonts if the
// fetch fails so image generation never breaks a deploy.

export const OG_SIZE = { width: 1200, height: 630 };

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 600 | 700 | 800; style: "normal" };

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
    // No browser UA -> Google serves truetype, which satori can embed.
    const css = await fetch(cssUrl).then((r) => r.text());
    const m = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
    if (!m) return null;
    return await fetch(m[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

let cached: Promise<OgFont[]> | null = null;

export function ogFonts(): Promise<OgFont[]> {
  if (!cached) {
    cached = (async () => {
      const [spectral, mono] = await Promise.all([
        fetchGoogleFont("Spectral", 800),
        fetchGoogleFont("IBM Plex Mono", 600),
      ]);
      const fonts: OgFont[] = [];
      if (spectral) fonts.push({ name: "Spectral", data: spectral, weight: 800, style: "normal" });
      if (mono) fonts.push({ name: "IBM Plex Mono", data: mono, weight: 600, style: "normal" });
      return fonts;
    })();
  }
  return cached;
}

// Shared visual pieces -------------------------------------------------------

// Brighter variants of the brand palette for text on the dark card.
const BRIGHT: Record<string, string> = {
  "#19734a": "#5cc491", // good
  "#a33429": "#e08a79", // bad
  "#c99a2e": "#e8c46f", // both / gold
  "#8a5e0f": "#e8c46f",
  "#285d83": "#8fbfe0", // opportunity
  "#6b3fa0": "#b79ae0", // pattern
  "#5a564d": "#b3a892", // signal
};
const bright = (c: string) => BRIGHT[c] || "#e8c46f";

export function Wordmark({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", fontFamily: "Spectral", fontSize: size, fontWeight: 800, letterSpacing: -1 }}>
      <span style={{ color: "#5cc491" }}>Good News</span>
      <span style={{ display: "flex", padding: `0 ${Math.round(size * 0.14)}px`, color: "#f4ecdd" }}>/</span>
      <span style={{ color: "#e08a79" }}>Bad News</span>
    </div>
  );
}

export function Tile({
  accent,
  kicker,
  kickerColor,
  headline,
  headlineSize,
  footerRight,
}: {
  accent: string;
  kicker: string;
  kickerColor: string;
  headline: string;
  headlineSize: number;
  footerRight: string;
}) {
  // First kicker segment gets the accent color (like the live wire); the rest
  // stays muted so the category reads at a glance.
  const sep = kicker.indexOf("\u00B7");
  const kickerLead = sep > 0 ? kicker.slice(0, sep).trim() : kicker;
  const kickerRest = sep > 0 ? kicker.slice(sep).trim() : "";

  return (
    <div
      style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "#161616", position: "relative", overflow: "hidden",
      }}
    >
      {/* The split ledger band: the brand's duality as the top edge */}
      <div style={{ display: "flex", height: 14, width: "100%" }}>
        <div style={{ display: "flex", width: "50%", background: "#19734a" }} />
        <div style={{ display: "flex", width: "50%", background: "#a33429" }} />
      </div>

      {/* Giant ghosted brand slash as texture */}
      <div
        style={{
          display: "flex", position: "absolute", right: 30, top: -150,
          fontFamily: "Spectral", fontWeight: 800, fontSize: 860, lineHeight: 1,
          color: "#f4ecdd", opacity: 0.06,
        }}
      >
        /
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", padding: "56px 72px 48px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "IBM Plex Mono", fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>
            <span style={{ color: bright(kickerColor || accent), display: "flex" }}>{kickerLead}</span>
            {kickerRest ? <span style={{ color: "#8a857a", marginLeft: 14, display: "flex" }}>{kickerRest}</span> : null}
          </div>
          <div
            style={{
              display: "flex", fontFamily: "Spectral", fontSize: headlineSize, fontWeight: 800,
              color: "#f4ecdd", lineHeight: 1.04, marginTop: 34, letterSpacing: -2, maxWidth: 1000,
            }}
          >
            {headline}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* The ledger rule: small split signature above the wordmark row */}
          <div style={{ display: "flex", height: 5, width: 118, marginBottom: 26, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ display: "flex", width: "50%", background: "#5cc491" }} />
            <div style={{ display: "flex", width: "50%", background: "#e08a79" }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <Wordmark />
            <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 20, color: "#8a857a", letterSpacing: 3, textTransform: "uppercase" }}>
              {footerRight}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
