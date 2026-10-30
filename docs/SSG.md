# SPMPST v0.1 (draft)

SPMPST means Standard Portable Markdown Pre-SSG Tree. This draft describes the
source tree consumed by the current preparation pipeline and the boundary where
an SSG adapter can consume its model. It records observed behavior; it does not
claim that a Feluqa Rust SSG exists.

The words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** express
requirements for this draft.

## 1. Purpose and scope

SPMPST is a portable directory convention and configuration model for human
documentation authors and static-site adapters. It defines authored Markdown,
metadata, configuration, and referenced resources before site generation.
SPMPST is not an SSG, a Markdown dialect, or a runtime component system.

SPMPST provides the source-tree contract, configuration ownership and loading
rules, portable routing and locale conventions, and logical resource-reference
syntax. It does not ship an icon or flag catalogue, choose a renderer, bundle
site-specific components, or dictate where an adapter is installed. An adapter
resolves logical resource references against its selected site's resource
catalogue and emits target-ready paths or URLs.

The current implementation is the JavaScript reference loader and preparation
pipeline. A Feluqa Rust SSG adapter is **PLANNED**.

## 2. Status and versioning

This document specifies **v0.1 (draft)**. A breaking tree, metadata, or model
change SHOULD increment the major version; additive optional fields SHOULD
increment the minor version. These versioning rules are **PLANNED** and are not
currently enforced by a manifest.

## 3. Terminology

- **Tree root**: directory containing `.site/`; currently `docs/`.
- **Guide**: independently routed documentation collection under `src/guides/`.
- **Subguide**: a guide registered in the `subguides` configuration array.
- **Section**: a directory of pages within a guide.
- **Page**: a Markdown source file that is not metadata or ignored content.
- **Collection**: a registry entry whose Markdown files are prepared as a list
  or article feed.
- **Category**: localized metadata from a collection's `category.json`.
- **Locale**: a language code such as `en` or `fr`.
- **Bundle**: a locale JSON file containing language-specific UI and SEO copy.
- **Concern file**: one `.site.config.json` file with one owner for each key.
- **Target**: a renderer-specific configuration and resource set.
- **Adapter**: code that maps the shared model to one target renderer.
- **Staged tree**: portable Markdown and staged assets produced before SSG
  rendering.

## 4. Layers

```text
Human-authored tree       docs/{.site,src,resources}
           │
           ▼
Shared site model          docs/vitepress-site/app/scripts/spmpst/ (target-neutral model)
           │
           ▼
Target adapter             docs/vitepress-site/app/scripts/preparation/ + target resources
           │
           ▼
Rendered site              static pages and browser assets
```

The source tree SHOULD remain usable by more than one adapter. Target code and
target-owned resources MAY be packaged with the adapter, outside that tree.
Source: `docs/vitepress-site/README.md`

The configuration loader MUST return target files as opaque data; target
validation belongs to the consuming adapter. Source: `docs/vitepress-site/app/scripts/spmpst/config/assemble.mjs#assembleConfig`

## 5. Directory layout and paths

```text
docs/
├── .site/
│   ├── *.site.config.json
│   ├── locales/*.locale.json
│   ├── public/*
│   ├── schema/*.schema.json
│   └── targets/*.target.config.json
├── src/
│   ├── guides/
│   └── collections/
└── resources/
    └── assets/
```

An adapter MAY keep target-owned catalogues beside its application rather than
inside the source tree. The current VitePress host does this in
`docs/vitepress-site/resources/`, with separate `icons/`, `flags/`,
`components/`, `hooks/`, and `diagrams/` directories.

The tree root MUST be the directory containing `.site/`; `SPMPST_ROOT` MAY
override it for tooling. Source roots MUST use the fixed conventions shown
above. Source: `docs/vitepress-site/app/scripts/spmpst/layout.mjs#resolveLayout`

Paths in `.site/` MUST be relative to the tree root, use `/`, and MUST NOT
escape the root. Collection `dir` is relative to `src/collections` and defaults
to its `id`. Guide config paths are relative to that guide. Markdown relative
links are relative to their page. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#prepareSources`

Assets referenced from Markdown MAY come from `src/guides`, `src/collections`,
or source-tree `resources/`; adapter resources are referenced by logical
SPMPST resource identifiers. Other paths are rejected. Source:
`docs/vitepress-site/app/scripts/preparation/source-stage.mjs#copyAsset`

## 6. Source file conventions

Numeric prefixes such as `010-` and `020.` control navigation order and are
removed from staged names. Language suffixes use `name.<lang>.md`, where the
current language pattern is `[a-z]{2,3}(-[A-Z]{2})?`; a missing suffix is
treated as the fallback language. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#cleanDir`

Names beginning with `.` and files named `README.md` MUST NOT be published.
`sidebar.json`, `guide.config.json`, and collection `category.json` are
metadata, not pages. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#scan`

`index.<language>.md` files provide localized directory indexes. The root
fallback index is derived as `src/guides/index.<fallbackLanguage>.md`.
Source: `docs/vitepress-site/app/scripts/preparation/runtime.mjs#toVitepressRuntime`

## 7. Frontmatter

Every published page MUST define `icon` and `sidebarTitle`; `title` and
`description` are recommended. Collection article pages may include `date` and
`category`. Unknown frontmatter is preserved for the target, except fields
rewritten by preparation. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#scan`

Preparation may add `requestedLanguage`, `contentLanguage`,
`languageFallbackNotice`, `prev`, `next`, `search`, `collection`, `wordCount`,
`readingTime`, and `collectionIndex`. Source: `docs/vitepress-site/app/scripts/preparation/pipeline.mjs#frontmatter preparation`

## 8. Routing

Guide routes are configured with `uri.base` and optional `uri.index`; locale
prefixes depend on `fallbackLanguage` and `selector.prefixDefaultLanguage`.
Route segments are cleaned by removing numeric ordering prefixes. Directory
indexes and collection pages are emitted from their source locations. The
current source does not implement a general route-conflict validator; that
check is **PLANNED**. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#stagedPath`

## 9. Languages and fallbacks

`lang.site.config.json` owns the configured languages, fallback language, and
selector policy. Each configured language MUST have one
`.site/locales/<language>.locale.json` bundle. Extra bundle files produce a
warning. Source: `docs/vitepress-site/app/scripts/spmpst/config/assemble.mjs#assembleConfig`

Localized inline objects are resolved using the requested language, then the
fallback language, then the first string value. Missing inline translations
warn normally and fail with `--strict-i18n`. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#localizedValue`

Fallback notice text uses `{requested}` and `{fallback}` placeholders where
provided. The reference implementation currently validates `{requested}` for
the notice string. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#prepareSources`

## 10. Collections

Collection layout is `article` or `doc`; index layout is `list` or `spotlight`.
`category.json` provides localized category names and IDs. Article word counts
use whitespace-separated words and reading time rounds up at 200 words per
minute. Source: `docs/vitepress-site/app/scripts/preparation/content-stage.mjs#readingMetrics`

Category-specific routes are **PLANNED**. Current collection indexes and
article metadata are generated by preparation. Source: `docs/vitepress-site/app/scripts/preparation/content-stage.mjs#collection compilation`

## 11. Site configuration

| Concern | File | Main keys |
|---|---|---|
| Definitions | `definitions.site.config.json` | `site`, `subguides`, `iconFallback` |
| Languages | `lang.site.config.json` | `languages`, `fallbackLanguage`, `selector` |
| Navigation | `topbar.site.config.json` | `items`, `theme` |
| Collections | `collections.site.config.json` | `collections` |
| Appearance | `appearance.site.config.json` | `fonts`, `logo`, `ogImages`, `mermaid` |
| Links | `links.site.config.json` | `socialLinks` |
| SEO | `seo.site.config.json` | `siteUrl`, `path`, `icon` |

The loader MUST reject unknown concerns, unknown keys, and duplicate ownership;
it MUST report a likely owner or spelling suggestion when available. `$schema`
is ignored by the loader. Source: `docs/vitepress-site/app/scripts/spmpst/config/assemble.mjs#assembleConfig`

Locale bundles MUST contain language, UI, search, outline, footer, notice, and
SEO sections. Target files are opaque to the shared loader. Source: `docs/vitepress-site/app/scripts/spmpst/config/assemble.mjs#assembleConfig`

`public/*` files are emitted with one trailing newline removed. Source: `docs/vitepress-site/app/scripts/preparation/runtime.mjs#toVitepressRuntime`

## 12. Assets and resources

Assets are copied to `__docs-assets/<sha256><extension>`; the current digest is
SHA-256 of file bytes. Source: `docs/vitepress-site/app/scripts/preparation/source-stage.mjs#copyAsset`

Icon IDs resolve against the selected adapter's icon catalogue; the current
VitePress catalogue has `lucide`, `custom`, `heroicons`, and `simple-icons`
families. An unrecognized icon uses the configured fallback. Sidebar icons may
also be local SVG paths. Source:
`docs/vitepress-site/app/scripts/preparation/source-stage.mjs#findIcon`

Portable JSON and frontmatter may use logical resource references:

```text
@spmpst::resources::icon::lucide/book-open
@spmpst::resources::flag::language/fr
@spmpst::resources::flag::catalog/countries/fr
```

The grammar is `@spmpst::resources::<kind>::<id>`. In v0.1, `kind` is `icon`
or `flag`; `<id>` is a slash-separated Unicode path without `..`, normalized
to NFC. SPMPST parses the reference and lets an adapter resolve it. The reference does not
embed a machine path or require one global icon catalogue. The VitePress
adapter replaces references with validated file paths before rendering. Source:
`docs/vitepress-site/app/scripts/spmpst/resources.mjs#parseResourceReference`
and `docs/vitepress-site/app/scripts/preparation/resolve-resource.mjs#resolveVitepressResource`.

Language flags and Mermaid settings are owned by the VitePress adapter under
`docs/vitepress-site/resources/flags/` and
`docs/vitepress-site/resources/diagrams/` respectively.
Mermaid rendering may generate light and dark variants. Source:
`docs/vitepress-site/app/scripts/preparation/stages/transform-markdown.mjs#renderDiagram`

## 13. Pre-SSG pipeline

The VitePress pipeline orders source discovery, guide and collection compilation,
theme metadata emission, Markdown transforms, language fallback pages, SEO
pages, directory indexes, pagination, and cleanup. Source: `docs/vitepress-site/app/scripts/preparation/pipeline.mjs#preparation entrypoint`

Incremental preparation is enabled by `DOCS_PREPARE_INCREMENTAL=1`. Concurrent
prepare processes serialize through `flock`. Source:
`docs/vitepress-site/app/scripts/preparation/pipeline.mjs#lock handling`

The output is deterministic for unchanged sources in the current baseline;
incremental-cache portability is not separately guaranteed.

## 14. Output contract

The portable output is staged Markdown plus content-addressed assets. Generated
navigation, component registration, hook registration, styles, and theme files
are adapter-specific. Source: `docs/vitepress-site/app/scripts/preparation/pipeline.mjs#preparation entrypoint`

## 15. Target adapters

An adapter maps the shared model and its own target config to renderer inputs.
The current target is VitePress; its components, hooks, and catalogues are
under `docs/vitepress-site/resources/`. The Feluqa Rust SSG adapter is
**PLANNED**.

## 16. Conformance

Run `npm --prefix docs/vitepress-site run docs:check` to validate
configuration and source frontmatter. Run
`npm --prefix docs/vitepress-site run docs:verify` to compare generated
snapshots using canonical JSON object-key order while preserving array order.
A portable cross-adapter conformance fixture directory is **PLANNED**.
Source: `docs/vitepress-site/app/scripts/dev/docs-check.mjs#validation` and `docs/vitepress-site/app/scripts/dev/verify.mjs#collect`

## 17. Planned features

- **PLANNED**: collection category pages and category route conflict checks.
- **PLANNED**: localized concept files and hover definitions.
- **PLANNED**: footer link groups.
- **PLANNED**: the Feluqa Rust SSG and target-neutral conformance fixtures.

## 18. Naming debt candidates for v0.2

Candidates include `subguides` → `guides`, removing `subguides[].label`,
`sidebarTitle` → a neutral navigation title, `topbar` → `header`, clarifying
`uri.entry`, `documentationNotices` → `notices`, and replacing renderer-shaped
frontmatter flags such as `sidebar: false` and `aside: false` with neutral
layout keys. These are discussion candidates, not current requirements.

## Appendix A — VitePress-specific surface

The following items belong to the current renderer adapter or emitted renderer
contract. They are not promises of the shared SPMPST model:

| Surface | Current location or output | Coupling |
|---|---|---|
| Theme slots | `.site/targets/vitepress.target.config.json` | Renderer slot names and theme component registration |
| Site registry | `docs/vitepress-site/vitepress-site.json` | Lists site declarations; paths are resolved relative to the registry |
| Site resources | `docs/vitepress-site/resources/{components,hooks,diagrams,icons,flags}/` | Site-owned UI and resource catalogues, kept in separate directories |
| Styles and renderer config | Target config and generated theme files | CSS, renderer theme API, Vite config |
| Search and Markdown options | Target config | Renderer local search and Markdown plugin settings |
| Emitted frontmatter | Staged Markdown | `layout`, `sidebar`, `aside`, `search`, `prev`, `next`, `lang` |
| Embedded component tags | Authored Markdown | Vue component syntax such as `<CollectionSpotlightCards />` |
| Generated modules | `docs/vitepress-site/.trash/vitepress-generated/` | Component, hook, style, theme and collection imports |
| CSS classes | Target components and styles | Renderer DOM and theme class names |

This inventory describes current coupling, not a recommendation for other
adapters. Source:
`docs/vitepress-site/app/scripts/preparation/runtime.mjs#toVitepressRuntime`
and `docs/vitepress-site/app/scripts/preparation/content-stage.mjs#prepareContent`.

## Appendix B — Minimal tree and staged result

```text
docs/
├── .site/
│   ├── definitions.site.config.json
│   ├── lang.site.config.json
│   ├── locales/en.locale.json
│   └── locales/fr.locale.json
├── resources/
│   └── icons/lucide/book-open.svg
└── src/
    ├── guides/index.en.md
    ├── guides/index.fr.md
    ├── guides/handbook/guide.config.json
    ├── guides/handbook/index.en.md
    ├── guides/handbook/index.fr.md
    └── collections/articles/
        ├── category.json
        ├── first.en.md
        └── first.fr.md
```

The guide config declares the route base `handbook`; the collection registry
uses `id: "articles"` and its conventional source directory. With English as
the fallback language and default-language prefixing disabled, the source page
`src/guides/handbook/index.en.md` stages at
`docs/vitepress-site/.trash/generated-guides/handbook/index.md`, while its French translation stages at
`docs/vitepress-site/.trash/generated-guides/fr/handbook/index.md`. The collection pages are staged below
their configured collection route. Content files retain their frontmatter and
relative links are rewritten to staged locations. Exact collection pagination
and target-generated modules depend on the renderer configuration.

The example is illustrative; a complete runnable sample requires the
mandatory fields in each concern file and locale bundle schema. Source:
`docs/vitepress-site/app/scripts/spmpst/config/assemble.mjs#assembleConfig` and
`docs/vitepress-site/app/scripts/preparation/source-stage.mjs#stagedPath`.

## Appendix A — VitePress-specific fields and behavior

The target configuration owns theme slots, Vue component and hook locations,
Vite configuration, CSS imports, Markdown options, local search, outline level,
and build output directory. Staged output currently includes renderer-shaped
frontmatter (`layout`, `sidebar`, `aside`, `search`, `lang`, pager fields),
generated Vue component tags, and local-search metadata. These fields are
adapter behavior, not neutral SPMPST guarantees.

## Appendix B — Minimal example

```text
docs/
├── .site/
│   ├── definitions.site.config.json
│   ├── lang.site.config.json
│   ├── locales/en.locale.json
│   └── locales/fr.locale.json
├── src/
│   ├── guides/index.en.md
│   ├── guides/index.fr.md
│   ├── guides/handbook/guide.config.json
│   ├── guides/handbook/index.en.md
│   ├── guides/handbook/index.fr.md
│   └── collections/articles/first.en.md
└── resources/
    └── icons/lucide/book-open.svg
```

With `fallbackLanguage: "en"`, the staged tree contains `index.md`,
`handbook/index.md`, `fr/index.md`, `fr/handbook/index.md`, the collection
article route, and any referenced assets under `__docs-assets/`. Exact route
prefixes depend on the guide URI and language selector configuration.
