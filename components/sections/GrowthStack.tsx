'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

// Tool icons for the growth stack
const toolIcons: Record<string, React.ReactNode> = {
  'Google Analytics': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  'Meta Ads': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  'Google Ads': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
    </svg>
  ),
  'WordPress': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.92 15.965c-.28.633-.92 1.409-2.3 1.51-1.44.105-1.91-.85-3.69-.85-1.76 0-2.28.83-3.6.87-1.37.05-2.17-.92-2.53-1.95-.67-1.94-1.13-4.94-1.13-6.66 0-2.28 1.07-4.39 3.08-5.34 1.3-.62 2.52-.73 3.45-.45 1.05.32 1.62.88 2.04 1.17l.63-1.53c-.69-.5-1.98-1.18-3.72-1.18-3.13 0-5.07 2.64-5.07 5.39 0 2.86 1.64 6.12 4.24 7.55 1.01.56 2.15.83 3.07.79 1.34-.05 2.42-.62 3.03-1.5.35-.5.51-1.04.51-1.71 0-.45-.08-.97-.25-1.54l-1.71.24c.26 1.06.46 1.84.73 2.24z"/>
    </svg>
  ),
  'WooCommerce': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  'Next.js': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5L10 9v8H8.5V7h1.5l6 6V7h1.5v9.5z"/>
    </svg>
  ),
  'React': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.37 4.2 7.99 3.62 7.37 4c-.64.35-.83 1.82-.32 3.96.77-.16 1.58-.28 2.4-.36.48-.67.99-1.31 1.51-1.9Z"/>
    </svg>
  ),
  'TypeScript': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8zm4.28-5.72H14.7V5.02h2.87v1.43h-2.87v2.72z"/>
    </svg>
  ),
  'Tailwind CSS': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.007 2.242c-.935 0-1.446.278-1.675.545-.12.14-.493.566-.886 1.067C8.762 5.072 7.502 6.11 7.502 6.11s-1.194-.87-2.422-1.067c-.98-.156-1.67.042-1.886.326-.12.156-.06.436.03.575-.72-.26-1.236.062-1.236.062s-1.05.546-1.423 1.83c-.416 1.42.062 2.305.602 2.962.39.467.956.686 1.236.686.56 0 .935-.248 1.32-.778.602-.914 1.423-2.56 1.423-2.56s.326 1.026 1.116 1.6c.39.28.803.435 1.116.435.56 0 .935-.248 1.32-.778.602-.914 1.423-2.56 1.423-2.56s.417 1.026 1.207 1.6c.39.28.713.513 1.116.513.56 0 .935-.248 1.32-.778.602-.914 1.423-2.56 1.423-2.56s.326 1.026 1.116 1.6c.39.28.713.513 1.116.513.602 0 1.026-.248 1.512-.778.652-.914 1.542-2.56 1.542-2.56s.062.358.062.575c0 .602-.45 1.242-1.512 1.242Z"/>
    </svg>
  ),
  'Vercel': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h20L12 2z"/>
    </svg>
  ),
  'Node.js': (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    </svg>
  ),
};

// A single tool chip used inside the marquee tracks.
function ToolChip({ tool }: { tool: { name: string; category: string } }) {
  return (
    <div
      className="group flex items-center gap-3 shrink-0 px-5 py-3 rounded-xl bg-[var(--background-surface)] border border-[var(--border-color)] hover:border-accent-growth/50 transition-colors duration-300"
    >
      <div className="w-9 h-9 shrink-0 rounded-lg bg-[var(--background-primary)] flex items-center justify-center text-[var(--text-primary)] group-hover:text-accent-growth transition-colors">
        {toolIcons[tool.name] || (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )}
      </div>
      <div className="flex flex-col whitespace-nowrap">
        <span className="text-sm font-medium text-[var(--text-primary)]">{tool.name}</span>
        <span className="text-xs text-[var(--text-secondary)]">{tool.category}</span>
      </div>
    </div>
  );
}

// One infinitely-looping row: the track is the tool list rendered twice back
// to back, animated from translateX(0) to translateX(-50%) so the seam
// between the two copies is never visible. Pauses on hover so it's actually
// readable, and motion-reduce just shows the first copy at rest (the
// duplicate is clipped by overflow-hidden on the parent).
function MarqueeRow({
  tools,
  reverse = false,
}: {
  tools: { name: string; category: string }[];
  reverse?: boolean;
}) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={cn(
          'flex w-max gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
      >
        {[...tools, ...tools].map((tool, index) => (
          <ToolChip key={`${tool.name}-${index}`} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default function GrowthStack() {
  // No custom scroll-linked JS here at all, deliberately - a hand-rolled
  // sync tween is what broke this repeatedly. PinnedPillars' own
  // strip-reveal ScrollTrigger (see its `pin: panelRef.current,
  // pinSpacing: false`) is what actually gets this section into view: with
  // no extra document height reserved during that pin, this section - a
  // completely plain, normal-flow section with no ref, no transform - is
  // already scrolling up into its natural resting position underneath the
  // still-pinned panel for the entire hold, for free, arriving at exactly
  // y:0 the instant the pin releases. See PinnedPillars.tsx for the actual
  // mechanism.

  // Expanded tool list with icons
  const tools = [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'WordPress', category: 'CMS' },
    { name: 'Statamic', category: 'CMS' },
    { name: 'Drupal', category: 'CMS' },
    { name: 'PHP', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Supabase', category: 'Backend' },
    { name: 'GA4', category: 'Analytics' },
    { name: 'Google Tag Manager', category: 'Analytics' },
    { name: 'Server-Side Tracking', category: 'Analytics' },
    { name: 'n8n', category: 'Automation' },
    { name: 'Claude API', category: 'Automation' },
    { name: 'M-Pesa Daraja, Paystack, Stripe', category: 'Payments' },
    { name: 'Meta Ads', category: 'Paid Media' },
    { name: 'Google Ads', category: 'Paid Media' },
    { name: 'Vercel', category: 'Deployment' },
  ];

  const midpoint = Math.ceil(tools.length / 2);
  const rowOne = tools.slice(0, midpoint);
  const rowTwo = tools.slice(midpoint);

  return (
    // A completely plain section, deliberately - see the note above the
    // component. No ref, no custom z-index: PinnedPillars' own pinned
    // panel already stacks above normal-flow content by default (it's
    // position:fixed during the reveal, with an explicit z-index), so
    // this needs nothing extra to stay hidden behind it until revealed.
    <AnimatedSection id="stack" variant="default" size="xl">
      <div className="container-main">
        {/* Section Header */}
        {/* Matches PinnedPillars' reveal-strip colour exactly (#1A1A1A) so
            the hand-off from "fully-grown strips" to this real section has
            zero visible seam. Scoped to #stack specifically since that's
            the element Section.tsx actually paints a background on - see
            the note on the wrapper above for why this can't just be a
            className here. */}
        <style>{`.dark #stack { background: #1A1A1A; }`}</style>
        <motion.div className="max-w-2xl mb-16 mx-auto text-center">
          <h2 className="text-section font-display font-semibold mb-4 text-[var(--text-primary)]">
            My Growth Stack
          </h2>
          <p className="text-body text-[var(--text-secondary)]">
            The tools and platforms I use to build, launch, and measure growth experiments.
          </p>
        </motion.div>
      </div>

      {/* Tools: two auto-scrolling rows, opposite directions, full-bleed
          (deliberately outside .container-main so the fade-out mask at each
          edge reaches the true edge of the viewport, not just the container) */}
      <div className="flex flex-col gap-4 mb-16">
        <MarqueeRow tools={rowOne} />
        <MarqueeRow tools={rowTwo} reverse />
      </div>

      <div className="container-main">
        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-body text-[var(--text-secondary)] mb-4">
            Ready to build something great together?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-accent-growth hover:text-accent-growth/80 transition-colors"
          >
            <span className="font-medium">Let&apos;s chat about your project</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
