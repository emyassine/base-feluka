# Feluqa command line

The CLI is a first-class product under `products/feluqa-cli/`; it builds the `feluqa` executable. It currently provides `help`, `list`, `dev`, `build`, and `check` for the monorepo's first web product. Project generation, app selection, tests, and standalone installation workflows remain follow-up work.

`dev` and `prod` describe how an application runs; they are not project types.

A new application chooses a profile such as `web`.

## Current commands

| Command | Purpose |
|---|---|
| `feluqa list` | Show products in the current workspace. |
| `feluqa dev [app]` | Run a web product in development mode; omit the name when the workspace has one app. |
| `feluqa build [app]` | Build a product for production. |
| `feluqa check [app]` | Check a product without starting its server. |
| `feluqa help` | Show commands and examples. |

From the monorepo source, run a command with:

```sh
cargo run --manifest-path _crates/Cargo.toml -p feluqa-cli -- dev
```

## Next CLI work

1. Resolve the selected application from the user's working directory rather than hard-coding Numerimondes.
2. Add `feluqa new app` using the Numerimondes site as the first template.
3. Add `start`, `test`, argument parsing, and useful config and app-selection errors.
4. Define the supported public installation and update channel.

Do not add separate `new prod` and `new dev` commands. Do not require users to know Cargo package names, workspace member IDs, or target triples for routine work.
