# Shared web themes and components

`themes/components/` contains reusable Vue components, their implementation helpers, and component-owned CSS. `themes/vitepress/` contains generic VitePress adapter styles and scripts. Site-specific page content stays with its site; each site can contribute local components through its own `paths.components` root.

The VitePress host discovers shared roots and assets from `docs/vitepress-site/spmpst.workspace.json`. Keep paths, stylesheet files, script entrypoints, and service aliases declared there so another host can provide its own implementations without importing repository locations directly.
