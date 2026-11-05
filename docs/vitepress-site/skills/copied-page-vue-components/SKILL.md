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
4. Make the Markdown the portable composition point. It calls auto-discovered components directly and supplies their content through props, without `<script setup>` or imports. Add a wrapper only when the page needs shared containment or CSS; if used, it should own that shared boundary and expose a slot, not page content or a hidden composition. The Markdown should compose it explicitly, for example:

   ```md
   <BrandKitWrapper>
     <BrandKitTopBar ...props />
     <BrandKitHero ...props />
     <BrandKitOverview ...props />
     <BrandKitIndex ...props />
     <BrandKitFooter ...props />
   </BrandKitWrapper>
   ```

   If no wrapper is needed, call the block components directly. Put auto-discovered Vue files under the site's declared `resources/components` tree.
5. Keep styles inside the wrapper when practical, scoped to its root, and free of source-platform names. Use the host's light/dark variables for surfaces and text. Keep the page inside its docs parent, remove unintended outer padding, avoid viewport breakout widths, and use container-aware `clamp()` sizing for large text. Keep internal navigation links local so VitePress does not render external-link indicators.
6. Keep shared behavior distinct from site-specific variation through component APIs and injected props. Do not label existing components as generic or site-specific before the planned migration decides the boundary; design for that migration without claiming its outcome.
7. Build the owning site and confirm the requested route is emitted. Resolve required frontmatter fields, component registration, and local-link failures instead of treating source preparation alone as a successful page.

For this workspace, build Numerimondes with `npm run docs:build -- --site numerimondes` from `docs/vitepress-site/`.
