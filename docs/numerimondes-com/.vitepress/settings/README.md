# Settings Overview

This folder mixes three different kinds of concerns. Keeping them distinct helps
avoid confusion about what is source-of-truth vs. generated output.

## 1) Static config (edited by hand)
- `static/`
  - `i18n/`
  - `locales/`
  - `search/`
  - `index.ts` (navigation)

These files change rarely and are part of the canonical configuration.

## 2) Generated/build-time data
- `generated/`
  - `builder/` (reads `docs/`, writes `.vitepress/cache/gen/*`)
  - `sidebar/` (reads `.vitepress/cache/gen/cms-cache.json`)
  - `cms/` (derived from content)

These depend on content and should be regenerated when `docs/` changes.

## 3) UI/runtime assets
- `ui/`
  - `theme/` (theme entry)
  - `components/`
  - `assets/`

## Shared utilities
- `.vitepress/utils/` (helpers used by builder and parsing)

These are consumed by VitePress at runtime/build time but are not content data.
