# Webkernel view compatibility inventory

Snapshot inspected on 2026-10-27 from `/home/yassine/Projects/Php/framework/__work`.
The scan included first-party `resources/views/**/*.view.php` sources under
`webkernel/` and `webkernel-src/`, excluding `internal/` and `vendor/`: 140 files.
Counts below are lexical occurrences, so they may include comments and should be
read as a prioritization signal, not as an AST count.

The app-owned Webkernel site has three view sources:

- `webkernel/app/resources/views/welcome.view.php` — site, documentation browser,
  component gallery, locale navigation, and extensive page-specific CSS.
- `webkernel/app/resources/views/components/assets.view.php` — Vite asset
  manifest iteration and `@once` inclusion.
- `webkernel/app/resources/views/errors/main.view.php` — error pages, loops,
  conditional content, inline CSS, and a Rust-portable presentation block.

The checkout also contains 137 package-owned view sources under `webkernel-src`.
Those demonstrate the broader component and Liveview syntax, but cannot be ported
by copying PHP expressions into Feluqa. Numerimondes currently has 15 compiled
`.view.rs` files and is the Feluqa consumer used for compiler conformance.

## Observed syntax and current treatment

| Webkernel syntax | Lexical count | Feluqa treatment |
|---|---:|---|
| `{{ expression }}` |  — | Escaped Rust expression. Dynamic URL attributes now require `SafeUrl`; ordinary text and approved attributes use HTML escaping. |
| `@if`, `@elseif`, `@else`, `@endif` | 643 / 38 / 79 / 643 | Supported with Rust expressions. Inline use in an HTML attribute is compiled and covered by a fixture. |
| `@foreach`, `@endforeach` | 120 / 119 | Supported after rewriting PHP `as`/`$variable` expressions to Rust `pattern in iterable`. |
| `@php`, `@endphp` | 189 / 188 | Port manually to trusted `@rs` / `@endrs`; PHP statements, helpers, arrays, and closures need Rust equivalents. |
| `@include` | 26 | Static Rust-view include with explicitly named parameters; PHP view names and implicit parent-variable capture are not compatible. |
| `<x-…>` components and dynamic `:prop` values | present in source | Supported only after registration in the Rust component catalogue and matching typed props/slots. PHP component discovery and PHP expressions are not carried over. |
| `@markdown` / `@endmarkdown` | 49 / 49 | Not implemented. Convert content to a separately sanitized Markdown service/output type before rendering. |
| `@js` | 118 | Not implemented. Use a dedicated JSON-for-script serializer; HTML escaping is not a JavaScript encoder. |
| `@class`, `@style` | 52 / 3 | Not implemented. Build class strings in Rust; dynamic CSS remains prohibited until a dedicated policy exists. |
| `@once` / `@endonce` | 4 / 4 | Not implemented. Prefer explicit layout/component composition or add a compile-time scoped deduplication contract. |
| `@platformStyles`, `@platformScripts`, `@assets` | 7 combined | Not implemented. The app must provide a typed asset-manifest service/component. |
| `@forelse` / `@empty` / `@endforelse` | 2 / 2 / 2 | Not implemented. Use `@if` plus `@foreach` or add a loop contract that does not consume iterators. |
| `@auth`, `@guest`, `@can` | 1 / 2 / 1 | Not implemented in templates. Pass already-authorized presentation state; server handlers remain the authorization boundary. |
| `@liveview` | 10 | Not implemented as a view directive. Feluqa Live uses typed, named server actions and signed snapshots with CSRF/session checks. |
| `@stack` | 2 | Not implemented. Use explicit layout sections until a deterministic asset/slot stack contract exists. |
| CSS `@media`, `@font-face`, `@keyframes` | present in source | Ordinary CSS text, not template directives; preserve as text. |

`@php` blocks in the site include application navigation and documentation
resolution, locale/config reads, asset URL closures, and component-gallery data
loading. These belong in Rust services/controllers, with typed view models passed
to templates. Renaming `@php` to `@rs` without porting the PHP is not compatibility.

## Compiler evidence added

The `feluqa-view` compiler now exposes `SafeUrl::new` and `write_url`. URL-bearing
attributes (`href`, `src`, `action`, `formaction`, `cite`, `poster`) compile only
when the expression has the `SafeUrl` type. The constructor accepts local path or
fragment/query references and `http`, `https`, `mailto`, and `tel` URLs; it rejects
protocol-relative URLs, unsupported schemes, user-info authorities, whitespace,
control bytes, and backslashes. The URL is then HTML-escaped by the renderer.

An integration fixture compiles Webkernel-shaped inline conditional navigation,
escaped labels, and dynamic `href` values in debug and release mode. It also checks
that raw strings and protocol-relative URLs are refused and that a plain `&str`
cannot be interpolated into `href`.

## Next porting work

1. Port the Webkernel error view's Rust-independent HTML/CSS shell as a compiled
   Feluqa view and compare its rendered output at representative widths.
2. Add a typed asset manifest component corresponding to `components/assets.view.php`.
3. Move the welcome site's locale, navigation, docs lookup, and asset URL logic
   into Rust services, then port the HTML view in smaller compiled components.
4. Add an explicit sanitized Markdown type and script-safe JSON type only when a
   real first-party view conversion needs each capability.
5. Keep package-owned Webkernel component views as behavior references; reproduce
   the needed accessible components through Feluqa's SDUI/component contracts.
