# Dependency Inventory and Review

This file lists the locked dependency set for the root Cargo workspace and reviews the build impact. It is generated from the current `Cargo.toml` files, Cargo metadata and `Cargo.lock`; it is an inventory, not an approval of every dependency.

## Findings

| Count | What it measures |
|---:|---|
| 607 | Package/version records in `Cargo.lock`, including optional integrations and packages for other targets. |
| 41 | First-party workspace packages locked by path. |
| 566 | Registry packages in the lockfile. |
| 462 | Packages in the currently resolved workspace graph reported by `cargo metadata --locked --offline`. |
| 343 | Distinct package name/version pairs reachable from Numerimondes normal and build dependencies for `x86_64-unknown-linux-gnu`. |
| 38 | First-party workspace packages in that Numerimondes graph. |
| 305 | Third-party packages in that Numerimondes graph. |
| 14 | Package names with multiple active versions in that graph (14 additional versions). |

These counts answer different questions. The 607 lockfile records are not 607 crates compiled by every application. The lockfile retains optional integrations such as Actix and dependencies for feature/target combinations that are not active in one build. Cargo metadata currently resolves 462 packages for the workspace’s selected features, leaving 145 lockfile records outside that resolved set. The app-specific dependency tree is narrower still.

## Axum and Actix

Numerimondes uses Axum directly, and `feluqa` also makes Axum available through its `web` feature. Cargo resolves one Axum 0.8 version for this build. Keeping a direct Axum dependency is correct when application code imports Axum types; relying on a transitive facade dependency would make the app manifest less honest.

Actix is an optional backend in `feluqa-ui-server-functions`. The `actix` feature is not enabled by Numerimondes, and `cargo tree -p numerimondes --target x86_64-unknown-linux-gnu -e normal,build -i actix-web` reports that `actix-web` is not in this build graph. Its packages appear in `Cargo.lock` because the optional integration is declared. This does not mean the current app requires both web frameworks.

## Main build-time concern

The `feluqa` facade declares `default = ["web"]`. That `web` feature enables Console, view, auth, UI, panel, notifications, Live, module, database and Core along with Axum/Tokio. Numerimondes depends on `feluqa` with default features enabled for both its runtime and build dependency. As a result, the app pulls UI runtime/components and browser-related crates into its server build. The supplied build log confirms that: it compiles UI runtime, DOM renderer, WASM bindings, `web-sys`, UI navigation and component macros alongside Axum, Tokio and SQLx.

The fastest likely improvement is to make the facade default lightweight and require products to opt into the features they use. For Numerimondes, define an explicit product feature set; for its build dependency, request only the APIs needed by `build.rs` (view compilation, panel view-root access and migration registry generation). The build script currently reaches `feluqa::panel` and `feluqa::database`; inspect and split those build-support APIs if they force UI/runtime dependencies. Preserve product behavior and confirm feature selection with `cargo tree -e features` before changing it.

Other candidates to measure are SQLite versus PostgreSQL feature selection in SeaORM, server-only versus browser/hydration UI dependencies, and whether every product needs the full default component catalogue. These should be separate features or target-specific dependencies where the APIs permit. Do not remove dependencies solely to lower the count.

## Duplicate versions

These different versions are simultaneously reachable in the Numerimondes Linux normal/build graph:

| Package | Active versions |
|---|---|
| `convert_case` | `0.11.0`, `0.6.0` |
| `getrandom` | `0.2.17`, `0.4.3` |
| `hashbrown` | `0.15.5`, `0.17.1` |
| `heck` | `0.4.1`, `0.5.0` |
| `proc-macro2-diagnostics` | `0.10.1`, `0.11.0` |
| `serde_spanned` | `0.6.9`, `1.1.2` |
| `strum` | `0.26.3`, `0.28.0` |
| `syn` | `2.0.119`, `3.0.9` |
| `thiserror` | `1.0.69`, `2.0.21` |
| `thiserror-impl` | `1.0.69`, `2.0.21` |
| `toml` | `0.8.23`, `1.1.8+spec-1.1.0` |
| `toml_datetime` | `0.6.11`, `1.1.2+spec-1.1.0` |
| `webpki-roots` | `0.26.11`, `1.0.11` |
| `winnow` | `0.7.15`, `1.0.4` |

Some duplicates are expected. `syn` 2 and 3, `toml` 0.8 and 1.1, `thiserror` 1 and 2, and `strum` 0.26 and 0.28 are separate compatible API lines pulled by different crates. Do not force them together unless upstream constraints allow it and the change passes the affected build and behavior checks. The smaller repeated versions worth reviewing are `convert_case`, `heck`, `winnow`, `hashbrown`, `getrandom`, and `webpki-roots`; they may still be required by incompatible upstream ranges or different target paths.

## Build output and current blocker

The supplied `feluqa dev numerimondes` output shows a cold or invalidated dependency build: many third-party and UI packages compile before the application build script fails. It does not include a successful end-to-end duration, so it cannot establish the steady-state or warm-build cost. Cargo reuses unchanged artifacts after a successful build when the compiler, features, profile, target and inputs remain the same.

The observed failure is separate from dependency count: `products/numerimondes/build.rs` reaches `generated.write_to(...)`, but `generated` is not defined in the shown function. The view loop is empty. This prevents the build from completing and makes build-time comparisons unreliable until the build script is repaired.

The number of package boundaries is not itself the main build-time measure. Count the packages activated for the product, proc-macro/build-script work, feature unification, target/profile changes, and which source edits invalidate which packages. A large transitive graph can still have good warm builds; a broad default feature set makes cold builds and unrelated rebuilds more expensive.

## Recommended order

1. Fix the current Numerimondes build-script error, then record cold build, warm no-op build and one application-source edit with the same toolchain and target.

2. Review the `feluqa` facade default. Prefer no broad default feature set; have each product opt into the server, UI, panel, database and other capabilities it uses. Update templates and guides with the feature contract.

3. Separate build-time facade needs from runtime needs. Keep macros/build helpers small and avoid compiling the complete UI runtime just to generate views or migrations.

4. Split server UI from browser/hydration dependencies where the current API allows it. Keep the browser renderer and WASM bindings out of server-only builds unless the server feature genuinely needs them.

5. Review database backend features and duplicate versions by tracing each to its parent. Preserve both database backends if both are supported requirements; do not trade away supported behavior for a smaller lockfile.

6. Re-run the same timings after each change. Keep a change only when it reduces relevant build work without breaking the product API or target support.

## Inventory method

Snapshot reviewed on 2026-10-28. Commands used: `cargo metadata --locked --offline --format-version 1`, `cargo tree -p numerimondes --target x86_64-unknown-linux-gnu --edges normal,build --prefix none --format '{p}'`, `cargo tree -p numerimondes --duplicates`, and manifest/lockfile inspection. This is dependency-graph analysis; no tests or benchmarks were run.

The following direct dependency table covers every dependency declaration of the 41 workspace packages, including optional, build, dev and target-specific declarations. “Default off” means the manifest disables that dependency’s default features. The lockfile inventory below lists every exact package/version record.

## Root dependency catalog and patches

The virtual workspace root has no compiled library of its own. Its `[workspace.dependencies]` table centralizes versions and feature choices for members; a catalog entry alone does not cause Cargo to compile a package. `[patch.crates-io]` redirects matching requested packages to these local paths; it also does not activate an otherwise unused dependency.

| Workspace alias | Package / version / source | Default features and selected features |
|---|---|---|
| `argon2` | `argon2 =0.5.3` | Cargo defaults |
| `axum` | `axum 0.8` | Cargo defaults |
| `crossterm` | `crossterm 0.29` | default off; `events`, `windows` |
| `feluqa_ui_autoform` | `feluqa-ui-autoform 0.1.1`; path: `crates/ui/feluqa-ui-autoform` | Cargo defaults |
| `feluqa_ui_classnames` | `feluqa-ui-classnames 0.1.21`; path: `crates/ui/feluqa-ui-classnames` | `variant` |
| `feluqa_ui_classnames_macros` | `feluqa-ui-classnames-macros 0.1.9`; path: `crates/macros/feluqa-ui-classnames-macros` | Cargo defaults |
| `feluqa_ui_component_macros` | `feluqa-ui-component-macros 0.3.22`; path: `crates/macros/feluqa-ui-component-macros` | Cargo defaults |
| `feluqa_ui_navigation` | `feluqa-ui-navigation 0.8.3`; path: `crates/ui/feluqa-ui-navigation` | `nightly`, `ssr` |
| `feluqa_ui_runtime` | `feluqa-ui-runtime 0.8.15`; path: `crates/ui/feluqa-ui-runtime` | `nightly`, `ssr` |
| `heck` | `heck 0.5` | Cargo defaults |
| `hmac` | `hmac 0.12` | Cargo defaults |
| `inventory` | `inventory 0.3` | Cargo defaults |
| `js-sys` | `js-sys 0.3` | Cargo defaults |
| `proc-macro2` | `proc-macro2 1` | Cargo defaults |
| `quote` | `quote 1` | Cargo defaults |
| `rand_core` | `rand_core 0.6` | Cargo defaults |
| `sea-orm` | `sea-orm =1.1.20` | default off; `macros`, `runtime-tokio-rustls`, `sqlx-sqlite`, `sqlx-postgres`, `with-json` |
| `serde` | `serde 1` | default off; `derive`, `alloc` |
| `serde_json` | `serde_json 1` | default off; `alloc` |
| `sha2` | `sha2 0.10` | Cargo defaults |
| `signal-hook` | `signal-hook 0.3` | Cargo defaults |
| `strum` | `strum 0.28` | `derive` |
| `subtle` | `subtle 2` | Cargo defaults |
| `syn` | `syn 2` | `full` |
| `thiserror` | `thiserror 2` | Cargo defaults |
| `time` | `time 0.3` | `serde`, `wasm-bindgen` |
| `tokio` | `tokio 1` | `macros`, `rt-multi-thread`, `net`, `signal` |
| `toml` | `toml 0.8` | Cargo defaults |
| `tower-http` | `tower-http 0.6` | `fs` |
| `validator` | `validator 0.20` | `derive` |
| `wasm-bindgen` | `wasm-bindgen 0.2` | Cargo defaults |
| `wasm-bindgen-futures` | `wasm-bindgen-futures 0.4` | Cargo defaults |
| `web-sys` | `web-sys 0.3` | default off; `Clipboard`, `console`, `CssStyleDeclaration`, `Document`, `DomRect`, `DomTokenList`, `DragEvent`, `Element`, `Event`, `EventTarget`, `Headers`, `HtmlElement`, `HtmlInputElement`, `InputEvent`, `KeyboardEvent`, `Location`, `MediaQueryList`, `MouseEvent`, `MutationObserver`, `MutationObserverInit`, `MutationRecord`, `Navigator`, `Node`, `NodeList`, `Request`, `RequestInit`, `RequestMode`, `Response`, `Storage`, `Window` |
| `zeroize` | `zeroize 1` | Cargo defaults |

### Local patches

| Package | Path override |
|---|---|
| `feluqa-ui-dom-renderer` | `crates/ui/feluqa-ui-dom-renderer` |
| `feluqa-ui-errors` | `crates/ui/feluqa-ui-errors` |
| `feluqa-ui-markup-parser` | `crates/ui/feluqa-ui-markup-parser` |
| `feluqa-ui-navigation` | `crates/ui/feluqa-ui-navigation` |
| `feluqa-ui-navigation-macros` | `crates/macros/feluqa-ui-navigation-macros` |
| `feluqa-ui-reactivity` | `crates/ui/feluqa-ui-reactivity` |
| `feluqa-ui-runtime` | `crates/ui/feluqa-ui-runtime` |
| `feluqa-ui-runtime-config` | `crates/ui/feluqa-ui-runtime-config` |
| `feluqa-ui-runtime-dom` | `crates/ui/feluqa-ui-runtime-dom` |
| `feluqa-ui-runtime-hot-reload` | `crates/ui/feluqa-ui-runtime-hot-reload` |
| `feluqa-ui-runtime-macros` | `crates/macros/feluqa-ui-runtime-macros` |
| `feluqa-ui-runtime-server` | `crates/ui/feluqa-ui-runtime-server` |
| `feluqa-ui-server-functions` | `crates/ui/feluqa-ui-server-functions` |
| `feluqa-ui-server-functions-macros` | `crates/macros/feluqa-ui-server-functions-macros` |
| `feluqa-ui-server-functions-macros-default` | `crates/macros/feluqa-ui-server-functions-macros-default` |
| `feluqa-ui-task-runtime` | `crates/ui/feluqa-ui-task-runtime` |

## Direct dependencies by workspace package

| Workspace package | Direct dependency declarations |
|---|---|
| [`feluqa`](crates/platform/feluqa/Cargo.toml) | `tokio ^1` (dev; features: macros, rt-multi-thread, net, signal), `tower ^0.5` (dev; features: util), `axum ^0.8` (optional), `feluqa-auth ^0.1.0` (optional), `feluqa-console ^0.1.1` (optional), `feluqa-console-macros ^0.1.0` (optional), `feluqa-core ^0.1.0` (optional), `feluqa-database ^0.1.0` (optional), `feluqa-definitions ^0.1.0` (optional), `feluqa-imagery ^0.1.0` (optional), `feluqa-live ^0.1.0` (optional), `feluqa-module ^0.1.0` (optional), `feluqa-notifications ^0.1.0` (optional), `feluqa-panel ^0.1.0` (optional), `feluqa-ui ^0.1.0` (optional), `feluqa-view ^0.2.0` (optional), `serde ^1` (optional; default off; features: derive, alloc), `subtle ^2`, `tokio ^1` (optional; features: macros, rt-multi-thread, net, signal), `toml ^0.8` (optional), `tower-http ^0.6` (optional; features: fs) |
| [`feluqa-auth`](crates/services/feluqa-auth/Cargo.toml) | — |
| [`feluqa-build`](tools/feluqa-build/Cargo.toml) | `syn ^2` (features: full) |
| [`feluqa-cli`](products/feluqa-cli/Cargo.toml) | `feluqa ^0.2.0` (build; default off; features: console-build), `feluqa ^0.2.0` (default off; features: console, definitions), `serde ^1` (default off; features: derive, alloc), `serde_json ^1` (default off; features: alloc), `toml ^0.8` |
| [`feluqa-console`](crates/platform/feluqa-console/Cargo.toml) | `crossterm ^0.29` (optional; default off; features: events, windows), `feluqa-console-macros ^0.1.0`, `feluqa-definitions ^0.1.0` (optional), `inventory ^0.3`, `signal-hook ^0.3` (optional), `syn ^2` (optional; features: full) |
| [`feluqa-console-macros`](crates/macros/feluqa-console-macros/Cargo.toml) | `proc-macro2 ^1`, `quote ^1`, `syn ^2` (features: full) |
| [`feluqa-core`](crates/core/feluqa-core/Cargo.toml) | `tokio ^1` (dev; features: macros, rt-multi-thread, net, signal), `argon2 =0.5.3`, `feluqa-auth ^0.1.0`, `feluqa-database ^0.1.0`, `rand_core ^0.6` (features: getrandom), `sea-orm =1.1.20` (default off; features: macros, runtime-tokio-rustls, sqlx-sqlite, sqlx-postgres, with-json), `sha2 ^0.10`, `subtle ^2`, `thiserror ^2`, `tokio ^1` (features: macros, rt-multi-thread, net, signal) |
| [`feluqa-database`](crates/services/feluqa-database/Cargo.toml) | `tokio ^1` (dev; features: macros, rt-multi-thread, net, signal), `feluqa-model-derive ^0.1.0`, `sea-orm =1.1.20` (default off; features: macros, runtime-tokio-rustls, sqlx-sqlite, sqlx-postgres, with-json), `serde ^1` (default off; features: derive, alloc), `sha2 ^0.10`, `thiserror ^2`, `toml ^0.8` |
| [`feluqa-definitions`](crates/core/feluqa-definitions/Cargo.toml) | `serde ^1` (default off; features: derive, alloc), `toml ^0.8` |
| [`feluqa-imagery`](crates/services/feluqa-imagery/Cargo.toml) | — |
| [`feluqa-live`](crates/services/feluqa-live/Cargo.toml) | `feluqa-auth ^0.1.0`, `hmac ^0.12`, `serde ^1` (default off; features: derive, alloc), `serde_json ^1` (default off; features: alloc), `sha2 ^0.10`, `zeroize ^1` |
| [`feluqa-model-derive`](crates/macros/feluqa-model-derive/Cargo.toml) | `proc-macro2 ^1`, `quote ^1`, `syn ^2` (features: full) |
| [`feluqa-module`](crates/platform/feluqa-module/Cargo.toml) | — |
| [`feluqa-notifications`](crates/services/feluqa-notifications/Cargo.toml) | `feluqa-auth ^0.1.0`, `serde ^1` (default off; features: derive, alloc), `serde_json ^1` (default off; features: alloc) |
| [`feluqa-panel`](crates/platform/feluqa-panel/Cargo.toml) | `feluqa-auth ^0.1.0`, `feluqa-imagery ^0.1.0`, `feluqa-ui ^0.1.0` (features: panel-shell), `serde_json ^1` (default off; features: alloc) |
| [`feluqa-ui`](crates/ui/feluqa-ui/Cargo.toml) | `feluqa-ui-components ^0.1.0` (optional), `serde ^1` (default off; features: derive, alloc), `serde_json ^1` (default off; features: alloc) |
| [`feluqa-ui-autoform`](crates/ui/feluqa-ui-autoform/Cargo.toml) | `darling ^0.20`, `proc-macro2 ^1`, `quote ^1`, `syn ^2` (features: full, extra-traits) |
| [`feluqa-ui-card`](crates/ui/feluqa-ui-card/Cargo.toml) | `feluqa-ui-classnames ^0.1.21` (features: variant), `feluqa-ui-component-macros ^0.3.22`, `feluqa-ui-runtime ^0.8.15` (features: nightly, ssr) |
| [`feluqa-ui-card-elements`](crates/ui/feluqa-ui-card-elements/Cargo.toml) | `feluqa-ui-component-macros ^0.3.22`, `feluqa-ui-runtime ^0.8.15` (features: nightly, ssr) |
| [`feluqa-ui-classnames`](crates/ui/feluqa-ui-classnames/Cargo.toml) | `feluqa-ui-classnames-macros ^0.1.9` (optional), `nom ^7` |
| [`feluqa-ui-classnames-macros`](crates/macros/feluqa-ui-classnames-macros/Cargo.toml) | `darling ^0.20`, `proc-macro2 ^1`, `quote ^1`, `syn ^2` (features: full) |
| [`feluqa-ui-component-macros`](crates/macros/feluqa-ui-component-macros/Cargo.toml) | `feluqa-ui-classnames ^0.1.21` (features: variant), `feluqa-ui-runtime ^0.8.15` (features: nightly, ssr), `paste ^1` |
| [`feluqa-ui-components`](crates/ui/feluqa-ui-components/Cargo.toml) | `feluqa-imagery ^0.1.0`, `feluqa-ui-autoform ^0.1.1`, `feluqa-ui-card *` (optional), `feluqa-ui-card-elements *` (optional), `feluqa-ui-classnames ^0.1.21` (features: variant), `feluqa-ui-component-macros ^0.3.22`, `feluqa-ui-navigation ^0.8.3` (features: nightly, ssr), `feluqa-ui-runtime ^0.8.15` (features: nightly, ssr), `heck ^0.5`, `js-sys ^0.3`, `serde ^1` (default off; features: derive, alloc), `serde_json ^1` (default off; features: alloc), `strum ^0.28` (features: derive), `time ^0.3` (features: serde, wasm-bindgen), `validator ^0.20` (features: derive), `wasm-bindgen ^0.2`, `wasm-bindgen-futures ^0.4`, `web-sys ^0.3` (default off; features: Clipboard, console, CssStyleDeclaration, Document, DomRect, DomTokenList, DragEvent, Element, Event, EventTarget, Headers, HtmlElement, HtmlInputElement, InputEvent, KeyboardEvent, Location, MediaQueryList, MouseEvent, MutationObserver, MutationObserverInit, MutationRecord, Navigator, Node, NodeList, Request, RequestInit, RequestMode, Response, Storage, Window) |
| [`feluqa-ui-dom-renderer`](crates/ui/feluqa-ui-dom-renderer/Cargo.toml) | `rustc_version ^0.4` (build), `tokio ^1.49` (dev; features: rt, macros), `tokio-test ^0.4` (dev), `async-trait ^0.1`, `const_str_slice_concat ^0.1`, `drain_filter_polyfill ^0.1`, `either_of ^0.1.6`, `erased ^0.1`, `feluqa-ui-errors ^0.3.1`, `feluqa-ui-reactivity ^0.2.13` (optional), `feluqa-ui-task-runtime ^0.3.0` (optional), `futures ^0.3`, `html-escape ^0.2`, `indexmap ^2.13`, `itertools ^0.14`, `js-sys ^0.3`, `next_tuple ^0.1.0`, `oco_ref ^0.2.1` (optional), `or_poisoned ^0.1.0`, `paste ^1.0`, `reactive_stores ^0.3.1` (optional), `rustc-hash ^2.1`, `send_wrapper ^0.6`, `serde ^1.0` (optional), `serde_json ^1.0` (optional), `sledgehammer_bindgen ^0.6` (optional; features: web), `sledgehammer_utils ^0.3` (optional), `slotmap ^1.1` (optional), `tracing ^0.1` (optional), `wasm-bindgen ^0.2`, `web-sys ^0.3` (features: Window, Document, HtmlElement, HtmlInputElement, Element, Event, console, Comment, Text, Node, HtmlTemplateElement, DocumentFragment, DomTokenList, CssStyleDeclaration, ShadowRoot, HtmlCollection, DomStringMap, AddEventListenerOptions, AnimationEvent, BeforeUnloadEvent, ClipboardEvent, CompositionEvent, CustomEvent, DeviceMotionEvent, DeviceOrientationEvent, DragEvent, ErrorEvent, Event, FocusEvent, GamepadEvent, HashChangeEvent, InputEvent, KeyboardEvent, MessageEvent, MouseEvent, PageTransitionEvent, PointerEvent, PopStateEvent, ProgressEvent, PromiseRejectionEvent, SecurityPolicyViolationEvent, StorageEvent, SubmitEvent, TouchEvent, TransitionEvent, UiEvent, WheelEvent, HtmlHtmlElement, HtmlBaseElement, HtmlHeadElement, HtmlLinkElement, HtmlMetaElement, HtmlStyleElement, HtmlTitleElement, HtmlBodyElement, HtmlHeadingElement, HtmlQuoteElement, HtmlDivElement, HtmlDListElement, HtmlHrElement, HtmlLiElement, HtmlOListElement, HtmlParagraphElement, HtmlPreElement, HtmlUListElement, HtmlAnchorElement, HtmlBrElement, HtmlDataElement, HtmlQuoteElement, HtmlSpanElement, HtmlTimeElement, HtmlAreaElement, HtmlAudioElement, HtmlImageElement, HtmlMapElement, HtmlTrackElement, HtmlVideoElement, HtmlEmbedElement, HtmlIFrameElement, HtmlObjectElement, HtmlParamElement, HtmlPictureElement, HtmlSourceElement, SvgElement, HtmlCanvasElement, HtmlScriptElement, HtmlModElement, HtmlTableCaptionElement, HtmlTableColElement, HtmlTableColElement, HtmlTableElement, HtmlTableSectionElement, HtmlTableCellElement, HtmlTableSectionElement, HtmlTableCellElement, HtmlTableSectionElement, HtmlTableRowElement, HtmlButtonElement, HtmlDataListElement, HtmlFieldSetElement, HtmlFormElement, HtmlInputElement, HtmlLabelElement, HtmlLegendElement, HtmlMeterElement, HtmlOptGroupElement, HtmlOutputElement, HtmlProgressElement, HtmlSelectElement, HtmlTextAreaElement, HtmlDetailsElement, HtmlDialogElement, HtmlMenuElement, HtmlSlotElement, HtmlTemplateElement, HtmlOptionElement) |
| [`feluqa-ui-errors`](crates/ui/feluqa-ui-errors/Cargo.toml) | `anyhow ^1.0.100` (dev; default off), `pin-project-lite ^0.2.16` |
| [`feluqa-ui-markup-parser`](crates/ui/feluqa-ui-markup-parser/Cargo.toml) | `criterion ^0.8.0` (dev), `eyre ^0.6.12` (dev), `proc-macro2 ^1.0.93` (dev; features: span-locations, span-locations), `derive-where ^1.7.0`, `proc-macro2 ^1.0.93` (features: span-locations), `proc-macro2-diagnostics ^0.11` (default off; features: nightly), `quote ^1.0.38`, `syn ^3.0.0` (features: extra-traits, full, parsing, visit-mut), `thiserror ^2.0.11` |
| [`feluqa-ui-navigation`](crates/ui/feluqa-ui-navigation/Cargo.toml) | `rustc_version ^0.4.1` (build), `either_of ^0.1.5`, `feluqa-ui-dom-renderer ^0.2.0` (features: feluqa_ui_reactivity), `feluqa-ui-navigation-macros ^0.8.3`, `feluqa-ui-reactivity ^0.2.0`, `feluqa-ui-runtime ^0.8.3`, `feluqa-ui-task-runtime ^0.3.0`, `futures ^0.3.31`, `gloo-net ^0.6.0`, `js-sys ^0.3.77`, `or_poisoned ^0.1.0`, `percent-encoding ^2.3.1` (optional), `send_wrapper ^0.6.0`, `thiserror ^2.0.12`, `tracing ^0.1.41` (optional), `url ^2.5.4`, `wasm-bindgen ^0.2.100`, `web-sys ^0.3.77` (features: Document, Window, console, History, HtmlAnchorElement, Location, MouseEvent, Url, FormData, HtmlButtonElement, HtmlFormElement, HtmlInputElement, SubmitEvent, Url, UrlSearchParams, Headers, Request, RequestInit, RequestMode, Response) |
| [`feluqa-ui-navigation-macros`](crates/macros/feluqa-ui-navigation-macros/Cargo.toml) | `proc-macro-error2 ^2.0.1` (default off), `proc-macro2 ^1.0.95`, `quote ^1.0.40`, `syn ^2.0.104` (features: full) |
| [`feluqa-ui-reactivity`](crates/ui/feluqa-ui-reactivity/Cargo.toml) | `rustc_version ^0.4` (build), `tokio ^1.49` (dev; features: rt-multi-thread, macros), `tokio-test ^0.4` (dev), `typed-builder ^0.23` (dev; default off), `async-lock ^3`, `feluqa-ui-task-runtime ^0.3.0`, `futures ^0.3`, `guardian ^1`, `hydration_context ^0.3.0` (optional), `indexmap ^2`, `or_poisoned ^0.1`, `paste ^1`, `pin-project-lite ^0.2`, `rustc-hash ^2`, `send_wrapper ^0.6` (features: futures), `serde ^1` (optional; features: derive, rc), `slotmap ^1`, `thiserror ^2`, `tracing ^0.1` (optional), `web-sys ^0.3` (default off; features: console; target: cfg(all(target_arch = "wasm32", target_os = "unknown"))) |
| [`feluqa-ui-runtime`](crates/ui/feluqa-ui-runtime/Cargo.toml) | `rustc_version ^0.4.1` (build), `feluqa-ui-task-runtime ^0.3.0` (dev; features: futures-executor, tokio), `tokio ^1.48.0` (dev; features: rt-multi-thread, macros), `tokio-test ^0.4.4` (dev), `base64 ^0.22.1` (optional), `cfg-if ^1.0.4`, `either_of ^0.1.6`, `feluqa-ui-dom-renderer ^0.2.11` (features: feluqa_ui_reactivity, oco), `feluqa-ui-errors ^0.3.1`, `feluqa-ui-reactivity ^0.2.12` (features: serde), `feluqa-ui-runtime-config ^0.8.8`, `feluqa-ui-runtime-dom ^0.8.7`, `feluqa-ui-runtime-hot-reload ^0.8.5`, `feluqa-ui-runtime-macros ^0.8.13`, `feluqa-ui-runtime-macros ^0.8.13` (features: __internal_erase_components; target: cfg(erase_components)), `feluqa-ui-runtime-server ^0.8.6` (features: feluqa_ui_dom_renderer), `feluqa-ui-server-functions ^0.8.9` (features: form-redirects, browser), `feluqa-ui-task-runtime ^0.3.0` (features: wasm-bindgen, futures-executor), `futures ^0.3.31`, `getrandom ^0.3.4` (optional), `hydration_context ^0.3.0`, `oco_ref ^0.2.1`, `or_poisoned ^0.1.0`, `paste ^1.0.15`, `rand ^0.9.2` (optional), `rustc-hash ^2.1.1`, `send_wrapper ^0.6.0`, `serde ^1.0.228`, `serde_json ^1.0.145`, `serde_qs ^0.15.0`, `slotmap ^1.1.1`, `thiserror ^2.0.17`, `tracing ^0.1.43` (optional), `typed-builder ^0.23.2`, `typed-builder-macro ^0.23.2`, `wasm-bindgen ^0.2.106`, `wasm-bindgen-futures ^0.4.56`, `wasm_split_helpers ^0.2.0`, `web-sys ^0.3.83` (features: ShadowRoot, ShadowRootInit, ShadowRootMode) |
| [`feluqa-ui-runtime-config`](crates/ui/feluqa-ui-runtime-config/Cargo.toml) | `temp-env ^0.3` (dev; features: async_closure), `tempfile ^3.24` (dev), `tokio ^1.49` (dev; features: rt, macros), `config ^0.15` (default off; features: toml, convert-case), `regex ^1.12`, `serde ^1.0` (features: derive, rc), `thiserror ^2.0`, `typed-builder ^0.23` |
| [`feluqa-ui-runtime-dom`](crates/ui/feluqa-ui-runtime-dom/Cargo.toml) | `feluqa-ui-dom-renderer ^0.2.12`, `feluqa-ui-reactivity ^0.2.13`, `js-sys ^0.3`, `or_poisoned ^0.1.0`, `send_wrapper ^0.6`, `serde ^1.0` (optional), `serde_json ^1.0` (optional), `tracing ^0.1` (optional), `wasm-bindgen ^0.2`, `web-sys ^0.3` (features: Location) |
| [`feluqa-ui-runtime-hot-reload`](crates/ui/feluqa-ui-runtime-hot-reload/Cargo.toml) | `anyhow ^1.0`, `camino ^1.2`, `feluqa-ui-markup-parser ^0.13.1`, `indexmap ^2.13`, `or_poisoned ^0.1.0`, `proc-macro2 ^1.0` (features: span-locations, nightly), `quote ^1.0`, `serde ^1.0` (features: derive), `syn ^3.0` (features: full, parsing, extra-traits, visit, printing), `walkdir ^2.5` |
| [`feluqa-ui-runtime-macros`](crates/macros/feluqa-ui-runtime-macros/Cargo.toml) | `rustc_version ^0.4` (build), `insta ^1.46` (dev), `log ^0.4` (dev), `serde ^1.0` (dev), `trybuild ^1.0` (dev), `typed-builder ^0.23` (dev), `attribute-derive ^0.11` (features: syn-full), `cfg-if ^1.0`, `convert_case ^0.11`, `convert_case_extras ^0.2`, `feluqa-ui-markup-parser ^0.13.1`, `feluqa-ui-runtime-hot-reload ^0.8.7`, `feluqa-ui-server-functions-macros =0.8.12`, `html-escape ^0.2`, `itertools ^0.14`, `prettyplease ^0.3`, `proc-macro2 ^1.0`, `quote ^1.0`, `syn ^3.0` (features: full), `tracing ^0.1` (optional), `uuid ^1.20` (features: v4) |
| [`feluqa-ui-runtime-server`](crates/ui/feluqa-ui-runtime-server/Cargo.toml) | `base64 ^0.22`, `codee ^0.3` (features: json_serde), `feluqa-ui-dom-renderer ^0.2.12` (optional; features: feluqa_ui_reactivity), `feluqa-ui-reactivity ^0.2.13` (features: hydration), `feluqa-ui-server-functions ^0.8.10`, `feluqa-ui-task-runtime ^0.3.0`, `futures ^0.3`, `hydration_context ^0.3.0`, `js-sys ^0.3` (optional), `or_poisoned ^0.1.0`, `send_wrapper ^0.6`, `serde ^1.0`, `serde_json ^1.0`, `tracing ^0.1` (optional), `wasm-bindgen ^0.2` (optional) |
| [`feluqa-ui-server-functions`](crates/ui/feluqa-ui-server-functions/Cargo.toml) | `rustc_version ^0.4` (build), `trybuild ^1.0` (dev), `actix-web ^4.12` (optional; default off; features: ws), `actix-ws ^0.3` (optional), `axum ^0.8` (optional; default off; features: multipart), `base64 ^0.22`, `bitcode ^0.6` (optional), `bytes ^1.11`, `ciborium ^0.2` (optional), `const-str ^1.1`, `const_format ^0.2`, `feluqa-ui-errors ^0.3.1`, `feluqa-ui-server-functions-macros-default ^0.8.5`, `futures ^0.3`, `gloo-net ^0.6` (optional), `http ^1.4`, `http-body-util ^0.1` (optional), `hyper ^1.8` (optional), `inventory ^0.3` (optional), `js-sys ^0.3` (optional), `multer ^3.1` (optional), `or_poisoned ^0.1.0`, `pin-project-lite ^0.2`, `postcard ^1.1` (optional; features: alloc), `reqwest ^0.13` (optional; default off; features: multipart, stream), `rkyv ^0.8` (optional), `rmp-serde ^1.3` (optional), `rustversion ^1.0`, `send_wrapper ^0.6` (optional; features: futures), `serde ^1.0` (features: derive), `serde-lite ^0.5` (optional; features: derive), `serde_json ^1.0`, `serde_qs ^0.15`, `thiserror ^2.0`, `tokio ^1.49` (optional; features: rt), `tokio-tungstenite ^0.28` (optional), `tower ^0.5` (optional), `tower-layer ^0.3` (optional), `url ^2.5`, `wasm-bindgen ^0.2` (optional), `wasm-bindgen-futures ^0.4` (optional), `wasm-streams ^0.5` (optional), `web-sys ^0.3` (optional; features: console, ReadableStream, ReadableStreamDefaultReader, AbortController, AbortSignal), `xxhash-rust ^0.8` (features: const_xxh64) |
| [`feluqa-ui-server-functions-macros`](crates/macros/feluqa-ui-server-functions-macros/Cargo.toml) | `rustc_version ^0.4` (build), `const_format ^0.2`, `convert_case ^0.11`, `proc-macro2 ^1.0`, `quote ^1.0`, `syn ^3.0` (features: full, parsing, extra-traits), `xxhash-rust ^0.8` (features: const_xxh64) |
| [`feluqa-ui-server-functions-macros-default`](crates/macros/feluqa-ui-server-functions-macros-default/Cargo.toml) | `feluqa-ui-server-functions-macros =0.8.12`, `syn ^3.0` |
| [`feluqa-ui-task-runtime`](crates/ui/feluqa-ui-task-runtime/Cargo.toml) | `futures-lite ^2.6.0` (dev; default off), `serial_test ^3.2.0` (dev), `tokio ^1.41` (dev; default off; features: rt, macros, time), `wasm-bindgen-test ^0.3.50` (dev), `async-executor ^1.13.1` (optional), `futures ^0.3.31`, `glib ^0.20.6` (optional), `thiserror ^2.0.12`, `tokio ^1.41` (optional; default off; features: rt), `tracing ^0.1.41` (optional), `wasm-bindgen-futures ^0.4.50` (optional) |
| [`feluqa-view`](crates/ui/feluqa-view/Cargo.toml) | `quote ^1.0` (optional), `syn ^2.0` (optional; features: full, parsing, printing) |
| [`numerimondes`](products/numerimondes/Cargo.toml) | `feluqa *` (build; features: view-compiler), `feluqa-build *` (build), `tower ^0.5` (dev; features: util), `axum ^0.8`, `feluqa ^0.2.0`, `sea-orm =1.1.20` (default off; features: macros, runtime-tokio-rustls, sqlx-sqlite, sqlx-postgres, with-json), `serde ^1` (default off; features: derive, alloc), `serde_json ^1` (default off; features: alloc), `subtle ^2`, `tokio ^1` (features: macros, rt-multi-thread, net, signal), `tower-http ^0.6` (features: fs) |

## First-party workspace packages

| Package | Locked version | Manifest |
|---|---:|---|
| `feluqa` | `0.2.0` | `crates/platform/feluqa/Cargo.toml` |
| `feluqa-auth` | `0.1.0` | `crates/services/feluqa-auth/Cargo.toml` |
| `feluqa-build` | `0.1.0` | `tools/feluqa-build/Cargo.toml` |
| `feluqa-cli` | `0.2.0` | `products/feluqa-cli/Cargo.toml` |
| `feluqa-console` | `0.1.1` | `crates/platform/feluqa-console/Cargo.toml` |
| `feluqa-console-macros` | `0.1.0` | `crates/macros/feluqa-console-macros/Cargo.toml` |
| `feluqa-core` | `0.1.0` | `crates/core/feluqa-core/Cargo.toml` |
| `feluqa-database` | `0.1.0` | `crates/services/feluqa-database/Cargo.toml` |
| `feluqa-definitions` | `0.1.0` | `crates/core/feluqa-definitions/Cargo.toml` |
| `feluqa-imagery` | `0.1.0` | `crates/services/feluqa-imagery/Cargo.toml` |
| `feluqa-live` | `0.1.0` | `crates/services/feluqa-live/Cargo.toml` |
| `feluqa-model-derive` | `0.1.0` | `crates/macros/feluqa-model-derive/Cargo.toml` |
| `feluqa-module` | `0.1.0` | `crates/platform/feluqa-module/Cargo.toml` |
| `feluqa-notifications` | `0.1.0` | `crates/services/feluqa-notifications/Cargo.toml` |
| `feluqa-panel` | `0.1.0` | `crates/platform/feluqa-panel/Cargo.toml` |
| `feluqa-ui` | `0.1.0` | `crates/ui/feluqa-ui/Cargo.toml` |
| `feluqa-ui-autoform` | `0.1.1` | `crates/ui/feluqa-ui-autoform/Cargo.toml` |
| `feluqa-ui-card` | `0.1.0` | `crates/ui/feluqa-ui-card/Cargo.toml` |
| `feluqa-ui-card-elements` | `0.1.0` | `crates/ui/feluqa-ui-card-elements/Cargo.toml` |
| `feluqa-ui-classnames` | `0.1.21` | `crates/ui/feluqa-ui-classnames/Cargo.toml` |
| `feluqa-ui-classnames-macros` | `0.1.9` | `crates/macros/feluqa-ui-classnames-macros/Cargo.toml` |
| `feluqa-ui-component-macros` | `0.3.22` | `crates/macros/feluqa-ui-component-macros/Cargo.toml` |
| `feluqa-ui-components` | `0.1.0` | `crates/ui/feluqa-ui-components/Cargo.toml` |
| `feluqa-ui-dom-renderer` | `0.2.13` | `crates/ui/feluqa-ui-dom-renderer/Cargo.toml` |
| `feluqa-ui-errors` | `0.3.1` | `crates/ui/feluqa-ui-errors/Cargo.toml` |
| `feluqa-ui-markup-parser` | `0.13.1` | `crates/ui/feluqa-ui-markup-parser/Cargo.toml` |
| `feluqa-ui-navigation` | `0.8.3` | `crates/ui/feluqa-ui-navigation/Cargo.toml` |
| `feluqa-ui-navigation-macros` | `0.8.3` | `crates/macros/feluqa-ui-navigation-macros/Cargo.toml` |
| `feluqa-ui-reactivity` | `0.2.14` | `crates/ui/feluqa-ui-reactivity/Cargo.toml` |
| `feluqa-ui-runtime` | `0.8.15` | `crates/ui/feluqa-ui-runtime/Cargo.toml` |
| `feluqa-ui-runtime-config` | `0.8.10` | `crates/ui/feluqa-ui-runtime-config/Cargo.toml` |
| `feluqa-ui-runtime-dom` | `0.8.8` | `crates/ui/feluqa-ui-runtime-dom/Cargo.toml` |
| `feluqa-ui-runtime-hot-reload` | `0.8.7` | `crates/ui/feluqa-ui-runtime-hot-reload/Cargo.toml` |
| `feluqa-ui-runtime-macros` | `0.8.19` | `crates/macros/feluqa-ui-runtime-macros/Cargo.toml` |
| `feluqa-ui-runtime-server` | `0.8.7` | `crates/ui/feluqa-ui-runtime-server/Cargo.toml` |
| `feluqa-ui-server-functions` | `0.8.13` | `crates/ui/feluqa-ui-server-functions/Cargo.toml` |
| `feluqa-ui-server-functions-macros` | `0.8.12` | `crates/macros/feluqa-ui-server-functions-macros/Cargo.toml` |
| `feluqa-ui-server-functions-macros-default` | `0.8.6` | `crates/macros/feluqa-ui-server-functions-macros-default/Cargo.toml` |
| `feluqa-ui-task-runtime` | `0.3.0` | `crates/ui/feluqa-ui-task-runtime/Cargo.toml` |
| `feluqa-view` | `0.2.0` | `crates/ui/feluqa-view/Cargo.toml` |
| `numerimondes` | `0.2.0` | `products/numerimondes/Cargo.toml` |

## Third-party locked package inventory

Every third-party package/version in `Cargo.lock` is listed below, including packages that are only reached through optional features or other target combinations. The source is crates.io for every entry in this lockfile.

| Package | Locked version |
|---|---:|
| `actix-codec` | `0.5.2` |
| `actix-http` | `3.11.2` |
| `actix-macros` | `0.2.4` |
| `actix-router` | `0.5.4` |
| `actix-rt` | `2.11.0` |
| `actix-server` | `2.6.0` |
| `actix-service` | `2.0.3` |
| `actix-utils` | `3.0.1` |
| `actix-web` | `4.12.1` |
| `actix-web-codegen` | `4.3.0` |
| `actix-ws` | `0.3.0` |
| `adler2` | `2.0.1` |
| `aho-corasick` | `1.1.5` |
| `aliasable` | `0.1.3` |
| `alloc-no-stdlib` | `2.0.4` |
| `alloc-stdlib` | `0.2.4` |
| `alloca` | `0.4.0` |
| `allocator-api2` | `0.2.21` |
| `anes` | `0.1.6` |
| `anstyle` | `1.0.14` |
| `any_spawner` | `0.3.0` |
| `anyhow` | `1.0.104` |
| `argon2` | `0.5.3` |
| `arrayvec` | `0.7.8` |
| `async-executor` | `1.14.0` |
| `async-lock` | `3.4.2` |
| `async-once-cell` | `0.5.4` |
| `async-stream` | `0.3.6` |
| `async-stream-impl` | `0.3.6` |
| `async-task` | `4.7.1` |
| `async-trait` | `0.1.92` |
| `atoi` | `2.0.0` |
| `atomic-polyfill` | `1.0.3` |
| `atomic-waker` | `1.1.2` |
| `attribute-derive` | `0.11.0` |
| `attribute-derive-macro` | `0.11.0` |
| `autocfg` | `1.5.1` |
| `aws-lc-rs` | `1.18.2` |
| `aws-lc-sys` | `0.46.0` |
| `axum` | `0.8.9` |
| `axum-core` | `0.5.6` |
| `base16` | `0.2.1` |
| `base64` | `0.22.1` |
| `base64` | `0.23.1` |
| `base64ct` | `1.8.3` |
| `bigdecimal` | `0.4.11` |
| `bitcode` | `0.6.9` |
| `bitcode_derive` | `0.6.9` |
| `bitflags` | `2.13.2` |
| `blake2` | `0.10.6` |
| `block-buffer` | `0.10.4` |
| `brotli` | `8.0.4` |
| `brotli-decompressor` | `5.0.3` |
| `bumpalo` | `3.20.3` |
| `bytecheck` | `0.8.3` |
| `bytecheck_derive` | `0.8.3` |
| `bytemuck` | `1.25.2` |
| `byteorder` | `1.5.0` |
| `bytes` | `1.12.1` |
| `bytestring` | `1.5.0` |
| `camino` | `1.2.6` |
| `cast` | `0.3.0` |
| `cc` | `1.10.0` |
| `cesu8` | `1.1.0` |
| `cfg-expr` | `0.18.0` |
| `cfg-if` | `1.0.5` |
| `cfg_aliases` | `0.2.2` |
| `chrono` | `0.4.45` |
| `ciborium` | `0.2.2` |
| `ciborium-io` | `0.2.2` |
| `ciborium-ll` | `0.2.2` |
| `clap` | `4.5.61` |
| `clap_builder` | `4.5.61` |
| `clap_lex` | `1.0.1` |
| `cmake` | `0.1.58` |
| `cobs` | `0.3.0` |
| `codee` | `0.3.5` |
| `collection_literals` | `1.0.3` |
| `combine` | `4.6.9` |
| `concurrent-queue` | `2.5.0` |
| `config` | `0.15.25` |
| `console` | `0.16.6` |
| `const-oid` | `0.9.6` |
| `const-str` | `1.1.0` |
| `const_format` | `0.2.37` |
| `const_format_proc_macros` | `0.2.37` |
| `const_str_slice_concat` | `0.1.0` |
| `convert_case` | `0.10.0` |
| `convert_case` | `0.11.0` |
| `convert_case` | `0.6.0` |
| `convert_case` | `0.8.0` |
| `convert_case_extras` | `0.2.0` |
| `cookie` | `0.16.2` |
| `core-foundation` | `0.10.1` |
| `core-foundation-sys` | `0.8.7` |
| `cpufeatures` | `0.2.17` |
| `crc` | `3.4.0` |
| `crc-catalog` | `2.5.0` |
| `crc32fast` | `1.5.3` |
| `criterion` | `0.8.2` |
| `criterion-plot` | `0.8.2` |
| `critical-section` | `1.2.0` |
| `crossbeam-deque` | `0.8.8` |
| `crossbeam-epoch` | `0.9.21` |
| `crossbeam-queue` | `0.3.14` |
| `crossbeam-utils` | `0.8.23` |
| `crossterm` | `0.29.0` |
| `crossterm_winapi` | `0.9.1` |
| `crunchy` | `0.2.4` |
| `crypto-common` | `0.1.7` |
| `darling` | `0.20.11` |
| `darling_core` | `0.20.11` |
| `darling_macro` | `0.20.11` |
| `dashmap` | `6.2.1` |
| `data-encoding` | `2.11.1` |
| `der` | `0.7.10` |
| `deranged` | `0.5.9` |
| `derive-where` | `1.7.0` |
| `derive_more` | `2.1.1` |
| `derive_more-impl` | `2.1.1` |
| `digest` | `0.10.7` |
| `displaydoc` | `0.2.7` |
| `document-features` | `0.2.12` |
| `dotenvy` | `0.15.7` |
| `drain_filter_polyfill` | `0.1.3` |
| `dunce` | `1.0.5` |
| `either` | `1.19.0` |
| `either_of` | `0.1.6` |
| `embedded-io` | `0.4.0` |
| `embedded-io` | `0.6.1` |
| `encode_unicode` | `1.0.0` |
| `encoding_rs` | `0.8.35` |
| `equivalent` | `1.0.3` |
| `erased` | `0.1.2` |
| `errno` | `0.3.14` |
| `etcetera` | `0.8.0` |
| `event-listener` | `5.4.2` |
| `event-listener-strategy` | `0.5.4` |
| `eyre` | `0.6.14` |
| `fastrand` | `2.5.0` |
| `find-msvc-tools` | `0.1.15` |
| `flate2` | `1.1.10` |
| `flume` | `0.11.1` |
| `fnv` | `1.0.7` |
| `foldhash` | `0.1.5` |
| `form_urlencoded` | `1.2.2` |
| `fs_extra` | `1.3.0` |
| `futures` | `0.3.34` |
| `futures-channel` | `0.3.34` |
| `futures-core` | `0.3.34` |
| `futures-executor` | `0.3.34` |
| `futures-intrusive` | `0.5.0` |
| `futures-io` | `0.3.34` |
| `futures-lite` | `2.6.1` |
| `futures-macro` | `0.3.34` |
| `futures-sink` | `0.3.34` |
| `futures-task` | `0.3.34` |
| `futures-util` | `0.3.34` |
| `generic-array` | `0.14.7` |
| `getrandom` | `0.2.17` |
| `getrandom` | `0.3.4` |
| `getrandom` | `0.4.3` |
| `gio-sys` | `0.20.10` |
| `glam` | `0.33.12` |
| `glib` | `0.20.12` |
| `glib-macros` | `0.20.12` |
| `glib-sys` | `0.20.10` |
| `glob` | `0.3.4` |
| `gloo-net` | `0.6.0` |
| `gloo-utils` | `0.2.0` |
| `gobject-sys` | `0.20.10` |
| `guardian` | `1.3.0` |
| `h2` | `0.3.27` |
| `half` | `2.4.1` |
| `hash32` | `0.2.1` |
| `hashbrown` | `0.14.5` |
| `hashbrown` | `0.15.5` |
| `hashbrown` | `0.17.1` |
| `hashlink` | `0.10.0` |
| `heapless` | `0.7.17` |
| `heck` | `0.4.1` |
| `heck` | `0.5.0` |
| `hex` | `0.4.3` |
| `hkdf` | `0.12.4` |
| `hmac` | `0.12.1` |
| `home` | `0.5.11` |
| `html-escape` | `0.2.15` |
| `http` | `0.2.12` |
| `http` | `1.5.0` |
| `http-body` | `1.1.0` |
| `http-body-util` | `0.1.5` |
| `http-range-header` | `0.4.2` |
| `httparse` | `1.10.1` |
| `httpdate` | `1.0.3` |
| `hydration_context` | `0.3.0` |
| `hyper` | `1.12.0` |
| `hyper-rustls` | `0.27.7` |
| `hyper-util` | `0.1.21` |
| `icu_collections` | `2.1.1` |
| `icu_locale_core` | `2.1.1` |
| `icu_normalizer` | `2.1.1` |
| `icu_normalizer_data` | `2.1.1` |
| `icu_properties` | `2.1.2` |
| `icu_properties_data` | `2.1.2` |
| `icu_provider` | `2.1.1` |
| `ident_case` | `1.0.1` |
| `idna` | `1.1.0` |
| `idna_adapter` | `1.2.1` |
| `impl-more` | `0.1.9` |
| `indenter` | `0.3.4` |
| `indexmap` | `2.14.2` |
| `inherent` | `1.0.14` |
| `insta` | `1.49.0` |
| `interpolator` | `0.5.0` |
| `inventory` | `0.3.25` |
| `ipnet` | `2.12.2` |
| `itertools` | `0.13.0` |
| `itertools` | `0.14.0` |
| `itoa` | `1.0.18` |
| `jni` | `0.21.1` |
| `jni-sys` | `0.3.1` |
| `jni-sys` | `0.4.1` |
| `jni-sys-macros` | `0.4.1` |
| `jobserver` | `0.1.34` |
| `js-sys` | `0.3.106` |
| `konst` | `0.2.20` |
| `konst_macro_rules` | `0.2.19` |
| `language-tags` | `0.3.2` |
| `lazy_static` | `1.5.1` |
| `libc` | `0.2.191` |
| `libm` | `0.2.16` |
| `libredox` | `0.1.25` |
| `libsqlite3-sys` | `0.30.1` |
| `linux-raw-sys` | `0.12.1` |
| `litemap` | `0.8.3` |
| `litrs` | `1.0.1` |
| `local-channel` | `0.1.5` |
| `local-waker` | `0.1.4` |
| `lock_api` | `0.4.14` |
| `log` | `0.4.34` |
| `lru-slab` | `0.1.3` |
| `mac_address` | `1.2.1` |
| `manyhow` | `0.14.1` |
| `manyhow-macros` | `0.14.1` |
| `matchit` | `0.8.4` |
| `md-5` | `0.10.6` |
| `memchr` | `2.8.3` |
| `memoffset` | `0.9.1` |
| `mime` | `0.3.17` |
| `mime_guess` | `2.0.5` |
| `mini-internal` | `0.1.46` |
| `minicov` | `0.3.8` |
| `minimal-lexical` | `0.2.1` |
| `miniserde` | `0.1.46` |
| `miniz_oxide` | `0.9.1` |
| `mio` | `1.2.4` |
| `multer` | `3.1.0` |
| `munge` | `0.4.4` |
| `munge_macro` | `0.4.4` |
| `next_tuple` | `0.1.0` |
| `nix` | `0.31.3` |
| `nom` | `7.1.3` |
| `nu-ansi-term` | `0.50.3` |
| `num-bigint` | `0.4.8` |
| `num-bigint-dig` | `0.8.6` |
| `num-conv` | `0.1.0` |
| `num-integer` | `0.1.47` |
| `num-iter` | `0.1.46` |
| `num-traits` | `0.2.19` |
| `oco_ref` | `0.2.1` |
| `once_cell` | `1.21.4` |
| `oorandom` | `11.1.5` |
| `openssl-probe` | `0.2.2` |
| `or_poisoned` | `0.1.0` |
| `ordered-float` | `4.6.0` |
| `ouroboros` | `0.18.5` |
| `ouroboros_macro` | `0.18.5` |
| `page_size` | `0.6.0` |
| `parking` | `2.2.1` |
| `parking_lot` | `0.12.5` |
| `parking_lot_core` | `0.9.12` |
| `password-hash` | `0.5.0` |
| `paste` | `1.0.15` |
| `pathdiff` | `0.2.3` |
| `pem-rfc7468` | `0.7.0` |
| `percent-encoding` | `2.3.2` |
| `pgvector` | `0.4.2` |
| `pin-project` | `1.1.13` |
| `pin-project-internal` | `1.1.13` |
| `pin-project-lite` | `0.2.17` |
| `pkcs1` | `0.7.5` |
| `pkcs8` | `0.10.2` |
| `pkg-config` | `0.3.34` |
| `plain` | `0.2.3` |
| `plotters` | `0.3.7` |
| `plotters-backend` | `0.3.7` |
| `plotters-svg` | `0.3.7` |
| `postcard` | `1.1.3` |
| `potential_utf` | `0.1.6` |
| `powerfmt` | `0.2.1` |
| `ppv-lite86` | `0.2.21` |
| `prettyplease` | `0.3.0` |
| `proc-macro-crate` | `3.4.0` |
| `proc-macro-error-attr2` | `2.0.0` |
| `proc-macro-error2` | `2.0.1` |
| `proc-macro-utils` | `0.10.0` |
| `proc-macro2` | `1.0.107` |
| `proc-macro2-diagnostics` | `0.10.1` |
| `proc-macro2-diagnostics` | `0.11.0` |
| `ptr_meta` | `0.3.2` |
| `ptr_meta_derive` | `0.3.2` |
| `quinn` | `0.11.9` |
| `quinn-proto` | `0.11.14` |
| `quinn-udp` | `0.5.14` |
| `quote` | `1.0.47` |
| `quote-use` | `0.9.0` |
| `quote-use-macros` | `0.9.0` |
| `r-efi` | `5.3.0` |
| `r-efi` | `6.0.0` |
| `rancor` | `0.1.3` |
| `rand` | `0.8.8` |
| `rand` | `0.9.5` |
| `rand_chacha` | `0.3.1` |
| `rand_chacha` | `0.9.0` |
| `rand_core` | `0.6.4` |
| `rand_core` | `0.9.5` |
| `rayon` | `1.12.0` |
| `rayon-core` | `1.13.0` |
| `reactive_graph` | `0.2.16` |
| `reactive_stores` | `0.3.1` |
| `reactive_stores_macro` | `0.2.6` |
| `redox_syscall` | `0.5.18` |
| `redox_syscall` | `0.9.5` |
| `regex` | `1.13.1` |
| `regex-automata` | `0.4.18` |
| `regex-lite` | `0.1.9` |
| `regex-syntax` | `0.8.11` |
| `rend` | `0.5.4` |
| `reqwest` | `0.13.3` |
| `ring` | `0.17.14` |
| `rkyv` | `0.8.18` |
| `rkyv_derive` | `0.8.18` |
| `rmp` | `0.8.14` |
| `rmp-serde` | `1.3.0` |
| `rsa` | `0.9.10` |
| `rust_decimal` | `1.43.0` |
| `rustc-hash` | `1.1.0` |
| `rustc-hash` | `2.1.3` |
| `rustc_version` | `0.4.1` |
| `rustix` | `1.1.6` |
| `rustls` | `0.23.46` |
| `rustls-native-certs` | `0.8.5` |
| `rustls-pki-types` | `1.15.1` |
| `rustls-platform-verifier` | `0.6.2` |
| `rustls-platform-verifier-android` | `0.1.1` |
| `rustls-webpki` | `0.103.16` |
| `rustversion` | `1.0.23` |
| `ryu` | `1.0.23` |
| `same-file` | `1.0.6` |
| `schannel` | `0.1.30` |
| `scopeguard` | `1.2.0` |
| `sea-bae` | `0.2.2` |
| `sea-orm` | `1.1.20` |
| `sea-orm-macros` | `1.1.20` |
| `sea-query` | `0.32.7` |
| `sea-query-binder` | `0.7.0` |
| `security-framework` | `3.6.0` |
| `security-framework-sys` | `2.17.0` |
| `semver` | `1.0.28` |
| `send_wrapper` | `0.6.0` |
| `serde` | `1.0.229` |
| `serde-lite` | `0.5.1` |
| `serde-lite-derive` | `0.5.1` |
| `serde-wasm-bindgen` | `0.6.5` |
| `serde_core` | `1.0.229` |
| `serde_derive` | `1.0.229` |
| `serde_json` | `1.0.154` |
| `serde_path_to_error` | `0.1.20` |
| `serde_qs` | `0.15.0` |
| `serde_spanned` | `0.6.9` |
| `serde_spanned` | `1.1.2` |
| `serde_urlencoded` | `0.7.1` |
| `serial_test` | `3.5.0` |
| `serial_test_derive` | `3.5.0` |
| `sha1` | `0.10.7` |
| `sha2` | `0.10.9` |
| `shlex` | `2.0.1` |
| `signal-hook` | `0.3.18` |
| `signal-hook-mio` | `0.2.5` |
| `signal-hook-registry` | `1.4.8` |
| `signature` | `2.2.0` |
| `simd-adler32` | `0.3.10` |
| `simdutf8` | `0.1.5` |
| `similar` | `2.7.0` |
| `slab` | `0.4.12` |
| `sledgehammer_bindgen` | `0.6.0` |
| `sledgehammer_bindgen_macro` | `0.6.5` |
| `sledgehammer_utils` | `0.3.1` |
| `slotmap` | `1.1.1` |
| `smallvec` | `1.16.4` |
| `socket2` | `0.5.10` |
| `socket2` | `0.6.5` |
| `spin` | `0.9.9` |
| `spki` | `0.7.3` |
| `sqlx` | `0.8.6` |
| `sqlx-core` | `0.8.6` |
| `sqlx-macros` | `0.8.6` |
| `sqlx-macros-core` | `0.8.6` |
| `sqlx-mysql` | `0.8.6` |
| `sqlx-postgres` | `0.8.6` |
| `sqlx-sqlite` | `0.8.6` |
| `stable_deref_trait` | `1.2.1` |
| `static_assertions` | `1.1.0` |
| `stringprep` | `0.1.5` |
| `strsim` | `0.11.1` |
| `strum` | `0.26.3` |
| `strum` | `0.28.0` |
| `strum_macros` | `0.28.0` |
| `subtle` | `2.6.1` |
| `syn` | `2.0.119` |
| `syn` | `3.0.9` |
| `sync_wrapper` | `1.0.2` |
| `synstructure` | `0.14.0` |
| `system-deps` | `7.0.8` |
| `target-lexicon` | `0.13.2` |
| `target-triple` | `1.0.1` |
| `temp-env` | `0.3.6` |
| `tempfile` | `3.27.0` |
| `termcolor` | `1.4.1` |
| `thiserror` | `1.0.69` |
| `thiserror` | `2.0.21` |
| `thiserror-impl` | `1.0.69` |
| `thiserror-impl` | `2.0.21` |
| `time` | `0.3.45` |
| `time-core` | `0.1.7` |
| `time-macros` | `0.2.25` |
| `tinystr` | `0.8.5` |
| `tinytemplate` | `1.2.1` |
| `tinyvec` | `1.13.3` |
| `tokio` | `1.54.1` |
| `tokio-macros` | `2.7.2` |
| `tokio-rustls` | `0.26.6` |
| `tokio-stream` | `0.1.19` |
| `tokio-test` | `0.4.6` |
| `tokio-tungstenite` | `0.28.0` |
| `tokio-tungstenite` | `0.29.0` |
| `tokio-util` | `0.7.20` |
| `toml` | `0.8.23` |
| `toml` | `1.1.8+spec-1.1.0` |
| `toml_datetime` | `0.6.11` |
| `toml_datetime` | `0.7.5+spec-1.1.0` |
| `toml_datetime` | `1.1.2+spec-1.1.0` |
| `toml_edit` | `0.22.27` |
| `toml_edit` | `0.23.10+spec-1.0.0` |
| `toml_parser` | `1.1.5+spec-1.1.0` |
| `toml_write` | `0.1.2` |
| `toml_writer` | `1.1.3+spec-1.1.0` |
| `tower` | `0.5.3` |
| `tower-http` | `0.6.11` |
| `tower-layer` | `0.3.3` |
| `tower-service` | `0.3.3` |
| `tracing` | `0.1.44` |
| `tracing-attributes` | `0.1.31` |
| `tracing-core` | `0.1.36` |
| `try-lock` | `0.2.5` |
| `trybuild` | `1.0.116` |
| `tungstenite` | `0.28.0` |
| `tungstenite` | `0.29.0` |
| `typed-builder` | `0.23.2` |
| `typed-builder-macro` | `0.23.2` |
| `typenum` | `1.20.1` |
| `unicase` | `2.10.0` |
| `unicode-bidi` | `0.3.18` |
| `unicode-ident` | `1.0.27` |
| `unicode-normalization` | `0.1.26` |
| `unicode-properties` | `0.1.4` |
| `unicode-segmentation` | `1.13.3` |
| `unicode-xid` | `0.2.6` |
| `untrusted` | `0.9.0` |
| `url` | `2.5.8` |
| `utf-8` | `0.7.6` |
| `utf8_iter` | `1.0.4` |
| `uuid` | `1.26.1` |
| `validator` | `0.20.0` |
| `validator_derive` | `0.20.0` |
| `vcpkg` | `0.2.15` |
| `version-compare` | `0.2.1` |
| `version_check` | `0.9.5` |
| `walkdir` | `2.5.0` |
| `want` | `0.3.2` |
| `wasi` | `0.11.1+wasi-snapshot-preview1` |
| `wasip2` | `1.0.1+wasi-0.2.4` |
| `wasite` | `0.1.0` |
| `wasm-bindgen` | `0.2.129` |
| `wasm-bindgen-futures` | `0.4.79` |
| `wasm-bindgen-macro` | `0.2.129` |
| `wasm-bindgen-macro-support` | `0.2.129` |
| `wasm-bindgen-shared` | `0.2.129` |
| `wasm-bindgen-test` | `0.3.79` |
| `wasm-bindgen-test-macro` | `0.3.79` |
| `wasm-bindgen-test-shared` | `0.2.129` |
| `wasm-streams` | `0.5.0` |
| `wasm_split_helpers` | `0.2.3` |
| `wasm_split_macros` | `0.2.2` |
| `web-sys` | `0.3.106` |
| `web-time` | `1.1.0` |
| `webpki-root-certs` | `1.0.11` |
| `webpki-roots` | `0.26.11` |
| `webpki-roots` | `1.0.11` |
| `whoami` | `1.6.1` |
| `winapi` | `0.3.9` |
| `winapi-i686-pc-windows-gnu` | `0.4.0` |
| `winapi-util` | `0.1.11` |
| `winapi-x86_64-pc-windows-gnu` | `0.4.0` |
| `windows-link` | `0.2.1` |
| `windows-sys` | `0.45.0` |
| `windows-sys` | `0.48.0` |
| `windows-sys` | `0.52.0` |
| `windows-sys` | `0.59.0` |
| `windows-sys` | `0.61.2` |
| `windows-targets` | `0.42.2` |
| `windows-targets` | `0.48.5` |
| `windows-targets` | `0.52.6` |
| `windows_aarch64_gnullvm` | `0.42.2` |
| `windows_aarch64_gnullvm` | `0.48.5` |
| `windows_aarch64_gnullvm` | `0.52.6` |
| `windows_aarch64_msvc` | `0.42.2` |
| `windows_aarch64_msvc` | `0.48.5` |
| `windows_aarch64_msvc` | `0.52.6` |
| `windows_i686_gnu` | `0.42.2` |
| `windows_i686_gnu` | `0.48.5` |
| `windows_i686_gnu` | `0.52.6` |
| `windows_i686_gnullvm` | `0.52.6` |
| `windows_i686_msvc` | `0.42.2` |
| `windows_i686_msvc` | `0.48.5` |
| `windows_i686_msvc` | `0.52.6` |
| `windows_x86_64_gnu` | `0.42.2` |
| `windows_x86_64_gnu` | `0.48.5` |
| `windows_x86_64_gnu` | `0.52.6` |
| `windows_x86_64_gnullvm` | `0.42.2` |
| `windows_x86_64_gnullvm` | `0.48.5` |
| `windows_x86_64_gnullvm` | `0.52.6` |
| `windows_x86_64_msvc` | `0.42.2` |
| `windows_x86_64_msvc` | `0.48.5` |
| `windows_x86_64_msvc` | `0.52.6` |
| `winnow` | `0.7.15` |
| `winnow` | `1.0.4` |
| `wit-bindgen` | `0.46.0` |
| `writeable` | `0.6.4` |
| `xxhash-rust` | `0.8.19` |
| `yansi` | `1.0.1` |
| `yoke` | `0.8.4` |
| `yoke-derive` | `0.8.4` |
| `zerocopy` | `0.8.63` |
| `zerocopy-derive` | `0.8.63` |
| `zerofrom` | `0.1.8` |
| `zerofrom-derive` | `0.1.8` |
| `zeroize` | `1.9.1` |
| `zerotrie` | `0.2.5` |
| `zerovec` | `0.11.9` |
| `zerovec-derive` | `0.11.7` |
| `zlib-rs` | `0.6.8` |
| `zmij` | `1.0.23` |
| `zstd` | `0.13.3` |
| `zstd-safe` | `7.3.0` |
| `zstd-sys` | `2.1.2+zstd.1.5.7` |
