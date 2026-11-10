# CMS Query (SQL-like)

This folder contains the runtime CMS API and query builder.

## Usage (no import)

Global function available in templates and `<script setup>`:

```vue
<!-- Returns a query builder scoped to locale -->
:items="useCms('en')
  .inPath('guides/02-build')
  .noIndex()
  .depth('*')
  .sortByOrder()
  .transform(row => ({
    id: row.id,
    title: row.i18n.title,
    excerpt: row.i18n.description ?? '',
    href: row.i18n.href || row.i18n.url,
    thumbnail: row.assets?.thumbnailByLocale?.[row._locale] ?? null,
    tags: row.taxonomy?.tags,
    type: row.taxonomy?.type
  }))
  .get()"
```

You can also use the default locale:

```vue
:items="useCms()
  .inCollection('guides')
  .type('case-study')
  .sortByOrder()
  .transform(row => ({
    id: row.id,
    title: row.i18n.title,
    excerpt: row.i18n.description ?? '',
    href: row.i18n.href || row.i18n.url
  }))
  .get()"
```

## Query builder

### Scope

- `inCollection(key)`
- `inGroup(key)`
- `inPath(dir)`

`inPath()` matches if:
- `source.dir === dir`
- or `source.dir` starts with `dir/`
- or `source.pathDir === dir`
- or `source.pathDir` starts with `dir/`
- or `sourcePathByLocale === dir`
- or `sourcePathByLocale` starts with `dir/`

Definitions:
- `source.dir` = section root (e.g. `guides/02-build`)
- `source.pathDir` = real directory of the file (e.g. `guides/02-build/capabilities`)
- `depth` is computed from `source.pathDir` relative to `source.dir`

### Index filters

- `onlyIndex()`
- `noIndex()`

### Depth

- `depth(0)` files directly in `source.dir`
- `depth(1)` one subdirectory under `source.dir`
- `depth('*')` recursive

### Directory filters

- `ifDirectoryContains(seg)`
- `ifPathIncludes(str)`
- `ifSlugStartsWith(prefix)`

### Taxonomy

- `type(value)`
- `tag(value)`
- `tagsAny(values)`
- `tagsAll(values)`

### I18n

- `hasLocale(locale)`
- `fallbackLocale()`

`hasLocale()` filters availability only. It does not change output locale (use `useCms('en')` to select output locale).

### Sorting

- `sortByOrder()`
- `sortByTitle()`
- `sort(keyOrFn, dir)`

### Projection

- `transform(mappingOrFn)`
- `select(fields | projector)`

### Output

- `get()`
- `first()`
- `count()` (after filters + sort + offset/limit, before projection)
- `pluck(field)` (before projection)

## Insight items mapping

If you need a UI-friendly shape, use `transform` to map CMS rows to your component props (example above).

## Examples

### All solutions (recursive)

```vue
:items="useCms('en')
  .inPath('guides/02-build')
  .noIndex()
  .depth('*')
  .sortByOrder()
  .toInsightItems()
  .get()"
```

### Case studies by taxonomy

```vue
:items="useCms('en')
  .inCollection('guides')
  .type('case-study')
  .sortByOrder()
  .toInsightItems()
  .get()"
```

### Case studies by directory

```vue
:items="useCms('en')
  .inPath('guides/03-industries')
  .ifDirectoryContains('case-studies')
  .noIndex()
  .depth('*')
  .sortByOrder()
  .toInsightItems()
  .get()"
```

## Frontmatter (normalized, no loss)

Recognized keys are normalized into the cache. Authors are not required to provide them; defaults are applied.
The full original frontmatter is preserved under `frontmatter.byLocale[locale]._raw`.

Recognized keys (normalized):
- `title`, `description`, `sidebarTitle`, `head`
- `order`, `orderGroup`, `draft`, `layout`
- `type`, `tags`, `audience`
- `thumbnail`, `image`, `icon`

Defaults in cache:
- `title` (from frontmatter title → H1 → filename)
- `description` = `null`
- `sidebarTitle` = `null`
- `draft` = `false`
- `order` (frontmatter → filename prefix → `9999`)
- `orderGroup` (frontmatter → group order)
- `type` = `undefined`
- `tags` = `[]`
- `audience` = `[]`
- `thumbnail` = `null`
- `icon` = `null`
- `layout` = `undefined`
- `head` = `{}`

## Cache file

Generated file:

```
.vitepress/cache/gen/cms-cache.json
```

It contains:
- `collections`, `groups`, `pages`
- `navigation`
- `rewrites`
- `indexes`

This file is the single source of truth.
### Transform

Map fields to a new shape:

```vue
:items="useCms('en')
  .inCollection('guides')
  .type('case-study')
  .sortByOrder()
  .transform({ 'i18n.title': 'title', 'i18n.url': 'href' })
  .get()"
```

Or a custom mapper:

```vue
:items="useCms('en')
  .inCollection('guides')
  .transform(row => ({ title: row.i18n.title, href: row.i18n.url }))
  .get()"
```
