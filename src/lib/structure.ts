// Explicit hierarchy accessors for the three-tier universe:
//   Community (the gathering place) → Causes (fundraisers within it) → Profiles (people).
// These typed helpers are the single way the app should traverse relations,
// so routes and components never reach into the raw record maps directly.
import {
  COMMUNITIES,
  FUNDRAISERS,
  PROFILES,
  type Community,
  type Fundraiser,
  type Profile,
} from "@/lib/data";

/** A cause is a fundraiser — the fundable unit that lives inside a community. */
export type Cause = Fundraiser;

export function getCommunity(id: string): Community | undefined {
  return COMMUNITIES[id];
}

/** Communities are addressed in the URL by their human-readable handle. */
export function communityByHandle(handle: string): Community | undefined {
  return Object.values(COMMUNITIES).find((c) => c.handle === handle);
}

export function getCause(id: string): Cause | undefined {
  return FUNDRAISERS[id];
}

export function getProfile(handle: string): Profile | undefined {
  return PROFILES[handle];
}

export function listCommunities(): Community[] {
  return Object.values(COMMUNITIES);
}

export function listCauses(): Cause[] {
  return Object.values(FUNDRAISERS);
}

export function listProfiles(): Profile[] {
  return Object.values(PROFILES);
}

/** Down the hierarchy: every cause that belongs to a community, in declared order. */
export function causesOf(community: Community): Cause[] {
  return community.fundraisers
    .map((id) => FUNDRAISERS[id])
    .filter((c): c is Cause => Boolean(c));
}

/** Up the hierarchy: the community a cause belongs to. */
export function communityOf(cause: Cause): Community | undefined {
  return COMMUNITIES[cause.community];
}

/** Sideways: other causes in the same community (self excluded). */
export function siblingCauses(cause: Cause): Cause[] {
  return listCauses().filter(
    (c) => c.community === cause.community && c.id !== cause.id,
  );
}
