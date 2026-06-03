import posthog from "posthog-js";

import { captureSink, setAnalyticsSink } from "@/lib/analytics";

let installed = false;

/**
 * Initialize posthog-js and route the app's typed analytics events to it.
 *
 * The thin vendor adapter: the event taxonomy lives in `analytics.ts` and is
 * vendor-neutral; this is the only file that imports posthog-js. Client-only and
 * idempotent — safe to call from a mount effect on every render. If the public
 * key is absent (e.g. local dev without env), it stays a no-op and `track()`
 * remains the silent no-op sink.
 */
export function initPostHog(): void {
  if (installed || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  installed = true;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // We emit a typed `page_view` from AnalyticsProvider, so disable autocapture
    // pageviews to avoid double-counting. Page-leave still powers dwell time.
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
  });

  setAnalyticsSink(captureSink((event, properties) => posthog.capture(event, properties)));
}
