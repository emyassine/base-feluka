---
sidebarTitle: "Async Runtimes"
icon: "@spmpst::icon::timer"
title: "Asynchronous Runtimes by Target"
description: "How Feluqa should use async execution on server, embedded, and real-time targets."
summary: "Explains that Rust async syntax produces futures but requires an executor to make progress. It records the current Tokio server runtime boundary, recommends against rewriting Tokio, and distinguishes embedded Embassy, real-time RTIC, and runtime-neutral futures utilities. It gives contributors a target-based checklist and cautions against assuming no_std, no allocation, and hard real-time guarantees are interchangeable."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, async, tokio, embassy, rtic, no-std]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Asynchronous Runtimes by Target

This page sets guidance for contributors working on Feluqa's runtime
architecture. It is not a rule that every Application must use the same
executor.

## Async syntax is not a runtime

Rust's `async` functions and blocks produce values that implement `Future`.
Calling an async function creates a future; it does not, by itself, run that
future. An executor polls futures and wakes them when the work they await can
continue. A runtime commonly adds target-specific services such as timers and
network I/O. See the [Rust async book](https://rust-lang.github.io/async-book/)
for the language and executor model.

We keep these concepts separate in Feluqa's APIs because shared business
logic should not depend on a particular executor. Runtime-specific facilities
belong to the target profile that provides them.

## Server profile: Tokio

The current Feluqa server profile uses Tokio for networking, timers, and task
execution. We keep Tokio as an external dependency because its established
runtime and ecosystem meet the server profile's current needs. Reimplementing
it or maintaining a fork would duplicate upstream's compatibility, security,
and maintenance work. We would revisit this choice only if a verified
requirement could not be met upstream.

We keep Tokio dependencies and types within the server profile so
`feluqa-core`, portable contracts, and `no_std` surfaces do not inherit a
server runtime. Shared APIs avoid Tokio-specific handles and synchronization
types because those would tie other target profiles to the server executor.

We treat vendoring as a build and supply-chain decision, for example for an
audited offline build. It does not require taking ownership of a runtime fork.

## Embedded and real-time targets

`no_std` does not choose an executor. We select the executor, timers, hardware
abstraction layer, and allocation policy based on each target's actual
requirements.

| Option | Role | Evaluation notes |
|---|---|---|
| [Embassy](https://embassy.dev/book/) | Async embedded ecosystem with executors, time support, networking components, and selected hardware abstraction layers. | We consider Embassy when an embedded Application benefits from its cooperative async model and supported hardware. Task allocation depends on executor configuration and features, so we do not describe all tasks as statically allocated by default. |
| [RTIC 2](https://rtic.rs/2/book/en/) | Interrupt-driven concurrency framework with priorities and resource scheduling; v2 software tasks use async functions. | We consider RTIC when an Application's interrupt and priority model fits. Hard real-time guarantees still require a defined timing model and analysis of the complete system. |
| [`futures-util`](https://docs.rs/futures-util/latest/futures_util/) | Utilities and combinators for working with futures, rather than a complete executor/runtime. | For constrained libraries, we disable default features and select only the utilities needed. Each utility has its own feature and allocation requirements; `alloc` enables heap-dependent functionality, and omitting it does not make every utility available. |

Embassy and RTIC solve different scheduling and hardware problems. They are
options to evaluate per target, not interchangeable defaults for every
Feluqa profile. Embassy documents its executor configuration and allocation
modes in the [Embassy Book](https://embassy.dev/book/).

## Selection checklist

We evaluate a runtime dependency against:

- the target profile and hardware or operating system;
- whether `std`, `alloc`, or neither is available;
- required networking, timers, hardware drivers, and executor facilities;
- concurrency and latency goals, including any hard deadlines;
- measured flash, RAM, stack, and scheduling costs on the target;
- dependency license, maintenance, MSRV, target support, and `unsafe` surface.

We do not describe an async runtime as providing hard real-time guarantees by
itself because timing depends on the complete system. We keep server runtime
dependencies out of portable and embedded contracts because shared
application-level async functions do not require a shared executor.
