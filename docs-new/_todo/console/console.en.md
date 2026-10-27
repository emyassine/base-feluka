# Console commands and terminal interaction

The `feluqa-console` crate is the shared contract for Feluqa command-line
products and application commands. It is available to CLI commands through
`feluqa::console` when the `console` feature is enabled.

**Implementation status:** the crate currently contains a small command
contract only. Distributed command registration, metadata-driven help,
profiles, aliases, hidden commands, interactive prompts and rich output
described here are the target design; they are not implemented yet.

## Command names

The canonical command shape is:

```text
feluqa [command-namespace][:command-subnamespace] [command-family] [arguments] [options]
```

Each part is optional where it is not needed. Use the shortest natural command
that stays unambiguous:

| Shape | Example | Meaning |
|---|---|---|
| Command only | `feluqa dev` | A command without a namespace or family. |
| Namespace and family | `feluqa make resource Customer` | A namespace groups a family of related commands. |
| Namespace, subnamespace and family | `feluqa support:ide view-highlight --ide=zed` | A nested namespace groups commands for one area. |
| Namespace and subnamespace only | `feluqa cache:clear` | A complete command may be expressed by the namespace path alone. |

Colons separate namespaces; spaces separate the command family and its
arguments. Options such as `--ide=zed` are parsed after the command path.
Aliases resolve to one canonical command and do not create a second command.

## Automatic command discovery

Command registration belongs in `feluqa-console`, not a CLI-specific dispatcher.
An attribute such as `#[feluqa::command(...)]` expands the annotated handler
into a normal compiled function plus a typed command descriptor registered with
the console registry. A distributed static registry (the
[`inventory` pattern](https://docs.rs/inventory/latest/inventory/)
is the leading candidate) collects descriptors from any linked source file or
crate; command help, completions and dispatch all read this registry. There is
no separate hard-coded help list or match arm per command.

Example target declaration (metadata names and handler signature are proposed,
not implemented):

```rust
#![no_implicit_prelude]

extern crate feluqa;
extern crate core;

use feluqa::console::{CommandContext, CommandResult};
use core::result::Result::Ok;

#[feluqa::command(
    namespace = "support:ide",
    description = "Check Feluqa View highlighting in an editor",
    aliases = ["support:ide highlight"],
    profiles = ["feluqa"],
    context = "global",
    hidden = false,
)]
pub fn view_highlight(context: &mut CommandContext) -> CommandResult {
    // Read the command's parsed options and run the integration check.
    context.console().success("Feluqa View syntax support is available.");
    Ok(())
}
```

The function name supplies the family (`view_highlight` becomes
`view-highlight`); the optional namespace supplies zero or more colon-separated
segments. Root commands omit `namespace`; commands that need no family may
declare a complete command path. The attribute records description, usage,
arguments/options, aliases, profile membership, visibility and context policy.
The exact Rust type signature must be finalized before this example is
presented as compilable API.

The registry validates duplicate paths and aliases, sorts commands
deterministically, and produces root help, namespace help, command help,
completions and dispatch targets from the same descriptors. Hidden commands
are omitted from ordinary help but remain callable; `--all` can show them for
diagnostics. Hidden is not authorization.

### What Rust discovers, and what it does not

The supplied module explanation is mostly right, with two important
distinctions:

- A directory alone is not a Rust module. A `mod name;` declaration (or an
  inline module, path attribute, or generated equivalent) brings source into
  the crate. `use` only imports names from code already compiled; it does not
  compile or discover a file.
- The source filename for an external module can use the modern
  `name.rs` + `name/child.rs` layout. `name/mod.rs` remains supported, but is
  the older alternative; do not provide both for the same module. `mod.rs` is
  just the source file chosen for a declared module, not a magical directory
  initializer.

This is consistent with the [Rust Reference on modules](https://doc.rust-lang.org/stable/reference/items/modules.html):
the module tree starts at the crate root and external source files are included
through module declarations or generated equivalents. Cargo does not add every
`.rs` file found under `src/` to the crate automatically. The Rust Reference
encourages the `name.rs` plus `name/child.rs` form and still permits
`name/mod.rs`.

Thus the CLI now uses `commands.rs`, `commands/app.rs` and
`commands/app/dev.rs` rather than `mod.rs` filenames. Rust module declarations
are still necessary to compile ordinary source. Feluqa should minimize manual
module-registration boilerplate with the command attribute and generated
dev-command modules, not claim that Rust modules can be removed.

The command registry is permissive about *where linked command code lives*:
commands can be declared in different files, modules and dependency crates.
This is not runtime filesystem scanning. A `.rs` file that the Rust crate graph
does not compile cannot register a command. A product may use a build script to
generate module declarations for a conventional development-command folder;
the resulting Rust is compiled before the command is dispatched. The running
binary never interprets or executes arbitrary Rust source from disk.

### Command source layout

Keep command implementations in subdirectories. The tree below is the CLI's
conventional organization, not a restriction on where a command may live.
Namespace and subnamespace directories may mirror colon-separated CLI paths,
but command names come from descriptor metadata, not from filesystem paths.
Commands in other compiled modules or linked crates can register the same way.
Put reusable command-specific helpers next to their owner, not in the top-level
dispatcher.

```text
products/feluqa-cli/src/
├── commands.rs              # composition and dispatch only
└── commands/
    ├── app.rs
    ├── app/
    │   ├── build.rs
    │   ├── check.rs
    │   ├── dev.rs
    │   ├── dev/
    │   │   └── watcher.rs
    │   ├── migrate.rs
    │   ├── seed.rs
    │   └── test.rs
    ├── global.rs
    ├── global/
    │   ├── list.rs
    │   ├── new.rs
    │   ├── update.rs
    │   └── version.rs
    ├── help.rs
    ├── make.rs
    ├── make/
    │   ├── controller.rs
    │   ├── migration.rs
    │   ├── model.rs
    │   ├── module.rs
    │   ├── panel.rs
    │   ├── resource.rs
    │   ├── seeder.rs
    │   └── service.rs
    ├── support/              # planned
    │   └── ide/
    │       ├── check.rs
    │       ├── install.rs
    │       └── view_highlight.rs
    └── tests.rs
```

In this tree, `app/`, `make/`, and `global/` are present now; `support/ide/`
is the planned location for the global editor-support command family.

For example, `support/ide/view_highlight.rs` declares
`support:ide view-highlight`. A top-level command may live in a descriptive
folder such as `global/` even though its public command has no namespace. The
App-scoped and global command implementations are grouped under
`commands/app/` and `commands/global/`; generators remain under
`commands/make/`. The dispatcher, hand-written help and test plumbing remain
outside those command folders. Attribute-based registration and generated
help/dispatch are still outstanding; the current dispatcher matches command
names directly.

Application context is policy attached to a command descriptor, not implied
by the source directory. Global commands such as editor support work from an
application, a module source tree, a workspace, or an unrelated directory.
Application operations require a detected application; workspace operations
require a detected Feluqa workspace. The same command dispatcher resolves
context before enforcing each command's declared policy.

The `products/` directory is repository organization; it is not a Rust module
tree by itself. A product becomes a Cargo package/crate through its manifest
and configured crate root. Within that crate, ordinary Rust source still uses
language modules, whether declared by hand or generated for commands.

## Aliases and hidden commands

Aliases are short alternate spellings for a canonical command. Help displays
the canonical spelling and may show aliases beside it. Parsing an alias
produces the same descriptor and behavior as parsing the canonical command.

Hidden commands remain callable by their canonical name or alias but do not
appear in ordinary help or command listings. Use hidden status only for
internal diagnostics, compatibility shims or advanced recovery operations;
it is not an access-control boundary. Authorization and destructive-operation
checks still belong in the command implementation.

## Console profiles and development commands

A console profile is a named CLI assembled from registered commands. It
defines a profile ID, display name, default help behavior and the command
descriptors enabled for that profile. The same console registry and runtime
can serve several products:

| Profile | Intended command surface |
|---|---|
| `feluqa` | Installed platform and application commands. |
| `feluqa-dev` | Feluqa developer tools plus explicitly registered development-only commands. |
| `nadim` | A separate personal CLI profile using the same console, prompts, output and command registry. |

An installed launcher name such as `feluqa`, `feluqa-dev` or `nadim` selects
its matching profile. A single launcher may instead accept an explicit
`--profile=<id>`. The selected profile filters command registration and help;
profile selection is not an authorization mechanism. Commands still apply
their own context, permission and environment checks.

Product development commands may live in a configured folder such as
`development/commands/` and use
`#[feluqa::command(profiles = ["feluqa-dev"], ...)]`. The development build
system can scan that folder and generate the Rust module declarations needed
to compile those commands. `feluqa dev` then discovers them from the compiled
console registry and executes the compiled handlers. When a source file
changes, the dev watcher rebuilds/restarts the process before registering the
updated command. Production builds exclude development-only command modules
and profiles.

There is no safe way for a running Rust binary to execute a new `.rs` file just
because it appeared in a folder. Runtime source loading would need a separate
compiler/plugin ABI and explicit trust model; that is not the default. The
developer workflow compiles commands before execution. This permits one console
core to power multiple CLIs without confusing CLI profiles with Feluqa platform
modules or Rust modules.

## Rust toolchain commands

Feluqa may offer a convenience interface for managing the Rust toolchain, for
example:

```text
feluqa rust:dev install-all
feluqa rust:toolchain check
feluqa rust:toolchain install stable
feluqa rust:component add rust-analyzer --toolchain stable
feluqa rust:target add wasm32-wasip2 --toolchain stable
feluqa rust:doctor
```

These commands are not implemented. Feluqa should orchestrate the official
`rustup` toolchain manager rather than distribute a second `rustc`/Cargo
installer. `install-all` should install the repository's declared channel and
an explicit component/target set (including `rustc`, Cargo, rustfmt, Clippy,
and Rust Analyzer where available), explain disk/network changes, and ask for
confirmation unless `--yes` is supplied. It must preserve existing toolchains,
avoid silently changing the global default, support per-user installation and
report missing native cross-compilation dependencies. Rustup profiles and
components vary by host/toolchain; never promise every target is installable.
The official toolchain interfaces are documented for
[installation](https://rust-lang.github.io/rustup/installation/),
[profiles](https://rust-lang.github.io/rustup/concepts/profiles.html),
[components](https://rust-lang.github.io/rustup/concepts/components.html), and
[cross-compilation](https://rust-lang.github.io/rustup/cross-compilation.html).

## Interactive prompts

Commands should accept all inputs as explicit arguments/options for scripts,
then prompt only for values that remain unspecified when running in an
interactive terminal. Prompt definitions support a label, placeholder,
default, hint, required input and typed validation. The validator returns a
clear error message and the prompt repeats until valid input is supplied or
the user cancels.

The target API is intentionally small and chainable. The following is an API
design example, not code that compiles against the current crate:

```rust
#![no_implicit_prelude]

extern crate feluqa;

use feluqa::console;
use feluqa::prelude::Result;

fn ask_for_project_name() -> Result<feluqa::console::PromptValue> {
    console::prompt::text("What should the project be called?")
        .placeholder("acme-portal")
        .required("Enter a project name.")
        .validate(|value| validate_project_name(value))
        .ask()
}
```

The prompt set should cover:

- text, multiline text, number and masked password;
- yes/no confirmation;
- single select, multi-select and searchable choices;
- suggestions/autocomplete for known values;
- pause, grouped forms and reusable validation.

Prompt values are typed where practical. Password prompts must not echo,
persist or log the entered value. Cancellation is a typed result, not an empty
string or panic. Prompts must respect terminal size and handle Unicode input.

## Non-interactive behavior

Prompts are used only when both required terminal streams are interactive.
When input is piped, redirected, or `--no-interaction` is set, the command
must not wait for input. It uses explicit arguments/options, documented
environment/config values, or returns an error naming the missing option and
showing a non-interactive invocation. Destructive actions require an explicit
confirmation option such as `--force` when prompting is unavailable.

## Output

The console output API should provide consistent success, info, warning and
error messages; headings, notes and callouts; tables; task logs; spinners; and
determinate/indeterminate progress. Long-running operations report meaningful
steps and finish with a stable summary. Progress renderers write to stderr so
stdout remains usable for machine-readable output and shell pipelines.

The CLI automatically detects terminal capabilities. It disables animation
when output is not a terminal, respects `NO_COLOR`, and supports `--no-ansi`
and `--quiet`. A future `--json` mode emits structured output without prompt
decoration. Errors go to stderr and use stable exit codes; successful command
data goes to stdout. Do not mix progress redraws into piped output.

Illustrative output API (also proposed, not implemented):

```rust
console::task("Preparing application", |task| {
    task.line("Checking configuration")?;
    task.success("Configuration is valid")?;
    task.line("Building executable")?;
    Ok(())
})?;

console::success("Application is ready");
```

## Dependency direction and implementation

Keep the public `feluqa::console` facade stable and keep terminal libraries
behind `feluqa-console`. Evaluate established Rust crates for prompt widgets,
terminal styling and progress rendering rather than implementing terminal
control sequences from scratch. Current candidates are `inquire` for validated
text/password/select prompts, `console` for terminal styling/capabilities and
`indicatif` for progress bars/spinners. Their documented capabilities are
[inquire](https://docs.rs/inquire/latest/inquire/),
[console](https://docs.rs/console/latest/console/), and
[indicatif](https://docs.rs/indicatif/latest/indicatif/). Select versions only after reviewing
MSRV, licenses, terminal fallbacks and feature footprint. The implementation
may replace a candidate while preserving this API contract.

Initial implementation sequence:

1. Define typed prompt/output errors, terminal capability detection, and
   deterministic non-interactive fallbacks.
2. Add text, password, confirm and select prompts with validation.
3. Add multi-select, search, textarea, grouped forms and suggestions.
4. Add styled output, tables, task logs, spinners and progress reporting.
5. Add command attributes and console-owned distributed registration; generate
   help, dispatch, completions, aliases, hidden status and context policy from
   the same descriptors.
6. Add `feluqa`, `feluqa-dev` and opt-in `nadim` profiles; compile product-local
   `development/commands/` into developer builds only.
7. Add safe rustup-backed toolchain commands and verify TTY/piped behavior on
   supported operating systems and terminals.

Planning estimates: **5–8 engineering days** for the command attribute,
distributed registry, generated help/dispatch and profiles; **5–8 days** for
interactive prompts and rich output; **2–4 days** for product-local development
command discovery/rebuild integration; and **2–4 days** for rustup-backed
toolchain management. These are separate work slices and should be refined
after the first compiled vertical example.

Indicatif automatically hides progress output when stdout/stderr is not a
terminal; prompt handling still needs an explicit non-interactive policy.
