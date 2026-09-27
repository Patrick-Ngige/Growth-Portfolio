'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { caseStudies, categoryFilters, type CaseStudy } from '@/lib/data';
import GhostHeading from '@/components/motion/GhostHeading';
import { SHORT_IMAGES } from '@/lib/shortImages';

/**
 * /work index - a text list with a hover-reveal preview panel, replacing
 * the old equal-weight card grid. Mechanic prototyped and approved in a
 * standalone artifact against real case studies first (inspired by
 * wearefred.co.uk's work list: rows dim except the hovered one, tags fade
 * in only on the active row, a fixed panel swaps to that project's
 * screenshot). Adapted to this site's own light/dark tokens rather than
 * fred's fixed dark palette.
 *
 * Preview panel and the ambient background dim are lg+ only: on mobile
 * there's no hover state to drive them, so rows are just a plain
 * navigable list there, same as the prototype.
 */

function ProjectPreview({ study, active }: { study: CaseStudy; active: boolean }) {
  const images = study.images ?? [];
  // A single image, not a mosaic - and prefer one of the "short" (landscape/
  // viewport-only) screenshots from WorkGallery.tsx's own classification
  // when the case study has one, since a full-page portrait screenshot
  // cropped into this box loses far more than a shorter one does. Falls
  // back to the first image when nothing short exists.
  const preferredImage = images.find((src) => SHORT_IMAGES.has(src)) ?? images[0];

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden={!active}
    >
      {!preferredImage ? (
        <div className="flex h-full items-center justify-center bg-[var(--background-surface)]">
          <span className="px-3 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            Image pending
          </span>
        </div>
      ) : (
        <img src={preferredImage} alt={`${study.company} screenshot`} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

// Rows shown before the list is truncated behind the Archive toggle -
// matches wearefred.co.uk/work's own split (7 visible, the rest revealed by
// its up/down arrow pair).
const VISIBLE_COUNT = 7;

export default function WorkIndexView() {
  const [active, setActive] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (active === 'all' ? caseStudies : caseStudies.filter((s) => s.category === active)),
    [active]
  );

  const visible = showArchive ? filtered : filtered.slice(0, VISIBLE_COUNT);
  const hasArchive = filtered.length > VISIBLE_COUNT;

  // Falls back to the first visible row whenever nothing's hovered - the
  // preview panel always shows something, and switching filters can't
  // leave it stuck on a project that just got filtered out.
  const activeId = hoveredId ?? visible[0]?.id ?? null;
  const activeStudy = visible.find((s) => s.id === activeId) ?? null;

  // Custom cursor "View" ring, rAF-coalesced like Hero.tsx's own
  // pointermove handler - direct style writes, no re-render per frame.
  useEffect(() => {
    const list = listRef.current;
    const ring = ringRef.current;
    if (!list || !ring) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending || !ring) return;
      ring.style.transform = `translate(${pending.x}px, ${pending.y}px) translate(-50%, -50%)`;
    };
    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => {
      ring.style.opacity = '1';
    };
    const onLeave = () => {
      ring.style.opacity = '0';
    };

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerenter', onEnter);
    list.addEventListener('pointerleave', onLeave);
    return () => {
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerenter', onEnter);
      list.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="w-full transition-colors duration-500"
      style={
        {
          // A solid colour-block fill, not a tinted gradient - confirmed by
          // hovering wearefred.co.uk/work's own list live: the whole
          // background flips to a flat, fully-saturated brand green the
          // instant any row is hovered (header and filters included, not
          // just the list), no fade-out toward the base colour. Same
          // mechanic here with our own accent-growth orange.
          //
          // Overriding the token *values* rather than each element's
          // classes: every descendant already reads var(--text-primary)/
          // var(--text-secondary)/var(--border-color) for light/dark theme
          // reactivity, so redefining those three variables here cascades
          // the hover palette to the whole subtree for free - text, borders,
          // and the "Image pending" placeholder all flip together, the same
          // way fred's page turns entirely white-on-green at once.
          background: hoveredId ? 'var(--accent-growth)' : 'var(--background-primary)',
          ...(hoveredId
            ? {
                '--text-primary': '#FFFFFF',
                '--text-secondary': 'rgba(255,255,255,0.65)',
                '--border-color': 'rgba(255,255,255,0.25)',
                '--background-surface': 'rgba(255,255,255,0.12)',
              }
            : {}),
        } as React.CSSProperties
      }
    >
      <header className="container-main pb-12 pt-32 lg:pb-16 lg:pt-40">
        <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">
          Work
        </span>
        <GhostHeading ghost="WORK">
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-[var(--text-primary)] sm:text-5xl">
            Selected work &amp; systems
          </h1>
        </GhostHeading>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
          {caseStudies.length} projects: production builds, growth systems, and a few things I
          shipped just to prove I could.
        </p>
      </header>

      {/* Numbered pills - the same circular-number treatment prototyped in
          the borrowed-elements artboard (from thirdway.com), so filters
          read as part of one numbering language with the rest of the
          site rather than a one-off pill style. */}
      <div className="container-main mb-10 flex flex-wrap gap-2 lg:mb-14">
        {categoryFilters.map((filter, i) => (
          <button
            key={filter.id}
            onClick={() => {
              setActive(filter.id);
              setHoveredId(null);
              setShowArchive(false);
            }}
            className={`flex items-center gap-2 rounded-full border pl-2 pr-4 py-2 font-mono text-xs uppercase tracking-[0.06em] transition-colors ${
              active === filter.id
                ? hoveredId
                  ? // Solid accent-growth would blend invisibly into the
                    // hover background (same colour) - outlined instead, so
                    // the selected filter is still legible while a row's
                    // hovered.
                    'border-white bg-transparent text-white'
                  : 'border-accent-growth bg-accent-growth text-[var(--background-primary)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent-growth/50 hover:text-[var(--text-primary)]'
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[9px] ${
                active === filter.id ? 'border-[var(--background-primary)]' : 'border-accent-growth text-accent-growth'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {filter.label} <span className="opacity-60">({filter.count})</span>
          </button>
        ))}
      </div>

      <div className="container-main pb-24 lg:pb-32">
        {/* Column proportions matched to wearefred.co.uk/work's own layout
            (confirmed by measuring its live DOM): a narrow ~325px list
            column flush left, not the wider ~55/45 split this had before,
            with the preview floating in the remaining space rather than
            filling a fixed 420px column edge-to-edge. */}
        <div className="grid gap-10 lg:grid-cols-[49vw_1fr] lg:items-start">
          <div ref={listRef} className="relative">
            {visible.map((study, i) => {
              const isActive = activeId === study.id;
              return (
                <Link
                  key={study.id}
                  href={`/work/${study.id}`}
                  onMouseEnter={() => setHoveredId(study.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex items-baseline gap-3 border-b border-[var(--border-color)] py-[23px] transition-opacity duration-300 ${
                    activeId && !isActive ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <span className="flex-shrink-0 font-mono text-xs text-accent-growth">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`truncate font-display text-2xl font-semibold leading-none transition-colors sm:text-3xl lg:text-[39px] ${
                      isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {study.company}
                  </span>
                </Link>
              );
            })}

            {/* Archive toggle - wearefred.co.uk/work only ever shows 7 rows
                up front (20 total), the rest behind an up/down arrow pair
                labelled "Archive". Same split here: a project list this
                long read as a wall of text without it. */}
            {hasArchive && (
              <div className="mt-5 flex items-center justify-between border-t border-[var(--border-color)] pt-5">
                <button
                  type="button"
                  onClick={() => setShowArchive((v) => !v)}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  Archive
                </button>
                <button
                  type="button"
                  onClick={() => setShowArchive((v) => !v)}
                  aria-label={showArchive ? 'Show fewer projects' : 'Show all projects'}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors hover:border-accent-growth/50 hover:text-[var(--text-primary)]"
                >
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${showArchive ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}

            <div
              ref={ringRef}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-50 hidden h-16 w-16 items-center justify-center rounded-full border border-accent-growth font-mono text-[10px] uppercase tracking-[0.06em] text-accent-growth opacity-0 transition-opacity duration-200 lg:flex"
              style={{ willChange: 'transform' }}
            >
              View
            </div>
          </div>

          {/* Preview: a bounded, landscape-proportioned box near the top of
              the remaining space, not stretched to fill it edge-to-edge -
              fred's own preview is a fixed ~586x381 (3:2) box floating with
              room around it, not a full-height sticky column. */}
          <div className="sticky top-24 hidden max-w-[480px] lg:block">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-[var(--border-color)]">
              {visible.map((study) => (
                <ProjectPreview key={study.id} study={study} active={activeId === study.id} />
              ))}
            </div>
            {/* Tags + industry moved here from the list row - fred's own
                row is just a number and a title with nothing else crammed
                in, and there wasn't room for them there either: at 325px
                wide, the tag pills and industry label (both flex-shrink-0)
                left the title with negative available space and it
                collapsed to nothing. This caption is where that
                information lives now instead. */}
            {activeStudy && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {activeStudy.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="whitespace-nowrap rounded-full border border-[var(--border-color)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex-shrink-0 font-mono text-[11px] text-[var(--text-secondary)]">
                  {activeStudy.industry}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
