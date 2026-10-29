---
icon: "terminal"
title: "Program 0: Hello CLI"
description: "Write a first Feluqa console command that prints Hello CLI, and learn why the crate uses explicit imports and strict lints."
weight: 4
tags: [feluqa, getting-started, cli, rust]
date: 2026-10-29
lastmod: 2026-10-29
status: "Exploring"
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Program 0: Hello CLI

This command handler lives in the console profile's command source tree. The binary, `main.rs`, build script, and profile setup are explained in [How a Feluqa CLI Is Structured](03-cli-structure.en.md).

## Command handler

The CLI application scaffold is planned but is not available yet. Once it
supports console applications, create this file from the project root:

```text
src/commands/hello.rs
```

Paste the following handler into that file:

This handler is named `hello`; with the `hello-cli` binary, the user runs
`hello-cli hello`:

```rust
// Disable Rust's automatic prelude imports.
// Common types and variants (Result, Ok, Err, Option, etc.)
// must be imported explicitly.
#![no_implicit_prelude]
#![forbid(unsafe_code)]   // Forbid unsafe Rust code throughout this crate.
#![deny(unused_must_use)] // Treat ignored results marked #[must_use] as compilation errors.
#![deny(missing_docs)]    // Require documentation for public items.

extern crate feluqa;            // Make the Feluqa crate available.
use ::core::result::Result::Ok; // Import the Ok variant explicitly because the prelude is disabled.
use feluqa::console::{ // Import the Feluqa console API used by this command.
    echo,
    CommandContext,
    CommandResult,
    OutputStyle,
};

/// Prints the first greeting from this console application.
#[feluqa::command(
    name = "hello",
    description = "Print a greeting",
    context = "anywhere",
)]
fn hello(
    // Mutable reference to the command's execution context.
    // The leading underscore indicates that it is intentionally unused.
    _context: &mut CommandContext<'_>,
) -> CommandResult {
    // Write a plain-text message to the Feluqa console.
    echo(
        "Hello CLI",
        OutputStyle::Plain,
    );

    // Return success without an associated value.
    // Ok = success; () = unit value (no meaningful data).
    // An error would instead be returned with Err(error).
    Ok(())
}
```

The example uses the current `CommandContext`, `CommandResult`, and `echo`
contracts. The console dispatches to the handler, which writes `Hello CLI` and
returns a result. The command's namespace and arguments are parsed before the
handler runs; later commands can call services, inspect options, or perform
longer operations without changing how the binary starts.

## Why these crate attributes

These crate-level rules are the recommended starting point for Feluqa Rust
code:

| Attribute | Why use it |
|-----------|------------|
| `#![no_implicit_prelude]` | Disables Rust's implicit prelude imports. Import or qualify the names the crate uses so dependencies stay visible and generated code is predictable. |
| `#![forbid(unsafe_code)]` | Prevents unsafe blocks in application code, keeping memory-safety boundaries small and visible. |
| `#![deny(unused_must_use)]` | Rejects silently ignored results from operations that may fail or require action. Handle the result or explicitly explain why it can be discarded. |
| `#![deny(missing_docs)]` | Requires documentation on public APIs so generated help and reference docs explain what the API does and why it exists. |

## Run Program 0

From the project root, run the binary with the `hello` command:

```sh
cargo run -- hello
```

The console prints:

```text
Hello CLI
```

> **Congratulations!** You have created and run your first Feluqa console
> command. The `hello` handler is registered with the `hello-cli` binary and
> uses Feluqa's console API to write its output.

## Continue

Next, [build the weather watcher](05-build-the-weather-watcher.en.md).
