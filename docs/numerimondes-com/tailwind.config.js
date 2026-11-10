/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.vitepress/**/*.{vue,js,ts,jsx,tsx,md,mdx}',
    './docs/**/*.{md,mdx,vue,js,ts,jsx,tsx,html}',
    './src/**/*.{html,js,ts,vue,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
