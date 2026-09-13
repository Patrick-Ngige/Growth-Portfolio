"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { EASE, registerEases } from "./lib/eases";

/**
 * Masked rise entrance — units start pushed fully below an overflow-hidden
 * mask at low opacity, then rise into place on a stagger.
 *
 * Two granularities: headings split per *word* (each word arrives as its own
 * beat), body copy splits per *line* (whole lines rise together, which stays
 * readable at small sizes).
 *
 * The initial offset is an inline `transform` rather than a CSS utility class:
 * some utility-CSS frameworks (Tailwind v4 included) compile a translate
 * utility to the standalone CSS `translate` property, which composes *on top
 * of* `transform`. GSAP animates `transform`, so a CSS `translate` would hold
 * the unit at 100% forever and the rise would never be visible. One property,
 * one authority.
 *
 * Reduced motion resolves every unit immediately — the text is the content, so
 * it can never be left sitting below its mask.
 */
export default function MaskedText({
  children,
  as = "p",
  by = "word",
  className,
  delay = 0,
  blurPx = 0,
}: {
  children: string;
  as?: "h1" | "h2" | "p";
  by?: "word" | "line";
  className?: string;
  delay?: number;
  /** Defocus depth the unit resolves *from*, in px — reads as depth rather
   *  than as a flat slide. 0 keeps the two-channel version. */
  blurPx?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const units = el.querySelectorAll<HTMLElement>("[data-unit]");
    if (!units.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(units, { y: 0, yPercent: 0, opacity: 1, filter: "none" });
      return;
    }

    registerEases();

    // Restate the offset through GSAP before tweening it. The inline
    // translateY(100%) below exists so SSR paints the units already hidden, but
    // GSAP resolves that percentage into a *pixel* y offset when it first reads
    // the element — so tweening yPercent alone would animate a channel that was
    // never set, and the pixel offset would sit there forever.
    gsap.set(units, {
      y: 0,
      yPercent: 100,
      opacity: 0.1,
      ...(blurPx ? { filter: `blur(${blurPx}px)` } : null),
    });

    const tween = gsap.to(units, {
      yPercent: 0,
      opacity: 1,
      ...(blurPx ? { filter: "blur(0px)" } : null),
      duration: 1.1,
      ease: EASE.glide,
      stagger: by === "word" ? 0.07 : 0.12,
      delay,
    });

    return () => {
      tween.kill();
    };
  }, [children, by, delay, blurPx]);

  const Tag = as;
  const units =
    by === "word" ? children.split(/\s+/) : children.split(/\n/).filter(Boolean);

  return (
    <Tag className={className}>
      <span ref={ref} style={{ display: "inline" }}>
        {units.map((u, i) => (
          <span
            key={i}
            style={
              by === "word"
                ? { position: "relative", marginRight: "0.28em", display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }
                : { position: "relative", display: "block", overflow: "hidden" }
            }
          >
            <span
              data-unit
              style={{
                display: "block",
                transform: "translateY(100%)",
                opacity: 0.1,
                ...(blurPx ? { filter: `blur(${blurPx}px)` } : null),
              }}
            >
              {u}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
