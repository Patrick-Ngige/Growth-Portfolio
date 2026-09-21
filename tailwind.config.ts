import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Accent Colors - growth delegates to the theme-aware CSS custom
        // property in globals.css (orange, #EA580C light / #FB923C dark)
        // rather than a second, independent hex value. The two had drifted
        // apart: this file previously hardcoded a lime green (#CCFF00)
        // that every text-accent-growth/bg-accent-growth utility resolved
        // to, silently overriding the intended orange everywhere those
        // Tailwind classes were used instead of var(--accent-growth)
        // directly - about a dozen live components, not a one-off.
        accent: {
          technical: {
            DEFAULT: '#00F0FF',
            light: '#0099FF',
          },
          growth: {
            DEFAULT: 'rgb(var(--accent-growth-rgb) / <alpha-value>)',
            light: 'rgb(var(--accent-growth-rgb) / <alpha-value>)',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 12vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['clamp(2rem, 6vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'card': ['1.25rem', { lineHeight: '1.2' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        'metric': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.0' }],
      },
      spacing: {
        'section': '120px',
        'section-lg': '160px',
        'container': '1280px',
        'gutter': '24px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'draw': 'draw 1s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'marquee': 'marquee 32s linear infinite',
        'marquee-reverse': 'marquee-reverse 32s linear infinite',
      },
      keyframes: {
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
};

export default config;
