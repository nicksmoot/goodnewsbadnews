import type { Contributor, Signal } from "./types";

export const neighborhoods = [
  { name: "Downtown", slug: "downtown", summary: "Transit, public space, small business, housing, and civic core signals." },
  { name: "North Side", slug: "north-side", summary: "Schools, parks, arterial safety, district services, and neighborhood upkeep." },
  { name: "South Hill", slug: "south-hill", summary: "Tree canopy, traffic calming, local commerce, schools, and parks." },
  { name: "Spokane Valley", slug: "spokane-valley", summary: "Regional growth, infrastructure, business openings, and service requests." }
];

export const signals: Signal[] = [
  {
    id: "sig-001",
    title: "Downtown crossing signal repairs completed near Riverside",
    body: "Residents reported repeated timing failures at a busy pedestrian crossing. City crews confirmed the repair window and marked the issue resolved after a field check.",
    signalType: "GOOD",
    city: "Spokane",
    neighborhood: "Downtown",
    status: "RESOLVED",
    confidenceLevel: "Public record",
    sourceNote: "Verified through city service update and resident follow-up.",
    createdAt: "2026-06-06",
    helpfulVotes: 47,
    civicScore: 91
  },
  {
    id: "sig-002",
    title: "Repeated near-misses reported at school-zone turn lane",
    body: "Three separate residents submitted time-stamped reports about unsafe left turns during morning drop-off. Editors are seeking additional observations before publication escalation.",
    signalType: "WARNING",
    city: "Spokane",
    neighborhood: "North Side",
    status: "PUBLISHED",
    confidenceLevel: "Needs more signal",
    responseRequested: "Spokane Streets and school administrators",
    sourceNote: "Names of minors are not collected or published.",
    createdAt: "2026-06-05",
    helpfulVotes: 63,
    civicScore: 84
  },
  {
    id: "sig-003",
    title: "Vacant storefront cluster could support a shared youth arts space",
    body: "Contributors identified a corridor with compatible vacant spaces, nearby transit, and interested arts groups. The next step is a property owner and nonprofit response.",
    signalType: "OPPORTUNITY",
    city: "Spokane",
    neighborhood: "South Hill",
    status: "PUBLISHED",
    confidenceLevel: "Verified by editor",
    responseRequested: "Arts nonprofits and property owners",
    sourceNote: "Opportunity signal reviewed for financial claims and conflicts.",
    createdAt: "2026-06-04",
    helpfulVotes: 39,
    civicScore: 77
  },
  {
    id: "sig-004",
    title: "New food pantry pickup hours reduce Saturday lines",
    body: "A community partner changed pickup routing after residents documented congestion. Volunteers report shorter waits and fewer blocked sidewalks this week.",
    signalType: "GOOD",
    city: "Spokane",
    neighborhood: "Spokane Valley",
    status: "PUBLISHED",
    confidenceLevel: "Verified by editor",
    sourceNote: "Confirmed with organizing volunteers and published hours.",
    createdAt: "2026-06-03",
    helpfulVotes: 28,
    civicScore: 88
  }
];

export const contributors: Contributor[] = [
  { name: "Avery M.", neighborhood: "Downtown", role: "Transit observer", civicScore: 94, verifiedSignals: 18 },
  { name: "J. Rivera", neighborhood: "North Side", role: "School-route contributor", civicScore: 89, verifiedSignals: 14 },
  { name: "Morgan T.", neighborhood: "South Hill", role: "Parks and canopy", civicScore: 86, verifiedSignals: 11 }
];

export const corrections = [
  { signal: "Downtown crossing signal repairs completed near Riverside", status: "Closed", note: "Updated repair date after city record review." },
  { signal: "Vacant storefront cluster could support a shared youth arts space", status: "Open", note: "Awaiting property availability clarification." }
];
