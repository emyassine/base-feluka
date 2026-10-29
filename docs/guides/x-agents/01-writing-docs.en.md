---
icon: "file-pen-line"
title: "Writing Published Feluqa Documentation"
description: "A workflow for writing accurate Feluqa docs that preserve product intent, use canonical terms, and stand on their own on the documentation site."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, agents, skills, documentation, writing]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Writing Published Feluqa Documentation

Use this workflow when creating or revising documentation intended for the
Feluqa documentation site. The site is independent of the monorepo. Write for
the people who will read the published page, and preserve the product owner's
meaning rather than turning it into a simpler but different idea.

## Read the source material first

1. Read the whole source document when the user names it as the basis for a
   page. Do not infer its thesis from one section or a search excerpt.
2. Read Feluqa's canonical taxonomy and product intent. Check the relevant
   architecture, roadmap, and implementation-status documents before making
   claims about terms, capabilities, or plans.
3. Inspect the current documentation tree and nearby pages. Paths and
   numbering can change; do not assume a path from earlier conversation is
   still current.
4. Keep a short map of which ideas belong in which pages before drafting. Use
   a concept page for one idea, a product page for a product proposal, and a
   reference page for detailed behavior. Do not compress several distinct
   ideas into a generic summary.

## Preserve the owner's intent

- Keep the owner's actual thesis and distinctions. Do not reduce an idea about
  extensible Modules, Features, hooks, agents, local execution, privacy,
  compilation, and distribution to a generic statement about small teams or
  automation.
- When asked to remove one reference or phrase, make that narrow change and
  preserve the surrounding wording unless the user asks for a rewrite.
- Do not introduce analogies, competitors, authors, or claims the user has
  rejected. In particular, do not add a monopoly framing or a reference to
  Peter Thiel or *Zero to One* when writing Feluqa's own strategy.
- Retain the reader's agency. Prefer "your Product" or "your Application"
  when the reader may be a founder, company, CTO, developer, contractor,
  student, operator, or customer. Do not assume every reader personally wrote
  the software.
- If a commercial, licensing, or ownership promise is ambiguous, clarify it
  before publishing a commitment. Distinguish "free of charge" from freedom
  to use, modify, contribute, or distribute.

## Use the canonical taxonomy

Read Feluqa's [Taxonomy](../feluqa.rs/01-get-started/00-introduction/03-taxonomy.en.md)
before introducing or changing a domain term. In particular, keep these
boundaries clear:

- A **Product** is the business solution offered to an organisation or user.
- An **Application** is a deployable program for an execution role.
- A **Module** is a reusable unit of business capability included in an
  Application; a **Feature** is an optional capability within a Module or
  Application.
- The **Feluqa SDK** is the development API and tooling. The **Feluqa
  Platform** is the runtime and control plane. Do not use either term as a
  synonym for a customer Product.
- A **crate** is a Rust compilation unit; a **package** is a Cargo package;
  a **workspace** contains related packages and projects.

Avoid vague references such as "the repository" when they could mean the
private Feluqa monorepo, a product workspace, a Cargo package, a crate, a
source distribution, or a customer's code. Name the exact thing.

## Keep site documentation independent of the monorepo

Published docs must make sense to someone who has never seen the private
monorepo. Do not link to root files such as `LICENSE.md`, `README.md`, or
`README_Product_Document_Intent.en.md` with relative filesystem paths. Summarise
the relevant content in the guide and link to another published guide page,
the public website, or a file distributed with the relevant source code.

Do not make an unavailable UI or CLI resource sound live. If a future System
Control Panel resource, public issue tracker, agent companion, or workflow is
planned, say it is planned and explain the current path only if one exists.

## Separate beliefs, targets, and delivered behavior

Use repository status documents and code to label claims accurately:

- **Delivered** means implemented and supported in the current repository.
- **Target** means an explicit product direction that is not yet a delivered
  guarantee.
- **Exploring** means a hypothesis under evaluation.

The product intent document is normative for product direction, but it does
not make a Target feature current. Do not present future dynamic Modules,
agent identities, local-agent orchestration, model-provider choice, hooks,
compile/package/distribute flows, or a companion project as implemented unless
the current status documentation confirms it. Use "is intended to", "is a
target", or "is planned" where appropriate.

Avoid unsupported percentages, performance claims, security guarantees, or
claims that proprietary or open-source licensing by itself makes software
secure. For technical security claims, use accurate wording and link to
authoritative references.

## Explain licensing and AI choices without conflating them

- Proprietary describes ownership and distribution; it does not by itself
  mean no participation, no contributions, or no right to create Products.
- State the owner's explicit guarantee about free Application creation and
  Product use before explaining framework ownership or optional services.
- Keep the rights to the Feluqa SDK and Platform distinct from rights to a
  customer Product, its Applications and Modules, and customer-specific source.
- If selective open-source releases are part of the stated direction, say
  which parts are confirmed and which crate-level decisions remain open. Do
  not imply every crate will be published.
- Feluqa is intended to support local agents and agents selected by the user.
  Explain that the local path can keep business-specific context in the
  organisation's controlled environment; do not promise that a remote agent
  will keep data private. Describe the complementary agent project as separate
  and planned until it exists.
- Do not imply agents can inject uncompiled code into a live application.
  Describe the intended workflow through explicit hooks/contracts, CLI
  inspection, generation, compilation, validation, testing, packaging, and
  controlled distribution; state which steps are not implemented yet.

When the content is a service offer, keep it in a clearly labelled section
after the reader-facing product and licensing explanation. Do not turn a
licensing introduction into an unexpected sales pitch.

## Structure and file naming

- Keep one concept per Markdown file under `01-get-started/03-concepts/`.
  Use a descriptive, topic-specific filename such as
  `00-agent-ready-extensible-modules.en.md`.
- Choose filenames and page titles that remain distinct across the whole
  future site. Avoid generic repeated names such as `overview`, `concepts`, or
  `getting-started` when a more specific slug is available.
- The `.en.md` suffix identifies English. Do not repeat it with `lang: en` in
  front matter.
- Include the required `icon` field and follow nearby front-matter structure.
- Use an ordered folder structure consistently; add an Upgrade Guide only
  when a prior major version exists to upgrade from.

## Final review

Before finishing:

1. Compare the page against the owner's source text and confirm the core idea
   has not been flattened, contradicted, or expanded into an unapproved
   promise.
2. Check Product, Application, Module, Feature, SDK, Platform, and CLI usage
   against the Taxonomy.
3. Verify implementation-status statements against the current repository
   guidance. Treat unknown or incomplete behavior as unknown or incomplete.
4. Check every local link from the page's actual location. Do not rely on
   monorepo-relative links for a published site.
5. Run `git diff --check`. For documentation-only changes, review links,
   terminology, front matter, and rendering structure; do not run a runtime
   test suite unless requested or required by repository guidance.
