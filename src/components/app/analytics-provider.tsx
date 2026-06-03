"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { sectionForPath, track } from "@/lib/analytics";
import { reportVital } from "@/lib/vitals";
import { initPostHog } from "@/lib/posthog";

/**
 * Initializes PostHog (the vendor sink) and fires a typed `page_view` on every
 * client navigation. These power the "Repeat Visits" metric — PostHog derives
 * unique/returning users from them.
 *
 * The event taxonomy stays vendor-neutral in `analytics.ts`; this provider just
 * attaches the PostHog adapter via `initPostHog()` (idempotent, client-only).
 * The init effect runs before the page_view effect on mount, so the sink is
 * installed before the first event fires.
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
    // PRD performance benchmark: capture Core Web Vitals as `perf_vital` events,
    // tagged with the path being measured. Dynamic import keeps the listener out
    // of the server bundle; each callback fires when its metric finalizes.
    let cancelled = false;
    import("web-vitals").then(({ onLCP, onCLS, onINP, onTTFB }) => {
      if (cancelled) return;
      const report = (m: { name: string; value: number; rating: string }) =>
        reportVital(m, window.location.pathname);
      onLCP(report);
      onCLS(report);
      onINP(report);
      onTTFB(report);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    track({ name: "page_view", props: { path: pathname, section: sectionForPath(pathname) } });
  }, [pathname]);

  return <>{children}</>;
}
