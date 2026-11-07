# Documentation component refactor checklist

## Completed in this change

- [x] Extend `docs/vitepress-site/spmpst.workspace.json` with `componentsPaths`, `StylesPaths`, and `jsPaths` registries.
- [x] Resolve and validate workspace paths relative to the workspace declaration; pass them to VitePress preparation.
- [x] Move reusable VitePress host and site components into the shared top-level `components/` tree, grouped by domain and responsibility rather than site; keep `StudentOrientationGuide` local to site-2.
- [x] Keep site-local component roots alongside shared workspace roots, and place the reusable `CurrencySelector.vue` directly at `components/CurrencySelector.vue`.
- [x] Make workspace `componentsPaths`, `StylesPaths`, and `jsPaths` feed discovery, style inclusion, and script imports.
- [x] Remove `Nm`, `Feluqa`, and `Mainline` prefixes; replace temporary or vague component names with role-based public identifiers and update Vue, Markdown, and host references.
- [x] Keep numbered `HeroOne` through `HeroNine` names and place Hero Five effect implementations under `HeroFiveInclude/`.
- [x] Replace repository-relative theme component imports with the generated component registry, so workspace roots provide the implementations.
- [x] Document the current Vue-only state and the semantic UI contract for future target renderers in `components/README.md`.
- [x] Remove the redundant brand registrar that double-registered components already included by workspace discovery.
- [x] Move the service marketplace's partner directory section into the standalone `partners-guide` guide and add a link from the marketplace.

## Verification

- [x] Run documentation configuration checks for both registered sites.
- [ ] Build both documentation sites and resolve any broken imports, component registrations, or routes. Site-2 client and SSR builds still hit a `RangeError: Maximum call stack size exceeded` while rendering; investigate before closing this refactor.
- [ ] Review the final diff for stale component paths, old names, and missing workspace injection.
