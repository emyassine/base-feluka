---
icon: "layout-dashboard"
title: "System Panel (Feluqa Core)"
description: "The built-in control plane: first-run setup, users, privileges, roles, permissions, modules, features, configuration, audit and licensing."
date: 2026-10-29
lastmod: 2026-10-29
weight: 4
status: "Target"
tags: [feluqa, system-panel, core, administration]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# System Panel (Feluqa Core)

The System Control Panel is part of the Feluqa Platform. It administers one Platform instance at `/system`, separately from business application panels.

## Sections

| Section | Purpose | Minimum privilege |
| --- | --- | --- |
| **Setup** | First-run bootstrap of the `platform-owner` for this Platform instance | One-time token |
| **Users** | Accounts, origin (internal/external), privilege level, sessions | `super-admin` |
| **Roles and permissions** | Browse the generated permission table, build roles, assign them | `super-admin` or delegated permission |
| **Modules** | Install, activate, deactivate, upgrade, uninstall by domain | `sysadmin` |
| **Features** | Toggle features per license or tenant | `sysadmin` |
| **Tenants** | Lifecycle: create, suspend, archive, restore | `super-admin` |
| **Configuration** | Typed settings generated from `#[config]` | `sysadmin` |
| **Licensing** | License status and domain activation | `platform-owner` |
| **Audit** | Every allow/deny, privilege change and install action | Audit permission |
| **Health** | Version, migrations, storage, backups | `staff` |

## Rules

- The System panel is the **only** place where permissions are listed from the generated table. Nothing is created by hand or in a seed.
- Its own handlers are gated like any other: privilege level first, then permission.
- It can be disabled on exposed networks (`system.bind = "127.0.0.1"` or management port).
- Destructive actions (uninstall, purge data, transfer ownership) require re-authentication and show what data will be kept.
