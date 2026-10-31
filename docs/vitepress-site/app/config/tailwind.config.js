import { resolve } from 'node:path'

const paths = JSON.parse(process.env.SPMPST_PATHS ?? '{}')
const generatedRoot = process.env.SPMPST_GENERATED_DIR
if (!paths.root || !paths.guides || !paths.components || !generatedRoot) {
  throw new Error('Tailwind requires a site selected through spmpst.json')
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    resolve(process.cwd(), '.vitepress/**/*.{vue,ts,js}'),
    resolve(generatedRoot, '../generated-guides/**/*.md'),
    resolve(paths.components, '**/*.{vue,md}'),
    resolve(paths.guides, '**/*.{vue,md}'),
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
