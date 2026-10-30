# VitePress adapter application

`app/` contains the renderer application and its command-line tooling. It can
run against any site declaration in the host registry.

```text
.vitepress/   renderer configuration and theme
bin/          small shell entrypoints
config/       Vite and CSS tooling configuration
public/       application-owned static files
scripts/      site selection, preparation, checks, and adapter code
```

The app does not own authored guides or the shared site registry. SPMPST owns
the portable source-tree conventions and logical resource identifiers. This
adapter resolves those identifiers to files from the selected site's
`resources/` directory and emits renderer-ready Markdown and metadata into the
host's `.trash/` directory.

Install the host's dependencies and run site commands from its directory:

```sh
npm install
npm run docs:serve
npm run docs:build
npm run docs:check
```

Set `VITEPRESS_SITE_MANIFEST` to use a registry outside this host. Set
`VITEPRESS_SITE_ID` or pass `--site <id>` for non-interactive site selection.
