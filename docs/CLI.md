# Feluqa command line

The CLI will be the installation and daily entry point for the framework. Keep its first release small and project-focused. `dev` and `prod` describe how an application runs; they are not project types. A new application chooses a **profile** such as `web`.

When published, users install it with `cargo install feluqa-cli` (or the platform package that Feluqa provides later).

## First release commands

| Command | Purpose |
|---|---|
| `feluqa new app` | Ask for an application name and profile, then create a ready-to-run project. |
| `feluqa list` | Show applications in the current workspace. |
| `feluqa dev` | Run the current application in development mode. |
| `feluqa build` | Build the current application for production. |
| `feluqa start` | Start the production build. |
| `feluqa check` | Check configuration, routes, and views without starting the server. |
| `feluqa test` | Run the current application's tests. |
| `feluqa help` | Show commands and examples. |

Creation should be conversational by default:

```text
$ feluqa new app
Application name: numerimondes
Application profile: web
Created numerimondes.
Next: cd numerimondes && feluqa dev
```

`feluqa dev` runs the application in the current app directory; from the workspace root, it may take an application name, for example `feluqa dev numerimondes`. `feluqa list` shows those available names.

Do not add separate `new prod` and `new dev` commands. Do not require users to know Cargo package names, workspace member IDs, target triples, or internal crate names for routine work. Advanced options can be added when a real workflow needs them.

## Delivery order

1. Rename the framework packages and place the Numerimondes application under `apps/numerimondes/`.
2. Make the current application run through `feluqa dev`.
3. Add `feluqa new app` using the working Numerimondes app as the first verified template.
4. Add `build`, `start`, `check`, `test`, and workspace app listing.

The CLI crate and commands are roadmap work; until implemented, use the Cargo commands in the root README.
