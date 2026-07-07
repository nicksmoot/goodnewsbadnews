import { CityKey } from "./data";

// Demo moderation-queue entries mirroring the seed stories that show
// "Under Review" / "Submitted" on the public feed, so the admin board looks
// like a working desk. Seeded once via POST /api/queue/seed (admin only).

export interface DemoQueueItem {
  title: string;
  cat: string;
  topic: string;
  hood: string;
  by: string;
  city: CityKey;
  wf: "New" | "Review" | "Verified";
  status: string;
  body: string;
  scanLevel: "clean" | "flag";
  scanMsg: string;
}

const CLEAN = "No risk flags. Describes a public condition, not a private individual. Ready for human review.";

export const DEMO_QUEUE: DemoQueueItem[] = [
  // ---- Spokane: mirrors of Under Review feed stories ----
  { title: "More broken streetlights reported near Monroe", cat: "bad", topic: "Public safety", hood: "North Side", by: "3 residents", city: "spokane", wf: "Review", status: "Under Review", scanLevel: "clean", scanMsg: CLEAN,
    body: "Several residents independently reported that a stretch of blocks near Monroe and Montgomery has had multiple streetlights out for weeks. One contributor walks the route at night and described specific intersections where visibility is poor." },
  { title: "Responders are seeing repeat calls from the same motel block", cat: "bad", topic: "Public safety", hood: "Downtown", by: "Anonymous, privately verified", city: "spokane", wf: "Review", status: "Under Review", scanLevel: "clean", scanMsg: "No risk flags after edit. Reframed as a system-level pattern; no private individuals named.",
    body: "A contributor who works in emergency response describes a pattern of repeated calls concentrated around a single downtown motel block, and asks whether the city is tracking the cluster as clearly as responders experience it." },
  { title: "Downtown businesses report more theft but little attention", cat: "bad", topic: "Business", hood: "Downtown", by: "Owner contributor", city: "spokane", wf: "Review", status: "Under Review", scanLevel: "clean", scanMsg: CLEAN,
    body: "Several downtown business owners describe a rising pattern of shoplifting and property theft that they say has not yet surfaced in any formal citywide conversation. Two report changing their hours or staffing because of it." },
  { title: "Parents report recurring conflict near a school", cat: "bad", topic: "Schools", hood: "Hillyard", by: "2 parents", city: "spokane", wf: "Review", status: "Under Review", scanLevel: "flag", scanMsg: "Flagged for care: involves minors near a school. No students are named; keep it that way through review.",
    body: "Several parents describe a recurring conflict among students near a Hillyard campus in the half hour after dismissal, and are asking for a consistent adult presence at the corner where it keeps happening." },
  { title: "A public restroom has been closed for months", cat: "bad", topic: "Parks", hood: "Spokane Valley", by: "Resident", city: "spokane", wf: "New", status: "Submitted", scanLevel: "clean", scanMsg: CLEAN,
    body: "Park users report a restroom that has been locked for an extended period with no posted timeline. Families using the adjacent playground say the closure effectively shortens their visits." },
  { title: "A warm-clothing drive needs a drop-off host", cat: "opportunity", topic: "Faith/community", hood: "South Hill", by: "Resident", city: "spokane", wf: "New", status: "Submitted", scanLevel: "clean", scanMsg: "No risk flags. Community opportunity; verify the organizer contact during review.",
    body: "Organizers of a warm-clothing drive have donors lined up and a distribution plan ready. What they lack is a centrally located, publicly accessible business willing to serve as the drop-off point for three weeks." },
  { title: "Volunteers repainted a community center", cat: "good", topic: "Faith/community", hood: "West Central", by: "Volunteer", city: "spokane", wf: "Verified", status: "Verified", scanLevel: "clean", scanMsg: "No risk flags. Verified with the host organization.",
    body: "A group of volunteers spent a weekend repainting a tired community center used by youth programs. The organization confirmed the work and shared photos of the finished rooms." },
  // ---- Honolulu ----
  { title: "Repeat flooding is hitting the same Kalihi streets", cat: "bad", topic: "Public safety", hood: "Kalihi", by: "3 residents", city: "honolulu", wf: "Review", status: "Under Review", scanLevel: "clean", scanMsg: CLEAN,
    body: "Several residents along the same Kalihi blocks report that storm runoff now floods the street with even moderate rain. They describe water entering ground-floor units and stalling cars." },
  { title: "Riders say route cuts are stranding early-shift workers", cat: "bad", topic: "Transportation", hood: "Kapālama", by: "Transit riders", city: "honolulu", wf: "Review", status: "Under Review", scanLevel: "clean", scanMsg: CLEAN,
    body: "Riders in Kapālama report that recent route reductions are stranding early-shift workers, with the first bus of the morning now arriving after several major employers' start times." },
  { title: "Storefront vacancies are climbing along Waiʻalae Avenue", cat: "bad", topic: "Business", hood: "Kaimukī", by: "Resident", city: "honolulu", wf: "New", status: "Submitted", scanLevel: "clean", scanMsg: CLEAN,
    body: "Storefront vacancies are climbing along Waiʻalae Avenue in Kaimukī, with several longtime businesses closing in the past year and their spaces still dark." },
  { title: "Surfers organized a reef cleanup off Waikīkī", cat: "good", topic: "Environment", hood: "Waikīkī", by: "Resident", city: "honolulu", wf: "New", status: "Submitted", scanLevel: "clean", scanMsg: "No risk flags. Positive community signal. Ready for human review.",
    body: "A group of surfers organized a volunteer reef cleanup and want help making it monthly. They are asking for a second sponsor to cover disposal fees." },
];
