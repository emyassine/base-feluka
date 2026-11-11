---
layout: articles
title: "SPMPST: A Portable Content Tree for Websites | Numerimondes"
sidebarTitle: "SPMPST"
author: "yassine-el-moumen"
icon: "@spmpst::icon::folder-tree"
description: "SPMPST is a draft standard for structuring portable Markdown content, metadata, configuration and resources before a site generator builds the website."
summary: "SPMPST separates a site's portable source tree from its generated website, with a preparation workflow and VitePress adapter under development."
image: "/images/home/initiatives/spmpst.svg"
imageAlt: "SPMPST project mark"
status: "Draft - ready for review"
category: "technology-and-standards"
tags: [spmpst, markdown, static-sites, content-portability, standards]
date: 2026-11-11
---

# A portable source tree, before the site generator

A website is more than its rendered pages. It also has source content, navigation, language variants, configuration and media. **SPMPST — Standard Portable Markdown Pre-SSG Tree — is a draft standard for organizing those inputs as a portable project before a static site generator turns them into a website.**

The aim is to keep the source project understandable and reusable while allowing a renderer to produce the final pages. Numerimondes is developing SPMPST alongside a preparation workflow and a VitePress adapter; this site is built through that work.

## Why put a standard before the generator?

Static site generators often define their own directory conventions and configuration formats. That works for producing a site, but can tie source content and navigation to one tool. SPMPST explores a shared layer that describes the site before a generator takes over.

That layer can give a project one place to define its Markdown, routes, languages, metadata, resources and site concerns. A renderer can then adapt the prepared project to its own build process. VitePress is the current integration; other adapters and broader compatibility remain future work.

## What the tree describes

An SPMPST project keeps content and its supporting structure together:

- Markdown pages and collections;
- localized titles, descriptions and navigation;
- site configuration for appearance, links and other concerns;
- references to media, icons and shared resources;
- the route and output ownership of each site.

The goal is a source tree that can be inspected and maintained without treating generated HTML as the original content. Preparation validates and resolves the project inputs, then gives the selected site generator the material it needs to build.

## What the current implementation does

The current VitePress host reads each site's declaration and configuration, discovers Markdown sources, prepares localized routes, resolves configured assets, and generates VitePress inputs. VitePress then builds the published site. The Numerimondes source tree and the resulting static output remain separate.

This workflow demonstrates the approach in one implementation. It does not establish that every SPMPST feature already works in every generator, or that a project can move between adapters without changes.

## Portability and offline use

Markdown and ordinary project files make the source easier to inspect, keep and move. SPMPST's configuration and preparation rules still need explicit support from an adapter, so portability depends on the implemented contract and the target generator.

A static site can be hosted without a server-side application, and its assets can be bundled locally. Offline behavior depends on how the target site is built and deployed; SPMPST alone does not guarantee offline access or synchronization.

## Status and next work

SPMPST is in development. The reference preparation workflow and VitePress integration are active work. The formal specification, validation across implementations, conformance material, and a Feluqa/Rust adapter remain incomplete or planned. Capabilities should be described according to what an implementation has verified.

We welcome technical discussions about portable content trees, static site generation and documentation tooling, as well as website projects built on this approach.

<Button tag="a" href="/company/contact?topic=project" label="Discuss a website project" />
