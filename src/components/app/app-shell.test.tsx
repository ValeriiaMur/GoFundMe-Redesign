import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/app/header", () => ({ Header: () => <div data-testid="header" /> }));
vi.mock("@/components/world/intro-dock", () => ({ IntroDock: () => <div data-testid="dock" /> }));

import { AppShell } from "@/components/app/app-shell";

describe("AppShell", () => {
  it("renders header, intro dock and children", () => {
    render(<AppShell>content</AppShell>);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("dock")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("has no floating replay button — the docked emblem itself replays the intro", () => {
    render(<AppShell>content</AppShell>);
    expect(screen.queryByText("Replay intro")).toBeNull();
  });
});
