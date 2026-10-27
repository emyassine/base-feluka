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
| Panel shell and Blade-style views | `_crates/feluqa-panel/resources/views` | Framework-owned document/simple-document/shell/assets components own the document boilerplate; Core and Numerimondes panel page views contain no `doctype`, `html`, or `body`. Core navigation is provider- and permission-driven. | Match upstream header/sidebar/mobile behavior and API exactly; port render hooks, user menu, theme switch, collapsible states and all provider appearance settings. |
| Notifications | `_crates/feluqa-notifications` | Typed toast payload, status/duration/action validation, bounded mailbox, batch selection, camelCase JSON, escaped HTML renderer and shared browser dismissal/action client. | Session-bound persistent mailbox adapter; flush/pull middleware; database notifications, read/unread, pagination, broadcast delivery, server-side action execution, safe custom-view registry and end-to-end panel integration. |
| Schemas/forms | `_crates/feluqa-ui` | Versioned closed SDUI tree and safe HTML renderer; resource fields support basic text/email/password/number/select/textarea inputs. | Port schema component configuration/state lifecycle, nested schema, validation rules, visibility/disabled/required conditions, grid/fieldset/tabs/wizard/repeater/file upload, actions, model hydration and operation hooks. |
| Tables/resources | `_crates/feluqa-panel`, `_crates/feluqa-ui` | Resource descriptors, per-operation/field/record access, safe basic tables and generated CRUD forms; Numerimondes CRM uses this path. | Query adapters and pagination/search/sort/filters/bulk actions/columns/column manager/summaries/empty states/export, relation managers, record actions and resource page lifecycle. |
| Actions/widgets | `_crates/feluqa-panel`, `_crates/feluqa-live` | Live actions are signed and permission checked; SDUI supports safe server-action nodes. | Full action/group lifecycle, modal forms, confirmation, notifications, transactions, mounting/authorization hooks, widgets/stats/charts and grid layout. |
| CLI and app ownership | `products/feluqa-cli` | Scaffold compiles framework panel views/assets from crate roots rather than generating copies into the app. A generated application compiles with the Core panel and permission-filtered menu. | Feature generators and integration tests for every provider, resource/page/widget/action type; standalone published-crate packaging. |

## Port rule

Translate behavior and contracts into strict Rust; do not mechanically translate PHP runtime machinery, closures,
reflection, or Livewire. Rust APIs use typed builders, registered IDs, explicit state, static view compilation,
server-side authorization and serialized data-only schemas. Preserve visible behavior where the source supports it,
and document a deliberate API difference where the PHP behavior depends on dynamic runtime evaluation.

Each feature is complete only when its source behavior has a corresponding Rust contract, a framework-owned
`.view.rs`/component where applicable, browser behavior where applicable, integration into the Core panel, and
tests for both allowed and denied paths. A checklist row stays open until all of those are delivered.

## PHP runtime dependencies without a direct Rust equivalent

The source uses Laravel's service container, providers, event dispatcher, queues/database notification drivers,
Blade component discovery, Livewire request hydration and browser runtime, and framework asset compilation. Those
services do not exist in the Rust runtime. Feluqa ports their observable contracts with provider registration,
typed Rust handlers, compiled `.view.rs`, explicit SDUI state, and Rust-owned browser assets; behavior that depends
on PHP reflection, dynamic container resolution, Livewire hydration hooks, or Laravel queue workers remains a
deliberate implementation gap until its Rust contract and runtime are shipped.
