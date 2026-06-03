import { describe, it, expect } from "vitest";
import { fundedPct, crossedMilestone } from "@/lib/progress";
import type { Milestone } from "@/lib/data";

const milestones: Milestone[] = [
  { at: 50, label: "a", reached: true },
  { at: 100, label: "b", reached: false },
  { at: 200, label: "c", reached: false },
];

describe("fundedPct", () => {
  it("computes and caps at 100", () => {
    expect(fundedPct(50, 200)).toBe(25);
    expect(fundedPct(300, 200)).toBe(100);
    expect(fundedPct(10, 0)).toBe(0);
  });
});

describe("crossedMilestone", () => {
  it("finds a milestone the donation crosses", () => {
    expect(crossedMilestone(milestones, 80, 120)?.label).toBe("b");
  });
  it("returns undefined when none crossed", () => {
    expect(crossedMilestone(milestones, 110, 140)).toBeUndefined();
  });
});
