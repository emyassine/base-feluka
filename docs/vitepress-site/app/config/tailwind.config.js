/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.vitepress/**/*.{vue,ts,js}',
    '../.trash/generated-guides/**/*.md',
    '../sites/feluqa/resources/components/**/*.{vue,md}',
    '../../src/guides/**/*.{vue,md}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1220px' },
    },
    extend: {
      colors: {
        border: 'var(--vp-c-divider)',
        background: 'var(--vp-c-bg)',
        foreground: 'var(--vp-c-text-1)',
        primary: { DEFAULT: 'var(--vp-c-brand-1)', foreground: 'var(--vp-c-bg)' },
        muted: { DEFAULT: 'var(--vp-c-bg-soft)', foreground: 'var(--vp-c-text-2)' },
        accent: { DEFAULT: 'var(--vp-c-bg-soft)', foreground: 'var(--vp-c-text-1)' },
        card: { DEFAULT: 'var(--vp-c-bg-soft)', foreground: 'var(--vp-c-text-1)' },
        ring: 'var(--vp-c-brand-1)',
      },
    },
  },
  plugins: [],
}
