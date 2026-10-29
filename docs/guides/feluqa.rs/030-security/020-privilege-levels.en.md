---
sidebarTitle: "Privileges"
icon: "badge-check"
title: "Privilege Levels"
description: "Platform-wide privilege levels (platform-owner, super-admin, sysadmin, staff) with internal and external origins, rank rules and delegation limits."
summary: "Defines privilege levels for administration of a single Platform instance and distinguishes them from application roles and permissions. It explains privilege origins, rank, use in gates, delegation limits, and an optional exploring clearance model for classified data, with examples and API sketches."
date: 2026-10-29
lastmod: 2026-10-29
weight: 2
status: "Target"
tags: [feluqa, security, privileges, origin, rank]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Privilege Levels

## Scope

Privilege levels govern administration of one **Platform instance only**:

- who can manage the platform itself (settings, modules, licensing, billing);
- who can configure or administer the instance.

They do **not** govern end users inside modules (hotel guests, bank customers, SaaS users), module-level customers, or fine-grained permissions. That is the job of [roles and permissions](010-authorization-model.en.md).

This is especially important for operational and defense-adjacent deployments, where "who may administer the system" must be answered independently from "who may use a given function".

## Levels

Each level exists in two **origins**:

- **Internal**: a direct member of the owning organization.
- **External**: a contractor, auditor, integrator or service provider.

| Level | Rank | Internal | External | Description |
| --- | --- | --- | --- | --- |
| `platform-owner` | 60 | yes | **never** | Ultimate authority over this Platform instance. One per instance. |
| `super-admin` | 50 | `super-admin` | `external-super-admin` | Full administrative access to platform features and modules. |
| `sysadmin` | 40 | `sysadmin` | `external-sysadmin` | Infrastructure, integrations and system configuration. |
| `staff` | 30 | `staff` | `external-staff` | Platform team member whose permissions come from assigned roles. |

`staff` is a platform administration level. **Member** is reserved for application-level end-user concepts. Platform privileges do not grant application permissions.

## Rank versus origin

- **Rank** is the hierarchy weight. It is identical for internal and external variants at the same level: a super-admin is a super-admin.
- **Origin** is a separate attribute. Platform policy can use it to control administrative visibility and access, for example limiting external operators to assigned system tasks.
- `platform-owner` has no external equivalent.

## API sketch

```rust
use feluqa::auth::{Privilege, Origin};

let p = ctx.user().privilege();

p.rank();                       // 30 / 40 / 50 / 60
p.origin();                     // Origin::Internal | Origin::External
p.is_at_least(Privilege::SysAdmin);
p.is_above(Privilege::Staff);
p.is_equivalent_to(Privilege::ExternalSysAdmin); // true for SysAdmin
```

## Using privilege in gates

```rust
// at least sysadmin, internal or external
#[feluqa::gate(require_privilege = SysAdmin)]
pub async fn rotate_keys(ctx: &Ctx) -> Result<()> { /* ... */ }

// internal staff only, whatever the rank
#[feluqa::gate(require_origin = Internal)]
pub async fn export_all_tenants(ctx: &Ctx) -> Result<Export> { /* ... */ }

// privilege AND permission, stacked gates combine with AND
#[feluqa::gate(require_privilege = SuperAdmin)]
#[feluqa::gate(require_permission = ManageModules)]
pub async fn uninstall_module(ctx: &Ctx, id: ModuleId) -> Result<()> { /* ... */ }
```

## Delegation rules

| Rule | Reason |
| --- | --- |
| Only the `platform-owner` can create or transfer the `platform-owner` privilege. | There is exactly one owner. |
| A user can assign only levels **strictly below** their own. | Prevents privilege escalation. |
| An external user can never be assigned `platform-owner`. | Ownership is internal by definition. |
| Changing a user's privilege requires re-authentication. | Protects against hijacked sessions. |
| Privilege changes are audited with actor, target, before and after. | Accountability. |
| Privilege level never grants module permissions by itself. | Avoids implicit super-powers; the exception is platform permissions explicitly mapped to a level. |

## Clearance (exploring)

For military and other high-security deployments, an optional **clearance** label can be attached to users and to data classes, independent of privilege and role. A user must hold both the permission and a clearance at least equal to the data's classification. No design is committed; it is listed to keep the model open for it.
