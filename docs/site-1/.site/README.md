# Site configuration

This directory owns the configuration for the documentation tree. Site paths
use `/` separators and are relative to `docs/`. Site behavior belongs in the
`spmpst.*.json` concern files; localized text belongs in the concern that consumes it; its leaf values use key-centric language maps.

| File | Owns |
|---|---|
| `spmpst.definitions.json` | Site identity, guide registry, and icon fallback. |
| `spmpst.lang.json` | Languages, selector policy, and localized language labels/fallback notice. |
| `spmpst.topbar.json` | Navigation items and color-mode policy. |
| `spmpst.collections.json` | Collection IDs, presentation, source directories, and empty-state copy. |
| `spmpst.layout.json` | Footer, component placements, and hook-owned copy such as documentation notices. |
| `spmpst.search.json` | Search provider/options and localized search UI labels. |
| `spmpst.markdown.json` | Markdown rendering preferences. |
| `spmpst.outline.json` | Table-of-contents depth and localized label. |
| `spmpst.appearance.json` | Fonts, logos, social preview images, styles, and diagram palette. |
| `spmpst.links.json` | Social links. |
| `spmpst.seo.json` | Canonical site URL, SEO route, icon, and key-centric multilingual SEO copy. |
| `public/*` | Root-level text files such as `robots.txt` and `llms.txt`. |

`src/guides/`, `src/collections/`, and `resources/` are fixed by convention;
do not add path overrides for those roots. `.site/public/` maps to the site URL
root (`/robots.txt`). `resources/media/` maps to `/media/` and accepts ordinary
files of any type. JSON schemas live in `resources/media/schemas/` and are
published as `/media/schemas/*.json` with the `application/json` MIME type.
`npm run docs:check` validates the assembled configuration and source content;
add `-- --strict-i18n` to reject missing translations.
