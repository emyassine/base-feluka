---
name: copied-page-vue-components
description: Copy a referenced page body into the VitePress docs site and split it into reusable, prop-driven Vue blocks while preserving the source styling.
---

# Copy pages into Vue blocks

Use this skill when a user asks to copy a website page into this docs site or to turn its page sections into Vue components.

## Workflow

1. Inspect the site's route definitions, Markdown frontmatter rules, component discovery path, and existing page styles before editing.
2. Copy the requested page body and its visual styling. Omit the outer document wrapper and do not substitute an iframe when the user asks for a local copy. Preserve source wording and structure unless the user asks for adaptation.
3. Split major page sections into small Vue components. Keep shared behavior and page-specific content separate: components expose typed props or slots, and the calling `.md` supplies the page copy, attributes, and composition. Avoid a single component that owns an entire page. For Brand Kit blocks, follow `BrandKit<Subject><BlockName>.vue` or `BrandKit<BlockName>.vue`.
4. Keep the Markdown file as the composition point. Put discovered Vue files and their assets under the site's declared `resources/components` tree. Import page data and styles from the `.md` with the site's `@docs` alias; generated Markdown is staged elsewhere, so relative component imports from it can fail.
5. Scope copied CSS to a page root. Remove source `<style>` elements from copied body fragments, scope every copied selector, and keep global rules limited to font-face declarations. Use the host's light/dark theme variables for surfaces and text. Keep the page within its parent docs container; do not use viewport breakout widths. Use container-aware `clamp()` sizing for large text.
6. Keep content and styles modular so a later migration can move reusable behavior without rewriting page copy. Distinguish generic behavior from site-specific variation through component APIs and injected props; do not label current components as generic or site-specific before that migration decides the boundary.
7. Build the owning site and confirm the requested route is emitted. Resolve required frontmatter fields, component imports, and local-link failures instead of treating source preparation alone as a successful page.

For this workspace, build Numerimondes with `npm run docs:build -- --site numerimondes` from `docs/vitepress-site/`.
