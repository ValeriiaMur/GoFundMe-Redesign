import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const site = {
  goHome: vi.fn(),
  goCommunities: vi.fn(),
  goProfile: vi.fn(),
};

vi.mock("@/components/app/site-provider", () => ({ useSite: () => site }));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { Header } from "@/components/app/header";

afterEach(() => vi.clearAllMocks());

describe("Header", () => {
  it("has no text menu — just logo, profile and Start", () => {
    render(<Header />);
    expect(screen.queryByRole("button", { name: "Home" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Communities" })).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("centers the GoFundMe logo image and links it home", async () => {
    render(<Header />);
    const logo = screen.getByAltText("GoFundMe");
    expect(logo).toBeInTheDocument();
    expect(logo.closest(".hdr-logo")).not.toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "GoFundMe home" }));
    expect(site.goHome).toHaveBeenCalled();
  });

  it("has only the profile avatar on the right — no Start button", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /Your profile/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Start a GoFundMe" })).toBeNull();
  });

  it("no longer renders the emblem dock slot", () => {
    const { container } = render(<Header />);
    expect(container.querySelector(".emblem-slot")).toBeNull();
  });
});
