'use client';

import { useEffect, useRef } from 'react';

/**
 * Replaces the old flat CSS background-image grid with a real wireframe
 * mesh drawn on canvas, so the cursor can genuinely displace it: nearby
 * grid vertices lift upward (a Gaussian falloff around the pointer) and
 * push outward radially by a fraction of that lift, the way a physical
 * membrane domes when poked from underneath - not a flat glow or a
 * brightened/scaled copy of the pattern (the first attempt here read as a
 * magnifying-glass lens, not a bulge, and was rejected for it). Stroke
 * alpha never changes with the cursor; only vertex position does, so
 * there's no brightening anywhere, only real geometric displacement.
 *
 * Runs a continuous rAF loop (not just on pointermove) so the bulge eases
 * back to flat on pointerleave instead of snapping - `active` lerps toward
 * its target each frame alongside the cursor position.
 */
const CELL = 60;
const MAX_LIFT = 30;
const RADIUS = 240;
const OUTWARD = 0.22;
const EASE = 0.12;

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroGridBulge({ className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest('section');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !section || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;

    const target = { x: -9999, y: -9999, active: 0 };
    const current = { x: -9999, y: -9999, active: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Resolve `currentColor` to real rgb components so the stroke can stay
    // a fixed, subtle alpha (matching the previous grid's opacity-5) with
    // zero brightness change anywhere in the pattern. Re-read on every
    // theme toggle (a MutationObserver on <html>'s class, same pattern as
    // Methodology.tsx) - resolving it once at mount froze whichever
    // color was current at first paint, which read as invisible after
    // toggling to dark (a light-mode near-black stroke at 0.07 alpha over
    // a near-black background).
    let stroke = 'rgba(128, 128, 128, 0.07)';
    const resolveStroke = () => {
      const resolved = getComputedStyle(canvas).color;
      const match = resolved.match(/\d+/g);
      const [r, g, b] = match ? match.map(Number) : [128, 128, 128];
      stroke = `rgba(${r}, ${g}, ${b}, 0.07)`;
    };
    resolveStroke();
    const themeObserver = new MutationObserver(resolveStroke);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const { x: cx, y: cy, active } = current;
      const cols = Math.ceil(width / CELL) + 1;
      const rows = Math.ceil(height / CELL) + 1;

      const vx: number[][] = [];
      const vy: number[][] = [];
      for (let j = 0; j <= rows; j++) {
        vx[j] = [];
        vy[j] = [];
        for (let i = 0; i <= cols; i++) {
          const gx = i * CELL;
          const gy = j * CELL;
          let dx = 0;
          let dy = 0;
          if (active > 0.01) {
            const ddx = gx - cx;
            const ddy = gy - cy;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < RADIUS) {
              const falloff = Math.cos((dist / RADIUS) * (Math.PI / 2));
              const h = MAX_LIFT * falloff * falloff * active;
              const len = dist || 1;
              dx = (ddx / len) * h * OUTWARD;
              dy = -h;
            }
          }
          vx[j][i] = gx + dx;
          vy[j][i] = gy + dy;
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = stroke;

      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          if (i === 0) ctx.moveTo(vx[j][i], vy[j][i]);
          else ctx.lineTo(vx[j][i], vy[j][i]);
        }
        ctx.stroke();
      }
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        for (let j = 0; j <= rows; j++) {
          if (j === 0) ctx.moveTo(vx[j][i], vy[j][i]);
          else ctx.lineTo(vx[j][i], vy[j][i]);
        }
        ctx.stroke();
      }
    };

    const tick = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      current.active += (target.active - current.active) * EASE;
      draw();
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      target.active = 1;
    };
    const onLeave = () => {
      target.active = 0;
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);

    return () => {
      ro.disconnect();
      themeObserver.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={className} style={style} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="block h-full w-full text-[var(--text-primary)]"
      />
    </div>
  );
}
