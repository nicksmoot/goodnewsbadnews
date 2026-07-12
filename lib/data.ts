// ============================================================================
// Good News Bad News — data model, seed data, and pure helpers.
// Ported faithfully from the design prototype (GoodNewsBadNews.dc.html).
// ============================================================================

import { BODIES } from "./bodies";

export type CatKey =
  | "good"
  | "bad"
  | "both"
  | "opportunity"
  | "signal"
  | "pattern";

export type CityKey = "spokane" | "honolulu";

export interface Post {
  id: string;
  cat: CatKey;
  title: string;
  summary: string;
  topics: string[];
  hood: string;
  status: string;
  by: string;
  helpful: number;
  age: number;
  photo: string;
  body: string[];
  next: string;
  city: CityKey;
  lat: number;
  lng: number;
  freeSeed?: boolean; // launch mechanic: readable in full by everyone (see config.freeSeedStories)
  seeded?: boolean; // founding example written by the desk (labeled in the UI)
}

export interface ScanResult {
  level: "clean" | "flag";
  msg: string;
}

export type WorkflowState = "New" | "Review" | "Verified" | "Published";

export interface QueueItem {
  id: string;
  wf: WorkflowState;
  cat: CatKey;
  title: string;
  topic: string;
  hood: string;
  by: string;
  age: number;
  tags?: string[];
  photo?: string;
  body: string[];
  status: string;
  scan: ScanResult;
  city: CityKey;
  lat?: number;
  lng?: number;
}

export interface CatStyle {
  label: string;
  color: string;
  bg: string;
  border: string;
}

export interface CityConfig {
  key: CityKey;
  name: string;
  region: string;
  short: string;
  center: [number, number];
  zoom: number;
  activeArea: string;
  hoods: string[];
}

// ---------------------------------------------------------------------------
// Static design tokens / vocab
// ---------------------------------------------------------------------------

export const CAT: Record<CatKey, CatStyle> = {
  good: { label: "Good News", color: "#19734a", bg: "#19734a14", border: "#19734a59" },
  bad: { label: "Bad News", color: "#a33429", bg: "#a3342914", border: "#a3342959" },
  both: { label: "Both", color: "#8a5e0f", bg: "#c99a2e21", border: "#c99a2e80" },
  opportunity: { label: "Opportunity", color: "#285d83", bg: "#285d831a", border: "#285d834d" },
  signal: { label: "Signal", color: "#5a564d", bg: "#5a564d12", border: "#5a564d40" },
  pattern: { label: "Pattern", color: "#6b3fa0", bg: "#6b3fa014", border: "#6b3fa045" },
};

export const STATUS: Record<string, string> = {
  Submitted: "#8a857a",
  "Under Review": "#9a6a12",
  Reviewed: "#285d83",
  Verified: "#19734a",
  Updated: "#285d83",
  Resolved: "#19734a",
  "Background Signal": "#8a857a",
  "Needs More Info": "#a33429",
};

export const TOPICS = [
  "Housing", "Homelessness", "Public safety", "Schools", "Youth", "Health",
  "Business", "Jobs", "Downtown", "Transportation", "Parks", "Faith/community",
  "Government", "Recovery", "Mental health", "Events", "Arts/culture", "Environment",
];

export const HOODS = [
  "Downtown", "North Side", "South Hill", "Spokane Valley", "West Central",
  "East Central", "Logan", "Hillyard", "Browne's Addition",
];

export const CITIES: Record<CityKey, CityConfig> = {
  spokane: {
    key: "spokane", name: "Spokane", region: "Washington", short: "Spokane, WA",
    center: [47.6588, -117.426], zoom: 12, activeArea: "Downtown",
    hoods: ["Downtown", "North Side", "South Hill", "Spokane Valley", "West Central", "East Central", "Logan", "Hillyard", "Browne's Addition"],
  },
  honolulu: {
    key: "honolulu", name: "Honolulu", region: "Hawaiʻi", short: "Honolulu, HI",
    center: [21.3045, -157.848], zoom: 12, activeArea: "Chinatown",
    hoods: ["Waikīkī", "Kakaʻako", "Chinatown", "Kalihi", "Mānoa", "Kaimukī", "Ala Moana", "Kapālama", "Salt Lake", "Hawaiʻi Kai"],
  },
};

const HOOD_COORDS: Record<CityKey, Record<string, [number, number]>> = {
  spokane: {
    "Downtown": [47.6588, -117.426], "North Side": [47.692, -117.409], "South Hill": [47.629, -117.404],
    "Spokane Valley": [47.661, -117.239], "West Central": [47.672, -117.443], "East Central": [47.661, -117.376],
    "Logan": [47.67, -117.403], "Hillyard": [47.703, -117.376], "Browne's Addition": [47.654, -117.44],
  },
  honolulu: {
    "Waikīkī": [21.2793, -157.8293], "Kakaʻako": [21.295, -157.854], "Chinatown": [21.314, -157.861],
    "Kalihi": [21.334, -157.873], "Mānoa": [21.314, -157.801], "Kaimukī": [21.279, -157.803],
    "Ala Moana": [21.291, -157.843], "Kapālama": [21.326, -157.877], "Salt Lake": [21.352, -157.887],
    "Hawaiʻi Kai": [21.281, -157.708],
  },
};

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

export function cityCfg(city: CityKey): CityConfig {
  return CITIES[city] || CITIES.spokane;
}

export function coordFor(city: CityKey, hood: string, id: string): { lat: number; lng: number } {
  const t = (HOOD_COORDS[city] && HOOD_COORDS[city][hood]) || cityCfg(city).center;
  const hsh = String(id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const dy = (((hsh * 37) % 100) / 100 - 0.5) * 0.011;
  const dx = (((hsh * 61) % 100) / 100 - 0.5) * 0.015;
  return { lat: t[0] + dy, lng: t[1] + dx };
}

// Great-circle distance in miles between two lat/lng points (Haversine).
// Used by the Signal Map to read pins outward from the reader's location.
export function haversineMi(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8; // Earth radius, miles
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Which live city is the reader closest to? Lets "near me" jump to the right
// city automatically instead of showing far-away pins.
export function nearestCity(loc: [number, number]): CityKey {
  let best: CityKey = "spokane";
  let bestD = Infinity;
  (Object.keys(CITIES) as CityKey[]).forEach((k) => {
    const d = haversineMi(loc, CITIES[k].center);
    if (d < bestD) { bestD = d; best = k; }
  });
  return best;
}

// Human-friendly distance label for the pin list.
export function distanceLabel(mi: number): string {
  if (mi < 0.1) return "right here";
  if (mi < 10) return `${mi.toFixed(1)} mi away`;
  return `${Math.round(mi)} mi away`;
}

export function typeToCat(t: string): CatKey {
  const m: Record<string, CatKey> = {
    "Good News": "good", "Bad News": "bad", "Both": "both", "Opportunity": "opportunity",
    "Signal": "signal", "Pattern / Trend": "pattern", "Question": "signal",
  };
  return m[t] || "signal";
}

// ---------------------------------------------------------------------------
// Automated safety scan (deterministic heuristic). In production this is paired
// with an LLM moderation pass — see INTEGRATION.md §4.
// ---------------------------------------------------------------------------

export function scan(text: string): ScanResult {
  const flags: string[] = [];
  const t = text || "";
  if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(t)) flags.push("a phone number");
  if (/\b\d{1,6}\s+[A-Z][a-z]+\s+(St|Street|Ave|Avenue|Rd|Road|Blvd|Dr|Drive|Ln|Lane|Ct|Way|Pl)\b/i.test(t))
    flags.push("a private street address");
  if (/\b(criminal|pedophile|thief|stole|stealing|junkie|addict|drunk|crazy)\b/i.test(t))
    flags.push("language that could be a personal accusation");
  if (/\b(my kid|my son|my daughter|the student|a kid named|named)\s+[A-Z][a-z]+/i.test(t))
    flags.push("what looks like a named individual or minor");
  if (/@[\w.-]+\.\w+/.test(t)) flags.push("an email address");
  if (/\b(cheat(ed|ing|er)?|affair|mistress|divorce|custody|ex-?(wife|husband|girlfriend|boyfriend)|home ?wrecker|sleeping with|hooking up)\b/i.test(t))
    flags.push("a private personal dispute (this is a platform for public civic stories, not private relationships)");
  if (flags.length === 0) {
    return { level: "clean", msg: "No risk flags detected. This reads as a public, civic story about the city - it has been queued." };
  }
  return {
    level: "flag",
    msg: "Our automated scan flagged " + flags.join(", ") +
      ". We focus on public civic life, not private individuals or personal disputes - this will be reviewed and may be edited or held before publishing.",
  };
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SPOKANE_PHOTOS: Record<string, string> = {
  "park-cleanup": "https://picsum.photos/seed/gnbnpark/900/560",
  "streetlights-monroe": "https://picsum.photos/seed/gnbnstreet/900/560",
  "shelter-mixed": "https://picsum.photos/seed/gnbnshelter/900/560",
  "robotics-mentors": "https://picsum.photos/seed/gnbnrobotics/900/560",
  "hiring-20": "https://picsum.photos/seed/gnbnjobs/900/560",
};

type SeedTuple = [
  id: string, cat: CatKey, title: string, summary: string, topics: string[],
  hood: string, status: string, by: string, helpful: number, age: number,
  body: string[] | null, next: string | null
];

const DEFAULT_NEXT =
  "This signal is open for more reports. Residents can add detail, and organizations can respond.";

function buildSpokane(): Post[] {
  const rows: SeedTuple[] = [
    ["breakfast-club", "good", "A teacher started a quiet breakfast club before school", "A local teacher noticed students arriving early with nowhere to go and built a simple morning table that has become a place of stability.", ["Schools", "Youth"], "North Side", "Verified", "Verified teacher", 31, 2,
      ["A teacher at a North Side elementary school noticed a small group of students arriving 30–40 minutes before the doors opened, often without having eaten.", "Rather than send them back outside, she set up a quiet table in the cafeteria with cereal, fruit, and a few board games. Word spread, and a handful of parents now drop off extra supplies each week.", "Three months in, staff say the students who use the table arrive calmer and are less likely to be sent to the office before lunch."],
      "Verified through the school and two staff members. We are tracking whether other Spokane schools have informal versions of this that could be supported."],
    ["sunday-gym", "good", "A coach opened a Sunday gym for kids with nowhere to train", "A volunteer coach is using open gym time to help students build discipline, confidence, and community on weekends.", ["Youth", "Parks"], "North Side", "Reviewed", "Coach contributor", 22, 3, null,
      "Reviewed for standards. The coach has asked for help with equipment and a second adult volunteer - see the Opportunities feed."],
    ["hiring-20", "good", "A local business hired 20 young people for the summer", "A downtown employer built a structured summer program pairing first jobs with mentorship.", ["Jobs", "Youth", "Business"], "Downtown", "Verified", "Business owner", 18, 5, null, null],
    ["park-cleanup", "good", "A park cleanup brought out 80 residents", "A neighborhood-organized cleanup drew far more volunteers than expected, and organizers want to make it monthly.", ["Parks", "Environment"], "South Hill", "Verified", "Neighborhood volunteer", 27, 6, null, null],
    ["warming-center", "good", "A church opened a warming center on the coldest nights", "A faith community quietly opened its hall as a warming center, coordinating with two nearby nonprofits.", ["Faith/community", "Homelessness"], "West Central", "Reviewed", "Faith leader", 15, 7, null, null],
    ["library-teens", "good", "The branch library became an after-school anchor", "Staff report a steady, well-behaved crowd of teens using the branch for homework and a warm place to be.", ["Youth", "Schools"], "East Central", "Reviewed", "Resident", 9, 8, null, null],
    ["streetlights-monroe", "bad", "More broken streetlights reported near Monroe", "Multiple residents have reported dark blocks near Monroe and Montgomery; the issue has been submitted for review and may be updated as more information comes in.", ["Public safety", "Transportation"], "North Side", "Under Review", "3 residents", 14, 1,
      ["Several residents independently reported that a stretch of blocks near Monroe and Montgomery has had multiple streetlights out for weeks.", "One contributor walks the route at night and described specific intersections where visibility is poor. We have not independently confirmed the cause or the city status.", "We are logging additional reports to understand how widespread the outage is before raising it as a pattern."],
      "We are collecting more location detail. If you have seen this too, add the specific cross-streets so we can map the affected area."],
    ["motel-block", "bad", "Responders are seeing repeat calls from the same motel block", "A contributor describes a pattern of repeated emergency calls around one corridor and asks whether the city is tracking it clearly. No private names are published.", ["Public safety", "Health"], "Downtown", "Under Review", "Anonymous, privately verified", 19, 2, null,
      "Reframed as a system-level pattern. We do not publish private individuals. We are checking whether this overlaps with other downtown reports."],
    ["downtown-theft", "bad", "Downtown businesses report more theft but little attention", "Several businesses describe a rising sense of disorder that has not yet shown up in a formal citywide conversation.", ["Business", "Public safety", "Downtown"], "Downtown", "Under Review", "Owner contributor", 12, 3, null, null],
    ["bus-stop-dark", "bad", "A bus stop has become unsafe after dark", "Riders report a specific stop where lighting and visibility have made waiting feel unsafe at night.", ["Transportation", "Public safety"], "East Central", "Reviewed", "Transit rider", 11, 4, null, null],
    ["restroom-closed", "bad", "A public restroom has been closed for months", "Park users report a restroom that has been locked for an extended period with no posted timeline.", ["Parks", "Government"], "Spokane Valley", "Submitted", "Resident", 6, 5, null, null],
    ["bullying-near-school", "bad", "Parents report recurring conflict near a school", "Several parents describe a recurring after-school issue near a campus and are asking for adult presence at dismissal.", ["Schools", "Youth"], "Hillyard", "Under Review", "2 parents", 8, 6, null,
      "Handled carefully - no minors are named. We are checking whether the school is aware and what supervision exists at dismissal."],
    ["program-overwhelmed", "bad", "A food program says it is overwhelmed", "A nonprofit reports demand outpacing supply and is asking for coordinated help rather than one-off donations.", ["Homelessness", "Health"], "West Central", "Reviewed", "Nonprofit staff", 13, 7, null, null],
    ["shelter-mixed", "both", "A new shelter opened downtown - more beds, but poor communication", "Good news: more beds came online. Bad news: neighbors say communication about the opening was poor. Both are true.", ["Homelessness", "Downtown"], "Downtown", "Verified", "Multiple contributors", 24, 2,
      ["A new shelter opened downtown this month, adding a meaningful number of beds during a stretch of cold weather.", "At the same time, several neighboring residents and businesses said they learned about the opening only after it happened, and that there was no clear point of contact for questions or concerns.", "Both things appear to be true at once: a real increase in capacity, and a real breakdown in communication. We are tracking how the operator and neighbors work it out."],
      "We have reached out for the operator's side and will update this story. Neighbors can submit specific questions they want answered."],
    ["housing-infra", "both", "New housing is going up, but neighbors worry about infrastructure", "Construction is adding units the city needs, while nearby residents raise real concerns about traffic and drainage.", ["Housing", "Transportation"], "Spokane Valley", "Reviewed", "Resident", 16, 4, null, null],
    ["downtown-traffic", "both", "Downtown foot traffic is up, but security costs are rising", "More people are coming downtown - a genuine win - while some small businesses say they are spending more on security.", ["Downtown", "Business"], "Downtown", "Reviewed", "Owner contributor", 14, 5, null, null],
    ["school-mental-health", "both", "A school added mental-health resources, but waitlists remain long", "The added support is real and welcome; the waitlist shows the need is bigger than the new capacity.", ["Schools", "Mental health"], "South Hill", "Verified", "Teacher", 17, 6, null, null],
    ["city-program-confusing", "both", "A new city program is helping people, but access is confusing", "Residents who reached the program say it helped; others gave up navigating how to apply.", ["Government", "Health"], "East Central", "Under Review", "Resident", 7, 8, null, null],
    ["robotics-mentors", "opportunity", "Mentors needed for after-school robotics and trades projects", "Teachers and parents are asking for local builders, engineers, mechanics, and entrepreneurs to help students turn ideas into projects.", ["Youth", "Jobs", "Schools"], "North Side", "Reviewed", "Volunteer opportunity", 21, 3, null,
      "Two schools are ready to host. We are matching mentors now - respond with what you can offer."],
    ["cleanup-crews", "opportunity", "Neighborhood cleanup crews are forming around problem areas", "Residents are organizing weekend cleanup walks and asking businesses, churches, and schools to coordinate supplies and volunteers.", ["Public safety", "Environment", "Parks"], "Hillyard", "Reviewed", "Community action", 13, 4, null, null],
    ["hiring-fair", "opportunity", "A local hiring fair needs employers and volunteers", "Organizers want more employers with real openings and a few volunteers to help run the day.", ["Jobs", "Business"], "Downtown", "Reviewed", "Workforce program", 10, 6, null, null],
    ["mentor-recovery", "opportunity", "A recovery program needs mentors who have been there", "A peer-support program is looking for volunteers with lived experience and time to give.", ["Recovery", "Health"], "West Central", "Reviewed", "Nonprofit staff", 12, 7, null, null],
    ["donation-drive", "opportunity", "A warm-clothing drive needs a drop-off host", "Organizers have donors lined up but need a centrally located business willing to be a drop-off point.", ["Faith/community", "Homelessness"], "South Hill", "Submitted", "Resident", 5, 8, null, null],
    ["pattern-bus-stops", "pattern", "Pattern: parents report safety concerns near three downtown bus stops", "Several independent reports point to the same set of stops. We have combined them into one pattern report rather than publishing each as a separate claim.", ["Public safety", "Transportation", "Schools"], "Downtown", "Verified", "Pattern report", 29, 3,
      ["Over the past two weeks we received separate submissions from parents and a transit rider describing the same three downtown bus stops as feeling unsafe for kids after school.", "No two reports name the same individuals, but they describe consistent conditions: poor lighting, loitering, and a lack of adult presence at dismissal times.", "We are publishing this as a pattern - a confirmed cluster of reports - not as a verified claim about any specific person or single incident."],
      "We have shared the aggregated, de-identified pattern with the relevant agencies. Residents can keep adding location detail to sharpen the map."],
    ["pattern-corridor", "pattern", "Pattern: repeat 911 calls cluster on one downtown corridor", "Multiple signals describe the same corridor. Combined into a de-identified pattern report for institutional response.", ["Public safety", "Health", "Downtown"], "Downtown", "Reviewed", "Pattern report", 20, 5, null, null],
    ["pattern-lunch", "pattern", "Pattern: several parents mention kids skipping lunch over cost or confusion", "Independent reports from different schools suggest a shared barrier worth a closer look.", ["Schools", "Youth", "Health"], "East Central", "Under Review", "Pattern report", 15, 7, null, null],
  ];
  return rows.map(([id, cat, title, summary, topics, hood, status, by, helpful, age, body, next]) => ({
    id, cat, title, summary, topics, hood, status, by, helpful, age,
    photo: SPOKANE_PHOTOS[id] || "",
    body: body || BODIES[id] || [summary],
    next: next || DEFAULT_NEXT,
    city: "spokane" as CityKey,
    ...coordFor("spokane", hood, id),
  }));
}

function buildHonolulu(): Post[] {
  const rows: SeedTuple[] = [
    ["hnl-beach-cleanup", "good", "Volunteers cleared two tons of debris from a Waikīkī shoreline", "A weekend cleanup organized by local students and a dive shop pulled an unexpected amount of marine debris off one stretch of beach.", ["Environment", "Parks"], "Waikīkī", "Verified", "Beach hui volunteer", 26, 2, null, null],
    ["hnl-keiki-surf", "good", "A retired lifeguard started a free keiki surf program", "Saturday mornings, kids who could never afford lessons are learning ocean safety and how to surf from a longtime lifeguard.", ["Youth", "Parks"], "Hawaiʻi Kai", "Reviewed", "Volunteer coach", 19, 4, null, null],
    ["hnl-kupuna-garden", "good", "A Mānoa church turned a vacant lot into a kūpuna garden", "Elders and youth are growing kalo and vegetables together on land that sat empty for years.", ["Faith/community", "Health"], "Mānoa", "Verified", "Community organizer", 22, 5, null, null],
    ["hnl-night-market", "good", "Chinatown's night market is reviving small storefronts", "A monthly night market is bringing foot traffic back to blocks that had gone quiet, and several shops report their best months in years.", ["Business", "Arts/culture"], "Chinatown", "Reviewed", "Small-business owner", 17, 6, null, null],
    ["hnl-flood-kalihi", "bad", "Repeat flooding is hitting the same Kalihi streets", "Residents report that even moderate rain now floods the same low blocks, damaging cars and ground-floor units.", ["Public safety", "Environment"], "Kalihi", "Under Review", "3 residents", 15, 1,
      ["Several residents along the same Kalihi blocks report that storm runoff now floods the street with even moderate rain.", "They describe water entering ground-floor units and stalling cars, and say drains appear blocked or undersized.", "We are collecting locations to understand how far the problem extends before raising it as a pattern."],
      "We are mapping the affected blocks. If you have seen this too, add the cross-streets and how high the water gets."],
    ["hnl-bus-cuts", "bad", "Riders say route cuts are stranding early-shift workers", "Service reductions on a key route are leaving early-shift workers in Kapālama without a reliable way to get to work.", ["Transportation", "Jobs"], "Kapālama", "Under Review", "Transit riders", 13, 3, null, null],
    ["hnl-reef-runoff", "bad", "Residents report runoff clouding the water after every storm", "Snorkelers and paddlers describe brown plumes reaching the reef after heavy rain, and worry about long-term damage.", ["Environment", "Health"], "Hawaiʻi Kai", "Reviewed", "Ocean user", 12, 4, null, null],
    ["hnl-vacancy-kaimuki", "bad", "Storefront vacancies are climbing along Waiʻalae Avenue", "Several longtime businesses have closed, and residents worry the corridor is losing the mix that made it walkable.", ["Business", "Downtown"], "Kaimukī", "Submitted", "Resident", 8, 5, null, null],
    ["hnl-rail-opening", "both", "The rail extension opened — more access, but fare confusion", "Good news: a new segment of rail is carrying riders. Bad news: riders say fares and transfers are confusing and signage is thin.", ["Transportation", "Government"], "Salt Lake", "Verified", "Multiple contributors", 23, 2,
      ["A new segment of the rail line opened this month, giving thousands of residents a faster way into town.", "At the same time, riders report confusion about fares, transfers, and where to buy passes, with little staff present to help.", "Both are true at once: real new access, and a rollout that is leaving some riders frustrated."],
      "We have reached out to the transit agency for clarification and will update. Riders can submit the specific stations where signage is unclear."],
    ["hnl-housing-kakaako", "both", "New Kakaʻako towers add homes, but locals fear being priced out", "Construction is adding badly needed units while longtime residents worry the new housing is not built for them.", ["Housing", "Business"], "Kakaʻako", "Reviewed", "Resident", 18, 4, null, null],
    ["hnl-tourism-return", "both", "Tourism is back in Waikīkī — revenue up, strain up too", "Visitor spending has rebounded, helping workers and shops, while residents describe crowding and rising costs.", ["Business", "Downtown"], "Waikīkī", "Reviewed", "Owner contributor", 16, 5, null, null],
    ["hnl-mentors-canoe", "opportunity", "A canoe club needs mentors for after-school paddling", "Coaches want adults who can help run safe afternoon practices and teach ocean skills to keiki.", ["Youth", "Parks"], "Ala Moana", "Reviewed", "Volunteer opportunity", 14, 3, null, null],
    ["hnl-food-hub", "opportunity", "A food-rescue hub needs drivers across the island", "A nonprofit recovering unsold food needs volunteer drivers to get it to shelters and kūpuna before it spoils.", ["Health", "Homelessness"], "Kalihi", "Reviewed", "Nonprofit staff", 12, 4, null, null],
    ["hnl-pattern-crosswalks", "pattern", "Pattern: pedestrian near-misses cluster on three Ala Moana crosswalks", "Independent reports describe the same crosswalks as dangerous for kids and kūpuna. Combined into one de-identified pattern report.", ["Public safety", "Transportation"], "Ala Moana", "Verified", "Pattern report", 21, 3,
      ["Over two weeks we received separate reports describing the same three crosswalks near Ala Moana as dangerous, especially for children and elders.", "The reports describe short signal timing, turning vehicles, and poor visibility - without naming individuals.", "We are publishing this as a pattern, a confirmed cluster of reports, rather than a single verified incident."],
      "We have shared the de-identified pattern with the relevant agency. Residents can keep adding detail to sharpen the map."],
  ];
  return rows.map(([id, cat, title, summary, topics, hood, status, by, helpful, age, body, next]) => ({
    id, cat, title, summary, topics, hood, status, by, helpful, age,
    photo: "https://picsum.photos/seed/" + id + "/900/560",
    body: body || BODIES[id] || [summary],
    next: next || DEFAULT_NEXT,
    city: "honolulu" as CityKey,
    ...coordFor("honolulu", hood, id),
  }));
}

// Is a GPS coordinate within (roughly) the city? ~40km box around the city
// center, matching the geocoder's sanity check. Used for local verification.
export function withinCityBounds(city: CityKey, lat: number, lng: number): boolean {
  const c = CITIES[city];
  if (!c) return false;
  return Math.abs(lat - c.center[0]) <= 0.4 && Math.abs(lng - c.center[1]) <= 0.5;
}

export function seedPosts(): Post[] {
  // Founding stories are always free: they are the seed corpus a new market
  // opens with, and they count toward getting each city habit-forming.
  return [...buildSpokane(), ...buildHonolulu()].map((p) => ({ ...p, freeSeed: true, seeded: true }));
}

export function seedQueue(): QueueItem[] {
  const spokane: QueueItem[] = [
    { id: "q1", wf: "New", cat: "bad", title: "Trash buildup recurring near Sprague and Napa", topic: "Public safety", hood: "East Central", by: "Resident", age: 0, body: ["Residents report recurring trash buildup near Sprague and Napa over the last several weeks."], status: "Submitted", scan: { level: "clean", msg: "No risk flags. Describes a public condition, not a private individual. Ready for human review." }, city: "spokane" },
    { id: "q2", wf: "New", cat: "bad", title: "Concern about a downtown corridor", topic: "Public safety", hood: "Downtown", by: "Anonymous", age: 0, body: ["A contributor raised a concern that named a specific individual and a private address."], status: "Submitted", scan: { level: "flag", msg: "Flagged: a private name and address were detected. Needs editing into system-level pattern language before it can advance." }, city: "spokane" },
    { id: "q3", wf: "Review", cat: "good", title: "Volunteers repainted a community center", topic: "Faith/community", hood: "West Central", by: "Volunteer", age: 1, body: ["A group of volunteers spent a weekend repainting a tired community center used by youth programs."], status: "Under Review", scan: { level: "clean", msg: "No risk flags. Positive community signal." }, city: "spokane" },
    { id: "q4", wf: "Verified", cat: "opportunity", title: "Tutors needed for weekend reading program", topic: "Schools", hood: "Hillyard", by: "Nonprofit staff", age: 1, body: ["A weekend reading program is looking for volunteer tutors who can commit to two hours on Saturdays."], status: "Verified", scan: { level: "clean", msg: "No risk flags. Verified with the host organization." }, city: "spokane" },
  ];
  const honolulu: QueueItem[] = [
    { id: "qh1", wf: "New", cat: "good", title: "Surfers organized a reef cleanup off Waikīkī", topic: "Environment", hood: "Waikīkī", by: "Resident", age: 0, body: ["A group of surfers organized a volunteer reef cleanup and want help making it monthly."], status: "Submitted", scan: { level: "clean", msg: "No risk flags. Positive community signal. Ready for human review." }, city: "honolulu" },
    { id: "qh2", wf: "Review", cat: "bad", title: "Flooding reported again on a Kalihi block", topic: "Public safety", hood: "Kalihi", by: "2 residents", age: 1, body: ["Residents report repeat flooding on the same block after moderate rain."], status: "Under Review", scan: { level: "clean", msg: "No risk flags. Describes a public condition. In review." }, city: "honolulu" },
  ];
  return [...spokane, ...honolulu];
}

// ---------------------------------------------------------------------------
// Category-derived presentation helpers (used across the feed/cards/detail)
// ---------------------------------------------------------------------------

export interface DecoratedPost extends Post {
  catLabel: string;
  catColor: string;
  catBg: string;
  catBorder: string;
  statusColor: string;
  statusBorder: string;
  metaLine: string;
  helpfulLine: string;
  hasPhoto: boolean;
}

export function decorate(p: Post, seenLocal: Record<string, boolean>): DecoratedPost {
  const cat = CAT[p.cat] || CAT.signal;
  const statusColor = STATUS[p.status] || "#8a857a";
  return {
    ...p,
    catLabel: cat.label, catColor: cat.color, catBg: cat.bg, catBorder: cat.border,
    statusColor, statusBorder: statusColor + "55",
    metaLine: `${p.hood} · ${p.by} · ${p.age === 0 ? "today" : p.age + "d ago"}`,
    helpfulLine: `${seenLocal[p.id] ? p.helpful + 1 : p.helpful} helpful`,
    hasPhoto: !!p.photo,
  };
}
