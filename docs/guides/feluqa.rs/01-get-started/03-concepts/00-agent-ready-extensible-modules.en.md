---
icon: "blocks"
title: "Agent-Ready, Extensible Modules"
description: "Feluqa's belief that agents should help users create and evolve product-specific software through explicit extension points."
summary: "States Feluqa's belief that broad shared capabilities can be affordable while organisations shape the specialised depth of their Products. It describes extensible Modules and Features, explicit hooks and contracts for user-selected agents, CLI-assisted software generation and verification, and the intended cost and deployment benefits while marking the agent workflow as a target."
date: 2026-10-29
lastmod: 2026-10-29
weight: 0
status: "Target"
tags: [feluqa, concepts, modules, agents, extensibility]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Agent-Ready, Extensible Modules

Feluqa's belief is that **breadth is now affordable; depth belongs to users**.

The platform should provide a broad, shared foundation, while each
organisation shapes the specialised software its work requires.

## Software that can be extended

Feluqa Modules and Features are intended to be extensible through explicit,
documented contracts and hooks. Those extension points let a developer or an
authorised AI agent create new capabilities for a Product without waiting for
every organisation-specific workflow to become part of the Feluqa Platform.

An agent should be able to understand a project's schemas, module manifests,
available capabilities, and extension points; propose or implement a Module
or Feature; and help evolve it as business needs change. The resulting work
should be ordinary, reviewable software with clear ownership, dependencies,
permissions, and version history.

## Agents use the tools the developer chooses

Feluqa is intended to work with local agents and with other agents chosen by
the organisation. A local agent can work with business requirements, source,
and data inside the organisation's controlled environment. If an organisation
chooses an external agent, it controls that choice and the information made
available to it; Feluqa does not assume that every agent is local or that every
provider handles data in the same way.

The Feluqa CLI is intended to help agents use the same project workflow as
developers: inspect the project, make changes through supported extension
points, compile, validate, run tests and evaluations, package, and distribute
the result. Machine-readable commands, declared capabilities, scoped agent
identities, approval rules, and audit records are part of this direction.

## Evolve products without building every possibility up front

Instead of implementing every specialised workflow in the Platform, Feluqa
aims to let organisations add or refine product capabilities as needs arise.
An agent can help make that change quickly, reducing the time and cost of
adding specialised capabilities. Compilation, validation, review, and
controlled distribution keep it part of the application's normal software
lifecycle. This is the intended route to evolvable software, not a claim that
arbitrary uncompiled code can be inserted into a running application.

## Direction and current status

Agent-ready extension contracts, agent identities, provider choice, and
machine-driven build and distribution workflows are product direction. The
repository has foundations for the Feluqa CLI, console, module contracts, and
build-time tooling, but the complete agent workflow, dynamic module lifecycle,
and companion agent product are not implemented. See [the complementary
agent project](../../00-prologue/04-feluqa-agent-companion.en.md) for the
proposed relationship between Feluqa and a separate agent product.
