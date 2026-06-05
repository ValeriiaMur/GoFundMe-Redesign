import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { StartTile } from "@/components/home/start-tile";

describe("StartTile", () => {
  it("opens the not-built modal instead of a dead click", () => {
    render(<StartTile />);
    fireEvent.click(screen.getByRole("button", { name: /Start a fundraiser/ }));
    expect(screen.getByText(/isn’t lit yet/i)).toBeInTheDocument();
    expect(screen.getByText(/wasn’t in scope/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByText(/isn’t lit yet/i)).toBeNull();
  });
});
