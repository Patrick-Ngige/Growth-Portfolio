"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * An image that assembles itself out of scattered, blurred tiles as you scroll.
 *
 * No canvas and no WebGL: a CSS grid where every cell paints the *same* image
 * with `background-size: <cols*100>% <rows*100>%` and a per-cell
 * `background-position`, so each cell shows exactly one slice and at rest the
 * grid reads as one seamless picture. Far cheaper than a shader and survives on
 * any GPU.
 *
 * Assembly is per-tile scroll-scrubbed: tiles fly in from scattered positions in
 * depth (translateZ under the ancestor's perspective), scale 0.2 -> 1, blur ->
 * 0, opacity 0 -> 1, shuffled so they land out of order. Once assembled the grid
 * retires to an identical single-image underlay, dropping every pinned tile
 * layer right before the box animates further (e.g. to full-screen, or into a
 * video handoff).
 */
function hash(n: number, salt: number) {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function TileMosaic({
  src,
  cols = 7,
  rows = 4,
  className,
  /** Element that drives the scrub (defaults to this component). */
  triggerRef,
  start = "top 80%",
  end = "+=1800",
}: {
  src: string;
  cols?: number;
  rows?: number;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const underlayRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => {
    const out: { x: number; y: number; blur: number; order: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        out.push({
          x: cols === 1 ? 0 : (c / (cols - 1)) * 100,
          y: rows === 1 ? 0 : (r / (rows - 1)) * 100,
          blur: 20 + Math.round(hash(i, 1) * 20), // 20-40px
          order: hash(i, 2),
        });
      }
    }
    return out;
  }, [cols, rows]);

  useEffect(() => {
    const grid = gridRef.current;
    const underlay = underlayRef.current;
    if (!grid || !underlay) return;

    const cells = Array.from(grid.children) as HTMLElement[];

    // Reduced motion: hand over the finished image immediately, no assembly.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      underlay.style.visibility = "visible";
      grid.style.visibility = "hidden";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(cells, {
        opacity: 0,
        scale: 0.2,
        x: () => gsap.utils.random(-900, 900),
        y: () => gsap.utils.random(-600, 600),
        z: () => gsap.utils.random(-2400, -1000),
        filter: (i: number) => `blur(${tiles[i].blur}px)`,
      });

      const order = cells
        .map((el, i) => ({ el, k: tiles[i].order }))
        .sort((a, b) => a.k - b.k)
        .map((o) => o.el);

      // Declared before the gsap.to() below: ScrollTrigger.create() runs an
      // immediate refresh/update synchronously, which can fire onLeave/onEnterBack
      // right away if the scroll position already satisfies the trigger on load.
      // A `const retire` declared after the call is still in the temporal dead
      // zone at that moment — "Cannot access 'retire' before initialization".
      const retire = (done: boolean) => {
        underlay.style.visibility = done ? "visible" : "hidden";
        grid.style.visibility = done ? "hidden" : "visible";
        cells.forEach((c) => {
          c.style.willChange = done ? "auto" : "transform, filter, opacity";
        });
      };

      gsap.to(order, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        z: 0,
        filter: "blur(0px)",
        ease: "none",
        stagger: { each: 0.035 },
        scrollTrigger: {
          trigger: triggerRef?.current ?? grid,
          start,
          end,
          scrub: 1,
          invalidateOnRefresh: true,
          onLeave: () => retire(true),
          onEnterBack: () => retire(false),
        },
      });

      retire(false);
    }, rootRef);

    return () => ctx.revert();
  }, [tiles, triggerRef, start, end]);

  const sliceStyle = {
    backgroundImage: `url(${src})`,
    backgroundSize: "100% 100%",
  } as const;

  return (
    <div
      ref={rootRef}
      className={`th-mosaic-root ${className ?? ""}`}
      style={{ position: "relative", height: "100%", width: "100%", transformStyle: "preserve-3d" }}
    >
      <div
        ref={underlayRef}
        className="th-mosaic-underlay"
        style={{ position: "absolute", inset: 0, ...sliceStyle, visibility: "hidden" }}
        aria-hidden="true"
      />

      <div
        ref={gridRef}
        className="th-mosaic-grid"
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          transformStyle: "preserve-3d",
        }}
        aria-hidden="true"
      >
        {tiles.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${cols * 100}% ${rows * 100}%`,
              backgroundPosition: `${t.x}% ${t.y}%`,
              willChange: "transform, filter, opacity",
              // From-state inline so the very first paint (before hydration) is
              // already correct rather than the whole finished photo flashing.
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
