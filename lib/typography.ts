// Typography System
// As specified in the strategy document

import { clsx, type ClassValue } from 'clsx';

// Font families
export const fontFamilies = {
  display: ['Clash Display', 'General Sans', 'system-ui', 'sans-serif'].join(', '),
  body: ['Switzer', 'Inter', 'system-ui', 'sans-serif'].join(', '),
  mono: ['JetBrains Mono', 'Space Mono', 'monospace'].join(', '),
};

// Font sizes - Desktop
export const fontSizes = {
  hero: { min: '5rem', max: '8rem', lineHeight: '0.9', letterSpacing: '-0.02em' },
  section: { min: '2.5rem', max: '4rem', lineHeight: '1.0', letterSpacing: '-0.02em' },
  card: { min: '1.25rem', max: '1.5rem', lineHeight: '1.2' },
  body: { min: '0.875rem', max: '1rem', lineHeight: '1.7' },
  label: { min: '0.75rem', max: '0.75rem', lineHeight: '1.4', letterSpacing: '0.1em' },
  metric: { min: '3rem', max: '5rem', lineHeight: '1.0' },
};

// Font sizes - Mobile
export const fontSizesMobile = {
  hero: { min: '2.5rem', max: '4rem', lineHeight: '0.9', letterSpacing: '-0.02em' },
  section: { min: '1.75rem', max: '2.5rem', lineHeight: '1.0', letterSpacing: '-0.02em' },
  card: { min: '1.125rem', max: '1.25rem', lineHeight: '1.2' },
  body: { min: '0.875rem', max: '0.875rem', lineHeight: '1.7' },
  label: { min: '0.75rem', max: '0.75rem', lineHeight: '1.4', letterSpacing: '0.1em' },
  metric: { min: '2rem', max: '3rem', lineHeight: '1.0' },
};

// Font weights
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// CSS classes for typography
export const typographyClasses = {
  // Headlines
  heroHeadline: `
    font-display font-bold
    text-[clamp(5rem,18vw,8rem)] leading-[0.9] tracking-[-0.02em]
    text-text-primary dark:text-text-primary-dark
  `,
  sectionHeadline: `
    font-display font-semibold
    text-[clamp(2.5rem,8vw,4rem)] leading-[1.0] tracking-[-0.02em]
    text-text-primary dark:text-text-primary-dark
  `,
  cardHeadline: `
    font-display font-semibold
    text-[clamp(1.25rem,1.5vw,1.5rem)] leading-[1.2]
    text-text-primary dark:text-text-primary-dark
  `,
  // Body
  body: `
    font-body font-normal
    text-[clamp(0.875rem,1vw,1rem)] leading-[1.7]
    text-text-secondary dark:text-text-secondary-dark
  `,
  // Data/Mono
  dataLabel: `
    font-mono font-medium
    text-[0.75rem] leading-[1.4] tracking-[0.1em] uppercase
    text-text-secondary dark:text-text-secondary-dark
  `,
  metricValue: `
    font-mono font-bold
    text-[clamp(3rem,8vw,5rem)] leading-[1.0]
    text-accent-growth-dark dark:text-accent-growth-dark
  `,
};

// Typography utility function
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Google Fonts configuration for Next.js
export const fontsConfiguration = {
  display: {
    variable: '--font-display',
    googleFont: 'Clash+Display:wght@400;500;600;700',
  },
  body: {
    variable: '--font-body',
    googleFont: 'Inter:wght@400;500;600;700',
  },
  mono: {
    variable: '--font-mono',
    googleFont: 'JetBrains+Mono:wght@400;500;700',
  },
};
