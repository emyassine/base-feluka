---
sidebarTitle: "Setup"
icon: "wrench"
title: "Prepare Your Development Environment"
description: "The planned Feluqa dev:init setup for Rust, target-specific tools, and the recommended Zed editor."
summary: "Describes the planned feluqa dev:init flow for installing Rust and target-specific dependencies based on the selected application profile. It covers editor choice, recommends Zed while noting other Rust Analyzer editors, and links the setup stage to the first project tutorial without presenting the planned automation as implemented."
weight: 2
tags: [feluqa, getting-started, rust, zed, setup]
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
# Prepare Your Development Environment

> This is part two of [Create Your First Application](/learn/get-started/first-application/create-your-first-application).

## Prepare the development environment

The interactive `feluqa dev:init` command is intended to prepare the machine
for the application and target profiles selected in the previous step. It will
inspect the host, identify the required tools, install missing supported
dependencies, and verify the result. It should avoid installing tools for
targets the project does not use.

Depending on the selected application, setup may include:

- **Rust.** Install Rust with `rustup` when needed and select the stable
  toolchain. Install only the target triples required by the selected builds;
  for example, a browser WebAssembly build may need
  `wasm320-unknown-unknown`.
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
rustup target add wasm320-unknown-unknown  # only when the selected build needs it
```

The [Rust Book](https://doc.rust-lang.org/book/) is a useful way to learn Rust.
It is recommended background, not a prerequisite for trying the first Feluqa
project. The walkthrough introduces Rust concepts as they appear and keeps
async code, lifetimes, and ownership details tied to the examples that need
them.

## Pick an editor

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

## Continue

With the machine ready, continue to [How a Feluqa CLI is structured](../040-directory-structure/010-cli-structure.en.md).

