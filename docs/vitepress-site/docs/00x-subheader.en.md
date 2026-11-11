# Floating subheader

This document is the working reference for the floating subheader in the shared VitePress host. Read it before changing its configuration, generated data, Vue component, or scroll behavior. The renderer is shared by the sites; the site source and its `.site/` configuration determine which pages receive a bar and what it contains.

## Where the pieces live

| Responsibility | Location |
|---|---|
| Site-wide and per-guide enablement | `.site/spmpst.definitions.json` (`site.floatingSubnav`, `subguides[].floatingSubnav`) |
| Optional per-context link additions/exclusions | `src/<guide>/spmpst.subheader.json` |
| Collection link additions/exclusions | `src/collections/<collection>/spmpst.subheader.json` |
| Global and guide logo assets | `.site/spmpst.appearance.json` and `src/<guide>/spmpst.guide.json` |
| Matching pages, building links, resolving/copying logo assets | `docs/vitepress-site/app/scripts/preparation/content-stage.mjs` |
| Generated route-to-props map | `vitepress-generated/floating-subnav.json` in the site's scratch/generated directory |
| Route lookup and placement in VitePress layout slots | `docs/vitepress-site/app/.vitepress/theme/index.ts` |
| Shared Vue behavior and styles | `themes/shared/vitepress/FloatingSubnavigation.vue` |
| Shared component export/registration | `themes/shared/vitepress/components/index.ts` and the generated component registry |

Do not diagnose this feature by looking only at the Vue component. First inspect the actual route entry in generated `floating-subnav.json`: it is the data passed as props to the component. A missing logo or an empty link list may already be present there before Vue renders anything.

## Enablement and route data

`site.floatingSubnav` and a guide's `floatingSubnav` rules contain `layouts`, `include`, and `exclude` arrays. Matching layouts and exact included public paths enable the bar; exclusions win. Site and guide rules are merged during content preparation. Guide navigation is built from localized page titles in source navigation order. The guide entry page is represented by the identity link and should not also appear in the links list.

An optional `spmpst.subheader.json` can add or exclude entries for a guide context or collection. Its generated links support separators and explicit custom links. A collection file enables its subheader on the collection index and its article pages. Keep link filtering locale-aware and check both default and translated routes when changing matching logic.

The component is rendered for a route when the normalized `route.path` matches a key in the generated map. `theme/index.ts` places it in the document area for ordinary pages. For article and home-subheader layouts, it suppresses the competing navigation in the top bar. Home layouts place their floating bar before the hero. When no generated route key exists, the floating subheader is absent and the normal configured subnav remains in effect.

## Logo behavior and root pages

The appearance configuration supports `light`, `dark`, `mini-light`, and `mini-dark` logo paths. Guide logo configuration can override the site's logo. Preparation resolves local paths relative to the owning configuration, copies assets into the generated public asset area, and records public URLs in the generated route props.

The bar should use the mini light/dark logo in both expanded and compact states. If a mini variant is absent, it should fall back to the matching full variant. Do not assume the component can recover an asset that preparation omitted.

Root-level pages such as `/projects/` have no guide logo context. Their generated props must therefore inherit the resolved site logo explicitly; reading only `generatedGuideColors.root` is insufficient when there is no root guide. Check the `/projects` object in generated JSON and confirm that all four logo fields are present before investigating CSS. In the Numerimondes configuration the mini assets are `logo-mini-light-mode.png` and `logo-mini-dark-mode.png`; the global logo definitions are in `docs/site-2/.site/spmpst.appearance.json`.

Resolved on 2026-11-11: the generated `/projects` entry had `links: []` and omitted all logo fields, even though the site appearance config defined full and mini logos. Root-page generation now inherits the resolved site logo, and compact mode is disabled when there are no usable links. Collection subheaders now read configuration from the collection source directory; Numerimondes' project navigation is configured in `docs/site-2/src/collections/005-projects/spmpst.subheader.json`. This was a preparation/root-context data bug combined with an empty-navigation scroll-state bug; CSS tweaks alone could not fix either cause.

## Compact mode

`FloatingSubnavigation.vue` owns compact mode. It listens to window scroll and toggles the `is-compact` class; CSS then contracts the identity title and inline links, leaving the identity/logo and any available menu control. The component also measures available width and moves overflowing links into its “more” menu. On narrow screens, the separate mobile dropdown is used and the desktop links, overflow control, and measuring layer are hidden.

Compact mode should only activate when there is useful subnavigation content to collapse. An empty link list must not cause an otherwise empty identity bar to shrink to a logo-only pill. Scroll transitions should be stable: small scroll reversals and page settling must not make the bar flicker between states. Preserve the mini logo in both states and keep its light/dark variant correct.

When a bar looks wrong, inspect in this order:

1. The generated props for the exact route: title, links, logo URLs, logo dimensions, and labels.
2. Whether the page receives the intended guide/root context and route key.
3. The rendered component state (`is-compact`) before tuning CSS.
4. The actual image response and dimensions for the logo URL.
5. Desktop and mobile layout separately; the mobile dropdown is a different control path.

## Change and verification checklist

- Update this reference when route matching, generated props, logo fallback, placement, or compact-mode behavior changes.
- Check the requested page's generated `floating-subnav.json` entry, not just another guide's entry.
- Run preparation/build for the affected site and check that root pages inherit the site logo and guide pages inherit the proper guide override.
- Verify an expanded state, a compact state after scrolling, no compact state for an empty link list, both color schemes, and the mobile layout in a browser.
- Keep observed behavior and implementation status accurate; do not claim visual verification unless it was performed.

The generic mechanism is also summarized in [`../MECHANISM.en.md`](../MECHANISM.en.md#11-route-and-language-mechanics). That overview does not replace this feature-specific implementation reference.
