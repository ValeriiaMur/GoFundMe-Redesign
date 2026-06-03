"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { sectionForPath, track } from "@/lib/analytics";
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
  }, []);

  useEffect(() => {
    track({ name: "page_view", props: { path: pathname, section: sectionForPath(pathname) } });
  }, [pathname]);

  return <>{children}</>;
}
