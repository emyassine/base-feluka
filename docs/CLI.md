# Feluqa command line

The CLI product lives under `products/feluqa-cli/` and builds the `feluqa` executable. The canonical behavior and security boundaries are specified in [CLI and runtime architecture](architecture/CLI_RUNTIME_SPEC.md).

The CLI detects the nearest valid `feluqa.toml` app before considering the monorepo. App commands require that context; the monorepo root permits explicit-target `migrate <app>` and `seed <app> <seeder-id>`. `feluqa new <name> [--profile web]` creates a separate project under `products/` when run from the monorepo, or under the current directory elsewhere.

## Implemented commands

| Command | Current behavior |
|---|---|
| `feluqa list` | Lists applications in the Feluqa workspace. |
| `feluqa dev` | Builds the app and starts its `dev` console command. Polls app Rust, `.view.rs`, config, module/migration files and local `_crates` sources. It compiles while the last server stays online, replaces it after a successful build, and keeps the old process on a compile failure. |
| `feluqa build` | Builds the app in release mode. |
| `feluqa check` / `feluqa test` | Runs Cargo against the detected application manifest. |
| `feluqa migrate` | Explicit app-level migrations; `feluqa migrate <app>` is available at the workspace root. |
| `feluqa seed <seeder-id>` | Runs one named seeder without applying migrations. |
| `feluqa seed <app> <seeder-id>` | Explicit app seeding from the workspace root. |
| `feluqa new <name> [--profile web]` | Creates a standalone web project with routes, controllers, compiled `.view.rs`, environment config, storage, dialect migration directories, Core `/system` setup/login/logout, users, roles, modules, connections, migrations and audit, plus ERP `/admin` panel routes. The migration panel shows status per module/connection and applies one selected pair using the connection's configured dialect. Development includes the signed Live ping and browser asset; staging/production keep the in-memory Live runtime disabled. It never overwrites an existing project. |
| `feluqa make migration <name> [--module <name>]` | Creates a module manifest when needed, then atomically reserves one SQL file per database declared by that module, with a timestamp and collision sequence. |
| `feluqa make seeder <name>` | Creates an idempotent seeder entry with a stable `<app>.<name>` ID and registers it for `feluqa seed <id>`. Seeders are separate from migrations. |
| `feluqa make model/controller/service <name>` | Each generator has its own command source file. Model, controller and service generators add a `pub mod ...;` declaration to the matching `src/app/**/mod.rs`; they never overwrite an existing source file. |
| `feluqa make controller <name> [--model <model>] [--connection <name>]` | Generates a small controller. With `--model`, it requires `#[tenant_key]` and `#[owner_key]` fields, then generates a permission-checked `show` action scoped to the authenticated tenant and user. The named pool defaults to `default`. Without a model it creates a simple controller shell. |
| `feluqa make resource <model> [--connection <name>]` | Generates paginated CRUD only when the model declares tenant and owner keys, then registers REST routes under `/admin/<plural-model>` in the scaffold's resource router. The router requires a valid Core session; handlers additionally check exact action permissions. Every SQL read/update/delete includes trusted tenant and owner IDs; both keys are omitted from writable attributes and serialized output. Writes require session-bound CSRF and write audit in the same transaction as the mutation. It also generates HTTP tests; `cargo test` verifies unauthenticated refusal, owner-scoped reads and writes, CSRF enforcement, and create/update/delete. Every returned model field except the primary `id` requires `business.<resource>.fields.<field>.read`; every submitted field requires `business.<resource>.fields.<field>.write`, in addition to the operation permission. Generated CRUD uses actor-owned records; broader record scopes remain an explicit module policy. |
| `feluqa make panel <name>` | Generates a strict Rust `Panel` declaration under `src/modules/` and registers it in the compiled panel catalogue. The scaffold serves registered pages through session and permission checks under `/admin/`. |
| `feluqa make module <name>` | Generates a module manifest and both database migration directories. |
| `feluqa make --help` / `feluqa help make` | Lists generator targets and what each one creates. |

`dev` and `production` are runtime environments, not project types. An app has a profile such as `web`. Run a source checkout command with:

```sh
cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- dev
```

The command words read as actions and targets. From a valid app root:

```sh
feluqa dev
feluqa make model Customer
feluqa make controller Customer
feluqa make controller Customer --model Customer
feluqa make controller Invoice --model Invoice --connection accounting
feluqa make resource Customer
feluqa make service Customer
feluqa make migration create_customers --module crm
feluqa make seeder demo_customers
feluqa migrate
feluqa seed numerimondes.demo_customers
```

Every built-in command has a file of its own. `products/feluqa-cli/src/commands/mod.rs` only detects context and delegates. `commands/make/mod.rs` resolves the target; each generator owns its parsing and file generation in its own file under `commands/make/`:

```text
commands/dev.rs
commands/new.rs
commands/migrate.rs
commands/seed.rs
commands/make/model.rs
commands/make/controller.rs
commands/make/resource.rs
commands/make/service.rs
commands/make/panel.rs
commands/make/seeder.rs
commands/make/module.rs
commands/make/migration.rs
```

The generated-resource test uses SQLite by default. To run its same HTTP checks on PostgreSQL, point `FELUQA_TEST_POSTGRES_URL` at a disposable PostgreSQL database and run:

```sh
FELUQA_TEST_POSTGRES_URL='postgres://user:password@127.0.0.1:5432/feluqa_test' \
  cargo test --manifest-path _crates/Cargo.toml -p feluqa-cli --test generated_resource
```

The generated tests use one temporary schema per case and drop those schemas after success.

`feluqa make panel Reports` creates `src/modules/reports/{mod.rs,panel.rs}`, implements `PanelProvider`, and registers it with the app's `AppPanelProvider` in `src/modules/mod.rs`. `PanelCatalog::register_provider` validates all panel/resource routes together during startup. `feluqa make migration create_customers --module crm` writes dialect variants below `src/modules/crm/migrations/`, beside the module manifest and Rust code.

The command form is `feluqa make <thing> <name>`: for example, `feluqa make model User` or `feluqa make migration create_users`. Each generator has one source file in `commands/make/` (`model.rs`, `migration.rs`, and so on); `commands/make/mod.rs` only dispatches to it. Rust registers each handler at compile time. Run `feluqa make --help` to list generators or `feluqa make model --help` to see one generator’s usage.

Create a site from outside an app:

```sh
feluqa new "Customer Portal" --profile web
cd customer-portal
feluqa dev
```

The scaffold uses local workspace crates when generated inside this monorepo. Outside it, it references Feluqa `0.2.0` from the proprietary registry and includes the configured private index URL. Run `cargo login --registry feluqa` with your account credential; Cargo stores credentials in the user's credential store, never in the generated project. **The private index currently has `feluqa` only through `0.1.1`, so an externally generated project cannot compile until the current framework crates are released there.** Development defaults to local SQLite. Staging and production read `FELUQA_DATABASE_URL`, so deploy credentials and PostgreSQL URLs stay outside source control.

The starter's development profile enables the signed ping action. Set `FELUQA_LIVE_SIGNING_KEY` to a random value of at least 32 bytes for a stable local key; if it is unset, the app creates an ephemeral key for that process. The in-memory replay guard is only created in development. The generated staging and production profiles disable Live; requests to its endpoints return 404.

Handlers live in separate files under `products/feluqa-cli/src/commands/`; generator handlers are in `commands/make/`. Each command owns its argument validation and action. `commands/app.rs` builds Cargo invocations with the subcommand first (`cargo build --manifest-path …`), so app commands use valid Cargo argument ordering. The context dispatcher checks whether a command is allowed in the current app/workspace/global context, then calls that command's file. `commands/make/mod.rs` resolves `make <target>` and delegates to the matching generator file.

Tempest's PHP console discovers attributed command methods automatically. Feluqa uses an explicit Rust module registry instead: each handler is compiled and reviewed as a normal Rust module, and the dispatcher lists its context boundary. This keeps the same small-command-file organization without runtime reflection or a hidden source scanner. Generator commands use one file each and the `feluqa make <thing> <name>` syntax (`feluqa make migration create_users`).

The web scaffold installs `DatabasePools` as the Axum router state. Model-backed controllers use that shared state and select a named connection explicitly; the generated example uses the required `default` connection.

Numerimondes keeps its statically compiled module selection in `[modules].enabled` in `feluqa.toml`. Only enabled modules receive automatic migrations and seed commands; their protected routes return `404` when disabled. `/system/modules` shows compiled modules as started or disabled. This configuration gate does not dynamically install code or replace a running process.

## Code shape

Web-profile application files start with `#![no_implicit_prelude]` and explicitly import the app-facing surface. This is the Rust spelling of the Laravel-shaped example: a controller action is a function item, and the route builder owns registrations. Rust has no `UserController::class` runtime reflection, and `Route` is not a static global facade.

```rust
#![no_implicit_prelude]

use feluqa::prelude::*;
use feluqa::database::eloquent::Model;

#[derive(Model, Debug, Clone, Deserialize, Serialize)]
#[table_name = "users"]
pub struct User {
    #[primary_key]
    pub id: i64,
    #[serde(skip)]
    #[tenant_key]
    pub tenant_id: i64,
    #[serde(skip)]
    #[owner_key]
    pub owner_user_id: i64,
    pub name: String,
}
```

`#[tenant_key]` and `#[owner_key]` mark trusted scope columns. The derive creates scoped page, find, create, update and delete methods and omits both IDs from `<Model>Attributes`. Generic unscoped helpers refuse models with a tenant key. The SQL migration must declare both columns as non-null. Generated panel CRUD defaults to the current owner's records; broader access must be implemented explicitly by the module's policy/service. `#[serde(skip)]` keeps both IDs out of JSON responses. Feluqa is exposed through one `feluqa::...` namespace; there is no `feluqa_view` crate.

The derive supplies `find`, `find_or_fail`, bounded `page`, `create`, `update`, `update_by_id`, `delete`, `create_from` and `update_from`, plus the `*_in_tenant` methods for marked models. For tenant-marked models the generic helpers return an error; callers must use the scoped variants. `<Model>Attributes` omits the primary, tenant and owner keys and rejects unknown JSON fields. Operations receive their named database connection explicitly. Generate an authorized tenant/owner-scoped lookup with `feluqa make controller User --model User`; use `feluqa make resource User` for paginated tenant/owner-scoped CRUD:

```rust
#![no_implicit_prelude]

use feluqa::prelude::*;
use feluqa::web;
use feluqa::core::service::SessionIdentity;
use crate::app::models::user::User;

pub struct UserController;

impl UserController {
    pub async fn show(
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
    ) -> Result<JsonResponse<User>, StatusCode> {
        web::authorize(&principal, "business.user.read")?;
        let database = databases
            .default_connection()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        User::find_or_fail_in_tenant(
            database,
            id,
            identity.tenant_id,
            identity.user_id,
        )
            .await
            .map(response::json)
            .map_err(web::database_error)
    }
}
```

The request handler stays short while the framework handles typed extraction and database errors. Database choice remains visible at the call site, so modules can use named connections without process-global state.

Routes use the same small, explicit builder:

```rust
#![no_implicit_prelude]

use feluqa::prelude::*;
use feluqa::web::RouteError;
use feluqa::database::DatabasePools;
use feluqa::core::service::CoreStore;
use crate::axum::Router;
use crate::app::controllers::UserController;
use crate::std::clone::Clone;

pub fn register_routes(core: CoreStore) -> Result<Router<DatabasePools>, RouteError> {
    let routes = Route::<DatabasePools>::new()
        .redirect("/old-path", "/new-path", StatusCode::MOVED_PERMANENTLY)
        .view("/welcome", String::from("<h1>Bienvenue</h1>"))
        .group("/admin", |routes| {
            Ok(routes
                .get("/users/{id}", UserController::show)
                .name("admin.users.show")?
                .authenticated(core.clone()))
        })?;
    Ok(routes.finish())
}
```

`Routes::authenticated` validates the Core session cookie and injects the trusted `Principal`; the controller then checks its exact permission. Put protected routes inside the authenticated group. Wire generated CRUD actions explicitly in `routes/web.rs`:

```rust
.group("/api/users", |routes| {
    Ok(routes
        .get("/", UserController::index)
        .get("/{id}", UserController::show)
        .post("/", UserController::store)
        .put("/{id}", UserController::update)
        .delete("/{id}", UserController::destroy)
        .authenticated(core.clone()))
})?
```

Generated writes call `web::verify_csrf`, which checks the session cookie, the `feluqa_csrf` cookie, the `x-csrf-token` request header, and the persisted Core token. A browser client should send the readable CSRF cookie back in that header. An action remains an ordinary async Rust function, and the named-database handle comes from application state. A `.view.rs` is compiled into a Rust render function; route code calls that generated function and passes its typed view model. SQL migrations are dialect-specific `.sql` files, not the closure-based `Schema::create` API shown in the initial sketch.

Routes use the Feluqa `Route` builder; controllers call services, while SQL stays behind models/services. Registration is explicit Rust module wiring, which keeps handlers discoverable to the compiler and debugger. Rust routes register function items such as `UserController::show`; named routes and route groups are implemented. Migrations use compiled, dialect-specific SQL files, which keeps SQLite and PostgreSQL variants explicit.

## Compiled module migrations

Each module directory under `src/modules/` has a `module.toml` declaration. The app build script calls `feluqa::database::build_support::generate_migration_registry`, which validates the manifest, checks that every declared database has the same ordered migration IDs, and generates an embedded registry in `OUT_DIR`. Adding a migration does not require editing a Rust matrix by hand:

```text
src/modules/crm/
├── module.toml
└── migrations/
    ├── sqlite/0001_create_customers.sql
    └── postgresql/0001_create_customers.sql
```

`module.toml` peut déclarer les pools nommés consommés, par exemple `database_connections = ["default", "analytics"]`. Le runner prévalide l'existence et le dialecte de tous ces pools avant de commencer les migrations du module. Les modules générés ciblent `default`.

The runtime selects the module's compiled SQL variant from each declared connection's dialect. `feluqa make migration` creates these SQL files and the module declaration; the build rejects a missing dialect variant or mismatched migration ID. The generated `build.rs` calls this scanner. A fresh local-workspace scaffold has been compiled and its `migrate` command applied successfully; standalone compilation against the private registry still needs the current framework release published there.

## Remaining CLI work

- Publish the current proprietary crate set to Kellnr after release authorization; verify `feluqa new` and the generated app against those artifacts from a clean user environment; then document CLI installation/update outside a checkout.
- The generated starter includes Core setup/login/logout and user/role/tenant/module/connection/migration/audit pages. Its `/system/users` and `/system/roles` tables and create/update forms use the shared resources and SDUI renderer; `/system/tenants` lists tenants and creates a tenant plus its first administrator transactionally, with Core handlers enforcing role delegation and revoking sessions after assignment. Dynamic module install/disable and updating configuration from the panel remain unavailable; modules and database connections come from the compiled app configuration.
- Add configurable global record scopes and bind generated resource descriptors to module-owned policy declarations; generated CRUD currently uses actor-owned records and exact action/field permission names.
- Connect panel resources to compiled views and module lifecycle hooks; registered panel pages currently render their validated SDUI text schema.
- Define and test production `migrate <app>` / `seed <app> <id>` artifact selection and operator-safe output.
- Add deployment/restore workflows and exercise the watcher with a browser editing a compiled view and recovering from a failed build.

The framework performance targets are not benchmark claims. See the specification for measurement boundaries and current limits.
