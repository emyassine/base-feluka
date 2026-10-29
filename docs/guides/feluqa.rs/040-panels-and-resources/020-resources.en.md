---
icon: "database"
title: "Resources"
description: "A complete CRUD in one file: form, table, actions, policy, generated routes, permissions and SDUI schema, from zero-config to full control."
summary: "Describes a Resource as a single-file CRUD definition and shows how to begin with zero configuration before adding a Resource implementation for custom behavior. It covers generated routes, forms, tables, actions, policies and permissions, and explains why standard forms and tables use SDUI schemas for multiple client targets."
date: 2026-100-29
lastmod: 2026-100-29
weight: 2
status: "Target"
tags: [feluqa, resource, crud, sdui]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---

# Resources

A resource is a complete CRUD in **one file**.

```rust
// src/modules/sales/resources/customer.rs
use feluqa::resource::prelude::*;
use feluqa::ui::{form::*, Icon};
use super::super::models::Customer;

/// Company customers.
/// Generates: routes `/admin/customers[/create|/{record}/edit]`, List/Create/Edit pages,
/// a sidebar entry, permissions `sales.customers.*`, and a multi-target SDUI schema.
#[feluqa::resource(panel = "admin", group = "Shop", icon = Icon::Users)]
pub struct CustomerResource;

impl Resource for CustomerResource {
    type Model = Customer;

    fn form(form: Form) -> Form {
        form.schema([
            TextInput::make(Customer::NAME).required().max_length(120),
            TextInput::make(Customer::EMAIL).email().required().unique(),
            Select::make(Customer::COUNTRY).options(Country::all()).searchable(),
            Toggle::make(Customer::ACTIVE).default(true),
        ])
    }

    fn table(table: Table) -> Table {
        table
            .columns([
                Column::make(Customer::NAME).searchable().sortable(),
                Column::make(Customer::EMAIL).copyable(),
                Column::badge(Customer::STATUS),
            ])
            .filters([
                Filter::make("verified").query(|q| q.where_not_null(Customer::VERIFIED_AT)),
            ])
            .record_actions([EditAction::make(), DeleteAction::make()])
            .bulk_actions([BulkActions::group([DeleteBulk::make()])])
            .default_sort(Customer::CREATED_AT, Desc)
    }

    /// Business hook. The `create` gate is already applied by the resource.
    async fn before_create(data: &mut CustomerData, ctx: &Ctx) -> Result<()> {
        data.owner_id = ctx.user().id;
        Ok(())
    }
}
```

## Level 0: zero configuration

```rust
/// Customer. A full CRUD with table, form, routes and permissions.
#[derive(feluqa::Model, feluqa::Resource)]
#[resource(panel = "admin", group = "Shop")]
pub struct Customer {
    #[field(text, required, searchable)] pub name: String,
    #[field(email, required, unique)]    pub email: String,
    #[field(toggle, default = true)]     pub active: bool,
}
```

Move to level 1 (the `impl Resource`) only when you need control.

## Generated capabilities

| Capability | Permission | Used by |
| --- | --- | --- |
| `view_any` | `sales.customers.view_any` | List page, sidebar entry |
| `view` | `sales.customers.view` | Detail page |
| `create` | `sales.customers.create` | Create page and button |
| `update` | `sales.customers.update` | Edit page and button |
| `delete` | `sales.customers.delete` | Delete action, bulk delete |

The names come from the context chain; inside a submodule they gain a segment (`sales.invoicing.invoices.view_any`).

## SDUI, not free-form views

In forms and tables, stay with **SDUI builders**. Otherwise web, mobile and desktop rendering no longer works from a single schema. A fully free page (`#[feluqa::page(custom)]` with `view!`) is the exception.
