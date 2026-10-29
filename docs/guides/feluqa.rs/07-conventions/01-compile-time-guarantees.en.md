---
icon: "badge-check"
title: "What Moves to Compile Time"
description: "Comparison of manual and legacy approaches with Feluqa's attribute-driven, compile-time equivalents."
summary: "Comparison of manual and legacy approaches with Feluqa's attribute-driven, compile-time equivalents."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Target"
tags: [feluqa, compile-time, scanner, attributes]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# What Moves to Compile Time

| Before (legacy panel implementation / manual) | Feluqa |
| --- | --- |
| `discoverResources(in:, for:)` | Attribute scanner, `static` registry |
| `'name'` as a string | Constants such as `Customer::NAME` |
| Permissions created in the database | `#[permissions]` + resources, generated table |
| `user.can("sales.refund")` | `Sales::Refund`, checked by the compiler |
| Missing policy = open access | Mandatory gate, otherwise compile error |
| Routes registered at boot | `const` table |
| Providers and `register_*` calls | `#[panel]`, `#[resource]`, `#[page]` are enough |
| Per-environment `*.toml` files | `#[config]` + generated `.env.example` |
| Hand-maintained `module.toml` | Derived from the folder, `Cargo.toml` and `module!{}` |

## Core extensions required (active development)

1. **Statically known module.** The scanner generates a hidden constant in each module (`__MODULE_ID`, derived from `src/modules/<id>/`). `#[gate]`, `#[permissions]` and `#[resource]` use it to prefix names. A proc-macro cannot reliably guess the source file path on stable Rust, so the scanner is used instead of a `Span` hack.
2. **`FeluqaContext` recognizes the generated manifest** as a module and product marker, in addition to `module.toml` and `feluqa.toml`. The platform loader confirms the id at runtime; the scanner provides it at compile time. They must match or the module is refused.
3. **Storage facade** `feluqa::storage_path()` / `ctx.storage()` resolved through that id.
4. **Permission table** consumed by the System panel (install, activate and deactivate by domain, assignment to roles).

## `main.rs`

```rust
#![no_implicit_prelude]
#![deny(unsafe_code, missing_docs)]

extern crate feluqa;

/// Entry point. Discovers `src/panels` and `src/modules` by convention.
/// Generates the runtime, the CLI (`feluqa dev|migrate|...`), routes and permissions.
#[feluqa::main]
fn main() {}
```

Paths are written only to deviate from convention: `#[feluqa::main(panels = "src/ui/panels")]`.

## Product layout

```text
my-erp/
├── Cargo.toml
└── src/
    ├── main.rs
    ├── panels/
    │   ├── back_office.rs            # /admin
    │   └── customer_portal.rs        # /app
    └── modules/
        └── sales/                    # id = folder name
            ├── permissions.rs
            ├── models/customer.rs
            ├── services/refunds.rs
            └── resources/
                ├── customer.rs
                └── customer/edit.rs  # ONLY to override a page
```
