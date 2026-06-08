import { Resend } from "resend";
import { signals } from "./data";

export const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

export function renderSaturdayDigest(preference: "GOOD" | "WARNING" | "OPPORTUNITY" | "ALL" = "ALL") {
  const selected = preference === "ALL" ? signals : signals.filter((signal) => signal.signalType === preference);
  return {
    subject: "Saturday briefing: what Spokane residents are seeing",
    html: `<h1>Good News Bad News</h1><p>See it. Verify it. Solve it.</p>${selected.map((signal) => `<h2>${signal.title}</h2><p>${signal.body}</p>`).join("")}`
  };
}
