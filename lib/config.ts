// Configurable product flags — ported from the prototype's `data-props`.
// In production these become server-driven settings (see design_handoff_gnbn/INTEGRATION.md).
//
//  - paidModel ........... turn on the paid-submission flow (Stripe one-time $0.50 anti-spam fee)
//  - showAdmin ........... show the Moderation link (client convenience only; ENFORCE access server-side)
//  - requireSafetyCheck .. require the 3 resident safety attestations before a submission can advance
//  - freeSeedStories ..... while seeding a new market, the earliest N published stories in each
//                          city are free to read in full for everyone (no membership/unlock). The
//                          paywall only engages once a city has more than N published stories.

export const config = {
  paidModel: true,
  showAdmin: true,
  requireSafetyCheck: true,
  freeSeedStories: 50,
} as const;
