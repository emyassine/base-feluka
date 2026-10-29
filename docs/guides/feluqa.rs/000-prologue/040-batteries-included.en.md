---
sidebarTitle: "Batteries"
icon: "battery-charging"
title: "Batteries Included"
description: "The major capabilities Feluqa brings together, what is available today, and what remains a product direction."
summary: "Introduces Feluqa's batteries-included approach across application foundations, asynchronous server execution, web and API services, identity and access control, data persistence, modules, panels, console tooling, live interactions, deployment, and agent workflows. It marks each area by implementation status, defines async, Tokio, Axum, and adapters, and identifies inertia-omega as an alpha integration lead rather than a selected dependency."
date: 2026-10-29
lastmod: 2026-10-29
weight: 4
status: "Exploring"
tags: [feluqa, batteries-included, capabilities, architecture]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Batteries Included

Feluqa brings common application capabilities together so a team can focus on
its Product's workflows. The direction is **batteries included, but
removable**: capabilities should have clear contracts and be replaceable where
an Application needs a different implementation.

Feluqa's ambition is to become the standard all-in-one ecosystem for building
Rust applications: the breadth of reusable components associated with
Symfony, the developer experience associated with Laravel, a product-building
layer in the spirit of Filament, and first-class desktop experiences that
belong alongside environments such as KDE. These are references for the
coherence and reach Feluqa aims to offer, not claims of feature parity or
affiliation.

The goal is a connected system of components, tools, and conventions that
teams can adopt as a whole or compose around their needs. “All in one” does
not mean every capability must be fused into one runtime: components should
have clear boundaries and contracts.

Some foundations are already available. Other capabilities are incomplete or
still product goals. The status beside each area describes Feluqa today; it
does not promise that every battery is finished or replaceable yet.

## Terms used on this page

| Term | Meaning here |
|---|---|
| **Asynchronous (`async`)** | A way to express work that can pause while waiting and resume later, allowing a runtime to schedule other work in the meantime. |
| **Asynchronous runtime** | The executor and supporting services that poll asynchronous tasks and provide facilities such as network I/O and timers. |
| **Tokio** | The asynchronous runtime used by Feluqa's current server profile. |
| **Axum** | The HTTP web framework used by Feluqa's current server profile. |
| **Adapter** | A boundary that connects a library or protocol to a framework, such as an Axum adapter for the Inertia server protocol. |
| **Inertia.js** | A way to build server-routed single-page applications with a frontend framework. The Rust `inertia-omega` project provides an alpha server implementation and Axum adapter; Feluqa has not selected it. |
| **Battery** | A capability Feluqa makes available or aims to provide through a documented contract. “Removable” is a product requirement; it does not mean every current capability can already be replaced. |

## The major capabilities

### Application and runtime foundation

<VPTeamMembers size="small" :members="foundation" />

### Platform and data services

<VPTeamMembers size="small" :members="platform" />

### Development, extension, and operations

<VPTeamMembers size="small" :members="operations" />

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import applicationIcon from '../art/batteries-included/code-xml.svg'
import asyncIcon from '../art/batteries-included/timer.svg'
import webIcon from '../art/batteries-included/server-cog.svg'
import identityIcon from '../art/batteries-included/shield-check.svg'
import dataIcon from '../art/batteries-included/database-zap.svg'
import panelsIcon from '../art/batteries-included/panel-top.svg'
import liveIcon from '../art/batteries-included/activity.svg'
import modulesIcon from '../art/batteries-included/blocks.svg'
import consoleIcon from '../art/batteries-included/terminal.svg'
import deploymentIcon from '../art/batteries-included/cloud-cog.svg'
import agentsIcon from '../art/batteries-included/bot.svg'

const foundation = [
  { avatar: applicationIcon, name: 'Application foundation', title: 'In progress', desc: 'SDK, compile-time checks, and application metadata establish shared contracts. Application composition is still being completed.' },
  { avatar: asyncIcon, name: 'Async execution', title: 'Server foundation', desc: 'The server profile uses Tokio for asynchronous tasks, network I/O, and timers.' },
  { avatar: webIcon, name: 'Web and APIs', title: 'Available; evolving', desc: 'Axum handles HTTP routing with Tower services and middleware. Inertia support remains a possible future integration.' },
]

const platform = [
  { avatar: identityIcon, name: 'Identity and access', title: 'Foundations available', desc: 'Accounts, roles, server-side sessions, CSRF, tenant identities, and audit persistence are available. The complete System Panel is unfinished.' },
  { avatar: dataIcon, name: 'Data persistence', title: 'Available foundations', desc: 'SQLite and PostgreSQL support uses SeaORM, named pools, and embedded migrations. Backup and restore need release qualification.' },
  { avatar: panelsIcon, name: 'Panels and resources', title: 'Integration in progress', desc: 'The panel catalogue and typed UI schemas provide shared contracts. The full System Panel and UI integration remain incomplete.' },
  { avatar: liveIcon, name: 'Live actions', title: 'Typed dispatch available', desc: 'Signed, typed actions are supported. Browser reconciliation and shared replay protection remain unfinished.' },
]

const operations = [
  { avatar: modulesIcon, name: 'Modules', title: 'Static composition', desc: 'Applications compose statically compiled Rust modules. Dynamic installation, upgrades, and removal remain product goals.' },
  { avatar: consoleIcon, name: 'Console and CLI', title: 'Available; evolving', desc: 'The CLI and console framework provide project commands, named binaries, profiles, and handlers.' },
  { avatar: deploymentIcon, name: 'Deployment', title: 'Product target', desc: 'Standalone builds, deployment, rollback, backup, and restore are not yet a qualified end-to-end path.' },
  { avatar: agentsIcon, name: 'Agent workflows', title: 'Product direction', desc: 'Agents should inspect, propose, validate, and package changes through explicit, reviewable steps. The complete workflow is not available yet.' },
]
</script>
Each area above is labelled with its current status. Feluqa's implementation
continues to evolve, so the capability guides describe what is available and
what remains a product direction.
