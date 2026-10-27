# Feluqa project layout

The monorepo has one source of truth for each concern. A generated web application follows this shape:

```text
my-app/
├── Cargo.toml                 # This application crate and its dependencies
├── feluqa.toml                # App identity, runtime profile and enabled modules
├── config/                    # Deployable environment/database settings
├── build.rs                   # Compiles views and embeds module migrations
├── resources/views/           # Shared app/site layouts, pages, components, partials
├── public/                    # Public document root and static assets
├── src/
│   ├── main.rs                # Composition root and process entry point
│   ├── config.rs              # Typed Serde config, validation and defaults
│   ├── routes/{mod,web,console}.rs
│   ├── app/                   # Application-wide MVC: controllers, models, services
│   └── modules/
│       ├── mod.rs             # Static module/provider composition
│       ├── system/            # Feluqa Core panel integration and owned views
│       └── crm/               # Domain code, provider, routes, migrations and owned views
│           ├── module.toml
│           ├── migrations/{sqlite,postgresql}/
│           ├── views/
│           ├── controllers.rs
│           ├── model.rs
│           ├── policies.rs
│           ├── resource.rs
│           ├── services.rs
│           └── seeders/
└── storage/                   # Mutable POSIX-owned runtime state; never source assets
```

## Ownership rules

- `src/modules/<id>/` is the single home for a business module. Its manifest, migrations, views, policies, resource declarations, services, controllers and seeders live together. Rust requires `src/` as its conventional crate source directory; `module.toml` and SQL files are still discovered by `build.rs` and embedded at compile time.
- `src/routes/` is the only route tree. `routes/web.rs` and `routes/console.rs` are compiled Rust files, so they belong below `src/`.
- Route declarations are owned by their feature: the public site exposes `app::routes`, while each panel/module exposes its own `routes` module (for example `modules/system/routes.rs` and `modules/crm/routes.rs`). `routes/web.rs` only assembles those routers and applies process-wide middleware, limits and static-file mounting. Adding a panel route must not require editing this composition file.
- `src/app/` contains application-specific MVC that is not owned by one domain module, such as the public website and cross-module composition. A CRM endpoint belongs to `src/modules/crm/controllers.rs`; a website page handler belongs to `src/app/controllers/site.rs`.
- Shared site layouts/components/pages remain in `resources/views/`. Module-owned panel views are next to their module under `src/modules/<id>/views/`. Cargo does not compile these as Rust source: `build.rs` explicitly feeds each root into Feluqa's `.view.rs` compiler, which emits Rust into Cargo's `OUT_DIR`.
- Unit tests that need private implementation details can stay beside Rust code. Cross-struct/application tests belong under the app's `tests/`; when a binary crate's internals are needed, keep the fixture under `tests/support/` and include it from `main.rs` as a test-only module. Cargo treats each top-level `tests/*.rs` file as a separate integration crate.
- `feluqa.toml` is the stable Feluqa application manifest. `config/` contains environment-specific operational values and secrets references. `src/config.rs` deserializes those files into validated Rust types. They are different layers, not competing config locations.
- `feluqa.toml` selects the Rust composition root with `app.service_provider = "src/service_provider.rs"`. `build.rs` validates that the path stays inside the app and sets a compile-time path; the app's `main.rs` includes that file under the crate's strict lint. The provider source then explicitly composes statically linked modules and panels. The manifest selects the entry file; Rust source remains the checked provider registry.
- `storage/` is mutable service data (SQLite, uploads, cache or local state), resolved from the app root/configuration and excluded from Git. Production should set a service-owned absolute path with restrictive POSIX permissions. It is not part of the Cargo package or public document root.
- The monorepo root owns workspace and toolchain configuration; each product/app owns its own Cargo manifest. `target/` is generated build output, never source.

## Providers and panel ownership

`feluqa::panel::PanelProvider` is the explicit contract for registering panel pages and module resources. `PanelCatalog::register_provider` adds a provider's declarations to the shared startup catalogue, where route collisions and invalid permissions fail before serving requests. Feluqa Core supplies the system panel provider; an application or module supplies business panel providers. A panel is therefore framework capability plus opt-in product configuration, not a hard-coded ERP feature.

`feluqa::module::ServiceProvider<C>` registers services into the host application's typed context. Module startup and shutdown remain explicit responsibilities of the separate `Module` lifecycle contract. This keeps app-owned wiring explicit and statically linked; it does not claim dynamic plugin loading. Numerimondes uses providers for Core/CRM module registration and Core/CRM/business panel catalog composition.

The `feluqa-panel` crate owns the shared panel registry, rendering contracts, and the browser assets used by all panel types. The `/system` provider and its framework resources live in `feluqa-system-panel`; Numerimondes imports that provider and owns only product-specific modules. `feluqa::web` serves the shared Live client and Filament-derived panel theme/runtime from the compiled binary, so generated apps do not maintain copied asset files. The original Webkernel Filament adaptation's built bundles and its upstream notice are retained in `feluqa-panel`; the Rust panel API remains a staged port and does not yet provide the full Filament resource/action/plugin/auth/tenancy feature set.

## Current migration note

The Numerimondes app has been moved to this layout. Its shared website views stay in `resources/views`; system/business/CRM views and the CRM manifest/SQL/controllers are in `src/modules/`. The Core session and CSRF helpers remain application infrastructure and are called by the CRM HTTP adapter.
