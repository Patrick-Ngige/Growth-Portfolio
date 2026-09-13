"use client";

import { useEffect, useRef } from "react";

/**
 * A three-circle Venn diagram, drawn once into a canvas: three equal circles
 * on a triangle, overlapping in one shared central region. The filled centre
 * stands for whatever the three things produce together — swap the three
 * labels below to make the diagram argue for anything, as long as it's
 * genuinely three things that compound into one.
 *
 * Deliberately a bitmap rather than live SVG, and the reason is performance
 * rather than taste. `PinnedPillars` scales this plate from 12.5x down to 1x
 * across a pinned scroll, and vector content has to be re-rasterized by the
 * CPU at *every new scale* — with stroked circles, curved captions and text
 * runs, that stutters exactly where the diagram's detail becomes visible. A
 * canvas is a texture: the GPU scales it for free.
 *
 * Canvas over an <img> of serialized SVG on purpose too: an SVG loaded through
 * <img> is isolated and cannot use the document's webfonts, so every label
 * would silently fall back. Canvas draws with the page's real fonts.
 */

export type Lobe = { symbol: string; word: string; caption: string };

/** Backing-store size. At 12.5x only the flat centre is on screen, so detail
 *  is needed around 1x-3x — 2048 is comfortably beyond that. */
const SIZE = 2048;

/** Design-space geometry, in a 400x400 box (scaled up to SIZE when drawn). */
const R = 100;
const D = 52;
const C = 200;

const DEFAULT_LOBES: [Lobe, Lobe, Lobe] = [
  { symbol: "Bu", word: "Build", caption: "Hosting | Web | Search" },
  { symbol: "Au", word: "Automate", caption: "CRM | Workflow | Agents" },
  { symbol: "Gr", word: "Grow", caption: "Ads | CRO | Attribution" },
];

const pos = (deg: number, radius: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + radius * Math.sin(rad), y: C - radius * Math.cos(rad) };
};

/**
 * Draw `text` along a circular arc, one glyph at a time, centred on `midDeg`.
 * Captions ride the outer edge of each circle, echoing technical-diagram
 * language. `flip` keeps the lower arcs upright instead of upside-down.
 */
function arcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  midDeg: number,
  flip: boolean,
) {
  const widths = Array.from(text).map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0);
  const span = total / radius; // angular length of the string at this radius
  let angle = (midDeg * Math.PI) / 180 - (flip ? -span / 2 : span / 2);

  for (let i = 0; i < text.length; i++) {
    const step = widths[i] / radius;
    const a = angle + (flip ? -step / 2 : step / 2);
    ctx.save();
    ctx.translate(cx + radius * Math.sin(a), cy - radius * Math.cos(a));
    ctx.rotate(flip ? -a + Math.PI : a);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
    angle += flip ? -step : step;
  }
}

/** Reads a CSS custom property if one resolves, else falls back — so the
 *  plate can be themed via CSS (`--pp-ink`, `--pp-plate-fill`, ...) without
 *  any setup, since canvas fillStyle can't take a live var() itself. */
function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export default function PillarPlate({
  className,
  style,
  /** The three things. Exactly 3 — this is a three-circle Venn, not an N-gon. */
  lobes = DEFAULT_LOBES,
  /** Line + label colour. Defaults to `--pp-ink` if set, else a light ink. */
  ink,
  /** Central intersection fill. Defaults to `--pp-plate-fill` if set, else a
   *  muted indigo. */
  fill,
  /** Font for the symbol/word labels. Defaults to `--pp-font-display` /
   *  `system-ui`. */
  fontDisplay,
  /** Font for the curved captions. Defaults to `--pp-font-body` / `system-ui`. */
  fontBody,
}: {
  className?: string;
  style?: React.CSSProperties;
  lobes?: [Lobe, Lobe, Lobe];
  ink?: string;
  fill?: string;
  fontDisplay?: string;
  fontBody?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;

    const draw = () => {
      if (cancelled) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resolvedInk = ink ?? cssVar("--pp-ink", "#f4f4f6");
      const resolvedFill = fill ?? cssVar("--pp-plate-fill", "#2a2f52");
      const display = fontDisplay ?? cssVar("--pp-font-display", "system-ui, sans-serif");
      const body = fontBody ?? cssVar("--pp-font-body", "system-ui, sans-serif");
      const s = SIZE / 400;
      const degs = [0, 120, 240] as const;

      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.scale(s, s);

      // Central three-way intersection. Successive clips intersect, so the fill
      // survives only where all three circles overlap. That region is what
      // covers the screen at 12.5x, so the section opens on a flat colour field
      // and only resolves into structure as it pulls back.
      ctx.save();
      degs.forEach((deg) => {
        const c = pos(deg, D);
        ctx.beginPath();
        ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
        ctx.clip();
      });
      ctx.fillStyle = resolvedFill;
      ctx.fillRect(0, 0, 400, 400);
      ctx.restore();

      // Circle outlines.
      ctx.strokeStyle = resolvedInk;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 0.6;
      degs.forEach((deg) => {
        const c = pos(deg, D);
        ctx.beginPath();
        ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // Symbol + word stacked straight in each free lobe, pushed outward along
      // the lobe's own axis so they never land in the overlaps.
      ctx.fillStyle = resolvedInk;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      lobes.forEach((l, i) => {
        const p = pos(degs[i], D + R * 0.5);

        ctx.font = `600 25px ${display}`;
        ctx.fillText(l.symbol, p.x, p.y);

        ctx.globalAlpha = 0.9;
        ctx.font = `600 11px ${display}`;
        ctx.fillText(l.word, p.x, p.y + 16);
        ctx.globalAlpha = 1;
      });

      // Captions curved along each circle's outer arc.
      ctx.globalAlpha = 0.82;
      ctx.font = `600 9.5px ${body}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.4px";
      lobes.forEach((l, i) => {
        const deg = degs[i];
        const c = pos(deg, D);
        // Lower two arcs (120°, 240°) flip so their text stays upright.
        arcText(ctx, l.caption, c.x, c.y, R - 11, deg, deg > 90 && deg < 271);
      });
      ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    // Fonts must be resolved before drawing, or the labels rasterize in a
    // fallback face and stay that way — the canvas is drawn once.
    if (document.fonts?.ready) document.fonts.ready.then(draw);
    else draw();

    return () => {
      cancelled = true;
    };
  }, [lobes, ink, fill, fontDisplay, fontBody]);

  const label = lobes.map((l) => l.word).join(", ");

  return (
    <canvas
      ref={ref}
      width={SIZE}
      height={SIZE}
      className={className}
      style={style}
      role="img"
      aria-label={`Three overlapping circles labelled ${label}, meeting in a shared centre`}
    />
  );
}
