---
sidebarTitle: "Introduction"
icon: "book-open"
title: "Introduction to Feluqa"
description: "A short introduction to Feluqa, its purpose, and the guides that explain its product model, vocabulary, and architecture."
summary: "Introduces Feluqa's goals for Rust applications across web, desktop, mobile, IoT, workstation, and high-stakes environments. It explains that the platform is under development, distinguishes existing foundations from design targets, and directs readers to product, architecture, security, and deployment guides."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, about, rust, introduction]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Introduction to Feluqa

Feluqa is an application platform and runtime built with Rust for
**enterprise backends, standalone workstations, high-stakes operations,
tactical units, and defense-adjacent workloads** *(such as ground-side drone
telemetry, sensor-fusion ingestion, and secure logistics)*.

The goal is to share one codebase across web, desktop, mobile, and IoT
deployments, while adapting each build to its target environment.

By avoiding heavy runtime overhead and garbage-collection pauses, Feluqa aims
to bring the performance and control of native software to business
applications and field systems.

Feluqa is under development. Some capabilities are implemented; others
described here are design targets. Each guide marks its implementation status
so readers can tell the difference.

| Status | Meaning |
|--------|---------|
| **Implemented** | Available in the current Feluqa release and covered by the documented baseline. |
| **Partial** | Some foundations exist, and the page identifies what is missing. |
| **Target** | An agreed design that is not yet fully implemented. |
| **Exploring** | An idea or working proposal that may change. |

## Start here

- [Product and audience](020-product-and-audience.en.md): understand the product
  model, the people who interact with Feluqa, and what the platform provides.
- [Taxonomy](030-taxonomy.en.md): learn the shared meanings of Application, Platform,
  developer kit (SDK), module, product, and other terms.
- [Architecture overview](040-architecture-overview.en.md): see how source code,
  modules, build artifacts, runtime components, and deployment targets fit
  together.
- [Create your first application](/learn/get-started/first-application/create-your-first-application): see
  the planned path from project setup to a useful running application.

## Continue reading

- [Security model](../../030-security/010-authorization-model.en.md): explore
  authorization and isolation.
- [Install an app on a new server](../../080-deployment/010-installing-an-app-with-the-cli.en.md):
  follow the deployment workflow.
