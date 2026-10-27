# Product intent: Feluqa platform and installable modules

## Platform model

Feluqa is a proprietary server platform built by NUMERIMONDES. The operator
installs Feluqa on a server. Feluqa provides the runtime, the built-in System
panel, shared services, security/ACL, panel infrastructure, and the APIs used by
modules.

A developer builds an installable **Feluqa module** against that platform.
Examples include an HRM module, an inventory module, or the Numerimondes
platform module. A module is not another Feluqa server and must not copy or
reimplement Feluqa's System panel or shared panel framework.

From the System panel, an authorized operator selects the domain on the
Feluqa installation, installs/configures the module for that domain, and uses
only the capabilities allowed by the applicable license and permissions. The
module declares its capabilities and registers them with Feluqa. Feluqa owns
the panel instance infrastructure and applies authorization at the server.

The intended module lifecycle includes package integrity, compatibility,
license and permission checks; per-domain configuration and activation;
migrations; upgrade/recovery; disable and uninstall with explicit data
retention. The current implementation statically composes modules into a
compiled product. Dynamic installation and the complete lifecycle are still
future work; see [the delivery plan](../_todo/enterprise-delivery.en.md).

## Product and source shapes

A deliverable can have either source shape:

1. **One installable module.** A focused module such as HRM owns its resources,
   pages, features, policies, migrations, views, and custom routes.
2. **A composed platform module.** A larger module such as Numerimondes may
   organize several business domains under `business/` or any other folder.
   The folder is a developer choice, not a Feluqa runtime rule. Packaging may
   bundle the domains together or expose child business modules separately.

Avoid generic `src/app/` and `src/modules/` buckets by default because they
hide ownership. They remain allowed when a developer has a concrete reason;
they are not recommended as the starting scaffold. Numerimondes currently
retains those directories as transitional implementation structure.

## Terminology

- **Feluqa platform:** the installed server host and built-in System panel.
- **Feluqa module:** an installable platform capability/package, for example
  HRM or Numerimondes.
- **Business module:** a business domain inside a composed source, such as CRM
  or finance under `business/`; its independent installation is a packaging
  decision.
- **Feature:** a narrower function within a module, such as contacts or a CRM
  pipeline. A feature is not independently installable by default.
- **Module Rust:** only the language namespace declared by Rust `mod` or
  `pub mod`. Use this full term to distinguish it from a Feluqa module.
- **Panel:** Feluqa's shared UI infrastructure instantiated/configured for a
  domain or module. The System panel is built into Feluqa. Modules register
  their resources/pages with Feluqa panel instances; they do not ship another
  panel framework.

## Panel and developer experience

A module normally declares a panel provider and registers resources with the
Feluqa panel instance. Resources receive standard CRUD pages, ACL, schemas,
forms, tables, clusters/navigation and framework components by convention.
Resources can be clustered or unclustered; pages can include custom
`.view.rs` fragments and widgets. Special routes may return a view or
controller response and may be public or protected by explicit middleware and
server-side policies.

The intended developer experience is “less is more”: declare the business
resource and policy; let Feluqa wire CRUD, navigation, layout and authorization.
Custom controllers/services/routes are for workflows outside those defaults.
The panel system is a Feluqa capability; a module registers with it.

## ERP data model

Modules within a Numerimondes installation share the application's `default`
database unless a concrete integration calls for a named connection. Each
module owns its tables and migrations, but does not receive a separate
database by default. Dialect folders such as `migrations/sqlite` and
`migrations/postgresql` provide SQL portability, not per-module databases.
Seeders remain separate from migrations.

## Filament parity is still missing

The desired panel is a faithful Rust port of Webkernel/Filament behavior and
developer APIs: theme providers and light/dark themes, shared components,
search/input wrappers/sections, schemas/forms/tables/actions/notifications,
navigation, resource CRUD pages, widgets, page composition and mobile shell.
The `.view.php` sources are adapted to `.view.rs` with strict Rust compilation.

The current repository only has selected Filament-derived CSS/JS bundles and
partial Rust components/behavior. The Filament theme system and full component
catalog are **not imported yet**. Do not describe the panel as a clone or claim
parity from matching CSS classes or screenshots. See [current port status](../exists/reference/panels/filament-port-status.en.md)
and [remaining parity work](../_todo/enterprise-delivery.en.md).

## Related intent and architecture

- [Platform/module layouts](architecture/platform-module-layout.en.md)
- [Web profile](architecture/web-profile.en.md)
- [Accepted platform decisions](architecture/platform-vision-decisions.en.md)
- [Open decisions](../_todo/open-decisions.en.md)
