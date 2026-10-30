# Documentation site tooling

The Markdown source of truth stays in `../guides`. This directory owns only the
VitePress adapter, build tools, and generated outputs. `build.sh`, `serve.sh`,
`preview.sh`, and `clean.sh` are the human-facing commands.

## Layout

```text
.vitepress/       VitePress discovery entry, theme, generated metadata, config parts
config/           Vite and CSS processor configuration
.vitepress/config/ config source port, Node adapter, navigation and SEO/head providers
scripts/
  preparation/    pipeline orchestrator plus source and content stages
  dev/            source watcher and incremental preparation
  build/          final output checks
  shared/         ordering helpers and their focused tests
icons/            icon source library
public/           static assets copied by VitePress
```

The root is reserved for runnable commands, package metadata, notices and this
guide. Preparation lives in `scripts/preparation/`; the watcher lives in
`scripts/dev/watch.mjs`. Put new implementation files in the directory that
owns their job.

`.vitepress/config/site.ts` is the composition root. It selects the Node
configuration source and generated SEO hook, then supplies them to navigation
and page-head builders. Those builders receive explicit inputs; they do not
read process-wide files or construct their own dependencies. A generic IoC
container is unnecessary for this static VitePress config.

## Pipeline

```text
Markdown + frontmatter + JSON + assets
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

### Inputs

- `../guides/vitepress.site.config.json`: site identity, routes, languages,
  search, SEO, collections, style and project paths.
- `../guides/<guide>/vitepress.config.json`: guide title, favicon, colors,
  fonts, logo, and theme overrides.
- `../guides/**/sidebar.json`: localized section labels and a relative icon.
- Markdown frontmatter: `icon` is required on source Markdown and
  `sidebarTitle` on every published page. Other supported fields are declared
  in `.vitepress/types/site-config.d.ts`.
- Collection `category.json`: localized categories and unique slug IDs.
- `../guides/.config/vitepress/mermaid.json`: Mermaid renderer theme and
  rendering options.
- `../guides/vitepress.site.config.json` → `mermaid`: flowchart palette,
  border width, and dark message color used by preparation.
- Project files selected by `project.components` and `project.hooks`: Vue
  theme components, SEO/head transformation, and optional hook CSS.

The site JSON shape is specified in `config/site-config.schema.json`; shared
TypeScript contracts, including guide config and SEO hook inputs, live in
`.vitepress/types/site-config.d.ts`. Runtime validation remains responsible
for path safety, file existence, and relationships across configuration files.

## Hooks

`project.hooks` is a directory. Preparation finds these basenames, preferring
extensions in `.ts`, `.mts`, `.js`, `.mjs`, `.cjs`, `.cts` order:

| Basename | Exports | Used for |
|---|---|---|
| `documentation-hooks` | `DocumentationNotice`, `DocumentationLastModified` | Vue components in the theme. |
| `documentation-seo` | `transformDocumentationHead`, `SeoOptions` | Page metadata from `transformHead`. |
| `documentation-hooks.css` | none | Optional component stylesheet. |

SEO receives `DocumentationSeoOptions`. Components under `project.components`
are registered for VitePress theme slots; every non-null slot name must match a
component discovered there.

## Generated output ownership

| Output | Owner | Safe to regenerate |
|---|---|---|
| `.generated-guides/` | preparation | yes |
| `.vitepress/generated/` | preparation | yes; generated TypeScript/JSON only |
| `.vitepress/mermaid-cache/` | preparation | yes; renderer cache |
| `docs/build/` | `build.sh` | yes; final static site, currently tracked by Git |

Do not edit generated files. `clean.sh` removes these outputs and caches, but
will also remove the tracked `docs/build/` tree; run it when that deletion is
intended. It never removes `../guides` or `node_modules`.

## Commands and future SSG boundary

```sh
./build.sh       # prepare, render, audit links, then swap the static build
./serve.sh       # VitePress dev server plus source watcher
./preview.sh     # build and serve docs/build
./clean.sh       # remove generated outputs and caches
```

VitePress is the current renderer. The future Rust SSG should consume explicit
site/guide/collection config, parsed frontmatter, routes, and asset references,
then compile a frontend-neutral page model for Vue, React, or HTML renderers.
That Rust preparation and rendering model is not implemented yet.
