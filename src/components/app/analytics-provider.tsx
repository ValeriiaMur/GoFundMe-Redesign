"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { sectionForPath, track } from "@/lib/analytics";

/**
 * Fires a `page_view` event on every client navigation. These power the
 * "Repeat Visits" metric (PostHog derives unique/returning users from them).
 *
 * This component is vendor-neutral on purpose: it only calls `track()`. To send
 * events to PostHog, install posthog-js and, once on the client, point the sink
 * at it — e.g. `setAnalyticsSink((p) => posthog.capture(p.event, p.properties))`.
 * Until a sink is installed, `track()` is a safe no-op.
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    track({ name: "page_view", props: { path: pathname, section: sectionForPath(pathname) } });
  }, [pathname]);

  return <>{children}</>;
}
