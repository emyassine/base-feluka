# Dead Links Toolkit

This toolkit scans generated VitePress content for dead internal links and lets you fix them in bulk.

## Commands

Scan and create a report (saved to `.vitepress/cache/gen/dead-links-report.json`):

```bash
node scripts/dead-links/cli.mjs scan
```

Interactive fix (uses the report or creates one):

```bash
node scripts/dead-links/cli.mjs fix
```

## What it does

- Reads valid URLs from `.vitepress/cache/gen/cms-cache.json`
- Scans `docs/**/*.md`
- Finds internal links that do not exist
- Offers interactive actions per link

## Actions

- `skip` leaves the link unchanged
- `remove` deletes the link markup and keeps plain text
- `rewrite` replaces the URL with a valid one (suggestions by slug)
- `stub` creates missing pages in `docs/` so the link becomes valid

## Notes

- For `stub`, if the link has no locale prefix, it creates both `-en.md` and `-fr.md` (based on cache locales).
- For `rewrite`, suggestions are derived from existing slugs in the CMS cache.
- All edits are applied to `docs/`, not to the generated cache.
