import { resolve } from 'node:path'

const sourceRoot = process.env.SPMPST_ROOT
const siteResourcesRoot = process.env.VITEPRESS_SITE_RESOURCES_DIR
const trashRoot = process.env.VITEPRESS_TRASH_DIR
if (!sourceRoot || !siteResourcesRoot || !trashRoot) {
  throw new Error('Tailwind requires a site selected through spmpst.json')
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    resolve(process.cwd(), '.vitepress/**/*.{vue,ts,js}'),
    resolve(trashRoot, 'generated-guides/**/*.md'),
    resolve(siteResourcesRoot, 'components/**/*.{vue,md}'),
    resolve(sourceRoot, 'src/guides/**/*.{vue,md}'),
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
