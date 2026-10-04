'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient canvas-drawn data-visualization motif: overlapping tilted rings
 * of dots, rotating slowly, perspective-scaled with emerald-to-grey depth
 * colour. Prototyped in the "borrowed elements" artboard as a recreation
 * of boonglobal.io's dot-field motif (their own version is a WebGL
 * particle system reading real simulation data - this is a canvas
 * approximation of the same idea: dots as a data texture instead of a
 * bare grid or gradient).
 *
 * Purely decorative (aria-hidden), sits absolutely within a `relative`
 * parent the caller controls the size of.
 */
export default function DotVortex({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !stage || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const RINGS = 16;
    const POINTS_PER_RING = 44;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const baseR = Math.min(w, h) * 0.34;

      for (let r = 0; r < RINGS; r++) {
        const ringT = r / (RINGS - 1);
        const tilt = ringT * Math.PI;
        for (let p = 0; p < POINTS_PER_RING; p++) {
          const theta = (p / POINTS_PER_RING) * Math.PI * 2 + t * (0.2 + ringT * 0.12);
          const x3 = Math.cos(theta) * baseR;
          const y3 = Math.sin(theta) * baseR * 0.32;
          const z3 = Math.sin(theta) * baseR * Math.sin(tilt);
          const rotX = x3 * Math.cos(tilt) - z3 * Math.sin(tilt);
          const rotZ = x3 * Math.sin(tilt) + z3 * Math.cos(tilt);
          const scale = 1 / (2 - rotZ / baseR);
          const px = cx + rotX * scale;
          const py = cy + y3 * scale;
          const depthT = (rotZ / baseR + 1) / 2;
          const size = 1 + depthT * 2.4;
          const alpha = 0.1 + depthT * 0.45;
          ctx.fillStyle = depthT > 0.5 ? `rgba(0, 156, 74, ${alpha})` : `rgba(140, 140, 140, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      t += 0.006;
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
