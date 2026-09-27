'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { IMAGE_ASPECT } from '@/lib/imageAspect';
import { SHORT_IMAGES } from '@/lib/shortImages';

/**
 * Three image tiers for WorkDetailView, replacing the old equal-weight
 * 3-column grid. Deliberately exported as separate pieces (not one bundled
 * gallery block) so WorkDetailView can space them out between its
 * narrative chapters - hero after Overview, coverflow after Challenge,
 * fanned stack after Build - rather than dumping every screenshot in one
 * spot before the text even starts. Tiers depend on how many screenshots a
 * case study actually has (most have exactly one, a couple have two,
 * PulseKE has six - nothing is padded out to fill a layout):
 *
 * 1. Full-bleed hero (any count >= 1) - the lead shot, with a curtain-style
 *    clip-path reveal that plays forward on scroll-in and reverses on
 *    scroll-out (framer-motion's useInView, once:false), a one-shot
 *    diagonal light sweep replayed on each entrance, and a slow Ken Burns
 *    drift while visible. The CSS lives in globals.css (.gallery-hero*)
 *    since it's a plain two-state reveal, not a scroll-scrubbed timeline.
 * 2. Coverflow (only when there are >= 3 images left after the hero) - the
 *    real Apple Cover Flow technique (perspective + rotateY + translateZ on
 *    the side covers, not a flat blur trick), center cover sharp and
 *    pushed forward, sides rotated away in 3D and pushed back.
 * 3. Vertical stack (whatever's left after the hero and coverflow claim
 *    theirs) - a sticky label in a narrow left column (plain CSS
 *    `lg:sticky`, not a JS/GSAP pin) beside a strict two-up grid of
 *    full-width, uncropped screenshots on the right. Modelled on
 *    pamidordesign.co/work/figcoms's own "Marketing Material" section,
 *    which turned out - after inspecting its DOM live - to have no
 *    scroll-jacking or horizontal motion at all: the label column is
 *    just `position: sticky`, and the taller image column scrolls past
 *    it in normal document flow - that's the entire "images slide up
 *    while the text holds still" effect. Replaced an earlier GSAP-pinned
 *    horizontal slider that fought against this project's own portrait
 *    screenshots by force-cropping them to 4:3, and an even earlier
 *    "one big shot then pairs" composition that made long stacks (KCB
 *    Bank, I&M Bank) taller than they needed to be.
 *
 * All three concepts and their exact numbers were prototyped and approved
 * in a standalone artifact against PulseKE's real screenshots before
 * landing here (the third tier went through two later swaps - fanned
 * stack to pinned slider to this vertical stack - each approved against
 * the "Case Study Structure" artifact and live reference sites in turn).
 */

export interface GalleryTiers {
  hero: string | null;
  count: number;
  coverflowImages: [string, string, string] | null;
  stackImages: string[];
}

export function useGalleryTiers(images?: string[]): GalleryTiers {
  if (!images || images.length === 0) {
    return { hero: null, count: 0, coverflowImages: null, stackImages: [] };
  }
  const [hero, ...rest] = images;
  const restShorts = rest.filter((src) => SHORT_IMAGES.has(src));
  const restTalls = rest.filter((src) => !SHORT_IMAGES.has(src));

  // Fill Coverflow from short images first (its 3-up crop is exactly where
  // they belong); only fall back to whatever's next in line if a case
  // study doesn't have 3 short images to spare.
  let coverflowImages: [string, string, string] | null = null;
  if (restShorts.length >= 3) {
    coverflowImages = restShorts.slice(0, 3) as [string, string, string];
  } else if (rest.length >= 3) {
    coverflowImages = rest.slice(0, 3) as [string, string, string];
  }
  const usedShorts = new Set(coverflowImages?.filter((src) => SHORT_IMAGES.has(src)) ?? []);
  const leftoverShorts = restShorts.filter((src) => !usedShorts.has(src));

  // Mixed case (a case study with both short and full-page screenshots,
  // e.g. KCB Bank): keep the stack tall-only, so any shorts left over once
  // Coverflow's taken its three simply don't appear in it. All-short case
  // (e.g. Fearless Food Battles, which has no full-page shots at all):
  // nothing to mix with, so the leftovers still go in the stack - a stack
  // of uniformly-short images has no rhythm to break.
  const stackImages = restTalls.length > 0 ? restTalls : leftoverShorts;

  return { hero, count: images.length, coverflowImages, stackImages };
}

export function GalleryPlaceholder() {
  return (
    <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background-surface)]">
      <span className="px-3 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        Image pending
      </span>
    </div>
  );
}

export function GalleryHero({ src, company, count }: { src: string; company: string; count: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Continuous scroll-scrubbed scale, not a discrete two-state reveal: the
  // hero sits at 80% (visibly smaller/zoomed out) while it's still entering
  // or leaving the viewport, and grows to its full 100% exactly when it's
  // centred - i.e. in focus. Symmetric on the way out, so scrolling past it
  // shrinks it back down the same way it grew, mirroring the entrance.
  // offset anchors: "start end" = the hero's top just touching the
  // viewport's bottom (fully offscreen below), "center center" = the
  // hero's centre aligned with the viewport's centre (fully in focus),
  // "end start" = the hero's bottom just touching the viewport's top
  // (fully offscreen above).
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // amount:0 + a shrunk root (margin) rather than a percentage `amount`
  // threshold: a percentage-of-element trigger stopped firing reliably
  // once the hero's height was capped below (a tall near-4:3 screenshot
  // still doesn't cleanly cross a fixed percentage on every viewport
  // size), whereas trimming the root by a fixed margin is independent of
  // the element's own height and fires consistently once it's genuinely
  // inside the middle of the viewport, not the instant one pixel appears.
  const inView = useInView(ref, { amount: 0, margin: '-12% 0px -12% 0px', once: false });
  const [sweepKey, setSweepKey] = useState(0);
  const wasInView = useRef(false);

  useEffect(() => {
    if (inView && !wasInView.current) setSweepKey((k) => k + 1);
    wasInView.current = inView;
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      style={{ scale: reducedMotion ? 1 : scale }}
      className={`relative max-h-[78vh] overflow-hidden rounded-2xl border border-[var(--border-color)] ${inView ? 'gallery-hero--in' : ''}`}
    >
      {/* max-h above caps the box itself; object-cover here is what lets a
          near-4:3 screenshot (PulseKE's are 1600x1227) still fill that box
          edge-to-edge instead of leaving letterboxing or forcing its own
          native aspect ratio to dictate a hero taller than the viewport. */}
      <img src={src} alt={`${company} screenshot 1`} className="h-[78vh] w-full object-cover" />
      <div
        key={sweepKey}
        className={`gallery-hero__sweep pointer-events-none absolute inset-0 z-[3] ${inView ? 'gallery-hero--sweep' : ''}`}
        style={{ background: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.22) 50%, transparent 58%)' }}
      />
      <div
        className="gallery-hero__cap absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between p-5 sm:p-6"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-white/65">
          01 / {String(count).padStart(2, '0')}
        </span>
        <span className="text-base font-semibold text-white sm:text-lg">{company}</span>
      </div>
    </motion.div>
  );
}

export function Coverflow({ images, company }: { images: [string, string, string]; company: string }) {
  return (
    <div className="flex items-center justify-center py-4" style={{ perspective: '1400px' }}>
      <div
        className="overflow-hidden rounded-[20px] border border-[var(--border-color)]"
        style={{
          width: 'min(30vw, 300px)',
          marginRight: '-6%',
          filter: 'blur(1.5px) brightness(0.55)',
          transform: 'rotateY(32deg) translateZ(-40px) scale(0.88)',
          transformOrigin: 'right center',
          transformStyle: 'preserve-3d',
          boxShadow: '0 24px 48px -18px rgba(0,0,0,0.7)',
        }}
      >
        <img src={images[0]} alt={`${company} screenshot`} className="w-full" style={{ aspectRatio: '4/3', objectFit: 'cover' }} />
      </div>
      <div
        className="overflow-hidden rounded-[20px] border"
        style={{
          width: 'min(46vw, 460px)',
          zIndex: 2,
          transform: 'translateZ(60px) scale(1.02)',
          boxShadow: '0 40px 80px -16px rgba(0,0,0,0.8)',
          borderColor: 'rgba(255,255,255,0.16)',
          transformStyle: 'preserve-3d',
        }}
      >
        <img src={images[1]} alt={`${company} screenshot`} className="w-full" style={{ aspectRatio: '4/3', objectFit: 'cover' }} />
      </div>
      <div
        className="overflow-hidden rounded-[20px] border border-[var(--border-color)]"
        style={{
          width: 'min(30vw, 300px)',
          marginLeft: '-6%',
          filter: 'blur(1.5px) brightness(0.55)',
          transform: 'rotateY(-32deg) translateZ(-40px) scale(0.88)',
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
          boxShadow: '0 24px 48px -18px rgba(0,0,0,0.7)',
        }}
      >
        <img src={images[2]} alt={`${company} screenshot`} className="w-full" style={{ aspectRatio: '4/3', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

export function VerticalStack({ images, company }: { images: string[]; company: string }) {
  // The left label is genuinely CSS position:sticky (lg:sticky, not a
  // JS/GSAP pin) - confirmed by inspecting figcoms's own "Marketing
  // Material" section live: its label column is plain `lg:sticky`, and
  // the taller image column beside it just scrolls past in normal
  // document flow. That's the whole mechanic - no scroll-jacking. Images
  // are a strict two-up grid throughout (not a first-full-width special
  // case), per direct feedback.
  //
  // Sorted by aspect ratio (not left in their original data order) so
  // that adjacent images - which land in the same grid row, side by side -
  // are close in height. Sorting first and rendering in that order is the
  // standard trick: it guarantees no pair is further apart in ratio than
  // its neighbours in the full sorted list, which is exactly what stops a
  // short screenshot landing next to a much longer one.
  const ordered = useMemo(() => {
    return [...images].sort((a, b) => (IMAGE_ASPECT[a] ?? 0.5) - (IMAGE_ASPECT[b] ?? 0.5));
  }, [images]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-growth">More Screenshots</span>
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {ordered.map((src) => (
          <div key={src} className="overflow-hidden rounded-2xl border border-[var(--border-color)]">
            <img src={src} alt={`${company} screenshot`} className="h-auto w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
