---
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

Some foundations are already available. Other capabilities are incomplete or
still product goals. The status beside each area describes Feluqa today; it
does not promise that every battery is finished or replaceable yet.

## The major capabilities

<img src="../000-art/batteries-included/code-xml.svg" alt="" width="40" height="40" />

### Application foundation — in progress

The Rust developer kit (SDK), compile-time checks, and generated application
metadata provide a shared foundation for Modules, permissions, resources, and
routes. Application composition is still being completed; the documented
architecture distinguishes current behavior from the target.

<img src="../000-art/batteries-included/timer.svg" alt="" width="40" height="40" />

### Asynchronous server execution — current foundation

Rust's `async` and `.await` syntax lets an operation pause while waiting for
work such as a database or network response. An asynchronous runtime schedules
those paused operations and provides services such as timers and network I/O.

The current server profile uses Tokio as its asynchronous runtime. The
recommended approach is to keep Tokio as an external dependency for server
work, not to reimplement or maintain a Feluqa fork of it. Keep runtime details
behind the server profile so Tokio does not become a requirement for `no_std`
or other constrained targets. Vendoring can still be considered for a
specific offline or supply-chain requirement.

<img src="../000-art/batteries-included/server-cog.svg" alt="" width="40" height="40" />

### Web and API services — available, still evolving

The current web profile uses Axum for HTTP routing and request handling, with
Tower services and middleware. Axum is the current web adapter; its use does
not make every Feluqa Application a web application.

For server-driven single-page applications, [inertia-omega](https://github.com/inertiajs/inertia-omega)
is an existing Rust project with an Axum adapter. It is marked alpha. It is a
useful lead to evaluate for a future optional integration, not a dependency
selected or integrated by Feluqa.

<img src="../000-art/batteries-included/shield-check.svg" alt="" width="40" height="40" />

### Identity, access control, and audit — foundations available

Feluqa Core provides account and role operations, server-side sessions, CSRF
protection, tenant-bound identities, and audit persistence. Access checks
belong on server actions, even when an interface hides an operation. The full
System Control Panel, agent identities, and production multi-instance session
management remain unfinished.

<img src="../000-art/batteries-included/database-zap.svg" alt="" width="40" height="40" />

### Data persistence — available foundations

The database service currently supports SQLite and PostgreSQL through SeaORM,
with named pools and embedded migrations and checksums. Storage contracts and
tenant boundaries are part of the application architecture. Backup, restore,
and production operations still need release-level qualification.

<img src="../000-art/batteries-included/blocks.svg" alt="" width="40" height="40" />

### Modules and extensibility — static foundation, dynamic lifecycle planned

Applications can be composed from statically compiled Rust Modules. The
current module lifecycle can order and start registered modules with rollback.
Installing, upgrading, or removing Modules dynamically is a target capability,
not something the current platform claims to support.

Feluqa's longer-term direction is to expose explicit contracts and extension
points so developers and authorized agents can add Product-specific behavior
as ordinary reviewable software.

<img src="../000-art/batteries-included/panel-top.svg" alt="" width="40" height="40" />

### Panels and resources — shared contracts, product integration in progress

The panel catalogue and typed UI schemas provide foundations for registering
business resources and pages. The complete System Control Panel, Feluqa UI
integration, and a broad accessible component catalogue are not yet complete.

<img src="../000-art/batteries-included/terminal.svg" alt="" width="40" height="40" />

### Console and developer CLI — available, workflows evolving

The Feluqa CLI provides project commands, and the console framework supports
named binaries, profiles, and command handlers. Application creation and
development workflows continue to evolve. See [Application Profiles and
Starter Kits](../010-get-started/070-starter-kits/010-application-profiles-and-starter-kits.en.md)
for the planned `feluqa new <app> profile <profile-or-starter-kit>` command
shape.

<img src="../000-art/batteries-included/activity.svg" alt="" width="40" height="40" />

### Live interactions — typed dispatch available, synchronization incomplete

Feluqa has signed, typed Live action dispatch. Browser-side state
reconciliation and shared replay protection still need work. This is not yet a
complete real-time synchronization system with conflict handling.

<img src="../000-art/batteries-included/cloud-cog.svg" alt="" width="40" height="40" />

### Deployment and operations — target

Feluqa aims to make building and operating an Application a coherent,
scriptable workflow. Standalone builds outside the development checkout,
production deployment, rollback, backup, and restore are not yet qualified as
a complete operational path.

<img src="../000-art/batteries-included/bot.svg" alt="" width="40" height="40" />

### Agent workflows — product direction

Feluqa is intended to support local agents and agents chosen by each
organisation. The CLI should help them inspect project capabilities, propose
changes, compile, validate, test, package, and distribute software through
explicit and reviewable steps. The complete agent workflow and complementary
agent product are not available yet.

## Terms used on this page

| Term | Meaning here |
|---|---|
| **Asynchronous (`async`)** | A way to express work that can pause while waiting and resume later, allowing a runtime to schedule other work in the meantime. |
| **Asynchronous runtime** | The executor and supporting services that poll asynchronous tasks and provide facilities such as network I/O and timers. |
| **Tokio** | The established asynchronous runtime used by Feluqa's current server profile. The recommended approach is to depend on it externally rather than reimplement or maintain a fork. |
| **Axum** | The HTTP web framework used by Feluqa's current server profile. |
| **Adapter** | A boundary that connects a library or protocol to a framework, such as an Axum adapter for the Inertia server protocol. |
| **Inertia.js** | A way to build server-routed single-page applications with a frontend framework. The Rust `inertia-omega` project provides an alpha server implementation and Axum adapter; Feluqa has not selected it. |
| **Battery** | A capability Feluqa makes available or aims to provide through a documented contract. “Removable” is a product requirement; it does not mean every current capability can already be replaced. |

For the current implementation status and remaining work, see the
[delivery roadmap](../080-roadmap/010-delivery-tracks.en.md).

The decorative Lucide icons used on this page are distributed under the ISC
licence; see the [icon licence notice](../000-art/LICENSE-LUCIDE.md).
