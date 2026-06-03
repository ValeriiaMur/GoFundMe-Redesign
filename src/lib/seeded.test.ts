import { describe, it, expect } from "vitest";
import { seeded, lerp } from "@/lib/seeded";

describe("seeded", () => {
  it("is deterministic and within [0,1)", () => {
    const a = seeded(3);
    expect(a).toBe(seeded(3));
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(1);
  });
});

describe("lerp", () => {
  it("interpolates and clamps t", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, -1)).toBe(0);
    expect(lerp(0, 10, 2)).toBe(10);
  });
});
