# SPMPST specification package

This directory is the canonical source for the SPMPST tree and conforming-tool
specification. `SSG.md` defines normative behavior. `spmpst.schema.json` defines
the site-root manifest, its complete `SpmpstPaths` registry, and the declarative
new-site scaffold. `schemas/<concern>.schema.json` defines each concern and its
scaffold defaults.

## Defaults and scaffold placeholders

A JSON Schema `default` is ordinarily an annotation. SPMPST gives it an
additional, explicit meaning during site generation: a conforming tool MUST
use the schema's `default` value as the initial JSON value, deep-clone it, and
substitute only the scaffold placeholders declared by
`spmpst.schema.json#/x-spmpst-scaffold/placeholders`. Unknown `{...}` tokens are
preserved so runtime templates such as `{requested}` remain intact.

The manifest's `x-spmpst-scaffold` object declares concern-schema filename
mapping, directories, files, and schema files to copy into a new site's
`paths.schemas` directory. A conforming tool MUST consume those declarations;
it MUST NOT hard-code site paths or starter config values in its CLI.

Concern schema files are also copied into each site's configured `paths.schemas`
directory when scaffolded. That path defaults to `public/api/schemas/`; the
schemas are delivered as ordinary static JSON files, while canonical schemas
and generation defaults remain owned by this specification package.

The current Node/VitePress conforming-tool entry point is:

```sh
./docs/vitepress-site/serve.sh new <sitename>
```
