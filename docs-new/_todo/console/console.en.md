# Console commands and terminal interaction

The `feluqa-console` crate is the shared contract for Feluqa command-line
products and application commands. It is available to CLI commands through
`feluqa::console` when the `console` feature is enabled.

**Implementation status:** the crate currently contains a small command
contract only. Command discovery, metadata-driven help, aliases, hidden
commands, interactive prompts and rich output described here are the target
design; they are not implemented yet.

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

Command implementations are ordinary Rust modules, but their metadata is
registered automatically in the compiled CLI. Adding a command must not
require another hand-maintained list in the top-level dispatcher or a duplicate
help table.

Rust does not compile a source file just because it exists in a directory.
Therefore discovery is a build-time operation: the CLI build scans the
conventional command tree, validates each command descriptor, generates Rust
module declarations and the command registry, then compiles the generated
registry into the executable. The runtime never loads arbitrary Rust files or
executes command source from the filesystem.

Every command descriptor declares its canonical path, aliases, summary, usage,
argument/option schema, context policy and visibility. Build-time validation
fails on duplicate canonical paths, alias collisions, invalid names, or
commands whose declared file path does not match their namespace.

### Command source layout

Keep command implementations in subdirectories. Namespace and subnamespace
directories mirror colon-separated CLI paths; the family is the command's Rust
file. Put reusable command-specific helpers next to that family, not in the
top-level dispatcher.

```text
products/feluqa-cli/src/commands/
├── app/
│   ├── dev.rs
│   ├── build.rs
│   ├── check.rs
│   ├── test.rs
│   ├── migrate.rs
│   └── seed.rs
├── make/
│   ├── model.rs
│   ├── controller.rs
│   ├── resource.rs
│   └── migration.rs
├── support/
│   └── ide/
│       ├── view_highlight.rs
│       ├── check.rs
│       └── install.rs
├── global/
│   ├── new.rs
│   ├── list.rs
│   └── version.rs
└── help.rs
```

In this tree, `app/`, `make/`, and `global/` are present now; `support/ide/`
is the planned location for the global editor-support command family.

For example, `support/ide/view_highlight.rs` declares
`support:ide view-highlight`. A top-level command may live in a descriptive
folder such as `global/` even though its public command has no namespace. The
App-scoped and global command implementations are now grouped under
`commands/app/` and `commands/global/`; generators remain under
`commands/make/`. Dispatcher, help and test plumbing remains at the command
root. Automatic descriptor discovery and a metadata-generated registry are
still outstanding; the dispatcher currently matches command names directly.

Application context is policy attached to a command descriptor, not implied
by the source directory. Global commands such as editor support work from an
application, a module source tree, a workspace, or an unrelated directory.
Application operations require a detected application; workspace operations
require a detected Feluqa workspace. The same command dispatcher resolves
context before enforcing each command's declared policy.

## Aliases and hidden commands

Aliases are short alternate spellings for a canonical command. Help displays
the canonical spelling and may show aliases beside it. Parsing an alias
produces the same descriptor and behavior as parsing the canonical command.

Hidden commands remain callable by their canonical name or alias but do not
appear in ordinary help or command listings. Use hidden status only for
internal diagnostics, compatibility shims or advanced recovery operations;
it is not an access-control boundary. Authorization and destructive-operation
checks still belong in the command implementation.

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
`indicatif` for progress bars/spinners. Select versions only after reviewing
MSRV, licenses, terminal fallbacks and feature footprint. The implementation
may replace a candidate while preserving this API contract.

Initial implementation sequence:

1. Define typed prompt/output errors, terminal capability detection, and
   deterministic non-interactive fallbacks.
2. Add text, password, confirm and select prompts with validation.
3. Add multi-select, search, textarea, grouped forms and suggestions.
4. Add styled output, tables, task logs, spinners and progress reporting.
5. Add metadata-driven CLI command discovery, aliases, hidden status, help and
   context policy; migrate existing flat command files into namespace folders.
6. Verify TTY and piped behavior on supported operating systems and terminals.

Indicatif automatically hides progress output when stdout/stderr is not a
terminal; prompt handling still needs an explicit non-interactive policy.
