---
icon: "square-terminal"
title: "Create Your First Application"
description: "The planned first-project journey for Feluqa: choose an application shape, prepare the development environment, build a useful CLI tool, and run it as a local service."
date: 2026-10-29
lastmod: 2026-10-29
weight: 5
status: "Exploring"
tags: [feluqa, getting-started, cli, application]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Create Your First Application

> **Exploring.** This page describes the intended beginner journey. The
> interactive project chooser, setup automation in `feluqa dev:init`, CLI
> application scaffold, and service packaging described below are not
> implemented yet. Today,
> `feluqa new <name> --profile web` creates the available web application
> scaffold, and `feluqa dev` watches and runs a development application.

The first project should answer a useful question from a terminal, then grow
into a service that can notify someone when conditions change. The walkthrough
will build a weather watcher in small steps so each stage can be run and
understood on its own.

## Feluqa command format

A Feluqa command has a binary name, a command namespace, optional positional
arguments, and optional flags or options:

```text
<binary> <principal-namespace[:sub-namespace...]> [<argument> ...] [<option> ...]
```

- **Binary** selects the executable, usually `feluqa`.
- **Namespace** names the requested operation. A colon separates nested command
  namespaces, such as `dev:init` or `support:ide`.
- **Arguments** provide required values or identify an object, such as `zed`.
- **Options** change the operation or provide named values, such as
  `--profile web`; a flag is an option that needs no value.

For example, `feluqa support:ide zed` means “run the IDE support command for
Zed.” The command routes to its Feluqa handler, which performs validation and
the relevant setup work. `feluqa dev:init` routes to the development setup
handler, which selects and prepares the toolchain for the current project.

**This is the target syntax for new namespaced commands.** The current CLI has
some space-separated command groups, such as `feluqa make resource`; those
commands have not yet been normalized to the target syntax. The command
interface is still being shaped, so the CLI can adopt a consistent namespace
form without preserving old command spellings for backward compatibility.

## 1. Choose what you are building

The intended `feluqa new <name>` flow asks what kind of application the project
needs:

- a command-line application;
- a server application;
- a workstation application;
- a server and workstation product with separate applications;
- a peer-to-peer application for connected devices.

The selection should shape the project layout, target profiles, and starter
code. A server and workstation solution produces separate applications that
can share modules and contracts. They communicate through an explicit API or
local protocol; one application does not depend on the other's executable.

## 2. Prepare the development environment

The interactive `feluqa dev:init` command is intended to prepare the machine
for the application and target profiles selected in the previous step. It will
inspect the host, identify the required tools, install missing supported
dependencies, and verify the result. It should avoid installing tools for
targets the project does not use.

Depending on the selected application, setup may include:

- **Rust.** Install Rust with `rustup` when needed and select the stable
  toolchain. Install only the target triples required by the selected builds;
  for example, a browser WebAssembly build may need
  `wasm32-unknown-unknown`.
- **Feluqa tooling.** Install or locate the Feluqa CLI and verify that it can
  create and build the selected application type.
- **Host dependencies.** Detect and install operating-system packages needed
  by the selected runtimes. A command-line or server project should not install
  graphical desktop libraries. Native desktop targets may need a platform UI
  toolkit; mobile targets require their platform SDKs and build tools.
- **Platform-specific setup.** On macOS, iOS builds require Apple's Xcode and
  SDKs. Android builds require the Android SDK and NDK. Linux and Windows
  desktop builds may need additional native libraries or toolchains. WSL setup
  depends on whether the selected target needs Linux graphics or device access.

`dev:init` should finish with a clear report of installed tools, selected Rust
targets, and any requirement that still needs a manual step, such as accepting
a platform SDK license. A developer can then build and run a minimal project
before adding application code.

The stable Rust compiler is the expected default. If Rust is already managed
with `rustup`, the equivalent setup includes commands such as:

```sh
rustup toolchain install stable
rustup target add wasm32-unknown-unknown  # only when the selected build needs it
```

The [Rust Book](https://doc.rust-lang.org/book/) is a useful way to learn Rust.
It is recommended background, not a prerequisite for trying the first Feluqa
project. The walkthrough introduces Rust concepts as they appear and keeps
async code, lifetimes, and ownership details tied to the examples that need
them.

## 3. Pick an editor

**Zed is the recommended editor for Feluqa projects.** It is fast, has built-in
Rust Analyzer support, and can use Feluqa's editor extension for `.view.rs`
templates. The extension provides template highlighting and Rust injections;
Rust Analyzer provides Rust navigation and analysis, while the Feluqa build
reports template compiler errors.

The Feluqa Zed extension is not yet available through a user-facing install
channel. The planned CLI command is `feluqa support:ide zed`; both the
command and extension distribution still need to be implemented. Until then,
Zed's Rust support is available, while Feluqa-specific `.view.rs` highlighting
is not available to application users. Other editors such as VS Code, Emacs,
and Vim can be used with Rust Analyzer; `.view.rs` support depends on an editor
extension being available for that editor.

## 4. Program 0: Hello CLI

The first program should be a single command with one job: print a greeting.
This introduces a Feluqa command handler and the console output API before the
weather watcher adds external services and background work.

```rust
#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

extern crate feluqa;

/// Prints the first greeting from this application.
#[feluqa::command(
    name = "hello",
    description = "Print a greeting",
    context = "anywhere",
)]
fn hello(
    _context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    feluqa::console::echo(
        "Hello CLI",
        feluqa::console::OutputStyle::Plain,
    );
    ::core::result::Result::Ok(())
}
```

The example uses the current `CommandContext`, `CommandResult`, and `echo`
contracts. The future CLI application scaffold will provide the surrounding
crate setup and command registration so the first command can be run without
editing framework internals.

These crate-level rules are the recommended starting point for Feluqa Rust
code:

| Attribute | Why use it |
|-----------|------------|
| `#![no_implicit_prelude]` | Makes imports explicit. Code does not silently depend on names brought into scope by Rust's prelude, which helps generated code and macros behave predictably. |
| `#![forbid(unsafe_code)]` | Prevents unsafe blocks in application code, keeping memory-safety boundaries small and visible. |
| `#![deny(unused_must_use)]` | Rejects silently ignored results from operations that may fail or require action. Handle the result or explicitly explain why it can be discarded. |
| `#![deny(missing_docs)]` | Requires documentation on public APIs so generated help and reference docs explain what the API does and why it exists. |

## 5. Build the weather watcher

The tutorial will develop the example in stages:

1. **Read a forecast.** Start with a deterministic local sample so the first
   run needs no account or network service.
2. **Fetch live weather.** Add a provider adapter and put its API key in local
   configuration, outside source control.
3. **Detect a condition.** Add a rule such as notifying when rain is forecast
   or the temperature crosses a configured limit.
4. **Send an email.** Add a notification adapter with validated settings and
   clear handling for delivery failures.
5. **Observe and operate.** Add structured logs, health information, and a
   bounded retry policy before running it unattended.

The first version should run in the foreground. A later step can package it as
a Linux service with a `systemd` unit, restart behavior, a dedicated service
account, and an operator guide. The service should start only after its
configuration and notification path have been verified.

## 6. Run it locally

For an application shape supported by the current CLI, the available workflow
is:

```sh
feluqa new weather-watch --profile web
cd weather-watch
feluqa dev
```

This creates a web application, not the CLI weather service described above.
The project chooser and a CLI application profile need to land before the
weather watcher can be followed end to end with Feluqa commands.

## When the walkthrough is ready

The guide can become a runnable tutorial once Feluqa supports an interactive
application-type chooser, environment setup and verification, a CLI application
scaffold, local configuration for external services, and a documented Linux
service package. The server-plus-workstation option also needs a clear
shared-module and API example. Until then, these steps are product direction
rather than available commands.
