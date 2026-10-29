---
icon: "square-terminal"
title: "Create Your First Application"
description: "The planned Feluqa getting-started path: choose an application, prepare the environment, create a first CLI command, and build a useful weather watcher."
summary: "Introduces the planned first-project journey and explains Feluqa's command format, including the binary name, command namespace, arguments, and options. It helps readers choose an application profile and follow the setup, CLI structure, first greeting command, and weather-watcher tutorial while clearly separating the planned scaffold from currently available CLI behavior."
weight: 1
tags: [feluqa, getting-started, cli, application]
date: 2026-100-29
lastmod: 2026-100-29
status: "Exploring"
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
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

## Choose what you are building

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

## Follow the walkthrough

1. [Prepare your development environment](020-prepare-your-development-environment.en.md): install the Rust toolchain and target dependencies, then choose an editor.
2. [How a Feluqa CLI is structured](030-cli-structure.en.md): learn how the binary, console, profiles, and command handlers fit together.
3. [Program 0: Hello CLI](040-program-0-hello-cli.en.md): write a command that prints `Hello CLI`.
4. [Build the weather watcher](050-build-the-weather-watcher.en.md): extend the first command into a useful local service with weather checks and email notifications.
5. [Choose an application profile](060-choose-an-application-profile.en.md): distinguish application profiles, executable binaries, and Rust compilation targets.

