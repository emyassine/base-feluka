# Console commands and terminal interaction

The `feluqa-console` crate provides the console engine/API exposed as
`feluqa::console`. Any product or Rust application using this API can define
console profiles and contribute commands. `products/feluqa-cli` is one such
product; its `feluqa`, `feluqa-dev` and `nadim` profiles are its configuration
of this general capability, not a rule that profiles belong to that product.
The API is available when the `console` feature is enabled.

**Implementation status:** the shared crate now contains a compiled-command registry, command metadata macro, profile filtering, aliases, hidden-command handling, longest-path parsing, generated help and basic portable terminal prompts/output. The `feluqa-cli` product declares its profiles once and recursively compiles each profile's `commands_directory`. Only Rust files annotated with `#[feluqa::command(...)]` become commands. The profile owns its implementation and scaffold templates; only deliberately reused command bodies belong in a shared-commands directory. The richer prompt set, shell completions and task/progress widgets remain in progress.

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

Command registration belongs in `feluqa-console`, not a CLI-specific
command catalogue. `#[feluqa::command(...)]` leaves an ordinary compiled Rust
handler and registers its metadata in the console registry. Help, path parsing,
alias resolution and dispatch consume that registry. Products can contribute
commands from any linked crate or source file, provided the product compiles
that code.

```rust
#![no_implicit_prelude]

#[feluqa::command(
    name = "support:ide view-highlight",
    description = "Check Feluqa View highlighting in an editor",
    usage = "feluqa support:ide view-highlight --ide=<name>",
    aliases = ["support:ide highlight"],
    profiles = ["feluqa-dev"],
    context = "global",
)]
pub fn view_highlight(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    feluqa::console::terminal::success("Feluqa View syntax support is available.");
    Ok(())
}
```

A command declares its full public path, description, optional usage, aliases,
profile membership and product-defined context label. Registry validation
rejects duplicate canonical paths and aliases and orders help output
consistently. Hidden commands stay callable but are omitted from ordinary help.

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

### Profile-first product layout

Each profile declares the directory that owns its commands. The console build
helper recursively visits that directory and compiles only files marked with
`#[feluqa::command(...)]`; ordinary Rust helper files are not command modules.
The attribute supplies the public command path, so filenames and nesting are
for source organization only.

```text
products/feluqa-cli/src/
├── lib.rs                         # console runner and generated include hidden by the facade macro
├── profiles.rs                    # one profile table used by runtime and build script
└── profiles/
    ├── feluqa/                     # commands_directory = "profiles/feluqa"
    │   ├── build.rs                # one command per file
    │   ├── make/migration.rs
    │   ├── support.rs              # profile-local implementation wiring
    │   ├── support/                # context, handlers, generators and operations for this profile
    │   └── templates/              # scaffold templates owned by Feluqa's `new` command
    ├── nadim/                      # commands_directory = "profiles/nadim"
    └── feluqa-dev/                 # commands_directory = "profiles/feluqa-dev"
```

A profile directory can be placed anywhere under the configured source root;
its path is the `commands_directory` value. A product build script passes the
same profile declarations to the console build helper, which recursively
compiles annotated command files and honors each declared directory. Rust
modules still need to be compiled, so this one small build integration handles
the generated module declarations. The running binary never scans source
folders or executes Rust source from disk.

Shared commands are opt-in. A command file can include a shared handler body
when another profile genuinely uses the same implementation. Merely placing a
file in a shared directory does not register or expose it. Each command's
`profiles` metadata determines which profiles can invoke it. Feluqa-specific
operations such as `make`, app context detection and project templates stay in
the `feluqa` profile; they are not placed in shared commands just because
another profile might exist.

`feluqa::console::MakeConsole` handles argument conversion, profile selection,
help generation, command discovery and dispatch. The product supplies only its
profile list and a host factory for product-specific context. The generated
`OUT_DIR` include is available through `feluqa::console::include_profile_commands!()`;
advanced products may use the raw generated include if they need custom wiring.

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

A console profile is a named command set provided through
`feluqa::console`. Any product using the console can declare profiles. Each
profile declaration names its binary, command directory and header. For
example, `feluqa-cli` uses:

| Profile | Binary | Intended command surface |
|---|---|---|
| `feluqa` | `feluqa` | Platform and application commands. |
| `nadim` | `nadim` | Personal commands. |
| `feluqa-dev` | `feluqa-dev` | Developer tools and development-only commands. |

The selected profile filters command help and dispatch; it does not grant
permissions. Executable aliases select profiles from the same product. The
product does not own the profile mechanism: any consumer can define its own
profile list and command folders.

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
6. Add generic console profile support, then configure `feluqa`, `feluqa-dev`
   and opt-in `nadim` profiles in `feluqa-cli`; compile product-local
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
