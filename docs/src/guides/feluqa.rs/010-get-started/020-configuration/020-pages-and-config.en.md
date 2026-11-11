---
sidebarTitle: "Configuration"
icon: "@spmpst::icon::file-cog"
title: "Pages and Configuration"
description: "Overriding a resource page only when needed, and generating typed configuration with #[config]."
summary: "Explains when to override a generated resource page and how Feluqa's typed configuration declaration generates a schema, environment example, startup validation, and System Panel page. It also describes configuration sources and the handling rules that keep saved secrets out of logs and client schemas."
date: 2026-10-29
lastmod: 2026-10-29
weight: 3
status: "Target"
tags: [feluqa, page, config, env]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Pages and Configuration

## Overriding a page (only if necessary)

```rust
// src/modules/sales/resources/customer/edit.rs

/// Customer edit page with stats and sub-navigation.
#[feluqa::page(resource = CustomerResource, kind = Edit)]
pub fn edit(page: Page<Customer>) -> Page<Customer> {
    page
        .title(|c| format!("Edit {}", c.name))
        .header_actions([
            Action::make("impersonate").gate(platform::Impersonate),
        ])
        .widgets([CustomerStats::for_record()])
        .sub_navigation([Tab::new("General"), Tab::new("Orders").badge(|c| c.orders_count())])
}
```

Create `resource/<name>/edit.rs` **only** to override a page. Otherwise the resource file is the single source.

## Typed, generated configuration

```rust
/// Database settings. Values come from the environment, never from code.
#[feluqa::config(prefix = "DATABASE")]
pub struct Database {
    /// Connection URL (secret).
    pub url: Secret<String>,
    /// Pool size.
    #[config(default = 10)] pub pool: u32,
}
```

Generated from this: the schema, `.env.example`, startup validation and the System panel configuration page. No more `app.{development,staging,production}.toml`, `config.rs` or `database.*.toml`.

## Where configuration comes from

| Source | Used for | Edited by |
| --- | --- | --- |
| Environment / secrets store | Secrets, deployment-time values | Operator |
| `feluqa.toml` | Manifest, rarely changed deployment settings | Developer |
| SQLite (via System panel) | Settings editable at runtime | Authorized users |

Secrets (`Secret<T>`) are never logged, never serialized to the SDUI schema and never shown after being saved.
