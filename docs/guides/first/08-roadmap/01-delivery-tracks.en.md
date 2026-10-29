---
icon: "route"
title: "Delivery Tracks"
description: "Active Feluqa delivery tracks F4 to F12 with estimates and what remains to be built."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, roadmap, tracks]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Delivery Tracks

What we are working on now. Estimates are rough ranges, not commitments.

| Track | Estimate | Scope and current state |
| --- | --- | --- |
| **F4. Data, Core and panels** | 15–25 days | Database, auth and vertical panel slices exist; finish generic resources and actions, tenant lifecycle, PostgreSQL HTTP coverage and restore. |
| **F5. Live actions** | 10–18 days | Signed typed dispatch exists; add shared replay protection, client reconciliation and focus handling, and failure/reconnect tests. |
| **F6. Sites, CLI and deployment** | 8–14 days | Local scaffold and watcher exist; validate standalone builds, a second independent site, production deployment and rollback. See [installing with the CLI](../06-deployment/01-installing-an-app-with-the-cli.en.md). |
| **F7. Installable module lifecycle** | 12–20 days | Static lifecycle exists; implement artifact compatibility and signatures, licensing, domain activation, staging, recovery, and safe uninstall with data retention. |
| **F8. Feluqa UI and panel migration** | Unestimated, pending build spike | Internalize the component source as first-party Feluqa packages and namespaces, integrate rendering and hydration with Axum, migrate all panel pages and interactions, verify light/dark and responsive behavior, then remove unused legacy assets. |
| **F9. One module, web and workstation products** | Unestimated, architecture and prototype | Make one business module deployable as a hosted web app or a standalone workstation app, with shared domain logic and separate web, desktop, storage and connection adapters. Bookstore scenario: the same books, sales, stock and student-facing behavior serve a public website with business administration and a local-only workstation install. Then design optional multi-device sessions over a local peer network or a routed connection, with explicit identity, authorization, synchronization, conflict handling, offline behavior, backup and recovery. No desktop framework, sync protocol or database topology is selected yet. |
| **F10. Feluqa-owned UI runtime** | Unestimated | Replace the remaining external rendering-runtime dependency with a first-party runtime under Feluqa namespaces, or implement the required compiler/runtime surface directly. Preserve web SSR/hydration, workstation and mobile outputs, and the `no_std` boundary. The current component-source copy is **not** a complete runtime internalization. |
| **F11. Attribute-driven application scanner** | Unestimated | Foundation exists: conventional source discovery, context from module directories, basic duplicate and reference checks, permission and role docs, write-handler gate checks. Remaining: complete attribute validation, recursive inline-module context, runtime and code generation for routes, permissions and configs, and generated docs and examples. Output stays deterministic under `target/feluqa/`. |
| **F12. Declarative panel, resource and gate APIs** | Unestimated | Add `#[feluqa::main]`, `#[panel]`, `#[resource]`, `#[page]`, `#[permissions]`, `#[roles]`, `#[config]` and `#[gate]` contracts. Generate panel-relative slugs, resource CRUD routes, pages, navigation and permissions, typed permission references, secure-by-default write gates, and shared privilege-management resources. Validate in a generated sample product before removing manual declarations. |

## Dependencies

```mermaid
flowchart LR
    F11[F11 Scanner] --> F12[F12 Declarative APIs]
    F12 --> F4[F4 Data, Core, panels]
    F4 --> F5[F5 Live actions]
    F4 --> F7[F7 Module lifecycle]
    F6[F6 CLI and deployment] --> F7
    F8[F8 UI migration] --> F10[F10 Own UI runtime]
    F4 --> F9[F9 Web and workstation]
    F7 --> F9
    F8 --> F4
```

The dependency graph is indicative. Several tracks can run in parallel.

## Caution on estimates

These tracks have dependencies and some can run in parallel. **Do not sum the ranges as a committed schedule**; re-estimate after each acceptance gate exposes the actual integration work.
