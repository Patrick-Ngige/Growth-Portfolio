"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillarPlate, { type Lobe } from "./PillarPlate";
import { useReducedMotion } from "./lib/useReducedMotion";

export type PillarCard = { index: string; title: string; body: string };

/**
 * A pinned track holding one sticky panel that reveals a three-circle Venn
 * diagram, then three cards — for the moment in a page where "three separate
 * things" needs to visually resolve into "one compounding system".
 *
 * What makes it work is not the zoom on its own but the interaction of three
 * layers:
 *
 *   1. A page-level colour ramp that runs BEFORE the pin is reached. Over the
 *      approach, `document.documentElement` tints from `approachFrom` to
 *      `plateFill` via a `--pp-page-tint` custom property, so by the time the
 *      panel sticks the page is already that colour. Style your page's own
 *      background with `background: var(--pp-page-tint, <your normal bg>)`
 *      to pick this up — it is a no-op otherwise.
 *   2. The sticky panel's own opaque background. This is the layer being
 *      *revealed*.
 *   3. The plate on top, which opens at 12.5x and pulls back. At that zoom the
 *      viewer sees only the flat centre of the diagram, so the screen reads as
 *      a solid colour field; as it shrinks, the intersection's curved edges
 *      enter frame and the surface behind is progressively uncovered until
 *      the three circles resolve.
 *
 * Remove any one of those three and the effect collapses.
 *
 * Choreography, in pin progress `p` (fixed — see the note on the component):
 *   p 0.00 -> 0.22  dial + title group exits: opacity 1 -> 0, scale 1 -> 0.55,
 *                   rotate 0 -> 15deg
 *   p 0.04 -> 0.52  plate unwinds: scale 12.5 -> 1, rotate 90deg -> 0, power4.out
 *   p 0.55 -> 0.70  plate defocuses: opacity 1 -> 0.4, blur 0 -> 25px
 *   p 0.57 -> 0.78  three cards rise on a stagger
 *   p 0.78 -> 1.00  static hold, then release
 */

const TRACK_VH = 700;

/**
 * Empty tail appended to the timeline purely to create a hold once the cards
 * have locked. This is not optional padding — ScrollTrigger normalises the
 * whole scroll range onto the timeline's own duration, which is set by
 * whichever tween finishes last. So however the phases are positioned, the
 * final animation always lands exactly at the release point and the section
 * moves on the instant the cards arrive. Extending the timeline past the last
 * tween is what buys reading time.
 *
 * Raising this does NOT simply add a pause — it rescales everything, because
 * the scroll range is divided across the whole timeline. Every increase here
 * needs a matching increase in TRACK_VH.
 */
const HOLD = 0.25;

const TICKS = 130;
const TICK_REST = 2.22; // % of dial box
const TICK_PEAK = 8.06; // % at the cursor
const FALLOFF_DEG = 27.7; // influence radius either side
const DIAL_R = 48.9; // tick anchor radius, % of dial box

export default function PinnedPillars({
  eyebrow,
  cards,
  /** Diagram labels for the plate. Defaults to PillarPlate's own Build /
   *  Automate / Grow set — pass your own three to match custom `cards`. */
  lobes,
  /** The sticky panel's ground colour — the brand artwork moment, fixed in
   *  both light and dark themes rather than a themed surface. */
  panelBg = "#0d1112",
  /** Ink over the panel. */
  ink = "#ecebe3",
  /** Muted ink for card copy over the panel. */
  inkMuted = "#b7bcbb",
  /** The plate's central intersection fill, and what the page ramps to on
   *  approach. */
  plateFill = "#2a2f52",
  /** What the page ramps FROM on approach — normally your page's own
   *  background colour. */
  approachFrom = "#08080a",
  /** Card corner radius. */
  radius = "0.625rem",
  /** Page inset, used only by the reduced-motion layout. */
  gutter = "5.5vw",
}: {
  eyebrow: string;
  cards: PillarCard[];
  lobes?: [Lobe, Lobe, Lobe];
  panelBg?: string;
  ink?: string;
  inkMuted?: string;
  plateFill?: string;
  approachFrom?: string;
  radius?: string;
  gutter?: string;
}) {
  const reduced = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  /** Wrapper that owns the defocus (opacity + blur), never the transform. */
  const defocusRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // ── Cursor-proximity ripple on the dial ──────────────────────────────────
  useEffect(() => {
    if (reduced) return;
    const dial = dialRef.current;
    const panel = panelRef.current;
    if (!dial || !panel) return;

    const ticks = Array.from(dial.querySelectorAll<HTMLElement>("[data-tick]"));
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    // Event-driven, coalesced to one frame per pointer move — not a standing
    // rAF loop. Nothing runs when the pointer is still.
    const apply = () => {
      raf = 0;
      if (!pending) return;
      const r = dial.getBoundingClientRect();
      const dx = pending.x - (r.left + r.width / 2);
      const dy = pending.y - (r.top + r.height / 2);
      const cursorDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;

      ticks.forEach((t, i) => {
        const tickDeg = (i / TICKS) * 360;
        // Shortest angular distance around the circle: 0 under the cursor, 180
        // at the antipode.
        const d = Math.abs(((tickDeg - cursorDeg + 540) % 360) - 180);
        const influence = Math.max(0, 1 - d / FALLOFF_DEG);
        t.style.height = `${TICK_REST + (TICK_PEAK - TICK_REST) * influence}%`;
      });
    };

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ticks.forEach((t) => (t.style.height = `${TICK_REST}%`));
    };

    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerleave", onLeave);
    return () => {
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // ── Scroll choreography ──────────────────────────────────────────────────
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;

    const root = document.documentElement;

    const hexToRgb = (hex: string): [number, number, number] => {
      const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
      if (!m) return [8, 8, 10];
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const ctx = gsap.context(() => {
      // Layer 1 — the approach ramp. Deliberately a SEPARATE trigger that
      // starts a viewport before the track, because this effect begins well
      // outside the pinned section's own scroll range.
      const from = hexToRgb(approachFrom);
      const to = hexToRgb(plateFill);
      // Cached, not measured per frame: getBoundingClientRect() inside
      // onUpdate forces a synchronous layout on every scroll tick.
      let split = Math.min(0.9, window.innerHeight / track.getBoundingClientRect().height);
      // Writing a custom property on <html> invalidates style for the whole
      // document, so a redundant write is not free — it is a full-page repaint.
      let lastWritten = "";

      const writeTint = (t: number) => {
        if (t <= 0.001) {
          // Release the property rather than writing the base colour back, so
          // a later theme/colour change is free to move it without an inline
          // style outranking the value it was derived from.
          if (lastWritten !== "") {
            lastWritten = "";
            root.style.removeProperty("--pp-page-tint");
          }
          return;
        }
        const c = from.map((f, i) => Math.round(f + (to[i] - f) * t));
        const next = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        if (next === lastWritten) return;
        lastWritten = next;
        root.style.setProperty("--pp-page-tint", next);
      };

      ScrollTrigger.create({
        trigger: track,
        start: "top bottom", // one viewport before the pin
        end: "bottom bottom", // pin release
        invalidateOnRefresh: true,
        onRefresh: () => {
          split = Math.min(0.9, window.innerHeight / track.getBoundingClientRect().height);
        },
        onUpdate: (self) => {
          const p = self.progress;
          // Ramp up across the approach, then snap back the moment the pin
          // engages. The snap is deliberate: the sticky panel is opaque for
          // the pin's entire duration, so nothing behind it is visible and a
          // gradual ramp-down buys no visual benefit — it only costs a
          // full-page repaint on every frame of the most expensive animation
          // on the page.
          writeTint(p < split ? p / split : 0);
        },
      });

      // Layers 2 and 3 — everything inside the pin, on one scrubbed timeline.
      const cardEls = cardsRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Plate unwind. power4.out holds near 12.5 briefly then decays hard,
      // which is what makes the reveal feel like a camera pulling back rather
      // than a linear shrink.
      tl.fromTo(
        plateRef.current,
        { scale: 12.5, rotate: 90 },
        { scale: 1, rotate: 0, duration: 0.48, ease: "power4.out" },
        0.04,
      );

      // Group exit — animated on the WRAPPER, so dial and title leave as one
      // object. There is deliberately no separate size tween on the dial: the
      // group is already scaling 1 -> 0.55, and a second tween double-counts.
      tl.fromTo(
        groupRef.current,
        { opacity: 1, scale: 1, rotate: 0 },
        { opacity: 0, scale: 0.55, rotate: 15, duration: 0.22 },
        0,
      );

      // Defocus on the wrapper, so it never competes with the scale/rotate
      // running on the child. Splitting them is a performance fix: blurring
      // the same element being scaled re-rasterizes the diagram every frame
      // with no cached texture to work from. This wrapper never transforms,
      // so hinting `filter` promotes it to its own layer and the blur applies
      // to a cached raster instead.
      tl.to(defocusRef.current, { opacity: 0.4, filter: "blur(25px)", duration: 0.15 }, 0.55);

      if (cardEls?.length) {
        // `y: 0` on both ends is load-bearing. The inline translateY(120%)
        // below exists so SSR paints the cards already offset, but GSAP
        // resolves that percentage into a *pixel* y on first read — so
        // tweening yPercent alone leaves the pixel offset in place forever and
        // the cards settle a full card-height low.
        tl.fromTo(
          cardEls,
          { y: 0, yPercent: 120, opacity: 0 },
          { y: 0, yPercent: 0, opacity: 1, duration: 0.21, stagger: 0.045 },
          0.57,
        );
      }

      // The hold — see HOLD above for why this is required rather than
      // cosmetic.
      tl.to({}, { duration: HOLD }, 0.87);
    }, trackRef);

    return () => {
      ctx.revert();
      root.style.removeProperty("--pp-page-tint");
    };
  }, [cards, reduced, approachFrom, plateFill]);

  const cardEls = cards.map((c, i) => (
    <article
      key={c.title}
      data-card
      className="pp-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "0.9vw",
        borderRadius: radius,
        border: "1px solid rgb(255 255 255 / 0.16)",
        background: "rgb(255 255 255 / 0.06)",
        padding: "1.4vw",
        willChange: "transform",
        width: reduced ? "100%" : "21vw",
        color: ink,
        // The diagonal — first card sits high, last sits low. Neutralised on
        // narrow viewports via the embedded stylesheet below, where the row
        // becomes a column and a staircase has nowhere to go.
        marginTop: !reduced && i === 0 ? "19vh" : undefined,
        marginBottom: !reduced && i === 2 ? "19vh" : undefined,
        ...(reduced ? null : { transform: "translateY(120%)", opacity: 0 }),
      }}
    >
      <span style={{ fontSize: "0.8125rem", letterSpacing: "0.14em", textTransform: "uppercase", fontVariantNumeric: "tabular-nums", color: inkMuted }}>
        {c.index}
      </span>
      <h3 style={{ fontSize: "clamp(1.5rem,1.35rem+.75vw,2rem)", lineHeight: 1.18, fontWeight: 600 }}>{c.title}</h3>
      <p style={{ fontSize: "clamp(.875rem,.85rem+.12vw,.9375rem)", lineHeight: 1.55, color: inkMuted }}>{c.body}</p>
    </article>
  ));

  // ── Reduced motion ───────────────────────────────────────────────────────
  // Not a softened version of the pin — a different section. A 700vh track is
  // markup, not motion, so it cannot be branched from inside an effect: left
  // in place it would be seven screens of scrolling past a static panel. The
  // resolved state is what the animation was travelling towards anyway.
  if (reduced) {
    return (
      <section
        style={{ width: "100%", padding: `14vh ${gutter}`, background: panelBg, color: ink }}
        aria-labelledby="pp-title"
      >
        <div style={{ margin: "0 auto", display: "flex", maxWidth: "42rem", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <PillarPlate lobes={lobes} ink={ink} fill={plateFill} style={{ width: "100%", maxWidth: "26rem" }} />
          <h2 id="pp-title" style={{ marginTop: "2rem", fontSize: "clamp(1.875rem,1.6rem+1.4vw,2.75rem)", fontWeight: 600 }}>
            {eyebrow}
          </h2>
        </div>
        <div style={{ marginTop: "8vh", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="pp-reduced-grid">
          {cardEls}
        </div>
        <style>{`@media (max-width:1024px){.pp-reduced-grid{grid-template-columns:1fr;}}`}</style>
      </section>
    );
  }

  return (
    // Margins give the pin room to breathe on both sides — without them the
    // track butts against whatever sits above and below it, so the panel
    // snaps in and releases with no separation at all.
    <div ref={trackRef} style={{ position: "relative", marginTop: "10vh", marginBottom: "10vh", overflow: "clip", height: `${TRACK_VH}vh` }}>
      {/* Layer 2: the opaque panel. This is what the plate uncovers — without
          it the plate would shrink against the tinted page and nothing would
          appear to be revealed. */}
      <section
        ref={panelRef}
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: panelBg,
          color: ink,
        }}
        aria-labelledby="pp-title"
      >
        {/* Layer 3: the plate. Opens at 12.5x so only the filled centre is on
            screen. 55.6vw matters: the centre intersection is ~24% of the
            plate, so at 12.5x that is ~167vw of flat colour. Sized smaller,
            the intersection's curved corners clip into the viewport corners
            on the first frame and the section opens on a visible shape
            instead of an unbroken field. */}
        <div
          ref={defocusRef}
          className="pp-plate-wrap"
          style={{ position: "absolute", aspectRatio: "1 / 1", width: "55.6vw", willChange: "filter, opacity" }}
        >
          <div ref={plateRef} style={{ height: "100%", width: "100%", willChange: "transform", transform: "scale(12.5) rotate(90deg)" }}>
            <PillarPlate lobes={lobes} ink={ink} fill={plateFill} style={{ height: "100%", width: "100%" }} />
          </div>
        </div>

        {/* Dial + title, exiting as a group. */}
        <div
          ref={groupRef}
          // `marginTop` nudges the dial down off the nav. The group is the
          // panel's only in-flow flex item and the panel centres it, so the
          // margin box is what gets centred — a 12vh top margin shifts the
          // circle down by half that. Deliberately a margin and not a
          // translate: the group's transform is owned by the scrubbed exit
          // tween.
          style={{ position: "relative", zIndex: 10, marginTop: "12vh", display: "flex", width: "100%", alignItems: "center", justifyContent: "center", willChange: "transform" }}
        >
          <div ref={dialRef} className="pp-dial" style={{ position: "relative", display: "grid", placeItems: "center", width: "47vw", height: "47vw" }}>
            {Array.from({ length: TICKS }, (_, i) => {
              const deg = (i / TICKS) * 360;
              const rad = (deg * Math.PI) / 180;
              // Rounded deliberately. Unrounded, these serialise to full float
              // precision on the server while the browser normalises the
              // parsed attribute to fewer digits, and React flags every one of
              // the 130 ticks as a hydration mismatch.
              const left = (50 + DIAL_R * Math.sin(rad)).toFixed(4);
              const top = (50 - DIAL_R * Math.cos(rad)).toFixed(4);
              return (
                <span
                  key={i}
                  data-tick
                  aria-hidden
                  style={{
                    position: "absolute",
                    transition: "height 300ms ease-out",
                    left: `${left}%`,
                    top: `${top}%`,
                    width: "0.59%",
                    height: `${TICK_REST}%`,
                    background: ink,
                    transform: `translate(-50%, -100%) rotate(${deg.toFixed(4)}deg)`,
                    transformOrigin: "center bottom",
                  }}
                />
              );
            })}

            <h2 id="pp-title" className="pp-dial-title" style={{ position: "relative", maxWidth: "14ch", textAlign: "center", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.015em" }}>
              {eyebrow}
            </h2>
          </div>
        </div>

        {/* Cards, on their ascending diagonal.
            `inset:0` is load-bearing: absolutely positioned without insets the
            row falls at its static position — below the dial group — so the
            whole diagonal sits low and the leading card finishes at the
            viewport floor. Filling the panel lets `alignItems:center` actually
            centre it. On narrow viewports (embedded stylesheet below) the
            diagonal becomes a centred column — NOT hidden: these three cards
            are the section's content, and hiding them would leave small
            screens scrolling a 700vh pin that resolves into an empty panel. */}
        <div ref={cardsRef} className="pp-cards" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "5.5vw" }}>
          {cardEls}
        </div>
      </section>

      {/* Scoped responsive overrides — embedded so the component needs no
          external CSS import at all. */}
      <style>{`
        .pp-dial-title { font-size: 3.3vw; }
        @media (max-width: 1024px) {
          .pp-plate-wrap { width: 80vw; }
          .pp-dial-title { font-size: 6vw; }
          .pp-cards { flex-direction: column; gap: 1.6vh; padding-left: 8vw; padding-right: 8vw; }
          .pp-card { width: 100% !important; gap: 0.5rem !important; margin-top: 0 !important; margin-bottom: 0 !important; padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
