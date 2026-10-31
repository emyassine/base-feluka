# VitePress site host

This directory contains the shared VitePress host and site registry. The
actual site sources live in sibling site directories such as `../site-1/`.

```text
spmpst.workspace.json     registry of site declaration files
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

`serve.sh` can run selected sites on separate available ports or build them:

```sh
./serve.sh --list
./serve.sh --sites=site-1,site-2
./serve.sh --sites=site-1
./serve.sh --sites=site-1 --build
./serve.sh --sites=site-1 --preview
```

`--build` compiles the selected sites and exits. `--preview` compiles them,
serves the static output, and then watches the sources of each selected site:
the first build runs before serving, later edits rebuild only the site whose
sources changed and keep the running static server pointed at the new output.

It prints each running site's URL and id. Without `--sites`, it asks which
registered sites to use in a terminal and selects all sites in non-interactive
mode. The npm commands accept `--site <id>` for one site. To move `app/` to a
different machine or directory, set `VITEPRESS_SITE_MANIFEST` to the registry
path.

Site declarations live with their owning sites. The host registry only lists
those declarations; it does not duplicate site content. Required third-party
notices are kept under `legal/`, outside the application code.
