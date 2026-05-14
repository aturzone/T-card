import rtl from 'tailwindcss-rtl';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    screens: {
      sm: '640px',
      md: '800px',
      lg: '1100px',
      xl: '1400px',
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-soft': 'var(--bg-soft)',
        'bg-card': 'var(--bg-card)',
        'bg-elev': 'var(--bg-elev)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-mute': 'var(--ink-mute)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        'accent-soft': 'var(--accent-soft)',
        gold: 'var(--gold)',
        danger: 'var(--danger)',
        success: 'var(--success)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        hero: 'var(--fs-hero)',
        h1: 'var(--fs-h1)',
        h2: 'var(--fs-h2)',
        h3: 'var(--fs-h3)',
        body: 'var(--fs-body)',
        small: 'var(--fs-small)',
        xs: 'var(--fs-xs)',
      },
      spacing: {
        'pad-x': 'var(--pad-x)',
        'pad-section': 'var(--pad-section)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
      },
      transitionTimingFunction: {
        ease: 'var(--ease)',
        'ease-out': 'var(--ease-out)',
      },
      transitionDuration: {
        fast: '180ms',
        DEFAULT: '320ms',
        slow: '600ms',
      },
      maxWidth: {
        container: '1400px',
      },
      letterSpacing: {
        eyebrow: '.18em',
      },
    },
  },
  plugins: [rtl],
};
