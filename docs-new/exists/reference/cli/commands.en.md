# Feluqa command line

The CLI product lives under `products/feluqa-cli/` and builds the `feluqa`
executable. This page is the canonical command reference. Module source layout,
resource APIs and data conventions are covered by the corresponding
[developer guides](../../for-developers/index.en.md).

## Context detection

The CLI searches the current directory and its ancestors for a valid app
manifest before considering a Feluqa workspace. A valid app has a readable
`feluqa.toml`, a Cargo package manifest and an application entrypoint. App
context takes precedence, including when the app is a workspace member.

| Context | Available commands |
|---|---|
| Valid app root | App-scoped `dev`, `build`, `check`, `test`, `migrate`, `seed`, `make`; global `help`, `--version`, `new`. `feluqa dev` needs no app name or manifest path. |
| Feluqa workspace root | Global `help`, `--version`, `new`, `list`; explicit-target `migrate <app>` and `seed <app> <seeder-id>`, resolved only within that workspace. |
| Unrelated directory | Global `help`, `--version`, `new`. App commands fail with a context error before invoking Cargo or mutating files. |

The CLI does not use the installed binary's build path to find an app and does
not scan workspaces after detecting an app. `update` is reserved for a future
distribution channel and is not implemented. An explicit app target is
accepted only at the workspace root; arbitrary filesystem paths are rejected.

## Commands

| Command | Behavior |
|---|---|
| `feluqa new <name> [--profile web]` | Generates a web application. From the monorepo root it creates the project under `products/`; elsewhere it creates it in the current directory. Existing paths are never overwritten. |
| `feluqa list` | Lists applications found from the workspace root. |
| `feluqa dev` | Builds and starts the app's development console command. Polls Rust, `.view.rs`, configuration, module/migration inputs and local `_crates` sources. It builds while the previous server remains available, replaces it after success and keeps it after a failed build. |
| `feluqa build` | Builds the app in release mode without starting it. |
| `feluqa check` / `feluqa test` | Runs Cargo against the detected app manifest. |
| `feluqa migrate` | Applies the app's registered migrations for its configured profile and connections. At workspace root, `feluqa migrate <app>` selects an app in that workspace. |
| `feluqa seed <id>` | Executes one explicitly registered seeder by stable ID. It does not run migrations. Workspace form: `feluqa seed <app> <id>`. |
| `feluqa make <thing> <name>` | Dispatches to the generator for `migration`, `seeder`, `model`, `controller`, `resource`, `service`, `panel` or `module`. |
| `feluqa help` / `feluqa --version` | Shows help or the executable version in any context. |

`dev` and `production` are deployment environments, not project types. A new
project selects a runtime profile such as `web`.

## Generators

| Generator | Behavior |
|---|---|
| `make migration <name> [--module <id>]` | Creates dialect SQL variants and the module declaration when needed. It atomically reserves an ordered timestamped prefix; a collision receives a distinct sequence rather than reusing an ID. |
| `make seeder <name>` | Creates a separately registered seeder with a stable `<app>.<name>` ID. Seeders are not stored or invoked as migrations. |
| `make model <name>` | Generates a model in the app's source structure and adds its Rust module declaration without overwriting existing files. |
| `make controller <name> [--model <model>] [--connection <name>]` | Generates a controller shell or a tenant/owner-scoped `show` action when the model declares both scope keys. `default` is the default named pool. |
| `make resource <model> [--connection <name>]` | Generates paginated tenant/owner-scoped CRUD, route registration and HTTP tests. The model must declare tenant and owner keys. Operation, field and scope checks remain server-side. |
| `make service <name>` | Generates a service source file and module declaration. |
| `make panel <name>` | Generates a strict Rust `PanelProvider`, registers it in the app catalogue and exposes pages behind session/permission checks. |
| `make module <name>` | Generates a module manifest and dialect migration directories. |

Each built-in command and each generator has its own Rust source file. The
dispatcher only checks context and forwards arguments; it does not discover
commands through runtime reflection. Use `feluqa make --help` or
`feluqa make <thing> --help` for generator options.

## Run from a source checkout

From a valid app root, run the CLI product through the workspace manifest:

```sh
cargo run --manifest-path ../../_crates/Cargo.toml -p feluqa-cli -- dev
```

The relative manifest path assumes the app is directly under `products/`.
For other layouts, adjust it or invoke an installed `feluqa` binary. A new
project is scaffolded with Core setup/authentication and administration pages,
compiled views, configuration profiles, storage, and declared SQL dialect
directories. The generated project compiles against local workspace crates
when created in this monorepo.

`feluqa.toml` selects the statically compiled Rust service provider and app
profile. Typed Serde configuration rejects unknown fields. `FELUQA_ENV`
selects staging or production overlays, and database credentials can be
provided through environment-backed URLs. The secure-cookie override is
`FELUQA_SECURE_COOKIES`; secrets do not belong in committed configuration.
The app profile (for example `web`) is independent of the deployment
environment (development, staging or production).

The general `FELUQA__SECTION__KEY` override convention, a shared `app.toml`,
a dedicated development overlay and an external secret-manager adapter are
not implemented. Do not assume arbitrary environment variables map to config
fields.

Outside the checkout, the scaffold references Feluqa `0.2.0` in the private
registry. The current Kellnr index exposes `feluqa` only through `0.1.1`, so
an external scaffold cannot compile until the current crate set is released.
Cargo credentials belong in the user's credential store, never in a project.
SQLite is the development default; staging/production database URLs come from
environment variables. See the [data and migration guide](../../for-developers/data-and-migrations.en.md).

The generated starter enables the signed Live ping only in development. Its
in-memory replay guard is disabled in staging/production; requests to those
Live endpoints return 404. Set `FELUQA_LIVE_SIGNING_KEY` to a random value of
at least 32 bytes for a stable local development key.

## CLI verification and remaining work

The scaffold test compiles an isolated generated project in the workspace and
exercises generated-resource HTTP behavior. Optional PostgreSQL coverage uses
`FELUQA_TEST_POSTGRES_URL` and a disposable database:

```sh
FELUQA_TEST_POSTGRES_URL='postgres://user:password@127.0.0.1:5432/feluqa_test' \
  cargo test --manifest-path _crates/Cargo.toml -p feluqa-cli --test generated_resource
```

Process-level watcher coverage is present, but browser editing/recovery still
needs acceptance. Standalone generation/build outside the checkout, private
registry release, app-targeted production migration/seed operations and
deployment/restore qualification remain open. These are not implied by a
successful local scaffold build.
