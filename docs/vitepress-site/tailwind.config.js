/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.vitepress/**/*.{vue,ts,js}',
    './.generated-guides/**/*.md',
    '../guides/**/*.{vue,md}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
