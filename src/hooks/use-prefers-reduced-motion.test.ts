import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Listener = (e: MediaQueryListEvent) => void;

function mockMatchMedia(initial: boolean) {
  let listener: Listener | null = null;
  const mql = {
    matches: initial,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, cb: Listener) => {
      listener = cb;
    },
    removeEventListener: () => {
      listener = null;
    },
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue(mql as unknown as MediaQueryList),
  );
  return {
    emit(matches: boolean) {
      mql.matches = matches;
      listener?.({ matches } as MediaQueryListEvent);
    },
  };
}

describe("usePrefersReducedMotion", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("reflects the initial media query state", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the preference changes", () => {
    const m = mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    act(() => m.emit(true));
    expect(result.current).toBe(true);
  });
});
