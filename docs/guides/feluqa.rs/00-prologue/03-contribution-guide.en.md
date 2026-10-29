---
icon: "git-pull-request"
title: "Contribution Guide"
description: "How to prepare a Feluqa contribution and use the contributor and agent skill guides."
date: 2026-10-29
lastmod: 2026-10-29
weight: 3
status: "Exploring"
tags: [feluqa, contribution, development, agents]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Contribution Guide

Feluqa is proprietary. Before preparing material for inclusion, read the
[Licence and Ownership](02-licence.en.md) page. External contributions require
written terms agreed with NUMERIMONDES in advance; repository access or a
review discussion does not grant contribution rights.

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
