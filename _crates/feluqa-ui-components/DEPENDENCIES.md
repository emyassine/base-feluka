# Dependencies

| Package | Purpose | Owner/source | License | MSRV | Selected features and review |
|---|---|---|---|---|---|
| `leptos` 0.8.15 | Component macro, view types and SSR-compatible component API | Leptos project | MIT | 1.88 | Default features disabled. Hydration and Axum SSR integration are not yet connected. Cargo metadata reports Rust 1.88. |
| Rust UI Button source | Button variants, Tailwind class definitions and composition reference | `rust-ui/ui` Leptos submodule commit `9cb8e9f251a254bea19c5d00318e296bb13dca05` (2026-09-22) | MIT | n/a | Button class sets adapted into Feluqa-owned code; preserve the upstream MIT notice in `NOTICE-RUST-UI.md`. |

No target build, audit scan, or browser verification is claimed by this initial
component slice. The local Feluqa runtime is Axum and remains the server
integration target.
