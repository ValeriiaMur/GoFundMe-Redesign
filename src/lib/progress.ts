import type { Milestone } from "@/lib/data";

/** Funded percentage, capped at 100. */
export function fundedPct(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, (raised / goal) * 100);
}

/** The milestone newly crossed by a donation taking `before` → `after`, if any. */
export function crossedMilestone(
  milestones: Milestone[],
  before: number,
  after: number,
): Milestone | undefined {
  return milestones.find((m) => before < m.at && after >= m.at);
}
