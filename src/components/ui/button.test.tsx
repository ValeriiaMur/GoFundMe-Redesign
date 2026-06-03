import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Donate</Button>);
    expect(screen.getByRole("button", { name: "Donate" })).toBeInTheDocument();
  });

  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Donate</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Donate" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders as a link when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/campaign">Share</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Share" })).toHaveAttribute(
      "href",
      "/campaign",
    );
  });
});
