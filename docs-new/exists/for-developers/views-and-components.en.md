# Write views and components

## Use compiled `.view.rs` templates

Feluqa Views are HTML templates containing trusted developer Rust. Production
templates are compiled into the module; they are not PHP/Blade files evaluated
at runtime. The language supports escaped interpolation, `@rs` / `@endrs`,
conditionals, loops, layouts, sections, includes, components and slots.

User views provide page content. Feluqa's panel shell provides the document,
layout and shared panel components. Do not write `<html>`, `<head>` or `<body>`
boilerplate into a panel page. Use escaped output by default; raw HTML must
come from a trusted renderer. Validate URLs with the safe URL type. Do not
interpolate untrusted values into JavaScript or CSS.

## Components and Filament parity

The view compiler and initial SDUI renderer exist. Feluqa also bundles selected
Filament-derived CSS/JS. The complete Filament theme system and component
catalog are **not imported**: forms, input wrappers, sections, tables, actions,
notifications, widgets, modals, theme providers and behaviors remain partial.
Do not assume a CSS class or copied asset supplies the matching component API.

See the [view language reference](../reference/views/view-language.en.md)
and [Filament status](../reference/panels/filament-port-status.en.md).
