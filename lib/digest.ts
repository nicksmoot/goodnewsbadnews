// Pure builder for a Saturday Digest issue. Given the week's posts, a tier, and
// a preference, it returns the email subject + HTML + text. Kept side-effect
// free so it's easy to test and preview. The send route (app/api/digest/send)
// supplies the posts and calls sendEmail().

export type Tier = "teaser" | "full";

export interface DigestPost {
  id: string; // public post id, e.g. "p-abc" or a seed id
  cat: string; // good | bad | both | opportunity | ...
  title: string;
  summary: string;
  hood: string;
  by: string;
}

export interface IssueInput {
  cityName: string;
  tier: Tier;
  preference: string; // "All Signals" | "Good Signals Only" | "Warning Signals Only" | "Opportunity Signals Only"
  posts: DigestPost[];
  baseUrl: string;
  issueLabel: string; // e.g. "Week of July 8"
  unsubscribeUrl?: string;
}

const esc = (s: string) =>
  String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const GREEN = "#19734a";
const RED = "#a33429";
const GOLD = "#9a6a12";
const BLUE = "#285d83";
const PAPER = "#f4ecdd";
const INK = "#161616";

interface SectionDef { key: string; title: string; color: string; cat: string; max: number }

const ALL_SECTIONS: SectionDef[] = [
  { key: "good", title: "The wins", color: GREEN, cat: "good", max: 3 },
  { key: "bad", title: "The concerns", color: RED, cat: "bad", max: 3 },
  { key: "both", title: "One complicated story", color: GOLD, cat: "both", max: 1 },
  { key: "opportunity", title: "Ways to help", color: BLUE, cat: "opportunity", max: 3 },
];

// Which sections a subscriber's preference includes.
function sectionsFor(preference: string): SectionDef[] {
  switch (preference) {
    case "Good Signals Only": return ALL_SECTIONS.filter((s) => s.key === "good");
    case "Warning Signals Only": return ALL_SECTIONS.filter((s) => s.key === "bad");
    case "Opportunity Signals Only": return ALL_SECTIONS.filter((s) => s.key === "opportunity");
    default: return ALL_SECTIONS;
  }
}

function renderSection(def: SectionDef, posts: DigestPost[], tier: Tier, baseUrl: string): string {
  const items = posts.filter((p) => p.cat === def.cat).slice(0, def.max);
  if (!items.length) return "";
  const rows = items
    .map((p) => {
      const url = `${baseUrl}/post/${encodeURIComponent(p.id)}`;
      const summary =
        tier === "full" && p.summary && p.summary !== p.title
          ? `<div style="font-family:Georgia,serif;font-size:15px;line-height:1.55;color:#3a362e;margin:5px 0 0">${esc(p.summary)}</div>`
          : "";
      return `<div style="margin:0 0 16px">
        <a href="${url}" style="font-family:Georgia,serif;font-weight:700;font-size:18px;line-height:1.25;color:${INK};text-decoration:none">${esc(p.title)}</a>
        <div style="font-family:'Courier New',monospace;font-size:11px;color:#8a857a;margin-top:3px">${esc(p.hood)} &middot; ${esc(p.by)}</div>
        ${summary}
      </div>`;
    })
    .join("");
  return `<div style="margin:0 0 28px">
    <div style="font-family:'Courier New',monospace;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${def.color};border-bottom:2px solid ${def.color};padding-bottom:6px;margin-bottom:14px">${esc(def.title)}</div>
    ${rows}
  </div>`;
}

export function buildIssue(input: IssueInput): { subject: string; html: string; text: string } {
  const { cityName, tier, preference, posts, baseUrl, issueLabel, unsubscribeUrl } = input;
  const subject = `The Good, the Bad, and the Real ${cityName} · ${issueLabel}`;

  const sections = sectionsFor(preference)
    .map((s) => renderSection(s, posts, tier, baseUrl))
    .filter(Boolean)
    .join("");

  const body =
    sections ||
    `<p style="font-family:Georgia,serif;font-size:16px;color:#3a362e">A quiet week on the board. New signals are always coming in at <a href="${baseUrl}/latest" style="color:${GREEN}">the feed</a>.</p>`;

  // Teaser subscribers get an upsell; members get a thank-you.
  const footerCta =
    tier === "full"
      ? `<p style="font-family:Georgia,serif;font-size:14px;color:#5a564d;line-height:1.55">You are getting the full members' edition. Thank you for keeping local reporting alive.</p>`
      : `<div style="background:${INK};border-radius:14px;padding:20px 22px;margin:6px 0 0">
           <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#c99a2e;margin-bottom:8px">You are reading the free teaser</div>
           <div style="font-family:Georgia,serif;font-size:16px;color:#f4ecdd;line-height:1.5;margin-bottom:14px">Members get every story written out in full, no paywall. Support the reporting for $5 a month.</div>
           <a href="${baseUrl}/pricing" style="display:inline-block;background:${GREEN};color:#fff;text-decoration:none;font-family:Georgia,serif;font-weight:700;font-size:15px;padding:11px 22px;border-radius:999px">Become a member</a>
         </div>`;

  const wordmark = `<span style="font-family:Georgia,serif;font-weight:800;font-size:22px;letter-spacing:-0.5px"><span style="color:${GREEN}">Good News</span> <span style="color:${RED}">Bad News</span></span>`;

  const html = `<!doctype html><html><body style="margin:0;background:${PAPER};padding:24px 0">
    <div style="max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #d8cab2;border-radius:18px;overflow:hidden">
      <div style="padding:26px 30px 0">
        ${wordmark}
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#8a857a;margin:16px 0 4px">The Saturday Digest · ${esc(cityName)}</div>
        <h1 style="font-family:Georgia,serif;font-weight:800;font-size:26px;line-height:1.1;letter-spacing:-0.8px;margin:0 0 4px;color:${INK}">The Good, the Bad, and the Real ${esc(cityName)}.</h1>
        <div style="font-family:'Courier New',monospace;font-size:12px;color:#8a857a;margin-bottom:22px">${esc(issueLabel)}</div>
      </div>
      <div style="padding:0 30px 8px">${body}</div>
      <div style="padding:0 30px 26px">${footerCta}</div>
      <div style="padding:16px 30px;border-top:1px solid #e4d8c2;font-family:'Courier New',monospace;font-size:11px;color:#9a857a;line-height:1.6">
        Good News Bad News · A civic signal platform · <a href="${baseUrl}" style="color:#9a857a">${esc(baseUrl.replace(/^https?:\/\//, ""))}</a>
        ${unsubscribeUrl ? ` · <a href="${esc(unsubscribeUrl)}" style="color:#9a857a">Unsubscribe</a>` : ""}
      </div>
    </div>
  </body></html>`;

  const textLines: string[] = [`${subject}`, ""];
  for (const s of sectionsFor(preference)) {
    const items = posts.filter((p) => p.cat === s.cat).slice(0, s.max);
    if (!items.length) continue;
    textLines.push(s.title.toUpperCase());
    for (const p of items) {
      textLines.push(`- ${p.title} (${p.hood}) ${baseUrl}/post/${p.id}`);
      if (tier === "full" && p.summary && p.summary !== p.title) textLines.push(`  ${p.summary}`);
    }
    textLines.push("");
  }
  if (tier === "teaser") textLines.push(`Members get every story in full. Join: ${baseUrl}/pricing`);
  const text = textLines.join("\n");

  return { subject, html, text };
}
