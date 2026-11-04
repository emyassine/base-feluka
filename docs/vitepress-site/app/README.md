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
`SPMPST_SITE_ID` or pass `--site <id>` for non-interactive site selection.

## Progressive Web Apps

Sites can opt into PWA support by mapping `pwa` to `.site/spmpst.pwa.json` in
`spmpst.json` and configuring the nested `pwa` object there. The adapter emits
the web app manifest, an offline page and a scoped service worker into the
generated public directory. The service worker is registered only after a
visitor allows offline storage in the site's storage manager. It then caches
visited public pages and static assets, and skips configured paths such as
account and API routes. Revoking that choice unregisters the worker and clears
its cache.
PWA installation requires a secure origin (HTTPS, or localhost during
development) and valid local icon files listed in the configuration.
