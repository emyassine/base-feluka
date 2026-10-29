---
icon: "layers-3"
title: "Choose an Application Profile"
description: "Understand the difference between a Feluqa application profile, a console binary, and a Rust compilation target."
weight: 6
tags: [feluqa, getting-started, profiles, targets]
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
# Choose an Application Profile

When you create an application, three related choices may appear: what kind
of application you are building, which executable starts it, and which
platform Rust compiles it for. They answer different questions.

## Application profile

An application profile describes the kind of Feluqa application and runtime
it uses, such as web or workstation. A product may eventually support more
than one profile while sharing its business modules and other Rust code.
Feluqa's target architecture uses separate runtimes for different targets.

The project configuration should declare which profiles an application
supports. Feluqa's project tooling can then use that declaration to select and
validate the appropriate runtime and build workflow. This project-level
configuration and multi-profile workflow are planned capabilities; the
current scaffold does not yet provide them.

## Executable binary

A binary is an executable entry point declared in `Cargo.toml`. A console
application, such as the `hello-cli` example, has a binary name and starts a
Feluqa console profile that registers its commands. The binary declaration
does not by itself identify a web or workstation runtime.

## Rust compilation target

The Rust compilation target identifies the platform and architecture for the
compiled program, for example a native operating system target or a
WebAssembly target. Cargo receives this choice as part of the build
configuration. It is separate from the product's application profile: a
profile describes the application/runtime, while the compilation target
describes where the resulting program runs.

The interaction surface is another independent choice. A console application
could run in a traditional terminal, in a future desktop host that presents
it as a terminal-style window, or as part of a graphical desktop application
with an integrated terminal. These desktop host experiences are product
directions; they are not currently available in Feluqa.

## Where should the choice live?

Declare the application's supported profiles in Feluqa project configuration
when that configuration is available. Keep the Rust compilation target in
the Cargo build workflow. A build script may read project settings, validate
them, or generate code, but it should not be the only place that declares
what kind of application the project is.

For the first CLI example, no extra application-type attribute is needed: its
`Cargo.toml` declares the binary, and its `main.rs` declares the console
profile. See [How a Feluqa CLI Is Structured](03-cli-structure.en.md).

## Continue

You have now seen how to choose and distinguish the application profile,
binary, compilation target, and interaction surface. Continue with the
[Feluqa architecture overview](../00-introduction/04-architecture-overview.en.md)
for Feluqa's target architecture.
