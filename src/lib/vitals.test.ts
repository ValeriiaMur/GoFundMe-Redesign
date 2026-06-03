import { afterEach, describe, expect, it } from "vitest";

import { setAnalyticsSink, type CapturePayload } from "@/lib/analytics";
import { reportVital } from "@/lib/vitals";

afterEach(() => setAnalyticsSink(null));

describe("reportVital", () => {
  it("maps a web-vitals metric onto the perf_vital event with a rounded value", () => {
    const seen: CapturePayload[] = [];
    setAnalyticsSink((p) => seen.push(p));

    reportVital({ name: "LCP", value: 1234.56, rating: "good" }, "/communities");

    expect(seen).toEqual([
      {
        event: "perf_vital",
        properties: { metric: "LCP", value: 1235, rating: "good", path: "/communities" },
      },
    ]);
  });

  it("CLS keeps fractional precision (values are < 1)", () => {
    const seen: CapturePayload[] = [];
    setAnalyticsSink((p) => seen.push(p));

    reportVital({ name: "CLS", value: 0.0421, rating: "good" }, "/");

    expect(seen[0].properties.value).toBe(0.042);
  });
});
