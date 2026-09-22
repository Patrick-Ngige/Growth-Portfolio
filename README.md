# Growth Portfolio

Patrick Ngige's developer-first Growth Engineer portfolio. Next.js 14, TypeScript,
Tailwind, exported as a static site.

## Stack

- Next.js 14 (App Router, `output: 'export'` static build)
- TypeScript, Tailwind CSS
- Framer Motion + GSAP/ScrollTrigger for scroll-driven sections
- `@studio-freight/react-lenis` (currently paused, see Notes below)
- Three.js (WebGL hero, currently paused, see Notes below)

## Getting started

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000` by default. To use a different port:

```bash
npm run dev -- -p 3300
```

## Build

```bash
npm run build
```

Static export, output in `/out`. Serve it with any static file server to verify
the real production output, for example `npx serve out`.

## Project structure

```
app/
  page.tsx           Home page, section order
  work/[slug]/        Work detail pages (generateStaticParams from lib/data.ts)
  globals.css          Theme tokens (light/dark CSS variables), base styles
components/
  sections/            Page sections (Hero, Methodology/Approach, Contact, WorkDetailView, ...)
  anim/                 Reusable animation primitives (Counter, MagneticButton, SplitText, SmoothScroll)
  motion/               Heavier motion pieces (HeroCanvas WebGL, SectionRail, PinnedPillars)
  ui/                    Buttons, layout primitives
lib/
  data.ts               All content: case studies, methodology steps, nav links, metrics
```

Editing project content (case studies, metrics, nav) means editing `lib/data.ts`,
not the components.

## Theming

Colors are CSS custom properties in `app/globals.css`, defined once on `:root`
(light) and again under `.dark` (dark mode). Components read them via
`var(--text-primary)`, `var(--background-surface)`, `bg-accent-growth`, etc.,
never hardcoded hex, so the same component works in both themes. When adding a
new color, add the token to both blocks in `globals.css` rather than hardcoding
a value in a component.

## Notes on paused features

A few pieces are intentionally disabled right now, not removed, each documented
in a comment at the top of the file that mounts them:

- **`components/motion/HeroCanvas.tsx`** - WebGL noise-field backdrop for
  `/work/[slug]` hero. Not mounted in `WorkDetailView.tsx` pending a real-device
  performance check (measured 2-3fps in a sandboxed test browser, inconclusive).
- **`components/motion/SectionRail.tsx`** - the scroll-position side rail on
  work detail pages. Unmounted while other parts of that page are reworked.
- **Lenis smooth scroll** (`components/anim/SmoothScroll.tsx`) - `ENABLED_PREFIXES`
  is currently empty, so every route uses native scroll. It was previously
  scoped to `/work` routes but felt like it was dragging; re-enable by adding
  `/work` back and raising `lerp` above `0.1`.

## Work page images

Case studies in `lib/data.ts` support an optional `images?: string[]` field
for the gallery on `/work/[slug]`. Until real screenshots are added, that
gallery renders an "Image pending" placeholder.
