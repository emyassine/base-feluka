---
sidebarTitle: "Batteries Included"
icon: "battery-charging"
title: "Batteries Included"
description: "The major capabilities Feluqa brings together, what is available today, and what remains a product direction."
summary: "Introduces Feluqa's batteries-included approach across application foundations, asynchronous server execution, web and API services, identity and access control, data persistence, modules, panels, console tooling, live interactions, deployment, and agent workflows. It marks each area by implementation status, defines async, Tokio, Axum, and adapters, and identifies inertia-omega as an alpha integration lead rather than a selected dependency."
date: 2026-10-29
lastmod: 2026-10-29
weight: 4
status: "Exploring"
tags: [feluqa, batteries-included, capabilities, architecture]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Batteries Included

Feluqa brings common application capabilities together so a team can focus on
its Product's workflows. The direction is **batteries included, but
removable**: capabilities should have clear contracts and be replaceable where
an Application needs a different implementation.

Feluqa's ambition is to become the standard all-in-one ecosystem for building
Rust applications: the breadth of reusable components associated with
Symfony, the developer experience associated with Laravel, a product-building
layer in the spirit of Filament, and first-class desktop experiences that
belong alongside environments such as KDE. These are references for the
coherence and reach Feluqa aims to offer, not claims of feature parity or
affiliation.

The goal is a connected system of components, tools, and conventions that
teams can adopt as a whole or compose around their needs. “All in one” does
not mean every capability must be fused into one runtime: components should
have clear boundaries and contracts.

Some foundations are already available. Other capabilities are incomplete or
still product goals. The status beside each area describes Feluqa today; it
does not promise that every battery is finished or replaceable yet.

## Terms used on this page

| Term | Meaning here |
|---|---|
| **Asynchronous (`async`)** | A way to express work that can pause while waiting and resume later, allowing a runtime to schedule other work in the meantime. |
| **Asynchronous runtime** | The executor and supporting services that poll asynchronous tasks and provide facilities such as network I/O and timers. |
| **Tokio** | The asynchronous runtime used by Feluqa's current server profile. |
| **Axum** | The HTTP web framework used by Feluqa's current server profile. |
| **Adapter** | A boundary that connects a library or protocol to a framework, such as an Axum adapter for the Inertia server protocol. |
| **Inertia.js** | A way to build server-routed single-page applications with a frontend framework. The Rust `inertia-omega` project provides an alpha server implementation and Axum adapter; Feluqa has not selected it. |
| **Battery** | A capability Feluqa makes available or aims to provide through a documented contract. “Removable” is a product requirement; it does not mean every current capability can already be replaced. |

## The major capabilities

### Application and runtime foundation

| Battery | Status | Included capability and direction |
|---|---|---|
| ![](../000-art/batteries-included/code-xml.svg) Application foundation | In progress | The Rust developer kit (SDK), compile-time checks, and generated application metadata provide a shared foundation for Modules, permissions, resources, and routes. Application composition is still being completed. |
| ![](../000-art/batteries-included/timer.svg) Async server execution | Current server foundation | Rust's `async` and `.await` syntax lets work pause while waiting for a database or network response. The server profile uses Tokio to execute asynchronous work and provide services such as network I/O and timers. |
| ![](../000-art/batteries-included/server-cog.svg) Web and API services | Available; evolving | The web profile uses Axum for HTTP routing and request handling, with Tower services and middleware. [inertia-omega](https://github.com/inertiajs/inertia-omega) is an alpha Rust implementation of the Inertia server protocol with an Axum adapter; it is a possible future integration to evaluate, not a Feluqa dependency. |

### Platform and data services

| Battery | Status | Included capability and direction |
|---|---|---|
| ![](../000-art/batteries-included/shield-check.svg) Identity, access control, and audit | Foundations available | Feluqa Core provides account and role operations, server-side sessions, CSRF protection, tenant-bound identities, and audit persistence. The full System Control Panel, agent identities, and production multi-instance session management remain unfinished. |
| ![](../000-art/batteries-included/database-zap.svg) Data persistence | Available foundations | The database service supports SQLite and PostgreSQL through SeaORM, with named pools and embedded migrations and checksums. Backup, restore, and production operations still need release-level qualification. |
| ![](../000-art/batteries-included/panel-top.svg) Panels and resources | Shared contracts; integration in progress | The panel catalogue and typed UI schemas provide foundations for registering business resources and pages. The complete System Control Panel, Feluqa UI integration, and a broad accessible component catalogue are not yet complete. |
| ![](../000-art/batteries-included/activity.svg) Live interactions | Typed dispatch available | Feluqa has signed, typed Live action dispatch. Browser-side state reconciliation and shared replay protection still need work; this is not yet a complete real-time synchronization system with conflict handling. |

### Development, extension, and operations

| Battery | Status | Included capability and direction |
|---|---|---|
| ![](../000-art/batteries-included/blocks.svg) Modules and extensibility | Static foundation; dynamic lifecycle planned | Applications can be composed from statically compiled Rust Modules. The current lifecycle can order and start registered Modules with rollback. Dynamic installation, upgrades, and removal are product targets. Explicit contracts and extension points should let developers and authorized agents add Product-specific behavior as reviewable software. |
| ![](../000-art/batteries-included/terminal.svg) Console and developer CLI | Available; workflows evolving | The CLI provides project commands, and the console framework supports named binaries, profiles, and command handlers. See [Application Profiles and Starter Kits](../010-get-started/070-starter-kits/010-application-profiles-and-starter-kits.en.md) for the planned `feluqa new <app> profile <profile-or-starter-kit>` command shape. |
| ![](../000-art/batteries-included/cloud-cog.svg) Deployment and operations | Product target | Feluqa aims to make building and operating an Application a coherent, scriptable workflow. Standalone builds outside the development checkout, production deployment, rollback, backup, and restore are not yet qualified as a complete operational path. |
| ![](../000-art/batteries-included/bot.svg) Agent workflows | Product direction | Feluqa is intended to support local agents and agents chosen by each organisation. The CLI should help them inspect project capabilities, propose changes, compile, validate, test, package, and distribute software through explicit, reviewable steps. The complete agent workflow and complementary agent product are not available yet. |

Each area above is labelled with its current status. Feluqa's implementation
continues to evolve, so the capability guides describe what is available and
what remains a product direction.
