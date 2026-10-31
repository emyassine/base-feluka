# Site configuration

This directory owns the configuration for the documentation tree. Site paths
use `/` separators and are relative to `docs/`. Keep target-specific settings
inside `targets/`; `scripts/spmpst/` loads those files as opaque target data.

| File | Owns |
|---|---|
| `spmpst.definitions.json` | Site identity, guide registry, and icon fallback. |
| `spmpst.lang.json` | Language list, fallback language, and selector policy. |
| `spmpst.topbar.json` | Navigation items and color-mode policy. |
| `spmpst.collections.json` | Collection IDs, presentation, and source directory names. |
| `spmpst.appearance.json` | Fonts, logos, social preview images, and diagram palette. |
| `spmpst.links.json` | Social links. |
| `spmpst.seo.json` | Canonical site URL, SEO route, and icon. |
| `locales/<language>.locale.json` | Localized UI, search, footer, notices, and SEO copy. |
| `public/*` | Public text files copied into the rendered site. |
| `targets/vitepress.target.config.json` | Renderer configuration; keep it separate from the target-neutral model. |

`src/guides/`, `src/collections/`, and `resources/` are fixed by convention;
do not add path overrides for those roots. Use the schemas in `schema/` in
editors. `npm run docs:check` validates the assembled configuration and source
content; add `-- --strict-i18n` to reject missing inline translations.
