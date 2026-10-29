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
> interactive project chooser, `feluqa dev:init`, CLI application scaffold, and
> service packaging described below are not implemented yet. Today,
> `feluqa new <name> --profile web` creates the available web application
> scaffold, and `feluqa dev` watches and runs a development application.

The first project should answer a useful question from a terminal, then grow
into a service that can notify someone when conditions change. The walkthrough
will build a weather watcher in small steps so each stage can be run and
understood on its own.

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

The proposed `feluqa dev:init` command checks for Rust and the Feluqa CLI,
reports missing system dependencies, and offers platform-specific setup steps.
It should explain each action and let the developer choose what to install.
The command and its setup recipes remain planned.

## 3. Build the weather watcher

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

## 4. Run it locally

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
application-type chooser, environment preflight, a CLI application scaffold,
local configuration for external services, and a documented Linux service
package. The server-plus-workstation option also needs a clear shared-module
and API example. Until then, these steps are product direction rather than
available commands.
