---
name: copied-page-vue-components
description: Copy a referenced page body into the VitePress docs site and split it into reusable, prop-driven Vue blocks while preserving the source styling.
---

# Copy pages into Vue blocks

Use this skill when a user asks to copy a website page into this docs site or to turn its page sections into Vue components.

## Workflow

1. Inspect the site's route definitions, Markdown frontmatter rules, component discovery path, and existing page styles before editing.
2. Copy the requested body and styling without carrying over the source platform's runtime, tracking code, generated class names, or badge. Do not use an iframe when the user asks for a local copy. Keep the visible content and design intent; normalize the markup into readable, semantic page code.
3. Keep the implementation lean and maintainable by one person. Use one prop-driven Vue component for each primary page block the user wants to compose (for example, Hero, Overview, Index, Footer) and one separate component for independently maintained navigation when requested. Do not make components for individual rows/items or create one `.html` fragment file per block.
4. Make the Markdown the portable composition point. It calls globally registered theme components or auto-discovered components directly and supplies their content through props, without `<script setup>` or imports. The shared brand blocks are registered by the VitePress theme and need no wrapper. Add a wrapper only when a page needs its own shared containment or CSS; if used, it should own that boundary and expose a slot, not page content or hidden composition.

   ```md
   <BrandHero ...props />
   <BrandOverview ...props />
   <BrandIndex ...props />
   <BrandFooter ...props />
   ```

   If no wrapper is needed, call the block components directly. Put auto-discovered Vue files in the repository-level `components/` tree, grouped by responsibility.
5. Keep component styles in each Vue component when they belong to that component, scoped to its root and free of source-platform names. For shared brand-block tokens and container sizing, use the VitePress theme's `brand.css`. Use host light/dark variables for surfaces and text. Keep the page inside its docs parent, remove unintended outer padding, avoid viewport breakout widths, and use container-aware `clamp()` sizing for large text. Keep internal navigation links local so VitePress does not render external-link indicators.
6. For text props that need rich author-authored markup or per-instance styling, expose matching `style-<prop>` and `class-<prop>` props (for example, `title`, `title-style`, and `title-class`). Render explicitly trusted Markdown-authored HTML with `v-html`; never pass untrusted content to it. Apply the style and class to the text element itself. Keep component APIs consistent across the page blocks.
7. Keep shared behavior in reusable component APIs and pass site-specific variation through props or data. Register VitePress-wide blocks in the shared theme; keep content and page composition in the owning site.
8. Build the owning site and confirm the requested route is emitted. Resolve required frontmatter fields, component registration, and local-link failures instead of treating source preparation alone as a successful page.
9. Keep component trees organized by responsibility instead of flattening files at the discovery root. Under `blocks/`, separate small atomic components, composed page blocks, and specialized blocks; keep tightly related parts such as a tabs group or a feature's local data and styles together. Keep shared styles in a dedicated styles folder. Host-wide brand components live in `components/brand/` and are registered from the theme. Component filenames derive their Markdown names, so use clear names without product or site prefixes. Name hero variants `HeroOne`, `HeroTwo`, and onward.

For this workspace, build Numerimondes with `npm run docs:build -- --site numerimondes` from `docs/vitepress-site/`.
