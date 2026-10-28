# Feluqa web UI direction: Leptos and Rust UI

## Decision

The web panel UI will move from the Filament-derived theme and component
markup to Feluqa-owned Leptos components. Rust UI is the upstream component
registry and design reference. Feluqa exposes the resulting API through
`feluqa::ui::component`; products use that facade and do not depend directly
on Rust UI implementation crates.

This decision replaces Filament as the target for panel UI work. The existing
panel remains operational during migration. Filament-derived assets, notices,
and code are removed after their routes and behaviors have moved and passed
the acceptance criteria below. Do not implement new panel behavior by
extending Filament-specific APIs or styles.

## Why this is not a drop-in component dependency

Rust UI describes itself as a composable component registry and code
distribution system. Its installation workflow copies component source into a
Leptos application for local customization. Its published `leptos_ui` crate
contains component-building macros, but it is not the complete component
catalogue. Feluqa therefore adopts selected upstream component source and
patterns, records their provenance and MIT notices, then owns and supports the
adapted Feluqa API.

The current Feluqa panel is server-rendered from compiled `.view.rs` templates
and served by Axum. Rust UI components use Leptos 0.8 and Tailwind. Interactive
state such as a responsive, persisted sidebar needs client hydration; markup
alone does not provide Leptos hooks or event behavior. The Leptos SSR model
builds a server target and a WebAssembly hydration target. This changes the
web product build and asset pipeline, while `.view.rs` remains available for
non-panel views and existing application pages.

Leptos 0.8.15 and leptos_axum 0.8.6 declare Rust 1.88 as their minimum. The
workspace currently declares 1.85. Keep the current `no_std` schema and
kernel crates independent of Leptos; the web UI feature and consuming web
product must explicitly require at least Rust 1.88. Do not silently change
the MSRV of other profiles.

## API and dependency boundary

- `feluqa::ui` remains the versioned, `no_std` SDUI schema and safe renderer.
- `feluqa::ui::component` is the web component facade. Its Leptos types and
  implementation are enabled only by the web UI feature.
- The framework owns adapted component source, shared themes, Tailwind
  output, and browser assets. Product templates and apps compose the public
  facade; they do not copy framework component files.
- Components contain presentation and local interaction. Existing routes,
  services, authorization, CSRF and audit handling continue to own server
  behavior. Client visibility never replaces server authorization.
- Prefer standard HTML forms and server handlers where possible. Hydrate
  components whose documented behavior requires client state; avoid adding
  server-function endpoints that duplicate existing APIs.
- Adopt components by an inventoried need. A component counts as available
  only when its Feluqa props, slots, accessibility behavior, theme tokens,
  responsive behavior and product usage are documented and verified.

## Migration order and acceptance

1. Add a Leptos SSR and hydration build spike to the existing Axum web
   product. Confirm compiler requirements, feature split,
   `no_implicit_prelude` compatibility, binary asset delivery and repeatable
   local build before migrating panel pages.
2. Establish Feluqa theme tokens and the `feluqa::ui::component` API with
   Button, Input/Field, Separator, Dropdown, Sheet and responsive Sidenav.
   The reference target includes the Rust UI Sidenav composition: desktop
   navigation, mobile sheet, active route and persisted state.
3. Migrate the Core panel shell and representative Users and Overview pages.
   Keep existing permission checks, form actions, CSRF checks and audit
   behavior in their server-side handlers.
4. Inventory every current panel page and component. Migrate each used
   component and interaction, including forms, tables, notifications,
   dialogs, widgets, theme switching, language selection and sidebar state.
   Record any upstream component that is absent or unsuitable and implement
   only behavior required by existing product screens.
5. Capture and compare the same authenticated routes at desktop and mobile
   widths in light and dark themes. Verify keyboard and screen-reader
   semantics, form submission and server authorization. Update the Filament
   port status as historical evidence and publish a Feluqa component parity
   inventory.
6. Remove Filament-derived CSS/JS, names, notices, and obsolete compatibility
   classes after no runtime route or build target references them. Preserve
   required third-party notices for source still used.

The migration is complete only when all panel routes and interactions in the
inventory use the Feluqa component facade, visual and interaction evidence
passes, old assets are unreferenced and removed, and the supported web build
works from a clean checkout. This is a migration decision, not a claim that
those capabilities are already implemented.

## Primary references

- [Rust UI component catalogue](https://leptos.rust-ui.com/docs/components)
- [Rust UI installation](https://leptos.rust-ui.com/docs/components/installation)
- [Rust UI component model](https://leptos.rust-ui.com/docs/components/introduction)
- [Rust UI source and MIT license](https://github.com/rust-ui/ui)
- [Leptos SSR book](https://book.leptos.dev/ssr/index.html)
- [Leptos page lifecycle and server/browser targets](https://book.leptos.dev/ssr/22_life_cycle.html)
- [Leptos 0.8.15 package metadata](https://docs.rs/crate/leptos/0.8.15)
- [leptos_axum 0.8.6 package metadata](https://docs.rs/crate/leptos_axum/0.8.6)
