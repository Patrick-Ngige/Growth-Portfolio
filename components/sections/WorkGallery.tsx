'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

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
 * 3. Fanned stack (whatever's left after the hero and coverflow claim
 *    theirs) - cards resting in a flat, overlapping fan; hovering pops one
 *    up, scales it, and tilts it to a SHARPER angle rather than
 *    straightening it, so it reads as being pulled forward, not just
 *    enlarged in place.
 *
 * All three concepts and their exact numbers were prototyped and approved
 * in a standalone artifact against PulseKE's real screenshots before
 * landing here.
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
  const coverflowImages = rest.length >= 3 ? (rest.slice(0, 3) as [string, string, string]) : null;
  const stackImages = rest.length >= 3 ? rest.slice(3) : rest;
  return { hero, count: images.length, coverflowImages, stackImages };
}

function fanTransform(i: number, n: number) {
  if (n === 1) return { xVw: 0, rest: -4, hover: 4 };
  const t = i / (n - 1);
  const xVw = -13 + t * 26;
  const rest = -12 + t * 24;
  const hover = rest + (rest >= -1 ? 8 : -8);
  return { xVw, rest, hover };
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

export function FannedStack({ images, company }: { images: string[]; company: string }) {
  return (
    <div className="relative mx-auto flex h-[280px] w-full max-w-3xl items-center justify-center sm:h-[360px] lg:h-[420px]">
      {images.map((src, i) => {
        const { xVw, rest, hover } = fanTransform(i, images.length);
        const restTransform = `translateX(${xVw}vw) rotate(${rest}deg)`;
        const hoverTransform = `translateX(${xVw}vw) translateY(-40px) scale(1.22) rotate(${hover}deg)`;
        return (
          <div
            key={src}
            className="absolute cursor-pointer overflow-hidden rounded-[18px] border border-[var(--border-color)] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: 'min(42vw, 380px)',
              transform: restTransform,
              zIndex: i + 1,
              boxShadow: '0 20px 44px -16px rgba(0,0,0,0.65)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = hoverTransform;
              e.currentTarget.style.zIndex = '10';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = restTransform;
              e.currentTarget.style.zIndex = String(i + 1);
            }}
          >
            <img src={src} alt={`${company} screenshot`} className="w-full" style={{ aspectRatio: '4/3', objectFit: 'cover' }} />
          </div>
        );
      })}
    </div>
  );
}
