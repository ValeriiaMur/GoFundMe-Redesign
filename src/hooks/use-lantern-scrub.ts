"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { HERO_FOCAL, LANTERN_FRAME_COUNT, frameBlendAt, lanternFrameSrc } from "@/lib/lantern";

/** Draws an image into the canvas with cover fit and a horizontal focal bias
 *  (the lantern sits right of center in the frames). */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  const dw = ir > cr ? h * ir : w;
  const dh = ir > cr ? h : w / ir;
  ctx.drawImage(img, (w - dw) * HERO_FOCAL, (h - dh) / 2, dw, dh);
}

export interface LanternScrub {
  /** Frames decoded so far (0 … LANTERN_FRAME_COUNT). */
  loaded: number;
  /** True once the whole sequence is ready. */
  ready: boolean;
}

/**
 * Preloads the lantern frame sequence and scrubs it on a pinned canvas:
 * scroll progress across `rootRef` maps to an eased crossfade between
 * adjacent frames; scrolling up plays it back. `onProgress` is called from
 * the rAF loop so overlays can be choreographed without React re-renders.
 */
export function useLanternScrub(
  rootRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  enabled: boolean,
  onProgress?: (p: number) => void,
): LanternScrub {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const { from, to, mix } = frameBlendAt(progressRef.current);
    const a = framesRef.current[from];
    const b = framesRef.current[to];
    if (!a?.complete || !a.naturalWidth) return;
    ctx.globalAlpha = 1;
    drawCover(ctx, a, cw, ch);
    if (mix > 0.001 && b?.complete && b.naturalWidth) {
      ctx.globalAlpha = mix;
      drawCover(ctx, b, cw, ch);
      ctx.globalAlpha = 1;
    }
  }, [canvasRef]);

  // Preload the sequence once.
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    framesRef.current = Array.from({ length: LANTERN_FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      const finish = () => {
        if (!live) return;
        setLoaded((n) => n + 1);
        draw();
      };
      img.onload = finish;
      img.onerror = finish;
      img.src = lanternFrameSrc(i);
      return img;
    });
    return () => {
      live = false;
    };
  }, [enabled, draw]);

  // Map scroll position → progress; redraw + choreograph overlays in rAF.
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let pending = false;
    const compute = () => {
      pending = false;
      const el = rootRef.current;
      if (!el) return;
      const span = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(1, span));
      const p = span > 0 ? scrolled / span : 0;
      progressRef.current = p;
      draw();
      onProgressRef.current?.(p);
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(compute);
    };
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            draw();
            compute();
          })
        : undefined;
    if (canvasRef.current) ro?.observe(canvasRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
    };
  }, [enabled, draw, rootRef, canvasRef]);

  return { loaded, ready: loaded >= LANTERN_FRAME_COUNT };
}
