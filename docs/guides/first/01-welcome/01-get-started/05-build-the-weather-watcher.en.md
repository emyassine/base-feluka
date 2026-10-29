---
icon: "cloud-rain"
title: "Build the Weather Watcher"
description: "Extend the first Feluqa CLI program into a weather watcher with email alerts and a local service workflow."
weight: 5
tags: [feluqa, getting-started, cli, weather, service]
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
# Build the Weather Watcher

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

## Run it locally

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

## Implementation status

The guide can become a runnable tutorial once Feluqa supports an interactive
application-type chooser, environment setup and verification, a CLI application
scaffold, local configuration for external services, and a documented Linux
service package. The server-plus-workstation option also needs a clear
shared-module and API example. Until then, these steps are product direction
rather than available commands.

## Previous step

Start with [Program 0: Hello CLI](04-program-0-hello-cli.en.md).

