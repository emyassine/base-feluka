---
icon: "users"
title: "Product and Audience"
description: "Feluqa's product model, the people who interact with it, and the responsibilities shared between an application and its platform."
summary: "Feluqa's product model, the people who interact with it, and the responsibilities shared between an application and its platform."
date: 2026-10-29
lastmod: 2026-10-29
weight: 2
status: "Exploring"
tags: [feluqa, product, audience, modules]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Product and Audience

## A product-first model

Feluqa treats a module as a product: a self-contained unit of business
functionality with its own identity, version, permissions, and switchable
features. An application can combine several modules, or a module can be
shipped on its own.

This model aims to make it possible to:

- focus application work on business rules and workflows while the platform
  provides shared services such as authentication, access control, and audit;
- offer modules independently and enable features for specific customers;
- reuse a module in a hosted application or a standalone workstation.

These are product goals; the repository does not yet provide every runtime or
module lifecycle capability needed to deliver them.

Feluqa products may offer console workflows through more than a conventional
terminal window. A desktop product could present a terminal as its primary
interface, or provide a terminal inside a graphical desktop application.
These are distinct product experiences: the first hosts a console interface
in a desktop window, while the second combines graphical workflows with an
integrated console. Both are product directions, not capabilities currently
provided by the repository.

## Who uses Feluqa

People encounter Feluqa in different ways. A founder or product owner may be
interested in the product model, while a technical lead or developer may work
with the project and its code. Operators install and run applications, and end
users work with the resulting application.

| Role | What they do | What they see |
|------|--------------|---------------|
| **Product builder** | Shapes and develops modules and applications. | The project and its tools, including the Feluqa CLI. |
| **Operator** | Installs, configures, and runs an application on a server or device. | The CLI and, as it is completed, the built-in System panel. |
| **End user** | Uses an application. | Its interface on a browser, workstation, phone, or other supported device. |
| **Framework contributor** | Works on Feluqa itself. | The Feluqa source repository and Rust workspace. |

You do not need to work on the framework itself to understand or use an
application built with Feluqa. The framework's repository matters mainly to
contributors.

## Application responsibilities

Application code defines the business side:

- domain models, rules, and workflows;
- resources and the screens used to manage them;
- permissions, roles, and policies;
- modules, submodules, and features.

Feluqa provides shared building blocks, including an SDK, compile-time
validation and generation, a CLI, storage integrations, and platform services.
The current implementation and remaining gaps are described in the
[architecture overview](04-architecture-overview.en.md) and the
[delivery roadmap](../../08-roadmap/01-delivery-tracks.en.md).

## Examples

**Business software.** A sales module could expose an API on a server and share
its business rules with a workstation application.

**Field workstations.** An application could keep essential functions and local
data available when connectivity is limited or unavailable.

**IoT and ground systems.** A module could collect and process telemetry locally
and expose relevant information to an operator. Protocol support depends on
the integration implemented for each target.

**Several offers, one codebase.** A product could provide a base set of features
and enable additional features for customers who license them.
