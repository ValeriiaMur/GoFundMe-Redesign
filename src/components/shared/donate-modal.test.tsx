import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DonateModal } from "@/components/shared/donate-modal";
import { setAnalyticsSink, type CapturePayload } from "@/lib/analytics";
import { FUNDRAISERS } from "@/lib/data";

afterEach(() => setAnalyticsSink(null));

describe("DonateModal", () => {
  it("tracks donate_modal_opened on mount — the top of the donate funnel", () => {
    const seen: CapturePayload[] = [];
    setAnalyticsSink((p) => seen.push(p));

    render(<DonateModal fundraiser={FUNDRAISERS.alerts} onClose={() => {}} onConfirm={() => {}} />);

    expect(seen).toContainEqual({
      event: "donate_modal_opened",
      properties: { causeId: "alerts", communityId: "watch" },
    });
  });

  it("confirms with the chosen preset amount and message", async () => {
    const onConfirm = vi.fn();
    render(
      <DonateModal fundraiser={FUNDRAISERS.alerts} onClose={() => {}} onConfirm={onConfirm} />,
    );
    await userEvent.click(screen.getByText("$150"));
    await userEvent.click(screen.getByRole("button", { name: /Plant/ }));
    expect(onConfirm).toHaveBeenCalledWith(150, "");
  });
});
