# Internalized UI packages and runtime dependencies

| Package or module | Responsibility | Ownership and status |
|---|---|---|
| `feluqa-ui-components` | Components, blocks, charts, hooks and utilities | Feluqa first-party source, adapted from the licensed component source identified in `NOTICE-RUST-UI.md`; compilation and product integration remain in progress. |
| `feluqa::ui::icons` | Icons and animated icons | Feluqa module within the UI package; alternate backend source is excluded. |
| `feluqa-ui-component-macros` | Component construction macros | Feluqa first-party package. |
| `feluqa-ui-classnames` and `feluqa-ui-classnames-macros` | Class composition and typed variants | Feluqa first-party packages, with Feluqa names and namespaces. |
| `feluqa-ui-autoform` | Form derive | Feluqa first-party package. |
| Rendering runtime 0.8.15 | Component runtime and compiler | Still an external implementation dependency. SSR/hydration is not connected; this runtime itself is not yet internalized. |

The rendering runtime source has been copied into first-party `feluqa-ui-*`
workspace packages and renamed to Feluqa package and Rust identifiers. The fork
is not yet compiling: normalized manifests need their complete dependency
contracts restored, then the component crate and panel integration need to pass
the build and browser acceptance gates. The feature requires Rust 1.88, which
is now the workspace baseline.
