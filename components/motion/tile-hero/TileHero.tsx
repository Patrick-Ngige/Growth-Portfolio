"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, registerEases } from "./lib/eases";
import { useReducedMotion } from "./lib/useReducedMotion";
import MaskedText from "./MaskedText";
import Showreel from "./Showreel";
import TileMosaic from "./TileMosaic";

/**
 * TileHero — a tall sticky scroll set-piece: a headline collapses into a
 * paired `MorphingWordmark` in your nav, a poster image assembles itself out
 * of scattered 3D tile fragments as you scroll, then hands off seamlessly to a
 * looping video that expands to fill the viewport.
 *
 * A tall sticky track (650vh) with the hero pinned to its top. The wrapper's
 * height IS the scroll budget: the hero stays pinned ~5.5 viewports, and when
 * the wrapper runs out the sticky releases and the whole thing scrolls off on
 * its own. No GSAP pin, so no pin-spacer.
 *
 * Beats (as % of the track):
 *   0 -> 400px   wordmark collapses (in your nav) and the copy rises to meet it
 *   0 -> 55%     tile mosaic assembles from scattered fragments, scroll-scrubbed
 *   42% -> 58%   copy exits back down into its own masks
 *   50% -> 78%   media box expands to fill the viewport; video fades in at ~56%
 *
 * PAIRS WITH `MorphingWordmark`: mount that in your nav and this as your hero.
 * They synchronise via a shared `[data-wordmark-row]` DOM attribute — no other
 * wiring required. The mosaic assembles the video's own poster frame, so the
 * hand-off from tiles to moving footage is seamless.
 *
 * Reduced motion renders a different, static hero entirely — a single
 * viewport with the video and the copy, no 650vh scrub. A pinned scrubbed
 * set-piece is exactly the motion that preference asks not to run.
 *
 * Zero CSS required to render correctly. Import `tile-hero.css` once if you
 * also want the headline/subcopy row to stack on narrow viewports.
 */

/** Windowed size of the media box before it expands. 1.784:1 by default. */
const BOX_W = "69.4vw";
const BOX_H = "38.9vw";

const TRACK_VH = 650;
const RELEASE_PCT = ((TRACK_VH - 100) / TRACK_VH) * 100; // ~84.6
const EXPAND_START = 50;
const EXPAND_END = Math.round(RELEASE_PCT) - 7; // ~78
const REEL_FADE_START = 56;
const REEL_FADE_END = 70;
const REEL_PLAY_AT = 44;

export type TileHeroProps = {
  /** Large display headline. Keep it short — it renders at display scale. */
  headline: string;
  /** Supporting copy beneath the headline. `\n` starts a new line. */
  subcopy: string;
  /** Looping video that the assembled tiles hand off to. */
  videoSrc: string;
  /** The video's first frame (or any representative still) — also what the
   *  tile mosaic assembles. */
  posterSrc: string;
  /** Small eyebrow line shown above the headline in the reduced-motion hero
   *  only (the full hero's headline carries this weight on its own). */
  eyebrow?: string;
  /** Ground colour behind the whole set-piece. */
  bg?: string;
  /** Primary ink colour for headline/copy. */
  ink?: string;
  /** Muted ink for secondary copy (eyebrow, subcopy in the reduced hero). */
  inkMuted?: string;
  /** Scrim laid over the video so text always has contrast, regardless of the
   *  footage's own brightness. */
  scrim?: string;
  /** Page inset used for the copy and reduced-hero padding. */
  gutter?: string;
  /** Height reserved for a fixed nav, so the reduced hero's copy clears it. */
  navHeight?: string;
};

function ReducedHero({
  headline,
  subcopy,
  videoSrc,
  posterSrc,
  eyebrow,
  bg,
  ink,
  inkMuted,
  scrim,
  gutter,
  navHeight,
}: Required<Omit<TileHeroProps, "eyebrow">> & { eyebrow?: string }) {
  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        minHeight: "100svh",
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        paddingTop: `calc(${navHeight} + 2rem)`,
        background: bg,
        color: ink,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <Showreel src={videoSrc} playing={false} poster={posterSrc} style={{ height: "100%", width: "100%" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: scrim }} aria-hidden />

      <div style={{ position: "relative", zIndex: 10, padding: `0 ${gutter} 8vh` }}>
        {eyebrow && (
          <p
            style={{
              marginBottom: "1.5rem",
              fontSize: "clamp(.75rem,.73rem+.1vw,.8125rem)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: inkMuted,
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={{
            maxWidth: "14ch",
            fontSize: "clamp(2.75rem,1.6rem+5.8vw,6.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {headline}
        </h1>
        <p
          style={{
            marginTop: "1.5rem",
            maxWidth: "46ch",
            fontSize: "clamp(1.25rem,1.18rem+.35vw,1.5rem)",
            lineHeight: 1.38,
            color: inkMuted,
          }}
        >
          {subcopy}
        </p>
      </div>
    </section>
  );
}

export default function TileHero({
  headline,
  subcopy,
  videoSrc,
  posterSrc,
  eyebrow,
  bg = "#0d1112",
  ink = "#ecebe3",
  inkMuted = "#b7bcbb",
  scrim = "linear-gradient(to bottom, rgb(8 8 10 / 0.74) 0%, rgb(8 8 10 / 0.42) 45%, rgb(8 8 10 / 0.9) 100%)",
  gutter = "5.5vw",
  navHeight = "4.5rem",
}: TileHeroProps) {
  const reduced = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const boxRiseRef = useRef<HTMLDivElement>(null);
  const boxLiftRef = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textRiseRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [reelPlaying, setReelPlaying] = useState(false);

  useEffect(() => {
    if (reduced) return;
    registerEases();
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    const box = boxRef.current;
    const boxRise = boxRiseRef.current;
    const boxLift = boxLiftRef.current;
    const layer = videoLayerRef.current;
    const backdrop = backdropRef.current;
    const rise = textRiseRef.current;
    const text = textRef.current;
    if (!track || !box || !boxRise || !boxLift || !layer || !backdrop || !rise || !text)
      return;

    const ctx = gsap.context(() => {
      // Measured, never guessed. The paired wordmark is a flex row spanning the
      // viewport, so its height scales with viewport *width*; a fixed offset
      // that clears it at one width lands on the headline at another. Measure
      // the real geometry and stack three bands — wordmark, copy, media.
      const restOf = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        const y = (gsap.getProperty(el, "y") as number) || 0;
        return { top: r.top - y, bottom: r.bottom - y };
      };

      const measure = () => {
        const mark = document.querySelector("[data-wordmark-row]");
        const markBottom = mark?.getBoundingClientRect().bottom ?? 0;
        const copy = restOf(rise);
        const textClear = Math.max(0, Math.round(markBottom - copy.top + 40));
        const media = restOf(boxRise);
        const boxRest = Math.max(0, Math.round(copy.bottom + 48 - media.top));
        return { textClear, boxRest };
      };

      // Copy rises into place as the wordmark collapses — tied to the same 400px
      // the morph uses by default, so they read as one gesture.
      gsap.fromTo(
        rise,
        { y: () => measure().textClear },
        {
          y: 0,
          ease: EASE.glide,
          scrollTrigger: { trigger: track, start: "top top", end: "+=400", scrub: 0.8, invalidateOnRefresh: true },
        },
      );

      // Media starts low — only its top edge in frame, below the copy — and
      // rises into centre over the same gesture, so copy and media never share a
      // band at rest.
      gsap.fromTo(
        boxRise,
        { y: () => measure().textClear },
        {
          y: "0vh",
          ease: EASE.glide,
          scrollTrigger: { trigger: track, start: "top top", end: "+=400", scrub: 0.8, invalidateOnRefresh: true },
        },
      );

      // Exit: the words drop back into the same masks they rose out of.
      gsap.to(text.querySelectorAll("[data-unit]"), {
        yPercent: 100,
        opacity: 0.1,
        ease: EASE.portal,
        stagger: 0.03,
        scrollTrigger: { trigger: track, start: "42% top", end: "58% top", scrub: 1, invalidateOnRefresh: true },
      });

      // Expand to the full viewport and lift the box back to centre as it grows.
      // ease "none": under scrub the scroll position IS the playhead, so an ease
      // on top would make the box surge independently of the wheel.
      const expandTrigger = {
        trigger: track,
        start: `${EXPAND_START}% top`,
        end: `${EXPAND_END}% top`,
        scrub: 1.2,
        invalidateOnRefresh: true,
      };

      gsap.fromTo(
        box,
        { width: BOX_W, height: BOX_H },
        {
          width: "100vw",
          height: "100vh",
          ease: "none",
          scrollTrigger: {
            ...expandTrigger,
            onToggle: (self) => {
              box.style.willChange = self.isActive ? "width, height" : "auto";
            },
          },
        },
      );

      gsap.fromTo(
        boxLift,
        { y: () => measure().boxRest },
        { y: 0, ease: "none", scrollTrigger: expandTrigger },
      );

      // Video fades in over the assembled mosaic, partway into the expand.
      gsap.fromTo(
        [backdrop, layer],
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: track, start: `${REEL_FADE_START}% top`, end: `${REEL_FADE_END}% top`, scrub: 1, invalidateOnRefresh: true },
        },
      );

      // Playback window, started before the video is visible so its first
      // visible frames are already in motion. onToggle handles both scroll
      // directions.
      ScrollTrigger.create({
        trigger: track,
        start: `${REEL_PLAY_AT}% top`,
        end: "bottom top",
        invalidateOnRefresh: true,
        onToggle: (self) => setReelPlaying(self.isActive),
      });
    }, trackRef);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <ReducedHero
        headline={headline}
        subcopy={subcopy}
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        eyebrow={eyebrow}
        bg={bg}
        ink={ink}
        inkMuted={inkMuted}
        scrim={scrim}
        gutter={gutter}
        navHeight={navHeight}
      />
    );
  }

  return (
    <div ref={trackRef} data-hero-track style={{ position: "relative", height: `${TRACK_VH}vh`, color: ink }}>
      <section style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: bg }}>
        {/* Media, centred so it grows about the middle and lands flush at full
            expand. */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Two wrappers — the intro rise and the expand lift each drive `y`,
              and sharing one element would let the later tween fight the
              earlier. */}
          <div ref={boxLiftRef}>
            <div ref={boxRiseRef}>
              <div
                ref={boxRef}
                style={{
                  position: "relative",
                  width: BOX_W,
                  height: BOX_H,
                  perspective: "1200px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Backdrop stays transparent until the video needs a floor. */}
                <div ref={backdropRef} style={{ position: "absolute", inset: 0, zIndex: 0, background: "#000", opacity: 0 }} />

                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                  <TileMosaic src={posterSrc} cols={7} rows={4} triggerRef={trackRef} start="top top" end="55% top" />
                </div>

                <div
                  ref={videoLayerRef}
                  style={{ position: "absolute", inset: 0, zIndex: 10, overflow: "hidden", opacity: 0 }}
                >
                  <Showreel src={videoSrc} poster={posterSrc} playing={reelPlaying} style={{ height: "100%", width: "100%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copy above the media. */}
        <div
          ref={textRiseRef}
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: "0 0 auto 0",
            zIndex: 20,
            padding: `16vh ${gutter} 0`,
          }}
        >
          <div ref={textRef} className="th-copy-row">
            <MaskedText as="h1" by="word" delay={0.35} blurPx={8} className="th-headline">
              {headline}
            </MaskedText>

            <MaskedText as="p" by="line" delay={0.75} className="th-subcopy">
              {subcopy}
            </MaskedText>
          </div>
        </div>
      </section>

      {/* Scoped, self-contained defaults for the two text elements above —
          inline styles can't target children of a component this way, so these
          two live as a tiny embedded stylesheet rather than a required import. */}
      <style>{`
        .th-headline { max-width: 10ch; font-size: clamp(2.75rem,1.6rem+5.8vw,6.5rem); font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
        .th-subcopy { max-width: 34ch; font-size: clamp(1.25rem,1.18rem+.35vw,1.5rem); line-height: 1.38; }
      `}</style>
    </div>
  );
}
