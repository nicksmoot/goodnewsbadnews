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

export function Wordmark({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", fontFamily: "Spectral", fontSize: size, fontWeight: 800, letterSpacing: -1 }}>
      <span style={{ color: "#19734a" }}>Good News</span>
      <span>&nbsp;</span>
      <span style={{ color: "#a33429" }}>Bad News</span>
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
  return (
    <div
      style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "#f4ecdd", padding: "64px 72px 56px", justifyContent: "space-between",
        borderTop: `18px solid ${accent}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 25, letterSpacing: 4, color: kickerColor, textTransform: "uppercase" }}>
            {kicker}
          </div>
          {/* newspaper double rule */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
            <div style={{ display: "flex", height: 3, background: "#161616" }} />
            <div style={{ display: "flex", height: 1, background: "#161616", marginTop: 4 }} />
          </div>
        </div>
        <div
          style={{
            display: "flex", fontFamily: "Spectral", fontSize: headlineSize, fontWeight: 800,
            color: "#161616", lineHeight: 1.04, marginTop: 36, letterSpacing: -2,
          }}
        >
          {headline}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Wordmark />
        <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontSize: 20, color: "#6b675e", letterSpacing: 3, textTransform: "uppercase" }}>
          {footerRight}
        </div>
      </div>
    </div>
  );
}
