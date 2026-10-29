---
sidebarTitle: "Contributing"
icon: "git-pull-request"
title: "Contribution Guide"
description: "How to propose a Feluqa contribution and find the guides for working with the Feluqa team."
summary: "Explains how to propose a contribution through Feluqa's GitHub page, discuss scope and terms with maintainers, and find the core contribution guidance and AI-agent skills."
date: 2026-10-29
lastmod: 2026-10-29
weight: 3
status: "Exploring"
tags: [feluqa, contribution, development, agents]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Contribution Guide

We welcome contributions and aim to collaborate directly with contributors.
Start by reaching out through [Feluqa on GitHub](https://github.com/feluqa/),
describe what you would like to improve, and request the access needed for the
work. A public issues and discussions space for these requests is planned and
will be linked from the GitHub page when ready.

Maintainers will work with you on scope and implementation, arrange access,
and agree the terms for your contribution before incorporating it. Read
[Build with Feluqa](020-licence.en.md) for the licensing model and contribution
terms. For source-level engineering guidance, see
[Core Contribution](../../feluqa-internals/index.en.md).

Organisations interested in building a Product or contributing to Feluqa's
developer tools (SDK) with their own engineering team can also use the contact
path above. The licence page explains the client-product and internal-team
options.

## Working agreements

- Follow the contribution instructions, Rust coding standard, and documentation
  voice and tone that apply to the work.
- Keep changes focused on a useful behavior or clear documentation outcome.
- For Rust changes, use the documented facade APIs and lint policy, handle
  errors explicitly, and include coverage appropriate to the behavior changed.
- For documentation changes, check links, terminology, and whether claims match
  current implementation and product direction.
- Run the checks appropriate to the change and report what you ran and any
  existing failures.

The source-level engineering rules are collected in the
[Core Contribution](../../feluqa-internals/index.en.md) section.
These published guides provide contributors with an entry point to that work.

## Skills for AI agents

Feluqa also maintains [`x-agents`](../../x-agents/000.index.en.md), a collection
of skills for AI agents working with Feluqa. Skills provide reusable,
task-specific workflows. They supplement the relevant contribution and
technical guides; they do not replace the applicable engineering rules.

Human contributors can read the skills as useful references, but do not need
to install or use agent-specific tooling to contribute.
