import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/app/header", () => ({ Header: () => <div data-testid="header" /> }));

import { AppShell } from "@/components/app/app-shell";

describe("AppShell", () => {
  it("renders the persistent header and the page content", () => {
    render(<AppShell>content</AppShell>);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("no longer mounts the docking video intro", () => {
    const { container } = render(<AppShell>content</AppShell>);
    expect(container.querySelector("[data-phase]")).toBeNull();
  });
});
