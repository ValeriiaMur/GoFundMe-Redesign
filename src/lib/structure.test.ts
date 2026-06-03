import { describe, expect, it } from "vitest";

import { COMMUNITIES, FUNDRAISERS, PROFILES } from "@/lib/data";
import {
  causesOf,
  communityByHandle,
  communityOf,
  getCause,
  getCommunity,
  getProfile,
  listCauses,
  listCommunities,
  listProfiles,
  siblingCauses,
} from "@/lib/structure";

describe("structure helpers", () => {
  it("resolves a community by id and by handle to the same record", () => {
    const byId = getCommunity("watch");
    const byHandle = communityByHandle("wildfire-watch");
    expect(byId).toBe(COMMUNITIES.watch);
    expect(byHandle).toBe(COMMUNITIES.watch);
  });

  it("returns undefined for unknown communities, causes, and profiles", () => {
    expect(getCommunity("nope")).toBeUndefined();
    expect(communityByHandle("nope")).toBeUndefined();
    expect(getCause("nope")).toBeUndefined();
    expect(getProfile("nope")).toBeUndefined();
  });

  it("resolves a cause and a profile by their keys", () => {
    expect(getCause("alerts")).toBe(FUNDRAISERS.alerts);
    expect(getProfile("janahan")).toBe(PROFILES.janahan);
  });

  it("lists every community, cause, and profile", () => {
    expect(listCommunities()).toEqual(Object.values(COMMUNITIES));
    expect(listCauses()).toEqual(Object.values(FUNDRAISERS));
    expect(listProfiles()).toEqual(Object.values(PROFILES));
  });

  it("walks the hierarchy down: a community's causes", () => {
    const causes = causesOf(COMMUNITIES.watch);
    expect(causes.map((c) => c.id)).toEqual(["alerts", "shelter", "replant"]);
  });

  it("walks the hierarchy up: a cause's community", () => {
    expect(communityOf(FUNDRAISERS.alerts)).toBe(COMMUNITIES.watch);
  });

  it("finds sibling causes within the same community, excluding self", () => {
    const sibs = siblingCauses(FUNDRAISERS.alerts);
    expect(sibs.map((c) => c.id).sort()).toEqual(["replant", "shelter"]);
    expect(sibs.some((c) => c.id === "alerts")).toBe(false);
  });
});
