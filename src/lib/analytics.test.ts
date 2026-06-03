import { afterEach, describe, expect, it } from "vitest";

import {
  captureSink,
  sectionForPath,
  setAnalyticsSink,
  toCapture,
  track,
  type CapturePayload,
} from "@/lib/analytics";

afterEach(() => setAnalyticsSink(null));

describe("analytics taxonomy", () => {
  it("maps an event to a flat capture payload (name + props)", () => {
    expect(
      toCapture({ name: "donate", props: { causeId: "alerts", amount: 50 } }),
    ).toEqual({ event: "donate", properties: { causeId: "alerts", amount: 50 } });
  });

  it("routes tracked events to the installed sink", () => {
    const seen: CapturePayload[] = [];
    setAnalyticsSink((p) => seen.push(p));

    track({ name: "follow", props: { targetKind: "cause", targetId: "alerts", following: true } });
    track({ name: "share_lantern", props: { targetKind: "community", targetId: "watch" } });

    expect(seen).toEqual([
      { event: "follow", properties: { targetKind: "cause", targetId: "alerts", following: true } },
      { event: "share_lantern", properties: { targetKind: "community", targetId: "watch" } },
    ]);
  });

  it("no-ops safely before any sink is installed", () => {
    expect(() => track({ name: "page_view", props: { path: "/", section: "home" } })).not.toThrow();
  });

  it("never lets a sink error reach the caller", () => {
    setAnalyticsSink(() => {
      throw new Error("network down");
    });
    expect(() => track({ name: "join_community", props: { communityId: "watch", joined: true } })).not.toThrow();
  });

  it("captureSink forwards tracked events to a backend capture fn as (event, properties)", () => {
    const calls: Array<[string, Record<string, unknown>]> = [];
    setAnalyticsSink(captureSink((event, properties) => calls.push([event, properties])));

    track({ name: "donate", props: { causeId: "alerts", amount: 50 } });

    expect(calls).toEqual([["donate", { causeId: "alerts", amount: 50 }]]);
  });

  it("derives the section from a path", () => {
    expect(sectionForPath("/")).toBe("home");
    expect(sectionForPath("/communities/wildfire-watch")).toBe("community");
    expect(sectionForPath("/f/alerts")).toBe("cause");
    expect(sectionForPath("/u/janahan")).toBe("profile");
    expect(sectionForPath("/settings")).toBe("other");
  });
});
