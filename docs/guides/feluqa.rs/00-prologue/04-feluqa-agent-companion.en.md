---
icon: "bot"
title: "A Complementary Agent Project"
description: "How a separate, user-chosen AI agent could work with Feluqa to create and evolve product software."
date: 2026-10-29
lastmod: 2026-10-29
weight: 4
status: "Exploring"
tags: [feluqa, agents, complementary-projects, product-direction]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# A Complementary Agent Project

Feluqa is intended to work with AI agents, but Feluqa and an agent product are
separate projects. Feluqa provides the platform, SDK, extensible Modules and
Features, and developer tools. A complementary agent project could help people
and organisations use those building blocks to create and evolve their own
Products.

## Choose where the agent runs

Organisations should be able to use a local agent or choose any other agent
they want through an integration the companion supports. A local deployment can
keep business requirements, source code, and project data within the organisation's
controlled environment. An organisation that chooses a remote agent decides which
provider to use and what information to make available to it. The companion project
should make this choice explicit rather than requiring every user to send
business-specific context to one external service.

## Let the agent work through Feluqa's contracts and tools

The agent should use Feluqa's machine-readable project descriptions, module
manifests, schemas, capabilities, permissions, and documented extension
points. It could then create or change a Module or Feature to meet a
product-specific need, while respecting the organisation's access and
approval rules.

The Feluqa CLI is intended to provide the engineering workflow under the
agent: inspect a project, generate or update source, compile it, validate the
result, run tests and evaluations, package it, and distribute it through the
chosen channel. The workflow should return machine-readable results so the
agent and its user can see what succeeded and what needs attention.

This makes it possible to add a new part to a Product without hand-building
every framework layer or enduring a complex deployment process. The agent
helps produce software; Feluqa's contracts, compiler, policy checks, review,
and release workflow keep the result within the application's lifecycle.

## Intended relationship and status

This agent companion is a complementary product direction, not a delivered
Feluqa feature. The repository does not yet provide the complete agent
orchestration, local-agent runtime, provider selection, dynamic extension,
compilation-to-distribution workflow, or a named companion product. The
[agent-ready extensibility concept](../01-get-started/03-concepts/00-agent-ready-extensible-modules.en.md)
describes the corresponding Feluqa platform direction.
