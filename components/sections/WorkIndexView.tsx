'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { caseStudies, categoryFilters, type CaseStudy } from '@/lib/data';

/**
 * /work index - a text list with a hover-reveal preview panel, replacing
 * the old equal-weight card grid. Mechanic prototyped and approved in a
 * standalone artifact against real case studies first (inspired by
 * wearefred.co.uk's work list: rows dim except the hovered one, tags fade
 * in only on the active row, a fixed panel swaps to that project's
 * screenshot). Adapted to this site's own light/dark tokens rather than
 * fred's fixed dark palette, and to real per-project image counts - most
 * case studies have one screenshot and get a single preview, a few
 * (KCB Bank, I&M Bank, PulseKE) have enough for a mosaic instead.
 *
 * Preview panel and the ambient background dim are lg+ only: on mobile
 * there's no hover state to drive them, so rows are just a plain
 * navigable list there, same as the prototype.
 */

function ProjectPreview({ study, active }: { study: CaseStudy; active: boolean }) {
  const images = study.images ?? [];
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden={!active}
    >
      {images.length === 0 ? (
        <div className="flex h-full items-center justify-center bg-[var(--background-surface)]">
          <span className="px-3 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            Image pending
          </span>
        </div>
      ) : images.length === 1 ? (
        <img src={images[0]} alt={`${study.company} screenshot`} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full grid-cols-3 gap-[3px] bg-[var(--border-color)]" style={{ gridAutoRows: '1fr' }}>
          {images.slice(0, 6).map((src) => (
            <img key={src} src={src} alt={`${study.company} screenshot`} className="h-full w-full object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkIndexView() {
  const [active, setActive] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (active === 'all' ? caseStudies : caseStudies.filter((s) => s.category === active)),
    [active]
  );

  // Falls back to the first visible row whenever nothing's hovered - the
  // preview panel always shows something, and switching filters can't
  // leave it stuck on a project that just got filtered out.
  const activeId = hoveredId ?? filtered[0]?.id ?? null;

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
      style={{ background: hoveredId ? 'var(--background-surface)' : 'var(--background-primary)' }}
    >
      <header className="container-main pb-12 pt-32 lg:pb-16 lg:pt-40">
        <span className="mb-4 block font-mono text-xs uppercase tracking-[0.14em] text-accent-growth">
          Work
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-[var(--text-primary)] sm:text-5xl">
          Selected work &amp; systems
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
          {caseStudies.length} projects: production builds, growth systems, and a few things I
          shipped just to prove I could.
        </p>
      </header>

      <div className="container-main mb-10 flex flex-wrap gap-2 lg:mb-14">
        {categoryFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActive(filter.id);
              setHoveredId(null);
            }}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] transition-colors ${
              active === filter.id
                ? 'border-accent-growth bg-accent-growth text-[var(--background-primary)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent-growth/50 hover:text-[var(--text-primary)]'
            }`}
          >
            {filter.label} <span className="opacity-60">({filter.count})</span>
          </button>
        ))}
      </div>

      <div className="container-main pb-24 lg:pb-32">
        {/* minmax(0, 1fr), not bare 1fr: a grid track's implicit minimum is
            `auto` (its content's own min size), not 0 - with tags/industry
            set to flex-shrink-0 inside each row, that content-based minimum
            was wider than the actual column, so the whole grid overflowed
            horizontally and pushed the preview panel off-screen entirely. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div ref={listRef} className="relative">
            {filtered.map((study, i) => {
              const isActive = activeId === study.id;
              return (
                <Link
                  key={study.id}
                  href={`/work/${study.id}`}
                  onMouseEnter={() => setHoveredId(study.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex items-baseline justify-between gap-4 border-b border-[var(--border-color)] py-5 transition-opacity duration-300 ${
                    activeId && !isActive ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <div className="flex min-w-0 items-baseline gap-3">
                    <span className="flex-shrink-0 font-mono text-xs text-accent-growth">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`truncate font-display text-xl font-semibold transition-colors sm:text-2xl ${
                        isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {study.company}
                    </span>
                  </div>
                  <div
                    className={`hidden flex-shrink-0 gap-2 transition-opacity duration-300 sm:flex ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {study.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="whitespace-nowrap rounded-full border border-[var(--border-color)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="hidden flex-shrink-0 font-mono text-[11px] text-[var(--text-secondary)] lg:block">
                    {study.industry}
                  </span>
                </Link>
              );
            })}

            <div
              ref={ringRef}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-50 hidden h-16 w-16 items-center justify-center rounded-full border border-accent-growth font-mono text-[10px] uppercase tracking-[0.06em] text-accent-growth opacity-0 transition-opacity duration-200 lg:flex"
              style={{ willChange: 'transform' }}
            >
              View
            </div>
          </div>

          <div className="sticky top-24 hidden aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border-color)] lg:block">
            {filtered.map((study) => (
              <ProjectPreview key={study.id} study={study} active={activeId === study.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
