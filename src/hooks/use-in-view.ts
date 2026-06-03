"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** Pre-load margin around the viewport. Defaults to a generous 300px. */
  rootMargin?: string;
  /** Stop observing after the first intersection. Defaults to true. */
  once?: boolean;
}

/**
 * Reports whether the attached element has entered the viewport.
 * Returns a callback ref to attach and the current in-view boolean.
 *
 * Falls back to `true` when IntersectionObserver is unavailable (older
 * browsers / SSR), so content is never hidden by a missing API.
 */
export function useInView<T extends Element>(
  options: UseInViewOptions = {},
): [(node: T | null) => void, boolean] {
  const { rootMargin = "300px", once = true } = options;
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect();
      if (!node) return;

      if (typeof IntersectionObserver === "undefined") {
        setInView(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setInView(true);
              if (once) observer.disconnect();
            } else if (!once) {
              setInView(false);
            }
          }
        },
        { rootMargin },
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [rootMargin, once],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return [setRef, inView];
}
