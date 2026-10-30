# Documentation site tooling

`docs/src/` contains authored guides and collections. `docs/.site/` contains
site configuration. `docs/resources/` contains referenced assets and the
VitePress-specific components and hooks. This directory owns the renderer,
preparation tools, and generated output.

## Layout

```text
.vitepress/       VitePress entry, theme, generated metadata and config parts
config/           Vite and CSS processor configuration
scripts/
  spmpst/          SSG-agnostic source-tree and configuration loader
  preparation/    renderer adapter and pre-SSG preparation
  dev/            output verification, content checks and source watcher
  shared/         ordering helpers
```

The configuration composition root selects the Node-backed SPMPST loader and
passes its site model to the renderer adapter. Preparation reads the same model
and compiles Markdown, metadata, assets, theme components, and Mermaid diagrams.

## Source and configuration

- `../.site/*.site.config.json`: site definitions, language policy, navigation,
  collections, appearance, links, and SEO.
- `../.site/locales/<language>.locale.json`: translated interface and SEO text.
- `../.site/targets/vitepress.target.config.json`: renderer-specific settings.
- `../.site/public/`: public text files copied into the generated site.
- `../src/guides/<guide>/guide.config.json`: guide title, favicon, colors,
  fonts, logos, and renderer theme slots.
- `../src/guides/**/sidebar.json`: localized section labels and relative icons.
- `../src/collections/<collection>/category.json`: localized categories and IDs.
- `../resources/diagrams/mermaid.json`: Mermaid renderer settings.
- Markdown frontmatter requires `icon` and `sidebarTitle` for published pages.

Paths in site configuration are relative to `docs/`. Guide configuration paths
are relative to that guide. Markdown links are relative to their Markdown file.
The loader validates concern ownership, configured locales, and navigation
references. The preparation pipeline validates renderer paths and source content.

## Preparation pipeline

```text
docs/src + docs/.site + docs/resources
                    │
                    ▼
 scripts/preparation/pipeline.mjs
  source-stage → content-stage → page/diagram rendering
                    │
                    ▼
       .generated-guides/ + .vitepress/generated/
                    │
                    ▼
 VitePress config/theme → static rendering → docs/build/
```

VitePress-specific code lives under `docs/resources/targets/vitepress/`; the
SPMPST loader under `scripts/spmpst/` has no dependency on the target adapter.
`docs/SSG.md` defines the source-tree format and planned adapter boundary.

## Generated output ownership

| Output | Owner | Safe to regenerate |
|---|---|---|
| `.generated-guides/` | preparation | yes |
| `.vitepress/generated/` | preparation | yes; generated TypeScript and JSON only |
| `.vitepress/mermaid-cache/` | preparation | yes; renderer cache |
| `docs/build/` | build script | yes; final static site, currently tracked by Git |

Do not edit generated files. `clean.sh` removes generated output and caches; it
also removes the tracked `docs/build/` tree. It does not remove `docs/src/` or
`node_modules`.

## Commands

```sh
npm run docs:check
npm run docs:prepare
npm run docs:build
./serve.sh
./preview.sh
./clean.sh
```

`docs:check -- --strict-i18n` treats missing inline translations as errors.
VitePress is the current renderer. The future Feluqa Rust SSG adapter and its
runtime are planned and are not implemented.
