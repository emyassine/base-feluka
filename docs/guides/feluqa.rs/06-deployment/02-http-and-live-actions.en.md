---
icon: "radio"
title: "HTTP Surface and Live Actions"
description: "Route classes, request lifecycle through gates, health endpoints and signed live actions in a Feluqa installation."
summary: "Describes Feluqa's generated Axum HTTP routes, route classes, request lifecycle, security rules, and Live actions. It explains typed client-triggered server operations and incremental UI updates, and distinguishes implemented signed dispatch from remaining planned work."
date: 2026-10-29
lastmod: 2026-10-29
weight: 2
status: "Partial"
tags: [feluqa, http, axum, live-actions, routes]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# HTTP Surface and Live Actions

Feluqa serves HTTP through Axum. Routes are **generated** from attributes into a `const` route table; nothing is registered at boot by hand.

> Paths are illustrative defaults. Signed typed dispatch for live actions exists; the remaining items are tracked in F5.

## Route classes

| Class | Example | Source | Protection |
| --- | --- | --- | --- |
| System panel | `/system/...` | Built in | Privilege level + permission |
| Panels | `/admin/customers/{id}/edit` | `#[panel]` + `#[resource]` | Resource capabilities + policy |
| API handlers | `GET /api/orders/{id}` | `#[feluqa::get(...)]` | `#[gate]` mandatory for writes |
| Live actions | `POST /live/dispatch` | Signed typed dispatch | Signature, replay protection, gate |
| Health | `/healthz`, `/readyz` | Built in | Public, no sensitive data |
| Assets | `/assets/...` | `feluqa::asset!` | Static, cacheable |

## Request lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant H as HTTP layer
    participant M as Middleware (session, tenant)
    participant G as Gate and policy
    participant S as Service (business logic)
    participant D as Database
    participant A as Audit log

    C->>H: request
    H->>M: authenticate, resolve tenant
    M->>G: user, tenant, route metadata
    G->>G: privilege, feature, permission, policy
    alt denied
        G->>A: record deny
        G-->>C: 401 / 403 / 404
    else allowed
        G->>S: call with ctx
        S->>D: transaction
        D-->>S: result
        G->>A: record allow
        S-->>C: JSON or SDUI schema (already filtered)
    end
```

## Rules

- Every write route carries a `#[gate]`; `public` must be justified.
- Error mapping: 401 unauthenticated, 403 denied, 404 for disabled features or invisible records.
- Sessions use secure cookies and CSRF protection; the management listener can be bound separately from the public one.
- The SDUI schema is filtered **server-side** before serialization.

## Live actions

Live actions let the client trigger typed server actions and receive incremental UI updates.

| Aspect | Status |
| --- | --- |
| Signed typed dispatch | Exists |
| Shared replay protection (multi-node) | To do (F5) |
| Client reconciliation and focus handling | To do (F5) |
| Failure and reconnect tests | To do (F5) |
