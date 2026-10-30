# VitePress site host

This directory contains the shared VitePress host and site registry. The
actual site sources live in sibling site directories such as `../site-1/`.

```text
vitepress-site.json       registry of site declaration files
app/                      renderer, adapters, commands, and package manifest
resources/                shared icon and flag catalogues
.trash/                   generated Markdown, metadata, caches, and scratch data
node_modules/              local dependencies
legal/                    required third-party notices
```

The registry's `sitesPaths` entries are resolved relative to this directory.
Each declaration's `sourcePath`, optional `resourcesPath`, optional
`siteResourcesPath`, and `outputPath` are resolved relative to that declaration
file. `../site-1/` contains Feluqa's `.site/`, `src/`, and `resources/`.
Its components, hooks, and diagrams stay with that site; shared icons and flags
stay in this host's `resources/`. `../site-2/` contains the Numerimondes
English/French starter site. Each build writes outside its site tree under
`docs-output/<site-id>/`.

```sh
npm install
npm run docs:serve
npm run docs:build
```

Run `./serve.sh` to start every registered site at once. It assigns distinct
available ports beginning at 4173 and prints each site's URL and id. Add a
site declaration to `vitepress-site.json` when that site's tree is ready; the
interactive npm command asks which site to use when several are registered.
Pass `--site <id>` for scripts and automation. To move `app/` to a different
machine or directory, set `VITEPRESS_SITE_MANIFEST` to the registry path.

Site declarations live with their owning sites. The host registry only lists
those declarations; it does not duplicate site content. Required third-party
notices are kept under `legal/`, outside the application code.
