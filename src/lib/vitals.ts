import { track } from "@/lib/analytics";

/** The slice of a web-vitals `Metric` we report — keeps this module testable without the package. */
export interface VitalLike {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor" | string;
}

/**
 * Map a Core Web Vital onto the `perf_vital` event — the PRD's "page load times"
 * benchmark, captured per path so each surface can be judged on its own.
 * Time-based metrics (LCP/TTFB/INP, in ms) round to whole numbers; CLS is a
 * unitless score < 1, so it keeps three decimals.
 */
export function reportVital(metric: VitalLike, path: string): void {
  const value =
    metric.name === "CLS" ? Math.round(metric.value * 1000) / 1000 : Math.round(metric.value);
  track({
    name: "perf_vital",
    props: { metric: metric.name, value, rating: metric.rating, path },
  });
}
