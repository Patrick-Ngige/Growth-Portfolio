'use client';

import { useEffect, useRef, useState } from 'react';

export interface RailItem {
  id: string;
  number: string;
  label: string;
}

/**
 * A fixed, numbered chapter rail for long narrative pages - ported from
 * driving the live DOM of seasats.com's own right-edge nav, not guessed
 * from a screenshot (see the "Mobile Nav Concepts" / "Section Rail
 * Concept" artifacts from this session for the verification trail).
 *
 * The verified mechanism, reproduced here: a fixed-width (220px) column
 * of real rows, each its own FLAT background colour banded by chapter
 * (no gradient blending between them), 14px/500 body type with the
 * number and label on one line, text colour flipping dark/light per
 * band for contrast. Position feedback lives in a separate thin
 * proportional strip with a moving marker next to the list - the list
 * itself never gets a bold "active" treatment, matching the reference.
 *
 * Deliberately a fixed-palette device (dark neutral warming to accent
 * orange), not theme-reactive - the same choice already made for
 * PinnedPillars' panel colour: a considered brand moment, not a themed
 * surface that flips with light/dark mode.
 */
const BANDS = [
  { bg: '#1c1a17', text: '#F4F4F5' },
  { bg: '#54381f', text: '#F4F4F5' },
  { bg: '#8c5629', text: '#F4F4F5' },
  { bg: '#c37432', text: '#F4F4F5' },
  { bg: '#FB923C', text: '#09090B' },
];

const ROW_H = 74;

export default function SectionRail({ items }: { items: RailItem[] }) {
  const [markerTop, setMarkerTop] = useState(0);
  const mapHeight = items.length * ROW_H;
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    sectionRefs.current = items.map((item) => document.getElementById(item.id));

    const updateMarker = () => {
      const doc = document.documentElement;
      const frac = window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight);
      setMarkerTop(Math.max(0, Math.min(1, frac)) * (mapHeight - 3));
    };
    updateMarker();
    window.addEventListener('scroll', updateMarker, { passive: true });
    return () => window.removeEventListener('scroll', updateMarker);
  }, [items, mapHeight]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-stretch lg:flex"
      aria-label="Section navigation"
    >
      <div className="mr-2.5 w-1.5 flex-shrink-0 overflow-hidden rounded-sm" style={{ height: mapHeight }}>
        {items.map((item, i) => (
          <div key={item.id} style={{ height: ROW_H, background: BANDS[i % BANDS.length].bg }} />
        ))}
        <div
          className="pointer-events-none absolute h-[3px] w-2.5 -translate-x-0.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)] transition-[top] duration-75"
          style={{ top: markerTop }}
        />
      </div>
      <nav className="flex w-[200px] flex-col">
        {items.map((item, i) => {
          const band = BANDS[i % BANDS.length];
          return (
            <button
              key={item.id}
              onClick={() => jumpTo(item.id)}
              className="flex w-full items-center gap-2.5 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              style={{ height: ROW_H, background: band.bg, color: band.text }}
            >
              <span className="font-mono text-sm opacity-50">{item.number}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
