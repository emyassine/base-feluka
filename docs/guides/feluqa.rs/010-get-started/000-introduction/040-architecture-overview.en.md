---
icon: "network"
title: "Architecture Overview"
description: "How the Feluqa SDK, CLI, artifacts, Platform, Applications, and clients fit together, and what is generated at compile time."
summary: "Presents Feluqa's target architecture, from Product and Module composition through SDK, CLI, generated artifacts, runtime layers, target profiles, and client interaction surfaces. It describes compile-time generation, execution and deployment flows, desktop console options, platform capabilities, and design targets, while identifying what the current implementation does not yet deliver."
date: 2026-100-29
lastmod: 2026-100-29
weight: 4
status: "Target"
tags: [feluqa, architecture, overview, mermaid, sdk]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Architecture Overview

## Principles

1. **Products compose applications; applications compose modules.** A product
   is the solution people use. An application is a deployable program for one
   target role. Modules provide reusable business capabilities inside it.
2. **Write only business logic.** Routes, permissions, sidebar, SDUI schemas, manifests and configuration files are generated at compile time.
3. **No manual registry, no magic strings.** Everything is declared with attributes (`#[panel]`, `#[resource]`, `#[permissions]`, `#[gate]`, ...) and collected by the compile-time scanner.
4. **Context is implicit.** The scanner knows the current module, so you write `Refund`, not `sales.refund`. The full path is still accepted.
5. **Secure by default.** A write handler without `#[gate]` does not compile.
6. **One file, one responsibility.** One resource per file. No catch-all `mod.rs` or `admin.rs`.
7. **One entry point.** The Feluqa SDK exposes a single namespace: `feluqa::ui`, `feluqa::panel`, `feluqa::auth`, `feluqa::resource`. Application code never imports internal `feluqa_*` crates.
8. **Server is the source of truth.** Hiding something in the client is never protection.

## The pieces and where they run

| Piece | Role | When it matters | Where it runs |
| --- | --- | --- | --- |
| **Feluqa SDK** | The library you build with: attributes, the compile-time scanner, the single `feluqa` namespace. | While you write and compile | Developer machine, linked into the Application |
| **Feluqa CLI** | Creates, validates, builds, installs and operates projects. | Development and operations | Developer machine and servers |
| **Feluqa Platform** | Authentication, access control, audit, configuration, System panel. | Runtime | Server |
| **Application** | A target-specific program composed of one or more modules. | Runtime | Server, workstation, mobile, or another target |

Most people only ever deal with these four. The internal Feluqa crates that
implement them are an implementation detail.

## From modules to application artifacts

A Product can provide several Applications for different target roles. Each
Application composes the modules it needs; each target build produces an
artifact for that Application and target profile.

```mermaid
flowchart LR
    subgraph BUILD["Build time"]
        direction TB
        SDK["Feluqa SDK<br/>attributes · scanner"]
        subgraph MODS["Your modules"]
            direction LR
            M1["Sales"]
            M2["Inventory"]
            M3["Telemetry"]
        end
        APP_BUILD["Application<br/>for one target role"]
        SDK --> MODS
        MODS --> APP_BUILD
    end

    ART[("Signed artifact<br/>versioned · installable")]

    subgraph RUN["Run time"]
        direction TB
        INST["feluqa install"]
        subgraph SRV["Server"]
            direction LR
            PL["Feluqa Platform"]
            APP["Application instance"]
            PL --- APP
        end
        INST --> SRV
    end

    CL["Clients<br/>browser · workstation · mobile · ground station"]

    APP_BUILD -->|"target build"| ART
    ART --> INST
    SRV -->|"HTTP"| CL

    classDef sdk fill:#1e1b4b,color:#ffffff,stroke:#8b5cf6,stroke-width:2px
    classDef module fill:#f5f3ff,color:#312e81,stroke:#8b5cf6,stroke-width:2px
    classDef product fill:#e0e7ff,color:#312e81,stroke:#6366f1,stroke-width:2px
    classDef artifact fill:#312e81,color:#ffffff,stroke:#6366f1,stroke-width:2px
    classDef runtime fill:#f8fafc,color:#0f172a,stroke:#94a3b8

    class SDK sdk
    class M1,M2,M3 module
    class APP_BUILD product
    class ART artifact
    class INST,PL,APP,CL runtime
```

## End-to-end flow

What happens between writing code and a running system:

```mermaid
flowchart LR
    A["Your source code<br/>SDK attributes + business logic"] --> B["Compile-time scanner"]
    B --> C["Generated in target/feluqa/<br/>routes · permissions · config schema<br/>.env.example · reference docs"]
    B --> D["Validation<br/>gates · docs · orphan permissions<br/>duplicate ids"]
    C --> E["Build"]
    D --> E
    E --> F[("Signed artifact")]
    F --> G["feluqa install"]
    G --> H["Platform instance<br/>Application instance + System Control Panel"]
    H --> I["Clients over HTTP"]

    classDef step fill:#f5f3ff,color:#312e81,stroke:#8b5cf6
    classDef check fill:#fef3c7,color:#78350f,stroke:#d97706
    classDef artifact fill:#312e81,color:#ffffff,stroke:#6366f1,stroke-width:2px
    classDef runtime fill:#f8fafc,color:#0f172a,stroke:#94a3b8

    class A,B,C,E step
    class D check
    class F artifact
    class G,H,I runtime
```

## Runtime layers

```mermaid
flowchart TB
    subgraph CLIENT["Client"]
        UI["Rendered UI<br/>web · desktop · mobile"]
    end

    subgraph SERVER["Server process"]
        HTTP["HTTP layer · Axum"]
        GATE["Gate and policy layer"]
        PAN["Panels and resources"]
        SVC["Services<br/>business logic"]
        PLAT["Platform services<br/>auth · RBAC · audit · config"]
        STO["Storage facade"]
    end

    DB[("SQLite or PostgreSQL")]

    UI -->|"SDUI schema · live actions"| HTTP
    HTTP --> GATE --> PAN --> SVC
    GATE --> PLAT
    SVC --> STO --> DB
    PLAT --> STO

    classDef client fill:#f8fafc,color:#0f172a,stroke:#94a3b8
    classDef layer fill:#f5f3ff,color:#312e81,stroke:#8b5cf6
    classDef guard fill:#fef3c7,color:#78350f,stroke:#d97706,stroke-width:2px
    classDef platform fill:#1e1b4b,color:#ffffff,stroke:#8b5cf6,stroke-width:2px
    classDef store fill:#e0e7ff,color:#312e81,stroke:#6366f1

    class UI client
    class HTTP,PAN,SVC layer
    class GATE guard
    class PLAT platform
    class STO,DB store
```

The SDUI schema sent to the client is **already filtered server-side**: an entry the user may not see is never serialized.

## What is generated and never edited

Generated into `target/feluqa/`, never edited and never committed:

- module manifests and the route table;
- the permission table (consumed by the System panel);
- configuration schemas and `.env.example`;
- reference documentation.

`feluqa.toml` (application) and `module.toml` (module) are build contexts. The current CLI creates the application manifest with `feluqa new`; module generation remains a separate capability.

## Target profiles

| Profile | Typical use | Storage | Status |
| --- | --- | --- | --- |
| `server` | Hosted backend, multi-user web app | PostgreSQL, or SQLite for small single-server installs | Partial |
| `workstation` | Standalone local app on a desktop | SQLite in the user data directory | Target |
| `embedded` (`no_std`) | Telemetry, sensor ingestion | Minimal or none | Exploring |

Shared modules can be included in separate Applications built for different target profiles. See [web and workstation modules](../../080-roadmap/010-delivery-tracks.en.md) (track F9) for the planned server and workstation composition and connectivity design.

## Interaction surfaces and desktop hosts

An application's target profile and its interaction surface are separate
choices. `workstation` describes where and how the application runtime is
deployed; `console`, `graphical`, or `mixed` describes how a person interacts
with it. A console application is therefore not limited to a shell window on
the developer's operating system.

Feluqa may provide a workstation host that presents a console application in
a terminal-style desktop window. A separate product experience could combine
a graphical desktop interface with an integrated terminal for console
commands. These experiences need a desktop host that connects the window to
the Feluqa console runtime; a Rust binary or a `workstation` profile alone
does not provide that host. Neither desktop terminal experience is currently
implemented. Host-shell selection and its build configuration remain product
and architecture work.

## Platform capabilities

| Component | Purpose |
|-----------|---------|
| **Feluqa CLI** | Creates, validates, builds, installs, and operates projects, modules, and applications. |
| **Modules** | Self-contained units of business functionality with their own version, permissions, and features. |
| **Target profiles** | Select dependencies and capabilities for server, workstation, and constrained `no_std` builds. |
| **Feluqa SDK** | Provides attributes, panels, resources, and the compile-time scanner through a single `feluqa` entry point. |
| **Feluqa Platform** | The planned server-side runtime and control plane, including a System panel for authentication, schema management, and access control. |
| **Authorization** | Defines privileges, roles, permissions, and policies. Runtime authorization remains necessary even when compile-time checks are available. |
| **Storage** | Uses embedded SQLite as the proposed local default, with other strategies depending on deployment needs. |

## Design targets

These figures and capabilities are **design targets**, not measured guarantees;
they have not yet been revalidated.

| Area | Target | Why it matters |
|------|--------|----------------|
| Language | Native Rust | Memory safety and control over runtime costs. |
| Hot-path latency | Sub-millisecond p50 | A target for selected operations, not an end-to-end or real-time guarantee. |
| Local persistence | SQLite by default | Reduces setup requirements for standalone deployments. |
| Security boundaries | Separate platform, application, and user scopes | Makes ownership and access rules explicit. |
| Access control | Privileges, roles, permissions, and policies | Combines compile-time validation where possible with runtime authorization. |
