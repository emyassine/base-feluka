---
icon: "book-open"
title: "Introduction to Feluqa"
description: "A short introduction to Feluqa, its purpose, and the guides that explain its product model, vocabulary, and architecture."
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

Feluqa is a sovereign, ultra-fast application platform and runtime for building
**enterprise backends, standalone workstations, high-stakes operations, lean
tactical units, and defense-adjacent workloads** *(such as ground-side drone
telemetry, sensor-fusion ingestion, and secure logistics)* with Rust.

The goal is to share one codebase across web, desktop, mobile, and IoT
deployments, while adapting each build to its target environment.

By avoiding heavy runtime overhead and garbage-collection pauses, Feluqa aims
to bring the performance and control of native software to business
applications and field systems.

Feluqa is under development. Some foundations exist in the current codebase;
other capabilities described here are design targets. Each guide marks its
implementation status so readers can tell the difference.

| Status | Meaning |
|--------|---------|
| **Implemented** | Available in the current codebase and covered by the documented baseline. |
| **Partial** | Some foundations exist, and the page identifies what is missing. |
| **Target** | An agreed design that is not yet fully implemented. |
| **Exploring** | An idea or working proposal that may change. |

## Start here

- [Product and audience](02-product-and-audience.en.md): understand the product
  model, the people who interact with Feluqa, and what the platform provides.
- [Taxonomy](03-taxonomy.en.md): learn the shared meanings of Application, Platform,
  SDK, module, product, and other terms.
- [Architecture overview](04-architecture-overview.en.md): see how source code,
  modules, build artifacts, runtime components, and deployment targets fit
  together.
- [Create your first application](../01-get-started/01-create-your-first-application.en.md): see
  the planned path from project setup to a useful running application.

## Continue reading

- [Workspaces and packages](../../02-workspaces-and-contexts/01-workspace-levels.en.md):
  understand how projects and shared code are organized (mostly useful for
  framework contributors).
- [Security model](../../03-security/01-authorization-model.en.md): explore
  authorization and isolation.
- [Install an app on a new server](../../06-deployment/01-installing-an-app-with-the-cli.en.md):
  follow the deployment workflow.
- [Roadmap](../../08-roadmap/01-delivery-tracks.en.md): see planned work and
  delivery priorities.
