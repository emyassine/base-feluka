---
icon: "git-pull-request"
title: "Contribution Guide"
description: "How to prepare a Feluqa contribution and use the contributor and agent skill guides."
summary: "Describes how prospective contributors can contact Feluqa, discuss scope and terms, and request monorepo access when needed. It sets expectations for implementation proposals, documentation, validation, and honest status reporting, and explains how the x-agents skills support contributors without replacing repository instructions."
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
describe what you would like to improve, and request access to the private
monorepo if you need it. A public issues and discussions space for these
requests is planned and will be linked from the GitHub page when ready.

Maintainers will work with you on scope and implementation, arrange access,
and agree the terms for your contribution before incorporating it. Read
[Build with Feluqa](02-licence.en.md) for the licensing model and contribution
terms.

Organisations interested in building a product or contributing to the Feluqa
SDK with their own engineering team can also use the contact path above. The
licence page explains the client-product and internal-team options.

For work authorized under those terms, identify the affected product, crate,
documentation page, or roadmap item. Read the relevant guide and inspect the
current implementation before proposing a change. Describe current behavior
and implementation status accurately; keep unfinished work in the roadmap.

## Working agreements

- Follow the repository's `AGENTS.md`, Rust coding standard, and documentation
  voice and tone.
- Keep changes focused on a useful behavior or clear documentation outcome.
- For Rust changes, use the documented facade APIs and lint policy, handle
  errors explicitly, and include coverage appropriate to the behavior changed.
- For documentation changes, check links, terminology, and whether claims match
  the implementation and roadmap.
- Run the checks appropriate to the change and report what you ran and any
  existing failures.

The repository's `AGENTS.md` is the authoritative engineering workflow for
this checkout. These guidelines provide a versioned entry point for
contributors; update them when the repository workflow changes.

## Skills for AI agents

Feluqa also maintains [`x-agents`](../../x-agents/00.index.en.md), a collection
of skills for AI agents working with Feluqa. Skills provide reusable,
task-specific workflows. They supplement repository instructions; they do not
replace `AGENTS.md`, the coding standard, or the relevant product guides.

Human contributors can read the skills as useful references, but do not need
to install or use agent-specific tooling to contribute.
