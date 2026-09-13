"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, registerEases } from "./lib/eases";

/**
 * Wordmark that collapses from a full-bleed display lockup into a small
 * top-left nav mark as the page is scrolled.
 *
 * The giant wordmark and the small nav mark are the SAME elements. Each
 * character is an SVG in a `flex` row with `flex: <glyphWidth> 1 0%`. Because
 * the basis is 0, every character is sized purely from its flex-grow share of
 * whatever width the container currently has, and `height: auto` preserves its
 * aspect. So the whole morph is driven by animating exactly two things on the
 * container: its width and its padding. No per-character tweens, no FLIP, no
 * measuring during the animation.
 *
 * Glyph widths are measured from the real font once loaded rather than
 * hardcoded — guessing them and forcing the type to fit with `textLength` makes
 * letters visibly stretch.
 *
 * `mix-blend-mode: difference` is what makes this legible over any background
 * from a single fill: against a dark ground it differences to near-white,
 * against a light ground it differences to near-black — including over a
 * moving hero video, which no theme token could guarantee contrast against.
 *
 * PAIRS WITH `TileHero`: that component measures this one's row element via
 * the `data-wordmark-row` attribute to time its own headline's entrance. Mount
 * this in your nav and `<TileHero />` as your hero and the two synchronise
 * automatically — no other wiring required.
 */

const MEASURE_PX = 160;

export default function MorphingWordmark({
  /** The wordmark text, e.g. "iD7", "Acme". Keep it short — 2-4 glyphs read
   *  best at full-bleed scale. */
  mark,
  /** Scroll distance (px) over which the collapse completes. */
  distance = 400,
  /** Fill colour before the difference blend — a light, near-white default
   *  reads correctly against both dark and light grounds via the blend. */
  ink = "#f2f2f2",
  /** Render permanently in the collapsed nav-mark state, with no morph — use
   *  on interior pages that don't have a matching full-bleed hero. */
  collapsed = false,
  /** CSS length for the collapsed nav mark's left inset, e.g. "5.5vw". */
  gutter = "5.5vw",
  /** CSS length for the collapsed mark's top padding while parked (its resting
   *  position once the morph finishes). */
  navHeight = "4.5rem",
}: {
  mark: string;
  distance?: number;
  ink?: string;
  collapsed?: boolean;
  gutter?: string;
  navHeight?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const chars = useMemo(() => Array.from(mark), [mark]);
  // Fallback ratios keep SSR sane before the font resolves.
  const [widths, setWidths] = useState<number[]>(() => chars.map(() => 100));
  const [viewH, setViewH] = useState(118);

  /** Rendered height of the row per unit of width. The flex row sizes every
   *  glyph from its share of the container, so row height is
   *  `contentWidth * viewH / totalGlyphWidth` — which makes the height budget
   *  invertible into a width. */
  const aspect = useMemo(
    () => viewH / (widths.reduce((a, b) => a + b, 0) || 1),
    [widths, viewH],
  );

  useEffect(() => {
    let cancelled = false;

    const measure = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `600 ${MEASURE_PX}px sans-serif`;

      const next = chars.map((c) => ctx.measureText(c).width);
      const m = ctx.measureText(mark);
      const inkHeight =
        (m.actualBoundingBoxAscent || MEASURE_PX * 0.72) +
        (m.actualBoundingBoxDescent || 0);

      if (!cancelled) {
        setWidths(next);
        setViewH(Math.round(inkHeight));
      }
    };

    if (document.fonts?.ready) document.fonts.ready.then(measure);
    else measure();

    return () => {
      cancelled = true;
    };
  }, [chars, mark]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const park = () =>
      gsap.set(row, {
        width: "132px",
        paddingTop: "20px",
        paddingLeft: gutter,
        paddingRight: "0px",
      });

    // A scroll-scrubbed lockup is exactly the kind of motion someone with
    // vestibular sensitivity asked not to have; the mark still does its job
    // parked in the nav.
    if (collapsed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      park();
      return;
    }

    registerEases();
    gsap.registerPlugin(ScrollTrigger);

    // Resolved to pixels through a probe element rather than parsed from the
    // raw CSS length string: lengths may be in rem/vh/calc(), and the browser
    // has to do that unit conversion for GSAP to have a number to tween.
    const resolvePx = (value: string) => {
      const probe = document.createElement("div");
      probe.style.cssText = `position:absolute;visibility:hidden;height:${value}`;
      document.body.appendChild(probe);
      const px = probe.getBoundingClientRect().height;
      probe.remove();
      return px;
    };
    const startPadTop = resolvePx(`calc(${navHeight} + 1.5rem)`) || 96;

    /**
     * Opening width of the lockup. Capped by viewport HEIGHT as well as width:
     * a flex row of glyphs is sized by width, but what collides with the hero
     * copy beneath it is its *height* — so on a short, wide viewport a
     * width-only cap can still produce a lockup taller than the space below
     * it. The row's height is `contentWidth * viewH / totalGlyphWidth`, so the
     * aspect is known from the glyph metrics already measured above and the
     * height budget can be inverted into a width.
     */
    const startWidth = () => {
      const w = window.innerWidth;
      const byWidth = Math.min(w * (w < 768 ? 0.72 : 0.5), 820);
      const byHeight = (window.innerHeight * 0.3) / aspect;
      return Math.max(120, Math.min(byWidth, byHeight));
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        row,
        {
          width: startWidth,
          paddingTop: startPadTop,
          paddingLeft: gutter,
          paddingRight: gutter,
        },
        {
          width: "132px",
          paddingTop: "20px",
          paddingLeft: gutter,
          paddingRight: "0px",
          ease: EASE.glide,
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: `+=${distance}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    }, rowRef);

    return () => ctx.revert();
    // `aspect` participates because the height budget is derived from it, and it
    // changes once when the real font resolves.
  }, [distance, collapsed, aspect, gutter, navHeight]);

  return (
    <div
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        width: "100vw",
        mixBlendMode: "difference",
      }}
    >
      <div
        ref={rowRef}
        data-wordmark-row
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5%",
          overflow: "hidden",
        }}
      >
        {chars.map((c, i) => {
          const w = Math.max(1, widths[i]);
          return (
            <svg
              key={i}
              viewBox={`0 0 ${w} ${viewH}`}
              style={{ height: "auto", flex: `${w} 1 0%` }}
              aria-hidden="true"
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fill={ink}
                fontFamily="inherit, sans-serif"
                fontSize={MEASURE_PX}
                fontWeight={600}
              >
                {c}
              </text>
            </svg>
          );
        })}
      </div>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {mark}
      </span>
    </div>
  );
}
