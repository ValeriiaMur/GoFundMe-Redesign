import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FrontRow } from "@/components/community/front-row";
import { FUNDRAISERS } from "@/lib/data";

function mockMatchMedia() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

beforeEach(mockMatchMedia);
afterEach(() => vi.unstubAllGlobals());

describe("FrontRow", () => {
  it("renders the short name and a mono meta line", () => {
    render(
      <FrontRow cause={FUNDRAISERS.alerts} raised={184200} active={false} onSelect={() => {}} />,
    );
    expect(screen.getByText("Real-time wildfire alerts")).toBeInTheDocument();
    expect(screen.getByText("74% · 3,128 supporters · 19d left")).toBeInTheDocument();
  });

  it("marks the selected row with the on state", () => {
    const { container, rerender } = render(
      <FrontRow cause={FUNDRAISERS.alerts} raised={184200} active={false} onSelect={() => {}} />,
    );
    expect(container.querySelector("button")).not.toHaveClass("on");
    rerender(
      <FrontRow cause={FUNDRAISERS.alerts} raised={184200} active onSelect={() => {}} />,
    );
    expect(container.querySelector("button")).toHaveClass("on");
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    render(
      <FrontRow cause={FUNDRAISERS.alerts} raised={184200} active={false} onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
