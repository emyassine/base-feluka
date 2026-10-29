---
icon: "folder-tree"
title: "How a Feluqa CLI Is Structured"
description: "How the CLI binary, Cargo manifest, main.rs, build script, console profile, and command source tree fit together."
weight: 3
tags: [feluqa, cli, console, rust]
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
# How a Feluqa CLI Is Structured

A Feluqa CLI is a **console application**: it has a named executable binary,
a `main.rs` that starts Feluqa's console, and command handlers registered
with that console. A command belongs to a console profile selected by the
binary; it is not a standalone function.

The **console** is the runtime that selects a command, provides its arguments
and execution context, and handles terminal input and output. A **profile**
connects a binary name to the commands available in that console. Each command
is a handler registered in the profile's source tree.

For this small CLI application, one simple structure is:

```text
hello-cli/
├── Cargo.toml                # declares the `hello-cli` binary
├── build.rs                  # discovers command handlers
└── src/
    ├── main.rs               # declares the console profile and starts it
    └── commands/
        └── hello.rs          # the `hello` command handler
```

`Cargo.toml` gives the executable its binary name. The Feluqa CLI binary is
named `feluqa`; a separate CLI application can choose a name such as
`hello-cli`. The command folder is the project's choice. `commands/` is a
simple convention here, and the console profile points to whichever source
folder the project uses.

The Feluqa CLI itself has multiple console profiles and groups related commands
in nested source folders, such as its `make` commands. That organization suits
the CLI's larger command set; a small application does not need an extra
profile directory or a nested `src` folder.

## The binary and its console entry point

The package manifest declares both the build script and binary:

```toml
[package]
name = "hello-cli"
build = "build.rs"

[[bin]]
name = "hello-cli"
path = "src/main.rs"
```

Cargo integrates with specialized tools through build scripts instead of
replacing those tools. It compiles and runs a package's build script just
before compiling the package. The Cargo Book describes this
[build-script lifecycle](https://doc.rust-lang.org/cargo/reference/build-scripts.html).
Feluqa's console scanner uses it to discover command handlers and generate
their registration.

`build = "build.rs"` belongs under `[package]`, because it configures the
package's build script. It does not belong in `[[bin]]`, which configures the
binary target. Cargo can discover a root-level `build.rs` by convention;
Feluqa declares the path explicitly so the manifest states that intent.

Before looking at the Rust files, one Rust term helps explain their first
lines: Rust has a **prelude**, a set of commonly used names the compiler makes
available without an explicit `use`. For example, ordinary code can often
write `Option`, `Result`, `String`, and `Vec` without importing them. This is
convenient, but it can hide where names come from and make generated code or
macros depend on implicit imports.

Feluqa prefers explicit imports. `#![no_implicit_prelude]` turns off those
automatic imports, so code must name or import what it uses. That makes the
crate's dependencies and macro inputs easier to inspect and keeps generated
application code predictable.

The binary's `main.rs` declares which command profile belongs to it, then
starts the console dispatcher. This follows the structure used by
`products/feluqa-cli/src/main.rs`:

```rust
#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

extern crate feluqa;
extern crate std;

use feluqa::console::{MakeConsole, Profile};
use std::process::ExitCode;

/// The console profiles compiled into this binary.
#[feluqa::console::profile_registry]
pub const PROFILES: &[Profile] = &[Profile {
    id: "hello-cli",
    name: "Hello CLI",
    binary_name: "hello-cli",
    commands_directory: "commands",
    header: "Hello CLI",
    launch_aliases: &[],
}];

fn main() -> ExitCode {
    MakeConsole::new(PROFILES).run()
}
```

`build.rs` asks Feluqa's build-time scanner to find the command handlers under
the profile directory and generate their registration:

```rust
#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

extern crate feluqa;
extern crate std;

// Root used to resolve each Profile::commands_directory.
const SOURCE_ROOT: &str = "src";
// Rust file containing the PROFILES declaration.
const PROFILE_SOURCE: &str = "src/main.rs";

fn main() {
    if let std::result::Result::Err(error) =
        feluqa::console::build::compile_profiles_from_source(SOURCE_ROOT, PROFILE_SOURCE)
    {
        std::panic!("could not compile profile commands: {error}");
    }
}
```

The normal `feluqa` dependency provides the console runtime; the build
dependency enables the console command scanner. `Cargo.toml` declares the
binary, `build.rs` generates command registration, `main.rs` starts the
console, and the console profile owns the command handlers.

The generated project scaffold will provide the manifest, dependency features,
entry point, and build script. The `commands_directory` value is relative to
the source root (`src` in this example), so this profile discovers:

```text
src/commands/hello.rs
```

## Continue

Now write [Program 0: Hello CLI](04-program-0-hello-cli.en.md).
