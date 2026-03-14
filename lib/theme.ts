// Theme tokens - Color System
// As specified in the strategy document

export const themeColors = {
  // Dark Mode Foundation
  dark: {
    background: {
      primary: '#0B0C10',
      surface: '#1F2937',
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8',
    },
    accent: {
      technical: '#00F0FF',
      growth: '#CCFF00',
    },
    border: '#334155',
  },
  // Light Mode Foundation
  light: {
    background: {
      primary: '#F4F4F5',
      surface: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#64748B',
    },
    accent: {
      technical: '#0099FF',
      growth: '#66CC00',
    },
    border: '#E2E8F0',
  },
};

// CSS Variables for runtime theme switching
export const cssVariables = {
  light: {
    '--color-background': '#F4F4F5',
    '--color-surface': '#FFFFFF',
    '--color-text-primary': '#1F2937',
    '--color-text-secondary': '#64748B',
    '--color-accent-technical': '#0099FF',
    '--color-accent-growth': '#66CC00',
    '--color-border': '#E2E8F0',
  },
  dark: {
    '--color-background': '#0B0C10',
    '--color-surface': '#1F2937',
    '--color-text-primary': '#E2E8F0',
    '--color-text-secondary': '#94A3B8',
    '--color-accent-technical': '#00F0FF',
    '--color-accent-growth': '#CCFF00',
    '--color-border': '#334155',
  },
};

// Color utility functions
export function getColor(
  color: string,
  mode: 'light' | 'dark'
): string {
  const theme = themeColors[mode as keyof typeof themeColors];
  const colorValue = (theme as any)[color];
  if (typeof colorValue === 'object' && colorValue !== null) {
    return Object.values(colorValue)[0] as string;
  }
  return colorValue || themeColors[mode].border;
}

// Accent color for specific use cases
export const accentColors = {
  technical: {
    name: 'Electric Cyan',
    darkMode: '#00F0FF',
    lightMode: '#0099FF',
    usage: 'Technical indicators, code references, accent elements',
  },
  growth: {
    name: 'Acid Lime',
    darkMode: '#CCFF00',
    lightMode: '#66CC00',
    usage: 'Metrics, results, calls to action',
  },
};

// Spacing scale
export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '2rem',
  lg: '4rem',
  xl: '8rem',
  section: '120px',
  sectionLg: '160px',
};

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
};

// Shadow scale
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgba(204, 255, 0, 0.3)',
};
