# Global IDE support commands

**Status:** planned; no `feluqa support:ide` command is implemented yet.

The IDE support command family belongs to the installed Feluqa CLI. It is
available from any working directory: inside or outside a Feluqa application,
module source tree, or workspace. It must not depend on application-context
detection, and running it must not create or modify application files unless
the selected operation explicitly installs an editor extension.

## Proposed command interface

| Command | Intended behavior |
|---|---|
| `feluqa support:ide list` | List integrations shipped with this CLI build and generic export targets. |
| `feluqa support:ide status --ide=zed` | Report editor detection and the installed Feluqa Views integration/version when detectable. |
| `feluqa support:ide check [--ide=<name>]` | Check the grammar, queries, packaging and prerequisites without changing files. With no IDE, check the shared language package. |
| `feluqa support:ide view-highlight --ide=zed` | Validate the Zed language extension, suffix, captures and Rust injections. `--install` explicitly requests a user-level install/update. |
| `feluqa support:ide view-highlight --ide=vscode` | Validate the VS Code language extension and TextMate highlighting. `--install` explicitly requests extension installation. |
| `feluqa support:ide view-highlight --ide=intellij` | Validate the JetBrains plugin integration once implemented; IntelliJ does not consume a Tree-sitter grammar as a native language plugin. |
| `feluqa support:ide view-highlight --ide=tree-sitter` | Export/check the editor-neutral Tree-sitter grammar, queries, fixtures and integration instructions for any editor that can load a custom grammar. |
| `feluqa support:ide install --ide=<name>` | Install a supported integration only when the editor exposes a safe, documented user-level path; otherwise print manual steps. |
| `feluqa support:ide remove --ide=<name>` | Remove only the Feluqa-managed integration when that editor's installation is managed safely by the CLI. |

`--ide=<name>` is required for editor-specific commands; `list` is the
exception. `view-highlight` is the requested user-facing task name. The
default operation should be a check, not an implicit install. `tree-sitter`
is the open, editor-neutral target: any editor or plugin able to consume a
custom Tree-sitter parser can use the grammar package without being added to
Feluqa's named editor integrations. New named integrations can be added without
changing the shared `.view.rs` language contract.

Do not equate editor support with one grammar format. Zed language extensions
consume Tree-sitter grammars and queries directly. VS Code's documented
extension highlighting mechanism is TextMate; its Feluqa integration needs a
TextMate grammar (and may separately use a Tree-sitter-capable extension), so
the same `.scm` query files alone are insufficient. IntelliJ IDEA custom
language plugins use the IntelliJ Platform language/plugin APIs; there is no
generic native Tree-sitter extension slot. Keep the canonical grammar and
fixtures editor-neutral, then provide a thin adapter per IDE. Sources:
[Zed language extensions](https://zed.dev/docs/extensions/languages),
[VS Code syntax highlighting](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide),
[IntelliJ Platform SDK](https://plugins.jetbrains.com/docs/intellij/custom-language-support.html).

## Required behavior

- These are global CLI commands and work from every directory, regardless of
  whether the user is in a Feluqa app, a platform module, a workspace, or an
  unrelated directory.
- They do not require an app manifest and never infer an app from the CLI
  binary's build path.
- Errors identify the missing editor, grammar artifact, query or permission
  precisely and include a recovery instruction.
- Install/remove are scoped to the current user's editor configuration and
  must preserve unrelated extensions and settings.
- The proprietary grammar and extensions are distributed from the same
  approved source/version as the CLI. Do not fetch from an unverified public
  repository or invent a remote revision.
- Keep one Rust source file per CLI command, following the existing command
  organization. The top-level dispatcher should only route this global
  namespace and must not pass it through app-context rejection.

## Acceptance and estimate

Estimate: **3–6 engineering days** for the context-independent command family,
generic Tree-sitter export, Zed adapter and CLI context checks. A VS Code
TextMate adapter is estimated separately at **3–5 days**; an IntelliJ plugin
at **5–10 days**. These are separate integrations, not automatic features of
the shared grammar. Estimates exclude finishing Tree-sitter HTML recovery.

Acceptance requires running every read-only command from an app root, a
workspace root, and an unrelated directory; confirming identical context
availability; verifying `.view.rs` suffix selection while `.rs` remains Rust;
checking each advertised editor adapter against its native extension format;
and installing/removing managed integrations without altering other editor
settings. The generic Tree-sitter export must include enough source, queries
and instructions for third-party editors to consume it without being added to
Feluqa's named editor list.

## Grammar effectiveness status

The current generated parser successfully parsed a smoke sample containing a
doctype, nested HTML, escaped Rust output, a component with a Rust-bound
attribute, a conditional, and a script element. That confirms basic parser
effectiveness. It does not establish full HTML parity: the Feluqa external
scanner still lacks the reference grammar's stateful tag stack, implicit end
tag handling, malformed-tag recovery and comprehensive HTML corpus. Those
remain part of the Tree-sitter/Zed delivery track. A successful parser smoke
parse is not Zed interactive acceptance.
