---
sidebarTitle: "Starting an app"
title: "A practical way to start a Feluqa app"
icon: "square-terminal"
description: "A concise starting point for shaping a Feluqa application around a real workflow and a chosen runtime."
summary: "Suggests a brief, use-case-led way to begin a Feluqa application while distinguishing current tools from unfinished target capabilities."
date: 2026-10-30
lastmod: 2026-10-30
status: "Implemented"
category: "building"
tags: [feluqa, application, article]
---

There is no single application shape that fits every Feluqa project. Start with
the workflow the application should support and the devices that need to use it.
That gives the project a concrete target without assuming a runtime in advance.

For a current web application, `feluqa new <name> --profile web` creates the
available scaffold. Its composition root selects statically compiled Rust
modules through `feluqa.toml`. Keep business operations in services, and enforce
authorization on each server action.

As the application grows, keep its routes, data, and behavior with the module
that owns them. Shared tooling and contracts can support other targets, while
each target keeps its own runtime profile. Dynamic module installation and
complete standalone runtime shells are still unfinished.

See [Create your first application](/learn/create-your-first-application) for
the longer learning path and [Feluqa’s internals](/feluqa-internals/) for
architecture details.
