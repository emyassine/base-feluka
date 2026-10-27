# Feluqa Imagery

Rust access helpers and SVG files imported from Webkernel's imagery package. The bundled sets are Lucide, Simple Icons, and Heroicons. The package code is part of the proprietary Feluqa repository; the SVGs retain their upstream notices and license boundaries.

- Lucide: ISC, with the upstream license and Feather-derived icon exception in `LICENSE-LUCIDE.md`.
- Heroicons: MIT, in `LICENSE-HEROICONS.md`.
- Simple Icons: the project uses CC0 for its own work, but individual brand marks may have separate license, trademark, and usage terms. Verify the icon's metadata and brand rules before using it commercially; see `DISCLAIMER-SIMPLE-ICONS.md`.
- Webkernel imagery package notice: `NOTICE-WEBKERNEL-IMAGERY-MIT.md`. Its package manifest declares EPL-2.0 while its `LICENSE.md` says MIT; this crate imports only the SVG collections above and preserves the notice for attribution. Custom Webkernel icons are excluded until that discrepancy is resolved.

Use `feluqa::imagery::icon_svg(IconSet::Lucide, "house")` to load a bundled SVG, or `IconCatalog::install` to copy a selected icon into an application's public asset tree. Do not treat third-party brand SVGs as cleared trademarks.
