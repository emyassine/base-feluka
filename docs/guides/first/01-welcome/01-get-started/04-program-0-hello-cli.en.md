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

This handler is named `hello`; with the `hello-cli` binary, the user runs
`hello-cli hello`:

```rust
#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

extern crate feluqa;

/// Prints the first greeting from this console application.
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

## Continue

Next, [build the weather watcher](05-build-the-weather-watcher.en.md).
