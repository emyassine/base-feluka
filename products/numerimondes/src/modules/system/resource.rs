#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::std::option::Option::{None, Some};
use feluqa::panel::{
    PanelKind, Resource, ResourceAction, ResourceField, ResourceInput, ResourceInputKind,
    ResourceOperation,
};

/// Core user resource. Mutations still pass through audited Core operations.
pub const USERS: Resource = Resource {
    id: "system.users",
    title: "Core users",
    path: "/system/users",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[
        ResourceAction {
            operation: ResourceOperation::List,
            permission: "system.users.read",
        },
        ResourceAction {
            operation: ResourceOperation::Create,
            permission: "system.users.write",
        },
        ResourceAction {
            operation: ResourceOperation::Update,
            permission: "system.users.write",
        },
    ],
    fields: &[
        ResourceField {
            id: "user_id",
            label: "ID",
            read_permission: "system.users.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "display_name",
            label: "Name",
            read_permission: "system.users.read",
            write_permission: Some("system.users.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(160),
            }),
        },
        ResourceField {
            id: "email",
            label: "Email",
            read_permission: "system.users.read",
            write_permission: Some("system.users.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Email,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(254),
            }),
        },
        ResourceField {
            id: "password",
            label: "Initial password",
            read_permission: "system.users.write",
            write_permission: Some("system.users.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Password,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(256),
            }),
        },
        ResourceField {
            id: "role_id",
            label: "Initial role",
            read_permission: "system.users.write",
            write_permission: Some("system.users.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Select,
                required_on_create: true,
                required_on_update: true,
                creatable: true,
                updatable: true,
                max_length: None,
            }),
        },
        ResourceField {
            id: "status",
            label: "Status",
            read_permission: "system.users.read",
            write_permission: None,
            input: None,
        },
    ],
};

/// Core role listing resource. Role grant mutations use their audited handlers.
pub const ROLES: Resource = Resource {
    id: "system.roles",
    title: "Core roles",
    path: "/system/roles",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[
        ResourceAction {
            operation: ResourceOperation::List,
            permission: "system.roles.read",
        },
        ResourceAction {
            operation: ResourceOperation::Create,
            permission: "system.roles.write",
        },
        ResourceAction {
            operation: ResourceOperation::Update,
            permission: "system.roles.write",
        },
    ],
    fields: &[
        ResourceField {
            id: "role_id",
            label: "ID",
            read_permission: "system.roles.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "display_name",
            label: "Name",
            read_permission: "system.roles.read",
            write_permission: Some("system.roles.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(160),
            }),
        },
        ResourceField {
            id: "slug",
            label: "Key",
            read_permission: "system.roles.read",
            write_permission: Some("system.roles.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(64),
            }),
        },
        ResourceField {
            id: "permissions",
            label: "Permissions",
            read_permission: "system.roles.read",
            write_permission: Some("system.roles.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Textarea,
                required_on_create: true,
                required_on_update: true,
                creatable: true,
                updatable: true,
                max_length: Some(8_192),
            }),
        },
    ],
};

/// Static module inventory exposed by Feluqa Core.
pub const MODULES: Resource = Resource {
    id: "system.modules",
    title: "Core modules",
    path: "/system/modules",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[ResourceAction {
        operation: ResourceOperation::List,
        permission: "system.modules.read",
    }],
    fields: &[
        ResourceField {
            id: "module_id",
            label: "Module",
            read_permission: "system.modules.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "state",
            label: "State",
            read_permission: "system.modules.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "source",
            label: "Source",
            read_permission: "system.modules.read",
            write_permission: None,
            input: None,
        },
    ],
};

/// Configured named connections, excluding credentials and connection URLs.
pub const CONNECTIONS: Resource = Resource {
    id: "system.connections",
    title: "Database connections",
    path: "/system/connections",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[ResourceAction {
        operation: ResourceOperation::List,
        permission: "system.connections.read",
    }],
    fields: &[
        ResourceField {
            id: "connection",
            label: "Connection",
            read_permission: "system.connections.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "dialect",
            label: "Database",
            read_permission: "system.connections.read",
            write_permission: None,
            input: None,
        },
    ],
};

/// Per-connection migration status exposed by the Core operations panel.
pub const MIGRATIONS: Resource = Resource {
    id: "system.migrations",
    title: "Database migrations",
    path: "/system/migrations",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[
        ResourceAction {
            operation: ResourceOperation::List,
            permission: "system.migrations.read",
        },
        ResourceAction {
            operation: ResourceOperation::Create,
            permission: "system.migrations.run",
        },
    ],
    fields: &[
        ResourceField {
            id: "connection",
            label: "Connection",
            read_permission: "system.migrations.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "module",
            label: "Module",
            read_permission: "system.migrations.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "migration",
            label: "Migration",
            read_permission: "system.migrations.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "status",
            label: "Status",
            read_permission: "system.migrations.read",
            write_permission: None,
            input: None,
        },
    ],
};

/// Bounded audit event listing with exact field grants.
pub const AUDIT: Resource = Resource {
    id: "system.audit",
    title: "Audit events",
    path: "/system/audit",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[ResourceAction {
        operation: ResourceOperation::List,
        permission: "system.audit.read",
    }],
    fields: &[
        ResourceField {
            id: "time",
            label: "Time (Unix)",
            read_permission: "system.audit.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "actor",
            label: "Actor ID",
            read_permission: "system.audit.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "action",
            label: "Action",
            read_permission: "system.audit.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "resource",
            label: "Resource",
            read_permission: "system.audit.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "record",
            label: "Record",
            read_permission: "system.audit.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "outcome",
            label: "Outcome",
            read_permission: "system.audit.read",
            write_permission: None,
            input: None,
        },
    ],
};

/// Platform tenant directory and one-time initial owner creation.
pub const TENANTS: Resource = Resource {
    id: "system.tenants",
    title: "Tenants",
    path: "/system/tenants",
    kind: PanelKind::System,
    manage_permission: None,
    record_access_permission: None,
    actions: &[
        ResourceAction {
            operation: ResourceOperation::List,
            permission: "system.tenants.read",
        },
        ResourceAction {
            operation: ResourceOperation::Create,
            permission: "system.tenants.write",
        },
        ResourceAction {
            operation: ResourceOperation::Update,
            permission: "system.tenants.write",
        },
    ],
    fields: &[
        ResourceField {
            id: "tenant_id",
            label: "ID",
            read_permission: "system.tenants.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "slug",
            label: "Slug",
            read_permission: "system.tenants.read",
            write_permission: Some("system.tenants.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(64),
            }),
        },
        ResourceField {
            id: "display_name",
            label: "Tenant name",
            read_permission: "system.tenants.read",
            write_permission: Some("system.tenants.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(160),
            }),
        },
        ResourceField {
            id: "created_at",
            label: "Created (Unix)",
            read_permission: "system.tenants.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "status",
            label: "Status",
            read_permission: "system.tenants.read",
            write_permission: None,
            input: None,
        },
        ResourceField {
            id: "owner_name",
            label: "Initial administrator name",
            read_permission: "system.tenants.write",
            write_permission: Some("system.tenants.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Text,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(160),
            }),
        },
        ResourceField {
            id: "owner_email",
            label: "Initial administrator email",
            read_permission: "system.tenants.write",
            write_permission: Some("system.tenants.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Email,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(254),
            }),
        },
        ResourceField {
            id: "owner_password",
            label: "Temporary password (12+ characters)",
            read_permission: "system.tenants.write",
            write_permission: Some("system.tenants.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Password,
                required_on_create: true,
                required_on_update: false,
                creatable: true,
                updatable: false,
                max_length: Some(256),
            }),
        },
    ],
};
