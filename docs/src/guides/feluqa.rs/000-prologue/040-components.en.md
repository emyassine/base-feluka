---
sidebarTitle: "Components"
icon: "battery-charging"
title: "Components"
description: "The major capabilities Feluqa brings together, what is available today, and what remains a product direction."
summary: "Introduces the components Feluqa brings together across application foundations, asynchronous server execution, web and API services, identity and access control, data persistence, modules, panels, console tooling, live interactions, deployment, and agent workflows. It marks each area by implementation status and explains Feluqa's batteries-included approach."
date: 2026-10-29
lastmod: 2026-10-29
weight: 4
status: "Exploring"
tags: [feluqa, components, capabilities, architecture]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Components

**Feluqa is all batteries included**: it brings common application capabilities
together so a team can focus on its Product's workflows. These components should
have clear contracts and be replaceable where an Application needs a different
implementation.

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

<div class="feluqa-components-grid">
  <SpotlightCard v-for="component in foundation" :key="component.name" class="feluqa-component-card">
    <img class="feluqa-component-card__icon" :src="component.avatar" alt="" aria-hidden="true" />
    <div class="feluqa-component-card__heading">
      <h3>{{ component.name }}</h3>
    </div>
    <p class="feluqa-component-card__description">{{ component.desc }}</p>
    <span class="feluqa-component-card__status">{{ component.title }}</span>
  </SpotlightCard>
</div>

### Platform and data services

<div class="feluqa-components-grid">
  <SpotlightCard v-for="component in platform" :key="component.name" class="feluqa-component-card">
    <img class="feluqa-component-card__icon" :src="component.avatar" alt="" aria-hidden="true" />
    <div class="feluqa-component-card__heading">
      <h3>{{ component.name }}</h3>
    </div>
    <p class="feluqa-component-card__description">{{ component.desc }}</p>
    <span class="feluqa-component-card__status">{{ component.title }}</span>
  </SpotlightCard>
</div>

### Development, extension, and operations

<div class="feluqa-components-grid">
  <SpotlightCard v-for="component in operations" :key="component.name" class="feluqa-component-card">
    <img class="feluqa-component-card__icon" :src="component.avatar" alt="" aria-hidden="true" />
    <div class="feluqa-component-card__heading">
      <h3>{{ component.name }}</h3>
    </div>
    <p class="feluqa-component-card__description">{{ component.desc }}</p>
    <span class="feluqa-component-card__status">{{ component.title }}</span>
  </SpotlightCard>
</div>

<script setup>
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
  { avatar: applicationIcon, name: 'Application foundation', title: 'In progress', desc: 'Compile-time checks and metadata define app contracts; composition remains in progress.' },
  { avatar: asyncIcon, name: 'Async execution', title: 'Server foundation', desc: 'Tokio runs server tasks, I/O, and timers; other target runtimes remain product work.' },
  { avatar: webIcon, name: 'Web and APIs', title: 'Available; evolving', desc: 'Axum routes HTTP; Tower provides middleware and services. Inertia remains future work.' },
]

const platform = [
  { avatar: identityIcon, name: 'Identity and access', title: 'Foundations available', desc: 'Accounts, roles, server sessions, CSRF, tenant identities, and audit persistence are available. The System Panel remains unfinished.' },
  { avatar: dataIcon, name: 'Data persistence', title: 'Available foundations', desc: 'SeaORM supports SQLite and PostgreSQL with named pools and embedded migrations. Backup and restore need release qualification.' },
  { avatar: panelsIcon, name: 'Panels and resources', title: 'Integration in progress', desc: 'The panel catalogue and typed UI schemas define shared contracts. Full System Panel and UI integration remain unfinished.' },
  { avatar: liveIcon, name: 'Live actions', title: 'Typed dispatch available', desc: 'Signed, typed Live dispatch works; shared replay and browser sync remain unfinished.' },
]

const operations = [
  { avatar: modulesIcon, name: 'Modules', title: 'Static composition', desc: 'Apps currently compose statically compiled Rust modules. Dynamic installation, upgrades, and removal remain product goals.' },
  { avatar: consoleIcon, name: 'Console and CLI', title: 'Available; evolving', desc: 'CLI and console provide commands, profiles, binaries, and handlers.' },
  { avatar: deploymentIcon, name: 'Deployment', title: 'Product target', desc: 'Standalone builds, deployment, rollback, backup, and restore remain product goals. No end-to-end path is release-qualified yet.' },
  { avatar: agentsIcon, name: 'Agent workflows', title: 'Product direction', desc: 'Agents are meant to inspect, propose, validate, and package changes for review. This complete workflow remains unavailable.' },
]
</script>
Each area above is labelled with its current status. Feluqa's implementation
continues to evolve, so the capability guides describe what is available and
what remains a product direction.
