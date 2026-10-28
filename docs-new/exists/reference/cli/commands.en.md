# Feluqa command line

The CLI product lives under `products/feluqa-cli/` and builds the `feluqa`
executable. This page is the canonical command reference. Module source layout,
resource APIs and data conventions are covered by the corresponding
[developer guides](../../for-developers/index.en.md).

The product builds two executables: `feluqa` for platform and application
work, and `nadim` for personal commands. Each command is visible only to the
profile whose configured `commands_directory` contains its source file. The
command attribute contains command metadata only; file placement controls
profile membership. Both executables display the same Feluqa release version
from the workspace package version.
Feluqa filters commands by detected location and explains the active command
scope in its help. In interactive terminals, it offers command choices and
prompts for missing required generator names; piped and scripted runs receive
usage errors instead of blocking prompts. Running `feluqa` without arguments
prints help and never waits for input. Start the chooser explicitly with
`feluqa -i`, `feluqa -int`, `feluqa --interactive` or `feluqa --interactif`.
`help` remains non-interactive even when a terminal is attached.

The command grammar, metadata, discovery, context filtering, aliases, colored
help and interactive prompt behavior are described in the
[console design](../../../_todo/console/console.en.md).

Interactive choices move with the arrow keys and confirm with Enter. Multi-
selection uses Space to toggle options. Escape, `q` or Ctrl+D cancels; Ctrl+C
and SIGINT return status 130, while SIGTERM returns status 143. Both signals
restore terminal mode before exiting the prompt.
Console status messages use background-colored `INFO`, `SUCCESS`, `WARNING` and
`ERROR` badges with a blank line before and after; set `NO_COLOR` to disable
ANSI styling. Help descriptions and its usage footer are muted. Command help
uses the current terminal width, including after a terminal resize. The active
profile is shown in generated help. A product host may provide a context
notice; Console does not define product-specific location messages, and a
profile can opt out.

## Context detection

The CLI searches the current directory and its ancestors for a valid app
manifest before considering a Feluqa workspace. A valid app has a readable
`feluqa.toml`, a Cargo package manifest and an application entrypoint. App
context takes precedence, including when the app is a workspace member.

| Context | Available commands |
|---|---|
| Valid app root | App-scoped `dev`, `build`, `check`, `test`, `migrate`, `seed`, `make`; global `help`, `--version`, `new`. `feluqa dev` needs no app name or manifest path. |
| Feluqa workspace root | Workspace commands such as `list`, `dev <app>`, `migrate <app>` and `seed <app> <seeder-id>`. `dev` also accepts `--app=<app>` and prompts for an app when no target is given. App-only commands and generators are hidden until an application is detected. |
| Unrelated directory | Global `help`, `--version`, `new`. App commands fail with a context error before invoking Cargo or mutating files. |

IDE support commands are planned as a context-independent global namespace.
They will work from all three contexts above and will not require app or
workspace detection. They are not implemented yet; see the
[IDE command plan](../../../_todo/editor/ide-support-commands.en.md) for the
proposed `feluqa support:ide view-highlight --ide=<name>` interface and
editor-neutral Tree-sitter target.

The CLI does not use the installed binary's build path to find an app and does
not scan workspaces after detecting an app. `update cli` checks or updates a
Cargo-managed CLI installation; `update platform` is currently unavailable.
See the [update and release policy](../../../knowledge/policy/updates.en.md)
for distribution and versioned platform installation requirements. An explicit
app target is accepted only at the workspace root; arbitrary filesystem paths
are rejected.

## Commands

| Command | Behavior |
|---|---|
| `feluqa new <name> [--profile web]` | Shows the default parent directory and why it was selected, then lets interactive users choose another location and confirm before writing files. The monorepo `products/` default uses local workspace crates; other locations use the configured private registry. Existing paths are never overwritten. After generation, it asks whether to start `feluqa dev`; scripts use the default location and print the next command. |
| `feluqa list` | Lists applications found from the workspace root. |
| `feluqa dev` | Builds and starts the app's development console command. Polls Rust, `.view.rs`, configuration, module/migration inputs and local `_crates` sources. It builds while the previous server remains available, replaces it after success and keeps it after a failed build. |
| `feluqa build` | Builds the app in release mode without starting it. |
| `feluqa check` / `feluqa test` | Runs Cargo against the detected app manifest. |
| `feluqa migrate` | Applies the app's registered migrations for its configured profile and connections. At workspace root, `feluqa migrate <app>` selects an app in that workspace. |
| `feluqa seed <id>` | Executes one explicitly registered seeder by stable ID. It does not run migrations. Workspace form: `feluqa seed <app> <id>`. |
| `feluqa make <thing> <name>` | Dispatches to the generator for `migration`, `seeder`, `model`, `controller`, `resource`, `service`, `panel` or `module`. |
| `feluqa update cli [--check]` | Checks the private registry for `feluqa-cli`; without `--check`, asks Cargo to update the current Cargo-managed installation. The package must be published first. |
| `feluqa update platform` | Reports that platform release installation and orchestration are not implemented. |
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

Each built-in command and each generator has its own Rust source file. Console
filters help and dispatch by both profile and detected location. In an
interactive terminal, `feluqa make` offers a choice and generators prompt for
a missing required name; in scripts, missing names return usage guidance.

## Run from a source checkout

Run `./build.sh [--release] [target-triple]` to build
the `feluqa` and `nadim` binaries for one Rust target. It builds debug binaries
by default in `target/debug/`; pass `--release` to build optimized binaries in
`target/release/`. With a target triple, outputs go under
`target/<triple>/<profile>/`. With no target argument, it uses the current host
target. It has no CI-provider dependency; any CI system or release machine can
invoke it. Rust target support is determined by the installed Rust target and
the platform linker/SDK available on that machine.

The initial release matrix is Linux x86-64 and ARM64, macOS Intel and ARM64,
and Windows x86-64. Build each target on a compatible native runner, or
configure a cross-linker and SDK where supported. One host cannot produce
every operating system's executable without the appropriate toolchains.

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
