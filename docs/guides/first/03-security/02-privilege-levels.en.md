---
icon: "badge-check"
title: "Privilege Levels"
description: "Platform-wide privilege levels (app-owner, super-admin, sysadmin, staff) with internal and external origins, rank rules and delegation limits."
date: 2026-10-29
lastmod: 2026-10-29
weight: 2
status: "Target"
tags: [feluqa, security, privileges, origin, rank]
draft: true
lang: en
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Privilege Levels

## Scope

Privilege levels govern **platform-level access only**:

- who can manage the platform itself (settings, modules, licensing, billing);
- who can configure or administer the instance.

They do **not** govern end users inside modules (hotel guests, bank customers, SaaS users), module-level customers, or fine-grained permissions. That is the job of [roles and permissions](01-authorization-model.en.md).

This is especially important for operational and defense-adjacent deployments, where "who may administer the system" must be answered independently from "who may use a given function".

## Levels

Each level exists in two **origins**:

- **Internal**: a direct member of the owning organization.
- **External**: a contractor, auditor, integrator or service provider.

| Level | Rank | Internal | External | Description |
| --- | --- | --- | --- | --- |
| `app-owner` | 60 | yes | **never** | Ultimate authority over the instance. One per instance. |
| `super-admin` | 50 | `super-admin` | `external-super-admin` | Full administrative access to platform features and modules. |
| `sysadmin` | 40 | `sysadmin` | `external-sysadmin` | Infrastructure, integrations and system configuration. |
| `staff` | 30 | `staff` | `external-staff` | Platform team member whose permissions come from assigned roles. |

`staff` replaces any earlier "member" term. **Member** is reserved for module-level end-user concepts.

## Rank versus origin

- **Rank** is the hierarchy weight. It is identical for internal and external variants at the same level: a super-admin is a super-admin.
- **Origin** is a separate attribute. The application owner uses it to control visibility, feature access and UI, for example hiding financial modules from external users.
- `app-owner` has no external equivalent.

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
| Only an `app-owner` can create or transfer `app-owner`. | There is exactly one owner. |
| A user can assign only levels **strictly below** their own. | Prevents privilege escalation. |
| An external user can never be assigned `app-owner`. | Ownership is internal by definition. |
| Changing a user's privilege requires re-authentication. | Protects against hijacked sessions. |
| Privilege changes are audited with actor, target, before and after. | Accountability. |
| Privilege level never grants module permissions by itself. | Avoids implicit super-powers; the exception is platform permissions explicitly mapped to a level. |

## Clearance (exploring)

For military and other high-security deployments, an optional **clearance** label can be attached to users and to data classes, independent of privilege and role. A user must hold both the permission and a clearance at least equal to the data's classification. No design is committed; it is listed to keep the model open for it.
