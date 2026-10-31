# Site configuration

This directory owns the configuration for the documentation tree. Site paths
use `/` separators and are relative to `docs/`. Site behavior belongs in the
`spmpst.*.json` concern files; localized UI copy belongs in the single key-centric `spmpst.locale.json` file.

| File | Owns |
|---|---|
| `spmpst.definitions.json` | Site identity, guide registry, and icon fallback. |
| `spmpst.lang.json` | Language list, fallback language, and selector policy. |
| `spmpst.locale.json` | UI, search, outline, and notice strings, keyed by property and then language. |
| `spmpst.topbar.json` | Navigation items and color-mode policy. |
| `spmpst.collections.json` | Collection IDs, presentation, and source directory names. |
| `spmpst.layout.json` | Site-wide footer component/copy and semantic component placements; general layout registry remains planned. |
| `spmpst.search.json` | Site search provider, provider options, and excluded routes. |
| `spmpst.markdown.json` | Markdown rendering preferences. |
| `spmpst.outline.json` | Site-wide table-of-contents depth. |
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
