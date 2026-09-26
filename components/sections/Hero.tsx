'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Button, { AnimatedButton } from '@/components/ui/Button';
import SplitText from '@/components/anim/SplitText';
import MagneticButton from '@/components/anim/MagneticButton';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse-reactive parallax + spotlight: the grid pattern and the three
  // floating dashboard cards drift at different rates as the cursor moves
  // (classic layered-parallax depth cue, no 3D library needed), and a soft
  // radial glow tracks the cursor over the grid. Pointer position is
  // written straight to style/CSS-variables in an rAF-coalesced handler -
  // same pattern as PinnedPillars' own cursor-ripple effect - so mouse
  // movement never triggers a React re-render.
  useEffect(() => {
    if (!mounted) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    if (!section || reduced) return;

    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const rect = section.getBoundingClientRect();
      // Normalised -1..1 from the section's centre.
      const nx = ((pending.x - rect.left) / rect.width - 0.5) * 2;
      const ny = ((pending.y - rect.top) / rect.height - 0.5) * 2;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${(-nx * 10).toFixed(1)}px, ${(-ny * 10).toFixed(1)}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spot-x', `${((pending.x - rect.left) / rect.width) * 100}%`);
        spotlightRef.current.style.setProperty('--spot-y', `${((pending.y - rect.top) / rect.height) * 100}%`);
        spotlightRef.current.style.opacity = '1';
      }
      // Each floating card drifts at its own rate (a data-depth attribute
      // set per card below) for a layered, foreground-vs-background feel.
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const depth = parseFloat(card.dataset.depth || '0');
        card.style.transform = `translate3d(${(nx * depth).toFixed(1)}px, ${(ny * depth).toFixed(1)}px, 0)`;
      });
    };

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (gridRef.current) gridRef.current.style.transform = 'translate3d(0, 0, 0)';
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
      cardRefs.current.forEach((card) => {
        if (card) card.style.transform = 'translate3d(0, 0, 0)';
      });
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted]);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Prevent hydration mismatch by not rendering animation-dependent content on server
  if (!mounted) {
    return (
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background-primary)]"
      >
        <div className="container-main relative z-10">
          <div className="max-w-4xl">
            <p className="data-label mb-6">Growth Engineer & Developer | Building Since 2022</p>
            <h1 className="text-hero font-display font-bold tracking-tight mb-6 leading-[0.9]">
              <span className="block text-[var(--text-primary)]">I engineer the systems</span>
              <span className="block text-accent-growth">behind growth.</span>
              <span className="block text-[var(--text-primary)]">Not just campaigns.</span>
            </h1>
            <p className="text-body max-w-2xl mb-10 text-[var(--text-secondary)]">
              A developer-first Growth Engineer. I build landing pages, run A/B tests, and
              instrument tracked campaigns myself, without a separate dev queue.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-[var(--background-primary)]"
    >
      {/* Background Grid Pattern - top: -96px bleeds it up into the fixed
          header's own spacer gap (Header.tsx's h-24) so it reads as one
          continuous field all the way to the true top of the viewport,
          instead of stopping at this section's own box (which starts 96px
          down, after that spacer). Needs the section's overflow-hidden
          moved onto the dashboard-elements wrapper below instead, or this
          would just get clipped at the same boundary it's trying to bleed
          past. */}
      <div ref={gridRef} className="pointer-events-none absolute left-0 right-0 bottom-0 opacity-5" style={{ top: '-96px' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Mouse-follow spotlight over the grid - a soft radial glow that
          tracks the cursor, updated via CSS custom properties rather than
          React state so moving the mouse never triggers a re-render. */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute left-0 right-0 bottom-0 opacity-0 transition-opacity duration-500"
        style={{
          top: '-96px',
          background: 'radial-gradient(400px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(234 88 12 / 0.15), transparent 70%)',
        }}
      />

      {/* Animated Dashboard Elements - Simple CSS animations for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Card 1 - ROAS */}
        <motion.div
          ref={(el) => {
            cardRefs.current[0] = el;
          }}
          data-depth="22"
          className="absolute top-1/4 right-[10%] glass rounded-xl p-4 w-48 hidden lg:block"
          style={{ willChange: 'transform' }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="data-label">Core Web Vitals</span>
            <span className="text-accent-growth text-sm">▲</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            Optimized
          </div>
          <svg className="w-full h-8 mt-2" viewBox="0 0 100 30">
            <motion.path
              d="M0,25 L10,22 L20,18 L30,20 L40,15 L50,12 L60,8 L70,10 L80,5 L90,3 L100,8"
              fill="none"
              stroke="#EA580C"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
          </svg>
          {/* Subtle floating animation */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* Floating Card 2 - Active Pixels */}
        <motion.div
          ref={(el) => {
            cardRefs.current[1] = el;
          }}
          data-depth="14"
          className="absolute bottom-1/3 left-[8%] glass rounded-xl p-4 w-40 hidden lg:block"
          style={{ willChange: 'transform' }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="data-label">Pixels Active</span>
          </div>
          <div className="text-2xl font-mono font-bold text-accent-technical">12</div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-accent-technical"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          {/* Subtle floating animation - different timing */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* Floating Card 3 - Conversion */}
        <motion.div
          ref={(el) => {
            cardRefs.current[2] = el;
          }}
          data-depth="18"
          className="absolute top-1/3 left-[5%] glass rounded-xl p-4 w-44 hidden lg:block"
          style={{ willChange: 'transform' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="data-label">Conversion</span>
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            4.2%
          </div>
          <div className="w-full bg-[var(--background-surface)]/50 h-1 mt-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-growth rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '84%' }}
              transition={{ duration: 1.5, delay: 1.5 }}
            />
          </div>
          {/* Subtle floating animation - different timing */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ willChange: 'transform' }}
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container-main relative z-10">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tagline */}
          <motion.p
            className="data-label mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Growth Engineer & Developer | Building Since 2022
          </motion.p>

          {/* Main Headline with Split Text Animation */}
          <h1 className="text-hero font-display font-bold tracking-tight mb-6 leading-[0.9]">
            <SplitText
              text="I engineer the systems"
              as="span"
              className="block"
              animation="slideUp"
              delay={0.3}
            />
            <SplitText
              text="behind growth."
              as="span"
              className="block text-accent-growth"
              animation="slideUp"
              delay={0.45}
            />
            <SplitText
              text="Not just campaigns."
              as="span"
              className="block"
              animation="slideUp"
              delay={0.6}
            />
          </h1>

          {/* Subheadline */}
          <motion.p
            className="text-body max-w-2xl mb-10 text-[var(--text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            A developer-first Growth Engineer. I build landing pages, run A/B tests, and
            instrument tracked campaigns myself, without a separate dev queue.
          </motion.p>

          {/* CTAs with Magnetic Effect */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <MagneticButton onClick={() => scrollToSection('#work')}>
              <AnimatedButton
                size="lg"
                containerClass="shadow-glow"
              >
                View My Work
              </AnimatedButton>
            </MagneticButton>
            <MagneticButton onClick={() => scrollToSection('#contact')}>
              <Button size="lg" variant="outline">
                Get In Touch
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="data-label">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-accent-growth to-transparent"
            animate={{
              scaleY: [1, 0.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
