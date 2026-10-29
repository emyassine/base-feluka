---
icon: "panels-top-left"
title: "Panels"
description: "How to declare a Feluqa panel: path, branding, login, tenancy, middleware, navigation groups and render hooks."
summary: "How to declare a Feluqa panel: path, branding, login, tenancy, middleware, navigation groups and render hooks."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Target"
tags: [feluqa, panel, ui, navigation]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Panels

A panel is a web surface served at a path (for example `/admin`). It is the equivalent of an `AdminPanelProvider` in other frameworks.

```rust
// src/panels/back_office.rs
use feluqa::panel::{Panel, NavGroup, Colors, DarkMode, Width, Hook};
use feluqa::auth::{Auth, Login};
use feluqa::ui::{self, Icon};

/// Internal administration panel, served at `/admin`.
/// NOTE: this panel lists NO resource. Each `#[resource(panel = "admin")]`
/// attaches itself. The navigation groups below are presentation only.
#[feluqa::panel(id = "admin", path = "/admin")]
pub fn back_office(panel: Panel) -> Panel {
    panel
        .brand("Feluqa ERP")
        .logo(feluqa::asset!("logo.svg"))
        .favicon(feluqa::asset!("favicon.png"))
        .font("Inter")
        .colors(Colors::new().primary("#6366f1").danger("rose").success("emerald"))
        .dark_mode(DarkMode::System)
        .max_content_width(Width::Full)
        .login(Login::default())
        .registration()
        .password_reset()
        .email_verification()
        .tenant::<Team>()
        .middleware(Auth::session())
        .spa().prefetch()
        .unsaved_changes_alerts()
        .database_transactions()
        .navigation_groups([
            NavGroup::new("Shop").icon(Icon::ShoppingCart),
            NavGroup::new("Blog").icon(Icon::Pencil),
            NavGroup::new("Settings").icon(Icon::Cog).collapsed(),
        ])
        .render_hook(Hook::BodyStart, || ui::slot("modal-host"))
}
```

## Authorization mode

Strict authorization is the **default**; there is no `.strict_authorization()` to write. `.permissive_authorization()` exists for prototypes and is **rejected in the `production` profile**.

## Built-in injected resources

Every panel receives, without declaration:

- the **Access Control resource** (privileges, roles, permissions), filtered by what the viewer may manage;
- the **account** pages (profile, password, sessions);
- the **audit** viewer, visible only to users holding the audit permission.

## Typical panels

| Panel | Path | Audience |
| --- | --- | --- |
| System panel | `/system` | Platform staff, see [System panel](04-system-panel.en.md) |
| Back office | `/admin` | Internal business users |
| Customer portal | `/app` | End customers, often scoped by tenant |
