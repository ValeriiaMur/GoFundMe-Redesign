// Analytics taxonomy for the three impact metrics the brief asks for:
//   Repeat Visits  → `page_view` (PostHog derives unique/returning users from these)
//   Meaningful Actions:
//     Donate ("plant a light")   → `donate`
//     Share  ("send a lantern")  → `share_lantern`
//     Follow ("keep watch")      → `follow` / `join_community`
//
// The taxonomy is decoupled from any vendor: events flow through a pluggable
// `sink`. The PostHog provider installs a sink that forwards to posthog.capture;
// tests install their own; before either runs, tracking is a safe no-op. This
// keeps the event contract unit-testable without the posthog-js dependency and
// guarantees analytics can never throw into the UI.

export type Section = "home" | "community" | "cause" | "profile" | "other";
export type ActionTargetKind = "cause" | "community" | "person";

export type AnalyticsEvent =
  | { name: "page_view"; props: { path: string; section: Section } }
  | {
      name: "donate";
      props: { causeId: string; communityId?: string; amount: number; milestone?: string };
    }
  | { name: "share_lantern"; props: { targetKind: ActionTargetKind; targetId: string } }
  | { name: "follow"; props: { targetKind: ActionTargetKind; targetId: string; following: boolean } }
  | { name: "join_community"; props: { communityId: string; joined: boolean } };

export interface CapturePayload {
  event: string;
  properties: Record<string, unknown>;
}

/** Flatten a typed event into the shape an analytics backend expects. */
export function toCapture(e: AnalyticsEvent): CapturePayload {
  return { event: e.name, properties: { ...e.props } };
}

type Sink = (payload: CapturePayload) => void;

const noopSink: Sink = () => {};
let sink: Sink = noopSink;

/** Install the destination for tracked events (e.g. posthog.capture). Pass null to reset. */
export function setAnalyticsSink(fn: Sink | null): void {
  sink = fn ?? noopSink;
}

/** Emit an event. Never throws — analytics must not be able to break the product. */
export function track(e: AnalyticsEvent): void {
  try {
    sink(toCapture(e));
  } catch {
    /* swallow: a failing analytics backend must stay invisible to users */
  }
}

/** Classify a pathname into a product section, for page_view segmentation. */
export function sectionForPath(path: string): Section {
  if (path === "/") return "home";
  if (path.startsWith("/communities")) return "community";
  if (path.startsWith("/f")) return "cause";
  if (path.startsWith("/u")) return "profile";
  return "other";
}
