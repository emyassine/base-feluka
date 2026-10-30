# VitePress site host

This directory is the site host and registry. It is not the documentation
source tree. Site declarations point to independent SPMPST trees and output
directories.

```text
vitepress-site.json       registry of site declaration files
sites/                    one declaration per site
app/                      renderer, adapters, commands, and package manifest
resources/                resources owned by this VitePress host
.trash/                   generated Markdown, metadata, caches, and scratch data
node_modules/              local dependencies
legal/                    required third-party notices
```

The registry's `sitesPaths` entries are resolved relative to this directory.
Each declaration's `sourcePath`, optional `resourcesPath`, and `outputPath` are
resolved relative to that declaration file. Each site can therefore own its
own components, hooks, diagrams, icon and flag catalogues. The default Feluqa
declaration reads `../docs`, uses this host's `resources/`, and builds to
`../docs-output`, outside the documentation source tree.

```sh
npm install
npm run docs:serve
npm run docs:build
```

When multiple declarations are registered, the interactive command asks which
site to use. Pass `--site <id>` for scripts and automation. To move `app/` to a
different machine or directory, set `VITEPRESS_SITE_MANIFEST` to the registry
path; resource and source roots continue to come from the selected declaration.

`resources/components`, `resources/hooks`, and `resources/diagrams` are separate
site-owned concerns. Icons and flags live in their own catalogues under
`resources/`; they are not mixed into component or hook directories. Required
third-party notices are kept under `legal/`, outside the application code.
