// Pure builders for the one-off transactional emails (welcome, membership,
// story published, partner inquiry). Side-effect free and matched to the
// Saturday Digest look in lib/digest.ts so all of GNBN's mail feels like one
// paper. Each returns { subject, html, text }; the routes call sendEmail().
import { siteUrl } from "./site";

const esc = (s: string) =>
  String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const GREEN = "#19734a";
const RED = "#a33429";
const GOLD = "#9a6a12";
const PAPER = "#f4ecdd";
const INK = "#161616";

export interface Email { subject: string; html: string; text: string; }

// The shared envelope: same card, wordmark, and footer as the digest.
function shell(opts: { eyebrow: string; heading: string; bodyHtml: string }): string {
  const base = siteUrl();
  const wordmark = `<span style="font-family:Georgia,serif;font-weight:800;font-size:22px;letter-spacing:-0.5px"><span style="color:${GREEN}">Good News</span> <span style="color:${RED}">Bad News</span></span>`;
  return `<!doctype html><html><body style="margin:0;background:${PAPER};padding:24px 0">
    <div style="max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #d8cab2;border-radius:18px;overflow:hidden">
      <div style="padding:26px 30px 0">
        ${wordmark}
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#8a857a;margin:16px 0 6px">${esc(opts.eyebrow)}</div>
        <h1 style="font-family:Georgia,serif;font-weight:800;font-size:26px;line-height:1.12;letter-spacing:-0.8px;margin:0 0 14px;color:${INK}">${opts.heading}</h1>
      </div>
      <div style="padding:0 30px 26px">${opts.bodyHtml}</div>
      <div style="padding:16px 30px;border-top:1px solid #e4d8c2;font-family:'Courier New',monospace;font-size:11px;color:#9a857a;line-height:1.6">
        Good News Bad News · A civic signal platform · <a href="${base}" style="color:#9a857a">${esc(base.replace(/^https?:\/\//, ""))}</a>
      </div>
    </div>
  </body></html>`;
}

function para(html: string): string {
  return `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#3a362e;margin:0 0 16px">${html}</p>`;
}
function button(label: string, href: string, color = GREEN): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-family:Georgia,serif;font-weight:700;font-size:15px;padding:12px 24px;border-radius:999px">${esc(label)}</a>`;
}

// ---- 1. Resident welcome (on signup) ----
export function welcomeEmail(name?: string | null): Email {
  const base = siteUrl();
  const heading = name ? `Welcome, ${esc(name)}.` : "Welcome to the desk.";
  return {
    subject: "Your byline is live on Good News Bad News",
    html: shell({
      eyebrow: "New contributor",
      heading,
      bodyHtml:
        para("You just joined the people who report what is actually happening on their blocks, the good and the bad. Every signal you file carries your name, and every story that gets verified makes your city a little more visible to itself.") +
        para("Here is how it works: you file a <strong>signal</strong> (what you saw, and where). Our desk reviews it for safety, no doxxing and no gossip, and verifies it. What survives becomes a <strong>story</strong> your whole city can read.") +
        `<div style="margin:6px 0 0">${button("File your first signal", `${base}/submit`)}</div>`,
    }),
    text: [
      name ? `Welcome, ${name}.` : "Welcome to the desk.",
      "",
      "You just joined the people who report what is actually happening on their blocks, the good and the bad. Every signal you file carries your name.",
      "",
      "File a signal (what you saw, and where). Our desk reviews it for safety and verifies it. What survives becomes a story your whole city can read.",
      "",
      `File your first signal: ${base}/submit`,
    ].join("\n"),
  };
}

// ---- Password reset ----
export function passwordResetEmail(resetUrl: string): Email {
  return {
    subject: "Reset your Good News Bad News password",
    html: shell({
      eyebrow: "Password reset",
      heading: "Reset your password.",
      bodyHtml:
        para("We got a request to reset your password. Use the button below to choose a new one. This link works once and expires in an hour.") +
        `<div style="margin:6px 0 0">${button("Choose a new password", resetUrl)}</div>` +
        para("If you didn't request this, you can safely ignore this email, your password stays the same."),
    }),
    text: [
      "Reset your password.",
      "",
      "We got a request to reset your password. Open this link to choose a new one (works once, expires in an hour):",
      resetUrl,
      "",
      "If you didn't request this, ignore this email, your password stays the same.",
    ].join("\n"),
  };
}

// ---- 2. Membership welcome (on Stripe subscription activation) ----
export function membershipWelcomeEmail(): Email {
  const base = siteUrl();
  return {
    subject: "You're a member of Good News Bad News",
    html: shell({
      eyebrow: "Membership active",
      heading: "You're in. Thank you.",
      bodyHtml:
        para("Your membership is active. Every full story is unlocked, and you have <strong>15 posts a month</strong> included to file your own signals. Post beyond that and it is fifty cents each.") +
        para("The best part: when a newsroom licenses a story you filed, you get paid. The more you report, the more your city sees, and the more that work is worth.") +
        `<div style="margin:6px 0 0">${button("Go to your account", `${base}/account`)}</div>`,
    }),
    text: [
      "You're in. Thank you.",
      "",
      "Your membership is active. Every full story is unlocked, and you have 15 posts a month included. Post beyond that and it is fifty cents each.",
      "",
      "When a newsroom licenses a story you filed, you get paid.",
      "",
      `Your account: ${base}/account`,
    ].join("\n"),
  };
}

// ---- 3. Story published (to the author) ----
export function storyPublishedEmail(title: string, postUrl: string): Email {
  return {
    subject: "Your story is live",
    html: shell({
      eyebrow: "Published",
      heading: "Your story is live.",
      bodyHtml:
        para(`&ldquo;<strong>${esc(title)}</strong>&rdquo; passed review and is now published to the public feed and the city map, credited to you.`) +
        para("This is also the version a partner newsroom can license. If it gets picked up, you get paid for it.") +
        `<div style="margin:6px 0 0">${button("View your story", postUrl)}</div>`,
    }),
    text: [
      "Your story is live.",
      "",
      `"${title}" passed review and is now published to the public feed and the city map, credited to you.`,
      "",
      "This is also the version a partner newsroom can license. If it gets picked up, you get paid for it.",
      "",
      `View your story: ${postUrl}`,
    ].join("\n"),
  };
}

// ---- 4a. Partner inquiry: internal notification ----
export function partnerNotifyEmail(inq: {
  org: string; city: string; interest: string; email: string; note: string;
}): Email {
  const row = (k: string, v: string) =>
    `<div style="margin:0 0 10px"><span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8a857a">${k}</span><br><span style="font-family:Georgia,serif;font-size:16px;color:${INK}">${v}</span></div>`;
  return {
    subject: `Newsroom inquiry: ${inq.org}`,
    html: shell({
      eyebrow: "New partner lead",
      heading: "New newsroom inquiry",
      bodyHtml:
        row("Newsroom", esc(inq.org)) +
        row("Market", esc(inq.city)) +
        row("Interested in", esc(inq.interest)) +
        row("Contact", `<a href="mailto:${esc(inq.email)}" style="color:${GREEN}">${esc(inq.email)}</a>`) +
        (inq.note ? `<div style="margin-top:14px;padding:14px 16px;background:${PAPER};border-radius:10px;font-family:Georgia,serif;font-size:15px;line-height:1.55;color:#3a362e">${esc(inq.note)}</div>` : ""),
    }),
    text: [
      "New newsroom inquiry",
      "",
      `Newsroom: ${inq.org}`,
      `Market: ${inq.city}`,
      `Interested in: ${inq.interest}`,
      `Contact: ${inq.email}`,
      inq.note ? `\nNote: ${inq.note}` : "",
    ].join("\n"),
  };
}

// ---- 4b. Partner inquiry: acknowledgement to the newsroom ----
export function partnerAckEmail(org: string): Email {
  return {
    subject: "Thanks for reaching out to Good News Bad News",
    html: shell({
      eyebrow: "We got your note",
      heading: "Thanks for reaching out.",
      bodyHtml:
        para(`We received your note from <strong>${esc(org)}</strong> and will follow up shortly. We are opening a small number of founding newsroom partnerships, one paper per market, so there is real value in getting on the calendar early.`) +
        para("In the meantime, the live markets - Spokane, Honolulu, and Post Falls - show exactly what a licensed local stream looks like."),
    }),
    text: [
      "Thanks for reaching out.",
      "",
      `We received your note from ${org} and will follow up shortly. We are opening a small number of founding newsroom partnerships, one paper per market.`,
      "",
      "The live markets - Spokane, Honolulu, and Post Falls - show what a licensed local stream looks like.",
    ].join("\n"),
  };
}
