import { describe, it, expect } from "vitest";
import { money, FUNDRAISERS, COMMUNITIES, PROFILES } from "@/lib/data";

describe("data layer", () => {
  it("formats money with thousands separators", () => {
    expect(money(184200)).toBe("$184,200");
    expect(money(0)).toBe("$0");
  });

  it("every community fundraiser id resolves", () => {
    for (const c of Object.values(COMMUNITIES)) {
      for (const id of c.fundraisers) {
        expect(FUNDRAISERS[id], `missing fundraiser ${id}`).toBeDefined();
      }
    }
  });

  it("profile constellation nodes point at real causes", () => {
    for (const node of PROFILES.janahan.constellation) {
      const exists = FUNDRAISERS[node.id] || COMMUNITIES[node.id];
      expect(exists, `dangling node ${node.id}`).toBeTruthy();
    }
  });
});
