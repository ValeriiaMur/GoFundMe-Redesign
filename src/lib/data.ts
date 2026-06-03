// Ported mock universe for the Beacon / GoFundMe design.
// Each cause references a world clip key from the optimized manifest.
import type { WorldKey } from "@/lib/worlds";

export interface Person {
  id: string;
  name: string;
  handle: string;
  hue: number;
  role: string;
}

export interface Milestone {
  at: number;
  label: string;
  reached: boolean;
}

export interface Update {
  id: string;
  at: string;
  author: Person;
  title: string;
  body: string;
}

export interface Scene {
  kicker?: string;
  big?: string;
  sub: string;
}

export interface Fundraiser {
  id: string;
  title: string;
  blurb: string;
  world: WorldKey;
  worldName: string;
  tagline?: string;
  accent: number;
  scenes?: Scene[];
  organizer: Person;
  community: string;
  raised: number;
  goal: number;
  supporters: number;
  followers: number;
  lanterns: number;
  daysLeft: number;
  story: string[];
  updates: Update[];
  milestones: Milestone[];
}

export interface Community {
  id: string;
  name: string;
  handle: string;
  world: WorldKey;
  worldName: string;
  accent: number;
  tagline: string;
  about: string;
  members: number;
  raisedAll: number;
  lanterns: number;
  fundraisers: string[];
  stewards: Person[];
  pulse: string;
}

export type ActivityType =
  | "donate"
  | "lantern"
  | "follow"
  | "milestone"
  | "join"
  | "update";

export interface Activity {
  id: string;
  who: Person;
  type: ActivityType;
  amount?: number;
  msg?: string;
  at: string;
  target: string;
}

export interface ConstellationNode {
  id: string;
  kind: "fundraiser" | "community";
  label: string;
  role: string;
  x: number;
  y: number;
  size: number;
  accent: number;
}

export interface ImpactEntry {
  metric: string;
  outcome: string;
  cause: string;
  accent: number;
  unit?: string;
}

export interface LanternReceived {
  from: Person;
  msg: string;
}

export interface Moment {
  id: string;
  at: string;
  text: string;
  kind: "watch" | "spark" | "plant";
}

export interface Profile extends Person {
  bio: string;
  joined: string;
  onWatch: boolean;
  streak: number;
  stats: { planted: number; lanterns: number; watching: number; sparked: number };
  constellation: ConstellationNode[];
  impact: ImpactEntry[];
  lanternsReceived: LanternReceived[];
  moments: Moment[];
}

export const money = (n: number): string => "$" + n.toLocaleString("en-US");

export const PEOPLE: Record<string, Person> = {
  janahan: { id: "janahan", name: "Janahan Veeran", handle: "janahan", hue: 52, role: "Steward" },
  mara: { id: "mara", name: "Mara Okafor", handle: "maraok", hue: 168, role: "Organizer" },
  devon: { id: "devon", name: "Devon Reyes", handle: "dreyes", hue: 28, role: "Member" },
  lin: { id: "lin", name: "Lin Castellano", handle: "lincast", hue: 92, role: "Member" },
  amir: { id: "amir", name: "Amir Haddad", handle: "amirh", hue: 300, role: "Member" },
  sofia: { id: "sofia", name: "Sofia Bright", handle: "sbright", hue: 210, role: "Member" },
  noor: { id: "noor", name: "Noor Haidar", handle: "noorh", hue: 130, role: "Member" },
  cole: { id: "cole", name: "Cole Whittaker", handle: "colew", hue: 8, role: "Member" },
};

export const BRAND = {
  name: "GoFundMe",
  tagline: "Help finds a way.",
  world: "hand" as WorldKey,
  arrival: {
    kicker: "GOFUNDME",
    headline: "Reach out. Someone's already reaching back.",
    sub: "Every cause here is a place — and a community keeping watch over it.",
  },
};

export const FUNDRAISERS: Record<string, Fundraiser> = {
  alerts: {
    id: "alerts",
    title: "Real-time alerts for wildfire safety",
    blurb:
      "An open, ad-free alert network that warns mountain towns the moment a fire sparks — built by the people who live there.",
    world: "signal",
    worldName: "The Signal",
    tagline: "Forty minutes is too long to wait.",
    accent: 52,
    scenes: [
      { kicker: "2:14 AM", big: "A line comes down above Cedar Hollow.", sub: "In a canyon where fire can move a mile in twelve minutes." },
      { kicker: "The old way", big: "The county alert arrived forty minutes later.", sub: "Forty minutes is a lifetime when the ridge is already burning." },
      { kicker: "So we built it ourselves", big: "One signal you can trust.", sub: "Satellite heat, camera networks, and local radio — fused, verified by hand, pushed to your phone in seconds." },
      { kicker: "The promise", big: "Free for every household in the watch. Forever.", sub: "No ads. No paywalls. Just neighbors watching the ridgelines so each other can sleep." },
    ],
    organizer: PEOPLE.mara,
    community: "watch",
    raised: 184200,
    goal: 250000,
    supporters: 3128,
    followers: 8740,
    lanterns: 612,
    daysLeft: 19,
    story: [
      "At 2:14am last August, a downed line sparked above Cedar Hollow. The county alert went out forty minutes later. Forty minutes, in a canyon where the fire moved a mile in twelve.",
      "We are a coalition of volunteers, dispatchers, and engineers building what the official system couldn't: a free, real-time alert layer that fuses satellite heat detection, camera networks, and local radio into one signal you can trust — pushed to your phone in seconds, not an hour.",
      "Your support funds the sensor relays on the ridgelines, the people who verify every alert by hand, and the promise that this stays free for every household in the watch — forever.",
    ],
    updates: [
      { id: "u1", at: "2 days ago", author: PEOPLE.mara, title: "Relay #7 is live on Saddle Ridge", body: "The northern blind spot above Cedar Hollow now has coverage. That's 1,400 more homes inside the signal." },
      { id: "u2", at: "1 week ago", author: PEOPLE.janahan, title: "We verified 100% of alerts this month", body: "Zero false alarms pushed to phones. Every signal checked by a human before it reaches you." },
    ],
    milestones: [
      { at: 50000, label: "First ridge sensors", reached: true },
      { at: 120000, label: "Cedar Hollow online", reached: true },
      { at: 184200, label: "Saddle Ridge relay", reached: true },
      { at: 250000, label: "Full canyon coverage", reached: false },
    ],
  },
  shelter: {
    id: "shelter",
    title: "Evacuate & shelter the animals",
    blurb:
      "When the evacuation order comes, no paw gets left behind. A mobile shelter + transport crew for the watch.",
    world: "shop",
    worldName: "The Shelter",
    accent: 28,
    organizer: PEOPLE.lin,
    community: "watch",
    raised: 41850,
    goal: 60000,
    supporters: 980,
    followers: 2100,
    lanterns: 188,
    daysLeft: 33,
    story: [
      "Last season we moved 214 animals out of the burn path in 36 hours — in borrowed trucks and dog crates from our own garages.",
      "This fund builds a real response: a trailer outfitted for transport, a network of foster homes on standby, and feed caches positioned before the season starts.",
    ],
    updates: [
      { id: "u1", at: "4 days ago", author: PEOPLE.lin, title: "Foster network at 40 homes", body: "Forty households across three counties are now on the standby list. That's room for ~120 animals overnight." },
    ],
    milestones: [
      { at: 15000, label: "Transport trailer", reached: true },
      { at: 41850, label: "Foster network", reached: true },
      { at: 60000, label: "Feed caches staged", reached: false },
    ],
  },
  replant: {
    id: "replant",
    title: "Replant the ridge",
    blurb: "Two thousand acres burned. We're bringing the canopy — and the creek — back to Cedar Hollow.",
    world: "pond",
    worldName: "The Regrowth",
    accent: 168,
    organizer: PEOPLE.noor,
    community: "watch",
    raised: 97300,
    goal: 140000,
    supporters: 1644,
    followers: 3300,
    lanterns: 401,
    daysLeft: 52,
    story: [
      "Where the canyon burned, the rains took the hillside next — ash and mud choking the creek the whole valley drinks from.",
      "We're planting 60,000 native seedlings, building erosion checks along the slope, and bringing the water back clear. Every light you plant here is, quite literally, a tree.",
    ],
    updates: [
      { id: "u1", at: "6 days ago", author: PEOPLE.noor, title: "12,000 seedlings in the ground", body: "The first slope above the creek is planted. Come spring it will be green again." },
    ],
    milestones: [
      { at: 30000, label: "Nursery stocked", reached: true },
      { at: 97300, label: "First slope planted", reached: true },
      { at: 140000, label: "Creek restored", reached: false },
    ],
  },
};

export const COMMUNITIES: Record<string, Community> = {
  watch: {
    id: "watch",
    name: "Wildfire Watch",
    handle: "wildfire-watch",
    world: "camp",
    worldName: "The Watch",
    accent: 52,
    tagline: "A volunteer watch keeping the canyon towns ahead of the fire.",
    about:
      "We are 12,000 neighbors, dispatchers, ranchers, and engineers across the Cedar Hollow watershed. We watch the ridgelines so each other can sleep. Everything we build is free, open, and run by the people it protects.",
    members: 12480,
    raisedAll: 323350,
    lanterns: 1201,
    fundraisers: ["alerts", "shelter", "replant"],
    stewards: [PEOPLE.mara, PEOPLE.janahan, PEOPLE.lin, PEOPLE.noor],
    pulse: "Fire weather: elevated",
  },
};

export const ACTIVITY: Activity[] = [
  { id: "a1", who: PEOPLE.devon, type: "donate", amount: 250, msg: "Stay safe up there. From a Cedar Hollow kid, now grown.", at: "just now", target: "alerts" },
  { id: "a2", who: PEOPLE.amir, type: "lantern", msg: "For my mom's street.", at: "2 min ago", target: "alerts" },
  { id: "a3", who: PEOPLE.sofia, type: "donate", amount: 1000, msg: "Forty minutes is forty too many. Thank you.", at: "6 min ago", target: "alerts" },
  { id: "a4", who: PEOPLE.cole, type: "follow", at: "11 min ago", target: "alerts" },
  { id: "a5", who: PEOPLE.lin, type: "milestone", msg: "Saddle Ridge relay reached!", at: "14 min ago", target: "alerts" },
  { id: "a6", who: PEOPLE.noor, type: "donate", amount: 75, msg: "A tree for the creek.", at: "22 min ago", target: "replant" },
  { id: "a7", who: PEOPLE.sofia, type: "join", at: "31 min ago", target: "watch" },
  { id: "a8", who: PEOPLE.devon, type: "donate", amount: 120, msg: "For the dogs.", at: "40 min ago", target: "shelter" },
  { id: "a9", who: PEOPLE.amir, type: "lantern", msg: "Keep watching.", at: "55 min ago", target: "watch" },
  { id: "a10", who: PEOPLE.mara, type: "update", msg: "Relay #7 is live on Saddle Ridge.", at: "2 hrs ago", target: "alerts" },
];

export const PROFILES: Record<string, Profile> = {
  janahan: {
    ...PEOPLE.janahan,
    bio: "Volunteer dispatcher on the night shift. I keep watch so my neighbors can sleep. Cedar Hollow, born & raised.",
    joined: "Joined 2023",
    onWatch: true,
    streak: 312,
    stats: { planted: 4280, lanterns: 37, watching: 6, sparked: 2 },
    constellation: [
      { id: "alerts", kind: "fundraiser", label: "Real-time alerts", role: "Steward · $1,200", x: 54, y: 30, size: 1.05, accent: 52 },
      { id: "watch", kind: "community", label: "Wildfire Watch", role: "Steward", x: 70, y: 54, size: 1.25, accent: 52 },
      { id: "replant", kind: "fundraiser", label: "Replant the ridge", role: "Planted $340", x: 85, y: 28, size: 0.82, accent: 168 },
      { id: "shelter", kind: "fundraiser", label: "Shelter the animals", role: "$90 · watching", x: 62, y: 72, size: 0.7, accent: 28 },
    ],
    impact: [
      { metric: "$1,200", outcome: "4 ridge sensors live on Saddle Ridge", cause: "alerts", accent: 52 },
      { metric: "$340", outcome: "68 native seedlings in the ground", cause: "replant", accent: 168 },
      { metric: "$90", outcome: "3 nights of shelter for evacuated animals", cause: "shelter", accent: 28 },
      { metric: "312", outcome: "alerts verified by hand this month", cause: "watch", accent: 52, unit: "verified" },
    ],
    lanternsReceived: [
      { from: PEOPLE.devon, msg: "You alerted my street at 2am. My family got out. Thank you." },
      { from: PEOPLE.mara, msg: "Couldn't keep this watch without you on nights." },
      { from: PEOPLE.noor, msg: "The creek is coming back because of people like you." },
    ],
    moments: [
      { id: "m1", at: "This week", text: "Verified 312 alerts on the night shift.", kind: "watch" },
      { id: "m2", at: "Last month", text: "Sparked a new fundraiser: Replant the Ridge.", kind: "spark" },
      { id: "m3", at: "Aug 2025", text: "Planted the first light on Real-time Alerts.", kind: "plant" },
    ],
  },
};
