import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { NotBuiltModal } from "@/components/shared/not-built-modal";

afterEach(() => {
  vi.useRealTimers();
});

describe("NotBuiltModal", () => {
  it("shows the unlit brand lantern instead of an external gif", () => {
    const { container } = render(<NotBuiltModal onClose={vi.fn()} />);
    expect(container.querySelector(".unlit-lantern")).not.toBeNull();
    expect(container.querySelector(".modal-gif")).toBeNull();
    expect(screen.getByText(/wasn’t in scope/i)).toBeInTheDocument();
  });

  it("strike a match: the flame catches, then puffs out, then resets", () => {
    vi.useFakeTimers();
    const { container } = render(<NotBuiltModal onClose={vi.fn()} />);
    const stage = container.querySelector(".unlit-stage")!;
    expect(stage.getAttribute("data-phase")).toBe("unlit");

    fireEvent.click(screen.getByRole("button", { name: "Strike a match" }));
    expect(stage.getAttribute("data-phase")).toBe("flicker");

    act(() => void vi.advanceTimersByTime(1400));
    expect(stage.getAttribute("data-phase")).toBe("smoke");

    act(() => void vi.advanceTimersByTime(1600));
    expect(stage.getAttribute("data-phase")).toBe("unlit");
  });
});
