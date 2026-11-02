---
title: "SPMPST | Specification in Development"
sidebarTitle: "SPMPST"
icon: "@spmpst::icon::folder-tree"
description: "SPMPST is a proposed standard for portable structured Markdown trees and site-building workflows."
lang: en
status: "ready-for-review"
---
<NmEffectHero
  :full-bleed="false"
  :effect="['silk', { inject: { color: '#141D2A' } }]"
  :hero-style="{ minHeight: '56vh' }"
  eyebrow="DRAFT SPECIFICATION · NUMERIMONDES"
  title="Portable content structures for site-building workflows."
  description="SPMPST explores a structured, portable way to organize Markdown content and related resources before site generation."
  :title-style-light="{ color: '#ffffff' }"
  :title-style-dark="{ color: '#ffffff' }"
  :description-style-light="{ color: '#e2e8f0' }"
  :description-style-dark="{ color: '#e2e8f0' }"
  :buttons="[{ label: 'Discuss SPMPST', href: '/company/contact?topic=innovation' }, { label: 'Explore innovation', href: '/company/innovation/', style: 'secondary' }]"
/>

<div class="nm-home-copy">


# SPMPST

**Draft specification · In development**

## Portable content structures for site-building workflows.

SPMPST stands for **Standard Portable Markdown Pre-SSG Tree**. It is a specification initiative created at Numerimondes to define a structured, portable way to organize Markdown content, configuration and related resources before delivery to site-generation tools.

## Design goals

- Author content as understandable Markdown and structured resources.
- Keep content organization portable across rendering and build targets.
- Support multilingual sites, metadata, navigation and related assets.
- Support offline-capable built outputs, with dependencies controlled by the target implementation.
- Explore real-time rendering workflows, extensible components and automation-friendly conventions.
- Produce output and packaging per site.

## Current state

The specification is a draft. A reference preparation workflow and a VitePress-oriented adapter approach are part of the current technical work; a Feluqa/Rust adapter and broader cross-adapter conformance work remain planned. Individual capabilities should be validated against an implementation before being treated as supported.

## Collaboration

We welcome technical discussions around content portability, static site generation, documentation tooling and interoperability.

**Discuss SPMPST** → `/company/contact?topic=innovation`  
**Back to innovation** → `/company/innovation`

</div>
