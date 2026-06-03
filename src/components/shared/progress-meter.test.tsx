import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProgressMeter } from "@/components/shared/progress-meter";

describe("ProgressMeter", () => {
  it("shows raised, goal and funded percent", () => {
    render(<ProgressMeter raised={184200} goal={250000} />);
    expect(screen.getByText("$184,200")).toBeInTheDocument();
    expect(screen.getByText("raised of $250,000")).toBeInTheDocument();
    expect(screen.getByText(/74% funded/)).toBeInTheDocument();
  });

  it("appends supporters and days left to the sub line", () => {
    const { container } = render(
      <ProgressMeter raised={184200} goal={250000} supporters={3128} daysLeft={19} />,
    );
    expect(container.querySelector(".meter-sub")).toHaveTextContent(
      "74% funded · 3,128 supporters · 19 days left",
    );
  });

  it("supports the large size used by the watch room detail panel", () => {
    const { container } = render(<ProgressMeter raised={1} goal={2} size="lg" />);
    expect(container.querySelector(".meter")).toHaveClass("meter-lg");
  });
});
