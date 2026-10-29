---
icon: "list-checks"
title: "Rules for Developers and Agents"
description: "Coding conventions and CLI generators for Feluqa developers and AI agents; also generated into AGENTS.md by feluqa new."
summary: "Collects the planned coding rules for developers and AI agents, including documentation, generated registries, typed names, security, and IDE support. It explains that feluqa new is intended to place the rules in AGENTS.md and that the global IDE command family remains planned."
date: 2026-10-29
lastmod: 2026-10-29
weight: 2
status: "Target"
tags: [feluqa, conventions, agents, cli]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Rules for Developers and Agents

These rules are also generated into `AGENTS.md` by `feluqa new`.

- **Document everything.** `#![deny(missing_docs)]` is active. Every `pub` item, permission, resource, panel and page carries a `///`. These docs feed the System panel, CLI help and `feluqa docs`. Explain the business *why*, not the syntax.
- **Never keep a manual registry** (lists of routes, permissions, resources). If you feel the need, an attribute is missing: report it instead of working around it.
- **No strings for a field, permission or role.** Use `Customer::NAME`, `Sales::Refund`.
- **No configuration file to write.** Add a typed `#[config]`.
- **Every handler that writes carries a `#[gate]`.** `public` must be justified in a comment.
- **Do not repeat the context.** In a module write `Refund`, not `sales.refund`. The full path is useful only for another module.
- **One file per resource.** Create `resource/<name>/edit.rs` only to override a page.
- **Prefer features over forks.** Optional behavior is a `#[feluqa::feature]`, not a copied module.
- **Generate with the CLI.** Each command produces a single file:

```bash
feluqa make:module sales
feluqa make:submodule sales invoicing
feluqa make:feature sales loyalty
feluqa make:resource Customer --from-model
feluqa make:panel customer_portal --path=/app
feluqa make:page edit --resource=customer
```

- **Finish with `feluqa check`**: compilation, missing gates, missing docs, orphan permissions.

## IDE support

The global `feluqa support:ide ...` command family is available regardless of app, module or workspace context. It is specified in the IDE support plan and **not implemented yet**.
