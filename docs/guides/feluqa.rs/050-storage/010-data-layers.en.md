---
icon: "layers"
title: "Data Layers: TOML, SQLite, JSON and Memory"
description: "Which format or store to use for manifests, runtime settings, business data, exchanges and temporary state."
summary: "Maps TOML, SQLite, JSON, and in-memory storage to manifests, runtime settings, business data, exchanges, and temporary state. It explains how interface changes are persisted and applied, when to use typed columns or validated JSON, and why synchronization across devices requires a separate design."
date: 2026-100-29
lastmod: 2026-100-29
weight: 1
status: "Target"
tags: [feluqa, storage, sqlite, toml, json]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Data Layers

| Layer | Used for |
| --- | --- |
| **TOML** | Manifest and rarely changed deployment settings, such as `feluqa.toml`. |
| **SQLite** | Settings editable in the UI, persistent module state, and business data that changes at runtime. |
| **JSON** | Exchanges: APIs, structured CLI output, exported documents. |
| **Memory** | Temporary state that does not need to survive a restart. |

```mermaid
flowchart LR
    UI[UI change] --> V[Server-side validation<br/>+ authorization]
    V --> TX[SQLite transaction]
    TX -->|commit| RT[Apply to runtime]
    TX -->|rollback| ERR[Error to user]
    TOML[feluqa.toml] -. read at startup .-> RT
    API[API / CLI] <-->|JSON| RT
```

## Rule

A value changed in the interface **does not rewrite the TOML file**. The app saves the change in SQLite, commits the transaction, then applies the new value to the runtime.

For structured settings use typed columns or validated JSON, depending on need. Important, frequently searched business data deserves a relational schema.

## Practical rules

- Versioned migrations.
- Transactions for related changes.
- Consistent backups.
- Server-side validation.
- Authorization on every mutation.

Synchronization between several devices is a **separate rule to define**. Local SQLite does not provide it by itself.
