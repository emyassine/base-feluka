---
title: "Taxonomy"
description: "The shared vocabulary of Feluqa: crates, platform, app, client, CLI, modules, submodules, features, panels, privileges, roles and permissions."
date: 2026-10-29
lastmod: 2026-10-29
weight: 2
status: "Target"
tags: [feluqa, taxonomy, vocabulary, glossary]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Taxonomy

This is the first page to read. Each term below has **one meaning, everywhere**
in the Feluqa documentation.

## Building blocks


|Term           |What it is                                                                                                                                                           |Where it lives               |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
|**Crate**      |The standard Rust unit of compilation and distribution, built by Cargo.                                                                                              |Anywhere Rust is built       |
|**Feluqa crate**|A crate of the framework itself, for example `feluqa-core`. Shared code used by both the Platform and the App.                                                       |Feluqa source workspace      |
|**Feluqa Platform**|The server-side runtime and control plane (Feluqa Core): authentication, schema management, access control, the System panel.                                        |Server                       |
|**Feluqa App** |The application you build with Feluqa. It is installed and run on the client machine (or on a server, in hosted mode).                                               |Client or server             |
|**Client**     |The machine or device on which a Feluqa App runs or from which it is used: a workstation, a mobile device, a ground station, or a browser connecting to a hosted app.|End-user side                |
|**Feluqa CLI** |The command-line tool that creates, validates, builds, installs and operates workspaces, modules and apps.                                                           |Developer machine and servers|
|**Product**    |A deployable application assembled from modules. Marked by a `feluqa.toml`.                                                                                          |Developer workspace          |
|**Module**     |A unit of business functionality developed with Feluqa, for example `sales`. Its id is its folder name.                                                              |Developer workspace          |
|**Submodule**  |A sub-domain nested inside a module, for example `sales/invoicing`.                                                                                                  |Inside a module              |
|**Feature**    |A switchable capability of a module or submodule, for example `loyalty`. Can be enabled per license or tenant.                                                       |Inside a module              |
|**Package**    |Umbrella term for a Feluqa crate or a module. Every package has a `feluqa.toml`.                                                                                     |Both                         |
|**Workspace**  |A repository root identified by `.feluqa/workspace.toml`. Either `framework` or `developer`.                                                                         |Repository root              |
|**Target profile**|A deployment shape: `no_std` embedded, workstation, or server.                                                                                                       |Build time                   |
|**Artifact**   |The signed, versioned, installable output of a build.                                                                                                                |Release channel              |

## Application building blocks


|Term        |What it is                                                                                                             |
|------------|-----------------------------------------------------------------------------------------------------------------------|
|**Panel**   |A web-served surface of an app (for example `/admin`) with its own branding, login, navigation and middleware.         |
|**Resource**|A complete CRUD definition (model, form, table, actions, policy) in a single file.                                     |
|**Page**    |A screen of a resource or a custom screen. Resource pages are generated and only overridden when needed.               |
|**System panel**|The built-in panel of the Platform: users, privileges, roles, permissions, modules, configuration, audit.              |
|**Scanner** |The compile-time component that discovers attributes and generates routes, permissions, configuration schemas and docs.|
|**Tenant**  |An organization (customer, team, unit) isolated inside one app instance.                                               |

## Access control vocabulary


|Term           |What it is                                                                                                                                                  |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
|**Privilege level**|The platform-wide rank of a user (`app-owner`, `super-admin`, `sysadmin`, `staff`, plus external variants). Answers "how powerful is this account on the platform?".|
|**Origin**     |Whether a user is `internal` or `external` (contractor, auditor, integrator). Separate from rank.                                                           |
|**Permission** |An atomic capability, such as `sales.refund` or `sales.customers.delete`.                                                                                   |
|**Role**       |A named bundle of permissions, defined per module and assignable to users.                                                                                  |
|**Policy**     |A per-record rule, such as "a customer with open orders cannot be deleted". Combined with permissions using AND.                                            |
|**Gate**       |The enforcement point. `\\#\\\[gate]` guards a function, a handler or an action.                                                                            |
|**Clearance**  |*(Exploring)* an optional classification label for high-security deployments.                                                                               |

> In one sentence: **Feluqa crates** are the shared foundation, the **Platform**
> runs on the server, the **App** runs on or serves the client, and the **CLI**
> builds, installs and operates all of it.

## Concept map

```mermaid
flowchart TB
    subgraph SRC[Feluqa source workspace]
        FC[Feluqa crates<br/>feluqa-core, ...]
    end
    subgraph DEV[Developer workspace]
        PR[Product]
        M[Module]
        SM[Submodule]
        F[Feature]
        PR --> M --> SM
        M --> F
        SM --> F
    end
    CLI[Feluqa CLI]
    ART[(Artifact<br/>signed and versioned)]
    subgraph SRV[Server]
        PL[Feluqa Platform]
        SP[System panel]
        APP[Feluqa App]
        DB[(SQLite / PostgreSQL)]
        PL --> SP
        PL --> APP
        APP --> DB
    end
    CL[Client<br/>workstation, mobile, browser, ground station]

    FC --> PL
    FC --> APP
    PR -->|compiled into| ART
    CLI -->|builds| ART
    CLI -->|installs on| SRV
    ART --> APP
    CL -->|HTTP| APP
```
## Common confusions

- **Crate vs module.** A module is a crate (or a folder inside one) that follows
  Feluqa conventions and carries a `feluqa.toml`. Not every crate is a module; `
  tools/feluqa-build` is neither.
- **Platform vs App.** The Platform is the same for everyone. The App is yours.
  They share Feluqa crates but are installed and versioned separately.
- **Client vs tenant.** A client is a device or a program. A tenant is an
  organization inside the app.
- **Privilege level vs role.** Privilege is platform rank. Roles are module-level
  bundles of permissions. See 
  [the authorization model](../03-security/01-authorization-model.en.md).
