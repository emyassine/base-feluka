#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::std::option::Option::{None, Some};
use feluqa::panel::{
    PanelKind, Resource, ResourceAction, ResourceField, ResourceInput, ResourceInputKind,
    ResourceOperation,
};

/// Shared server-side contract for the CRM customer panel, API and policies.
pub const CUSTOMERS: Resource = Resource {
    id: "crm.customers",
    title: "Customers",
    path: "/admin/customers",
    kind: PanelKind::Business,
    manage_permission: Some("business.erp.manage"),
    record_access_permission: Some("business.crm.customers.records.all"),
    actions: &[
        ResourceAction {
            operation: ResourceOperation::List,
            permission: "business.crm.customers.read",
        },
        ResourceAction {
            operation: ResourceOperation::Create,
            permission: "business.crm.customers.create",
        },
        ResourceAction {
            operation: ResourceOperation::Update,
            permission: "business.crm.customers.update",
        },
        ResourceAction {
            operation: ResourceOperation::Delete,
            permission: "business.crm.customers.delete",
        },
    ],
    fields: &[
        ResourceField {
            id: "record_id",
            label: "ID",
            read_permission: "business.crm.customers.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "name",
            label: "Name",
            read_permission: "business.crm.customers.fields.name.read",
            write_permission: Some("business.crm.customers.fields.name.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: true,
                max_length: Some(160),
            }),
        },
        ResourceField {
            id: "email",
            label: "Email",
            read_permission: "business.crm.customers.fields.email.read",
            write_permission: Some("business.crm.customers.fields.email.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Email,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: true,
                max_length: Some(254),
            }),
        },
    ],
};
