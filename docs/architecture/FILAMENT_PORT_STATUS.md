# Filament/Webkernel panel port status

Source of truth for the port is `/home/yassine/Projects/Php/framework/__work/webkernel-src/y-dev-platform/platform/`.
Counts below were enumerated from each package's `src/**/*.php` and `resources/views/**/*.view.php` on
2026-10-27: Filament 279/67, schemas 122/2, tables 199/8, forms 152/3, actions 125/3, widgets 30/6,
notifications 26/2 (PHP source files/views). The full platform root contains 4,929 PHP files across all
packages, so these package slices are an inventory, not a claim that the full platform has been ported.
A copied asset bundle is not feature parity. Each row below tracks an independently usable Rust capability.

| Capability | Rust location | Current state | Still required for parity |
|---|---|---|---|
| Panel configuration/provider | `_crates/feluqa-panel` | Typed builder for branding, auth-flow flags, sidebar/topbar placement, widths, groups, and permission-filtered navigation. Core registers initial provider data; Numerimondes and the CLI render links from registered providers. | Render the remaining appearance options in the panel shell; auth pages and registration/reset/verification handlers; middleware ordering; tenant selection/registration; panel events, hooks, plugins, themes, SPA mode and global search. |
| Theme system and visual assets | `_crates/feluqa-panel/assets` | Selected compiled Filament/Webkernel CSS and browser runtime assets are bundled and served by Feluqa, with a small Feluqa adapter and light/dark switch. | **Filament theming is not fully imported.** Theme providers/configuration, theme compilation/customization, all theme assets/tokens and dark-mode behavior parity remain. Bundling a compiled CSS file is not the Filament theme API. |
| Panel shell and Blade-style views | `_crates/feluqa-panel/resources/views`, `_crates/feluqa-panel/assets` | Framework-owned `.view.rs` templates own the document and expose partial input-wrapper, section, shell, theme-switcher and Webkernel-style language-selector components. The shell includes local nav search, grouped navigation, icons, active route, mobile drawer, avatar/user menu and CSRF-protected sign out. Six language flags are bundled and served by Feluqa. | **The Filament component catalog is not fully imported.** The input wrapper lacks prefix/suffix actions, complete icon/loading/validation/disabled state; sections lack full collapse/persist/header/footer behavior; tables, schemas, notifications, actions, widgets, modals, navigation and pages remain partial. Search only filters sidebar links, not a server-backed global search. Browser captures are visual evidence, not parity. |
| Notifications | `_crates/feluqa-notifications` | Typed toast payload, status/duration/action validation, bounded mailbox, batch selection, camelCase JSON, escaped HTML renderer and shared browser dismissal/action client. | Session-bound persistent mailbox adapter; flush/pull middleware; database notifications, read/unread, pagination, broadcast delivery, server-side action execution, safe custom-view registry and end-to-end panel integration. |
| Schemas/forms | `_crates/feluqa-ui`, `_crates/feluqa-panel/resources/views/components/input` | Versioned closed SDUI tree and safe HTML renderer; basic resource fields render with Filament field-wrapper, input-wrapper, input/select/textarea and button classes. | The wrapper is only the first static slice of Filament's component; prefix/suffix actions and icons, loading targets, dynamic validity/disabled states, form component state, nested schema, validation, layout schemas (grid/fieldset/tabs/wizard/repeater), upload, model hydration and operation hooks remain. |
| Panels, resources, pages and clusters | `_crates/feluqa-panel`, `_crates/feluqa-ui` | Typed `.pages()` / `.resources()` registration, resource access checks, basic generated forms and escaped table markup. Numerimondes CRM uses the resource contract. | Full resource CRUD lifecycle, built-in operation pages, custom typed pages, optional resource clusters, widgets per page/resource, query adapters, pagination/search/sort/filters/bulk actions/column manager/summaries/empty states/exports/relation managers/record actions remain. Public websites are not yet first-class panel providers. |
| Actions/widgets/LiveView | `_crates/feluqa-panel`, `_crates/feluqa-live`, public alias `feluqa::liveview` | Live actions are signed, CSRF checked, permission checked, and replay protected over HTTP. The panel's health action completed in the browser-facing HTTP integration test. | This is not yet Livewire-style LiveView: there is no persistent component session, event transport, state diff/morph lifecycle, reconnect, or streaming. `axum-wire` is currently version 0.0.6; Shelly's Axum adapter is version 0.6.0 and its published history starts in May 2026. Neither has enough production history to make it Feluqa's core contract. Keep the signed Feluqa action contract and choose a transport behind it only after protocol/security and browser acceptance tests. Full action/group lifecycle, modal forms, confirmation, notifications, transactions, widgets/stats/charts and grid layout also remain. |
| CLI and app ownership | `products/feluqa-cli` | Scaffold compiles framework panel views/assets from crate roots rather than generating copies into the app. A generated application compiles with the Core panel and permission-filtered menu. | Feature generators and integration tests for every provider, resource/page/widget/action type; standalone published-crate packaging. |

## Port rule

Translate behavior and contracts into strict Rust; do not mechanically translate PHP runtime machinery, closures,
reflection, or Livewire. Rust APIs use typed builders, registered IDs, explicit state, static view compilation,
server-side authorization and serialized data-only schemas. Preserve visible behavior where the source supports it,
and document a deliberate API difference where the PHP behavior depends on dynamic runtime evaluation.

Each feature is complete only when its source behavior has a corresponding Rust contract, a framework-owned
`.view.rs`/component where applicable, browser behavior where applicable, integration into the Core panel, and
tests for both allowed and denied paths. A checklist row stays open until all of those are delivered.

## Browser-level visual check

`scripts/capture-system-panel.sh /tmp/feluqa-system-panel.png` runs the authenticated Numerimondes HTTP test,
captures its actual rendered `/system/connections` response, serves the framework assets, and makes Firefox
headless screenshots at desktop, dark and mobile sizes. The mobile image forces the drawer open in a capture-only
stylesheet; it proves the narrow layout can render, not that the browser toggle interaction passes. No pixel
comparison or complete browser interaction suite exists yet. See [panel visual QA](../testing/PANEL_VISUAL_QA.md).

## PHP runtime dependencies without a direct Rust equivalent

The source uses Laravel's service container, providers, event dispatcher, queues/database notification drivers,
Blade component discovery, Livewire request hydration and browser runtime, and framework asset compilation. Those
services do not exist in the Rust runtime. Feluqa ports their observable contracts with provider registration,
typed Rust handlers, compiled `.view.rs`, explicit SDUI state, and Rust-owned browser assets; behavior that depends
on PHP reflection, dynamic container resolution, Livewire hydration hooks, or Laravel queue workers remains a
deliberate implementation gap until its Rust contract and runtime are shipped.
