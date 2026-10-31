# Site configuration

This directory owns the concern config files for the documentation tree. Its
location is declared by `paths.config` in the root `../spmpst.json`; individual
concern file locations are registered in `paths.configFiles`. Site behavior belongs in the
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
| `public/*` | The directory selected by `paths.public` in the root manifest, copied recursively to the site URL root. |

`src/guides/`, `src/collections/`, and `resources/` use the paths declared in the root manifest.
The current `paths.public: "public"` in `../spmpst.json` selects the site-root `public/`; all its contents map to the URL root (`robots.txt` becomes `/robots.txt`, and `media/schemas/definitions.schema.json` becomes `/media/schemas/definitions.schema.json`). `paths.media` and `paths.schemas` identify subdirectories within that same public tree for media references and schema tooling. Move public assets by updating these fields in `../spmpst.json`; there is no second media source directory.
`npm run docs:check` validates the assembled configuration and source content;
add `-- --strict-i18n` to reject missing translations.
