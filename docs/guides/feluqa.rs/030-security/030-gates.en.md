---
icon: "shield"
title: "Gates: Protecting a Function"
description: "The #[gate] attribute: syntax, options, resolution order, secure-by-default rules and the builder equivalent."
summary: "Documents the planned #[gate] attribute for protecting service functions, resource hooks, API handlers, actions, and custom pages. It covers options, composition rules, secure-by-default compile errors, explicit public access, the builder equivalent, and the checks and audit behavior the macro is intended to generate."
date: 2026-10-29
lastmod: 2026-10-29
weight: 3
status: "Target"
tags: [feluqa, security, gate, attributes]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Gates: Protecting a Function

Add the attribute above the business logic. The current context is resolved automatically.

```rust
// src/modules/sales/services/refunds.rs

/// Refunds a paid order.
/// Returns `Denied` if the user lacks `sales.refund`.
#[feluqa::gate(require_permission = Refund)]
pub async fn refund_order(ctx: &Ctx, order: OrderId) -> Result<Refund> {
    // Business logic only.
    // Access control, audit logging and the 403 error are injected by the macro.
    ctx.db().orders().refund(order).await
}
```

**Syntax.** A Rust attribute uses `=`, not `:`, so `require_permission = Refund`.

## Options

```rust
#[feluqa::gate(require_permission = Refund)]                  // one permission
#[feluqa::gate(require_any = [Refund, ExportLedger])]         // OR
#[feluqa::gate(require_role = Finance)]                       // role declared by #[roles]
#[feluqa::gate(require_privilege = SysAdmin)]                 // platform rank, at least
#[feluqa::gate(require_origin = Internal)]                    // internal users only
#[feluqa::gate(require_feature = Loyalty)]                    // feature must be enabled
#[feluqa::gate(require_tenant)]                               // an active tenant is required
#[feluqa::gate(authenticated)]                                // signed in, no specific permission
#[feluqa::gate(public)]                                       // open: an explicit choice
#[feluqa::gate(require_permission = Refund, on_deny = hide)]  // UI: hide instead of error
```

Stacked `#[gate]` attributes combine with **AND**. Options inside one gate such as `require_any` combine with **OR**.

## Where it can be placed

Service functions, resource hooks, API handlers (`#[feluqa::get("/orders/{id}")]`), actions and custom pages.

## Secure by default

A function annotated `#[feluqa::post]`, `#[feluqa::action]` or a write hook **without** `#[gate]` is a compile error. To open it, you must write `#[gate(public)]`, which is visible in code review and must be justified by a comment.

## Builder equivalent

For dynamic UI:

```rust
Action::make("refund").gate(Sales::Refund)
```

It is the same rule and feeds the same registry.

## What the macro injects

1. Resolution of `ctx` from the function signature (compile error if absent).
2. The ordered checks of the [decision pipeline](010-authorization-model.en.md).
3. An audit entry for both allow and deny.
4. Mapping to the right error: 401, 403 or 404.
5. Registration in the generated permission and route tables, so the System panel and `feluqa check` know about it.
