# Documentation component refactor checklist

## Completed in this change

- [x] Extend `docs/vitepress-site/spmpst.workspace.json` with `componentsPaths`, `StylesPaths`, and `jsPaths` registries.
- [x] Resolve and validate workspace paths relative to the workspace declaration; pass them to VitePress preparation.
- [x] Move reusable VitePress host and site components into `themes/components/`, grouped by domain and responsibility rather than site; keep `StudentOrientationGuide` local to site-2.
- [x] Keep site-local component roots alongside shared workspace roots, and place the reusable `CurrencySelector.vue` directly at `themes/components/CurrencySelector.vue`.
- [x] Move VitePress theme CSS and tooltip script into `themes/vitepress/styles/` and `themes/vitepress/scripts/`; keep `.vitepress/theme/` as the host adapter entrypoint.
- [x] Make workspace `componentsPaths`, `StylesPaths`, and `jsPaths` feed discovery, style inclusion, and script imports.
- [x] Remove `Nm`, `Feluqa`, and `Mainline` prefixes; replace temporary or vague component names with role-based public identifiers and update Vue, Markdown, and host references.
- [x] Keep numbered `HeroOne` through `HeroNine` names and place Hero Five effect implementations under `HeroFiveInclude/`.
- [x] Replace repository-relative theme component imports with the generated component registry, so workspace roots provide the implementations.
- [x] Document the current Vue-only state and the semantic UI contract for future target renderers in `themes/components/README.md`.
- [x] Remove the redundant brand registrar that double-registered components already included by workspace discovery.
- [x] Move the service marketplace's partner directory section into the standalone `partners-guide` guide and add a link from the marketplace.

## Verification

- [x] Run documentation configuration checks for both registered sites.
- [x] Confirm VitePress client and SSR rendering succeeds and the running site reports no Vue warnings or page errors. Fix native button resolution in `Button.vue` so global component registration cannot recursively resolve the native `<button>` tag.
- [x] Confirm `.vitepress/theme/` contains only its adapter `index.ts`; CSS and tooltip script are loaded from the workspace-configured `themes/vitepress/` paths.
- [x] Review generated imports after the component move and remove the site-1 cross-site link that VitePress could not resolve.
- [ ] Resolve the remaining site-2 content-link audit failures (the build renders pages, then reports 142 unresolved local links, mostly brand-kit routes and images).
- [x] Review the final diff for stale component paths, old names, and missing workspace injection.
