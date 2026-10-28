# Internalized UI packages and runtime dependencies

| Package or module | Responsibility | Ownership and status |
|---|---|---|
| `feluqa-ui-components` | Components, blocks, charts, hooks and utilities | Feluqa first-party source, adapted from the licensed component source identified in `NOTICE-RUST-UI.md`; compilation and product integration remain in progress. |
| `feluqa::ui::icons` | Icons and animated icons | Feluqa module within the UI package; alternate backend source is excluded. |
| `feluqa-ui-component-macros` | Component construction macros | Feluqa first-party package. |
| `feluqa-ui-classnames` and `feluqa-ui-classnames-macros` | Class composition and typed variants | Feluqa first-party packages, with Feluqa names and namespaces. |
| `feluqa-ui-autoform` | Form derive | Feluqa first-party package. |
| Rendering runtime 0.8.15 | Component runtime and compiler | Still an external implementation dependency. SSR/hydration is not connected; this runtime itself is not yet internalized. |

The adapted source retains its required MIT notice in `NOTICE-RUST-UI.md` and
the source-level license files. This source move is not a successful build,
browser verification, or completed panel migration. The rendering runtime's
minimum supported Rust version is 1.88; the UI product's MSRV must be
reconciled before enabling this feature in consumers.
