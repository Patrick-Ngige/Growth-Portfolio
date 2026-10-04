'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { visibleCaseStudies, categoryFilters, type CaseStudy } from '@/lib/data';
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

// Rows visible without scrolling the list - above this count the up/down
// arrows appear, matching wearefred.co.uk/work's own split (7 visible, the
// rest revealed by its up/down arrow pair). The difference here: fred's
// arrows show/hide the rest (growing the page), ours scroll a fixed-height
// list instead, so the page itself never grows - only the list does.
const VISIBLE_COUNT = 7;
// One row is 23px vertical padding top+bottom plus the ~39px title line
// height at the lg breakpoint - matches the row's own py-[23px] + the
// lg:text-[39px] title exactly, so a scroll step lands on a row boundary
// instead of stopping mid-row.
const ROW_HEIGHT = 85;

export default function WorkIndexView() {
  const [active, setActive] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Featured/Archive, not a single reveal toggle - matches
  // wearefred.co.uk/work's own two-state nav (confirmed live: "Archive" is
  // a real second view there, not a show/hide on the same list). Featured
  // shows the first VISIBLE_COUNT rows only and never needs to scroll;
  // Archive swaps in the full list, which may then overflow and scroll -
  // still within the same contained box, not growing the page (the page
  // itself stays locked to the viewport regardless of which state this is in).
  const [showArchive, setShowArchive] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (active === 'all' ? visibleCaseStudies : visibleCaseStudies.filter((s) => s.category === active)),
    [active]
  );

  const visible = showArchive ? filtered : filtered.slice(0, VISIBLE_COUNT);
  const hasArchive = filtered.length > VISIBLE_COUNT;

  const scrollList = (direction: 1 | -1) => {
    listRef.current?.scrollBy({ top: direction * ROW_HEIGHT * 3, behavior: 'smooth' });
  };

  // Falls back to the first visible row whenever nothing's hovered - the
  // preview panel always shows something, and switching filters or views
  // can't leave it stuck on a project that just got filtered/collapsed out.
  const activeId = hoveredId ?? visible[0]?.id ?? null;
  const activeStudy = visible.find((s) => s.id === activeId) ?? null;

  // The hover-green fill needs to reach the strip of page behind the fixed
  // header pill too (not the pill itself, which stays its normal white/
  // dark glass). That strip is <body>'s own background
  // (bg-[var(--background-primary)] in layout.tsx) showing through the
  // invisible spacer Header.tsx renders above <main> - outside this
  // component's subtree, so a plain inline style on this component's own
  // wrapper can't reach it.
  //
  // This sets body's inline style.backgroundColor directly (which wins
  // over its own Tailwind class) rather than overriding the shared
  // --background-primary *token* on <html> - that token is read by other
  // things besides body's background, e.g. MagicButton's primary variant
  // uses text-[var(--background-primary)] for its own text colour, which
  // went invisible (green-on-green) the first time this redefined the
  // token itself instead of just body's rendered colour. Cleared on
  // unmount so leaving /work can't strand the page mid-hover-state.
  useEffect(() => {
    const { body } = document;
    if (hoveredId) {
      body.style.backgroundColor = 'var(--accent-growth)';
    } else {
      body.style.removeProperty('background-color');
    }
    return () => {
      body.style.removeProperty('background-color');
    };
  }, [hoveredId]);

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
      // lg:h-[calc(100vh-6rem)], not lg:h-screen: Header.tsx renders a
      // 96px (h-24) spacer above <main> sitewide to offset its own fixed
      // positioning, so a plain 100vh here double-counts that already-
      // reserved space and leaves exactly 96px of page-level scroll even
      // though this component's own height is correctly locked.
      className="flex w-full flex-col transition-colors duration-500 lg:h-[calc(100vh-6rem)] lg:overflow-hidden"
      style={
        {
          // A solid colour-block fill, not a tinted gradient - confirmed by
          // hovering wearefred.co.uk/work's own list live: the whole
          // background flips to a flat, fully-saturated brand green the
          // instant any row is hovered (header and filters included, not
          // just the list), no fade-out toward the base colour. Same
          // mechanic here with our own accent-growth emerald.
          //
          // Overriding the token *values* rather than each element's
          // classes: every descendant already reads var(--text-primary)/
          // var(--text-secondary)/var(--border-color) for light/dark theme
          // reactivity, so redefining those three variables here cascades
          // the hover palette to the whole subtree for free. Scoped to
          // this wrapper only (not <html>, unlike --background-primary
          // above) so it never reaches the header pill's own text - that
          // pill stays white, so white-on-white would make its text
          // disappear if these reached it too.
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
      {/* No headline block - a bare filter row sits directly under the
          header, nothing above the list competing for attention. */}
      <div className="container-main w-full flex items-center justify-between pb-6 pt-32 lg:shrink-0 lg:pb-8 lg:pt-28">
        <nav aria-label="Work filters" className="flex flex-wrap items-center gap-6">
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActive(filter.id);
                setHoveredId(null);
                setShowArchive(false);
              }}
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                active === filter.id
                  ? hoveredId
                    ? 'text-white'
                    : 'text-accent-growth'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="container-main w-full min-h-0 pb-24 lg:flex-1 lg:pb-10">
        {/* Column proportions matched to wearefred.co.uk/work's own layout
            (measured live at 1024px and 1440px: a near-fixed ~650px list
            column - 650px to 656px across that range - with the preview
            as the flexible column that grows to fill whatever's left,
            225px to 572px over the same range). The list is the fixed
            share here, not the preview, which is the reverse of this
            grid's earlier 360px-list/480px-capped-preview shape. At lg+
            the whole page is locked to the viewport (see the root
            wrapper's lg:h-[calc(100vh-6rem)]) - this grid fills what's
            left after the header and filters, and the list column
            scrolls internally instead of the page growing. */}
        <div className="grid min-h-0 gap-20 lg:h-full lg:grid-cols-[640px_1fr] lg:items-start">
          <div className="relative flex min-h-0 flex-col lg:h-full">
            <div ref={listRef} className="relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1 no-scrollbar">
              {visible.map((study, i) => {
                const isActive = activeId === study.id;
                return (
                  <Link
                    key={study.id}
                    href={`/work/${study.id}`}
                    onMouseEnter={() => setHoveredId(study.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex items-baseline border-b border-black/[0.14] py-[23px] transition-opacity duration-300 dark:border-white/[0.14] ${
                      activeId && !isActive ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <span
                      className={`truncate font-display text-2xl font-semibold leading-none transition-colors sm:text-3xl lg:text-[39px] ${
                        isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {study.company}
                    </span>
                    {/* Superscript index mark after the title, not a
                        separate mono-font column before it - matches
                        wearefred.co.uk/work's own row treatment (a small
                        footnote-style number, not a left-aligned prefix
                        column). */}
                    <sup className="ml-1.5 flex-shrink-0 font-mono text-[11px] text-accent-growth">
                      {String(i + 1).padStart(2, '0')}
                    </sup>
                  </Link>
                );
              })}
            </div>

            {/* Featured/Archive toggle, matching wearefred.co.uk/work's own
                two-state nav - a real second state (full list), not a
                single reveal arrow. The up/down pair only appears once
                Archive is open and actually overflows the box, and scrolls
                that revealed list in place - the page itself stays locked
                to the viewport throughout (lg:h-[calc(100vh-6rem)] on the
                root), it never grows the way fred's own page does. */}
            {hasArchive && (
              <div className="mt-5 flex shrink-0 items-center justify-between border-t border-black/[0.14] pt-5 dark:border-white/[0.14]">
                <button
                  type="button"
                  onClick={() => setShowArchive(false)}
                  className={`font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                    !showArchive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Featured
                </button>
                <button
                  type="button"
                  onClick={() => setShowArchive(true)}
                  className={`font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                    showArchive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Archive
                </button>
                {showArchive && (
                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => scrollList(-1)}
                      aria-label="Scroll up"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors hover:border-accent-growth/50 hover:text-[var(--text-primary)]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollList(1)}
                      aria-label="Scroll down"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors hover:border-accent-growth/50 hover:text-[var(--text-primary)]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div
              ref={ringRef}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-50 hidden h-16 w-16 items-center justify-center rounded-full border border-white font-mono text-[10px] uppercase tracking-[0.06em] text-white opacity-0 transition-opacity duration-200 lg:flex"
              style={{ willChange: 'transform' }}
            >
              View
            </div>
          </div>

          {/* Preview: fills the flexible column fully (no width cap) -
              fred's own preview column is the one that grows with the
              viewport (225px at 1024px wide up to 572px at 1440px wide),
              while the list column stays near-fixed. A fixed aspect-[3/2]
              keeps it landscape-proportioned as it grows. */}
          <div className="top-24 hidden lg:sticky lg:block">
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
