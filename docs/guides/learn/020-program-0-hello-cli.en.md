---
sidebarTitle: "Hello CLI"
icon: "terminal"
title: "Program 0: Hello CLI"
description: "Write a first Feluqa console command that prints Hello CLI, and learn why the crate uses explicit imports and strict lints."
summary: "Walks through a first console command that prints Hello CLI and returns a command result. It explains the handler's relationship to the binary and profile, introduces core/alloc/std, Rust paths and the prelude, explains the crate attributes and lint choices, and shows how to run the program and continue learning."
weight: 4
tags: [feluqa, getting-started, cli, rust]
date: 2026-10-29
lastmod: 2026-10-29
status: "Exploring"
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Program 0: Hello CLI

This command handler lives in the console profile's command source tree. The binary, `main.rs`, build script, and profile setup are explained in [How a Feluqa CLI Is Structured](/get-started/directory-structure/cli-structure).

::: tip A note on what you are learning
This first program introduces ideas that appear across Rust projects: crate
roots, imports, library paths, `Result`, attributes, functions, references, and
return values. Knowing these basics will help you read a wide range of Rust
code. Each project may add its own APIs and concepts, so use this as a
foundation rather than a complete guide to every part of Rust.
:::

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
// Disable Rust's implicit standard, extern-crate, macro_use, and tool preludes.
// Names used below are imported or qualified explicitly.
#![no_implicit_prelude]
#![forbid(unsafe_code)]   // Forbid unsafe Rust code throughout this crate.
#![deny(unused_must_use)] // Treat ignored results marked #[must_use] as compilation errors.
#![deny(missing_docs)]    // Require documentation for public items.

extern crate core;              // Make the core crate available explicitly.
extern crate feluqa;            // Make the Feluqa crate available explicitly.
use ::core::result::Result::Ok; // Import the Ok variant from Rust's core library.
use feluqa::console::{
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

## Rust's `core`, `alloc`, and `std` libraries

Rust's libraries form layers. `core` provides fundamental types and traits
without requiring an operating system or heap allocation. `alloc` adds
heap-backed types and requires an allocator. `std` builds on these libraries
with operating-system facilities such as files, networking, threads, and I/O.

```text
std   operating-system services and higher-level APIs
└── alloc   heap-backed types such as String, Vec, and Box
    └── core   fundamental types and traits such as Result, Option, and Iterator
```

| Library | Provides | Examples |
|---|---|---|
| `core` | Fundamental types, traits, and operations; no OS or heap requirement. | `Result`, `Option`, `Iterator` |
| `alloc` | Heap allocation abstractions and heap-backed collections; needs an allocator, not necessarily an OS. | `String`, `Vec`, `Box` |
| `std` | The standard library's OS integration and higher-level facilities. | `File`, `TcpStream`, `thread` |

`std` re-exports many items from `core`, so `core::result::Result` and
`std::result::Result` name the same type. Feluqa code can use `core` when it
wants a fundamental Rust type without making that type's path depend on `std`.

## Explicit crate paths and the prelude

A Rust **prelude** is a set of names made available without a `use` statement.
Rust has several preludes; the standard prelude is why ordinary Rust code can
often write `Option` or `Result` without an import. Feluqa uses
`#![no_implicit_prelude]` to suppress implicit prelude imports, so this example
explicitly brings the `core` crate into scope and imports `Ok` from it.

The leading `::` in `::core::result::Result::Ok` starts resolution from the
external crate namespace in Rust 2018 and later. It makes clear that `core`
means Rust's external crate, even if the application also has a local module
named `core`. The leading `::` affects name resolution; it does not select a
different library. It is useful for this explicit path, but is not required on
every import.

```rust
extern crate core;
use ::core::result::Result::{Ok, Err};

fn example() -> ::core::result::Result<(), &'static str> {
    Ok(())
}
```

In the command above, `extern crate core;` makes the crate available despite
the disabled extern prelude, and `use ::core::result::Result::Ok;` makes the
success variant available as `Ok(())`. The same convention can be used for
Feluqa APIs: import the items a command needs, while keeping their crate origin
visible.

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

Next, [build the weather watcher](030-build-the-weather-watcher.en.md).
