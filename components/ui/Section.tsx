'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  variant?: 'default' | 'surface' | 'gradient' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDivider?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      id,
      variant = 'default',
      size = 'lg',
      showDivider = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-[var(--background-primary)] dark:bg-[var(--background-primary)]',
      surface: 'bg-[var(--surface-color)] dark:bg-[var(--background-surface)]',
      gradient: 'bg-gradient-to-b from-[var(--background-surface)] to-[var(--background-primary)] dark:from-[var(--background-surface)] dark:to-[var(--background-primary)]',
      dark: 'bg-[var(--background-primary)] dark:bg-[var(--background-primary)]',
    };

    const sizes = {
      sm: 'py-16 lg:py-20',
      md: 'py-24 lg:py-28',
      lg: 'py-20 lg:py-32',
      xl: 'py-24 lg:py-40',
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'relative w-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {showDivider && (
          <div className="absolute top-0 left-0 right-0 h-px bg-[var(--border-color)]/20" />
        )}
        <div className="container-main">{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';

// Animated Section with reveal on scroll
interface AnimatedSectionProps extends SectionProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedSection = forwardRef<HTMLElement, AnimatedSectionProps>(
  ({ delay = 0, children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.6,
          delay: delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn('w-full', className)}
      >
        <Section {...props}>{children}</Section>
      </motion.div>
    );
  }
);

AnimatedSection.displayName = 'AnimatedSection';

export default Section;
