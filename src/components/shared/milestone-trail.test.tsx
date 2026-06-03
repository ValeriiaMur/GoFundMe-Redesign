import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { MilestoneTrail } from "@/components/shared/milestone-trail";
import type { Milestone } from "@/lib/data";

const milestones: Milestone[] = [
  { at: 50000, label: "First ridge sensors", reached: true },
  { at: 120000, label: "Cedar Hollow online", reached: true },
  { at: 250000, label: "Full canyon coverage", reached: false },
];

describe("MilestoneTrail", () => {
  it("renders vertically by default", () => {
    const { container } = render(<MilestoneTrail milestones={milestones} raised={130000} />);
    expect(container.querySelector(".mtrail")).not.toBeNull();
    expect(container.querySelector(".mtrail-h")).toBeNull();
  });

  it("renders a horizontal trail with labels and amounts", () => {
    const { container } = render(
      <MilestoneTrail milestones={milestones} raised={130000} layout="horizontal" />,
    );
    expect(container.querySelector(".mtrail-h")).not.toBeNull();
    expect(screen.getByText("First ridge sensors")).toBeInTheDocument();
    expect(screen.getByText("$250,000")).toBeInTheDocument();
  });

  it("lights up reached milestones from live raised, not static flags", () => {
    const { container } = render(
      <MilestoneTrail milestones={milestones} raised={130000} layout="horizontal" />,
    );
    const segments = container.querySelectorAll(".mtrail-h .ms");
    expect(segments[0]).toHaveClass("done");
    expect(segments[1]).toHaveClass("done");
    expect(segments[2]).not.toHaveClass("done");
  });
});
