---
title: "SPMPST | Numerimondes"
sidebarTitle: "SPMPST"
icon: "@spmpst::icon::folder-tree"
description: "SPMPST is a standard in development for building fast websites from portable Markdown content trees."
lang: en
status: "ready-for-review"
category: platforms
js-events:
  - uncollapse-sidebar
---

<HeroThree
  eyebrow="OUR STANDARD · IN DEVELOPMENT"
  title="A standard for <span class='silky-bbi'>fast websites</span> built from portable content."
  description="SPMPST defines how a site’s content is structured before it is built, so the site stays fast and the content stays yours."
  height="40vh"
/>

<div>

## What it is

SPMPST stands for **Standard Portable Markdown Pre-SSG Tree**. It is a specification created at Numerimondes to structure Markdown content, configuration and resources before they are handed to a site generator. This website is built from such a tree.

## Why it matters

- **Speed**: sites are generated ahead of time and can work offline, depending on the target implementation.
- **Portability**: content is plain Markdown and structured resources, not locked into one tool.
- **Multilingual and structured**: metadata, navigation, languages and assets are part of the structure.
- **One package per site**: output and packaging are produced site by site.

## Current state

The specification is a draft. A reference preparation workflow and a VitePress adapter are part of the current work. A Feluqa/Rust adapter and wider conformance work are planned. Each capability should be validated against an implementation before being treated as supported.

## Collaboration

We welcome technical discussions on content portability, static site generation and documentation tooling, as well as website projects built on this approach.

<Button tag="a" href="/company/contact?topic=project" label="Discuss a website project" />

</div>
