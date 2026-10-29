---
title: "Feluqa | Fullstack Cross-Platform Framework"
description: "Feluqa is a sovereign, ultra-fast application platform and runtime built in Rust, for enterprise backends, workstations and tactical ground operations."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, about, rust, introduction]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Introduction to Feluqa

Feluqa is a sovereign, ultra-fast application platform and runtime built in Rust. It is architected from the bare metal up to serve **enterprise backends, standalone workstations, high-stakes operations, lean tactical units and defense-adjacent workloads** such as ground-side drone telemetry, sensor-fusion ingestion and secure logistics.

By avoiding heavy runtime overhead and unpredictable garbage-collection pauses, Feluqa bridges high-level business applications and hard tactical reliability across several deployment targets.

## Beyond a traditional framework

Feluqa is a complete cross-platform ecosystem spanning server backends, single-page applications, desktop workstations, mobile apps and embedded systems.

- **Minimalist syntax, zero-cost abstractions.** Native Rust speed behind a clean, declarative, attribute-driven syntax. You write business logic; routes, permissions, navigation, schemas and configuration are generated at compile time.
- **Target profiles (`no_std` to server and workstation).** One monorepo workspace covers several deployment profiles: Linux server backends with local SQLite, desktop nodes, and embedded telemetry systems.
- **Built-in System panel ("Feluqa Core").** A control plane that ships with authentication, schema management, and access control (privileges, roles, permissions) out of the box.
- **Secure by default.** A handler that mutates data without a `#[gate]` does not compile.

## Who it is for

**Small and growing enterprises.** Fast deployment, a negligible memory footprint, simple vertical and horizontal scaling, and no vendor lock-in or SaaS licensing model.

**Tactical, drone and IoT ground operations.** Ground-side mission-planning interfaces, encrypted data-link integration (for example MAVLink), deterministic execution, and air-gapped operation from day one.

## Technical snapshot

> The figures below are **design targets**, not measured guarantees. They have not been revalidated in this documentation migration.

| Metric / layer | Specification | Benefit |
| --- | --- | --- |
| **Language** | Native Rust | Memory safety, zero-cost abstractions, predictable execution. |
| **Hot-path latency** | Sub-millisecond (p50 target) | Instant response for high-frequency control loops and telemetry. |
| **Data persistence** | Embedded SQLite by default | No database administration overhead; ideal for field deployments. |
| **Security boundaries** | Strict separation of scopes | Isolation between platform administration, tenant apps and user profiles. |
| **Access control** | Privileges, roles, permissions, policies | Layered authorization, enforced at compile time and at runtime. |

## Reading status labels

Every page carries a `status` in its front matter.

| Status | Meaning |
| --- | --- |
| **Implemented** | Exists in the codebase and is covered by the current baseline. |
| **Partial** | A foundation exists; the page lists what is missing. |
| **Target** | Agreed design, not yet implemented. Treat as a contract to build toward. |
| **Exploring** | Working material. Not an implementation contract. |

## Where to go next

1. [Taxonomy](02-taxonomy.en.md): the vocabulary used everywhere.
2. [Architecture overview](03-architecture-overview.en.md): how the pieces fit.
3. [Workspaces and packages](../02-workspaces-and-contexts/01-workspace-levels.en.md)
4. [Security model](../03-security/01-authorization-model.en.md)
5. [Installing an app on a new server](../06-deployment/01-installing-an-app-with-the-cli.en.md)
6. [Roadmap](../08-roadmap/01-delivery-tracks.en.md)
