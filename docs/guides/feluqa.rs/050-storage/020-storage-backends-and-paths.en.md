---
icon: "hard-drive"
title: "Storage Backends and Paths"
description: "SQLite versus PostgreSQL, browser storage, per-module storage paths, and how this compares with editors such as Zed."
summary: "Compares SQLite, PostgreSQL, and browser storage by deployment and use, and relates persistent state to user-owned storage locations. It explains context-derived Module paths and the storage facade, then gives exploratory criteria for deciding when to switch backends."
date: 2026-100-29
lastmod: 2026-100-29
weight: 2
status: "Exploring"
tags: [feluqa, storage, postgresql, sqlite, paths]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Storage Backends and Paths

SQLite can serve as storage for Feluqa apps, as some editors do for local data. The right choice depends on **where the application runs and how it is used**.

| Deployment | Recommended store | Notes |
| --- | --- | --- |
| Hosted app, shared data, several users | **PostgreSQL** | Natural choice for multi-user business data. |
| Small installation on one server | SQLite | Acceptable while concurrent writes and availability needs stay modest. |
| Local workstation app | **SQLite** in the user's data directory | With migrations and backups. |
| Browser UI | Server stays the source of truth | `localStorage` for simple preferences, IndexedDB for structured offline data. These are per-browser and never replace the server database. |

The model resembles Zed's: editable settings in files, persistent state in a database, in a location owned by the user. Zed keeps user settings in JSON files with comments and workspace data (recent projects, tabs, panes) in SQLite databases in its user data directory ([Zed settings](https://zed.dev/docs/configuring-zed), [Zed troubleshooting](https://zed.dev/docs/troubleshooting)). Browser storage behavior is described in [MDN client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage).

> The exact criteria for switching from SQLite to PostgreSQL are still to be defined in the architecture.

## Storage paths

Storage is resolved from the context, never guessed:

```text
<product-or-platform>/storage/modules/<module-id>[/<submodule>]
```

Accessed through the facade `feluqa::storage_path()` or `ctx.storage()`. A crate without a module owner is an error.

## Proposed switch criteria (exploring)

| Signal | Move toward PostgreSQL |
| --- | --- |
| More than one app node | yes |
| Sustained concurrent writers | yes |
| High-availability or replication requirement | yes |
| Single node, single site, low write concurrency | stay on SQLite |
| Air-gapped or field deployment with no DB admin | stay on SQLite |
