#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Feluqa Core's persistent identity, access-control, session and audit schema.

extern crate core;
extern crate feluqa_database as database;
extern crate sea_orm;

use database::{Dialect, MigrationSet, ModuleMigrations};

/// SeaORM entities for the system panel.
pub mod entities;
/// Database-backed administrator bootstrap, authentication, sessions and audit.
pub mod service;
/// Persistent Core identity and authorization services.
pub mod store;

const SQLITE: MigrationSet = database::migration_set!(
    "feluqa.core",
    sqlite,
    {
        "0001_create_core_identity" => "../migrations/sqlite/0001_create_core_identity.sql",
        "0002_add_tenant_scoping" => "../migrations/sqlite/0002_add_tenant_scoping.sql",
        "0003_add_tenant_lifecycle" => "../migrations/sqlite/0003_add_tenant_lifecycle.sql"
    }
);

const POSTGRESQL: MigrationSet = database::migration_set!(
    "feluqa.core",
    postgresql,
    {
        "0001_create_core_identity" => "../migrations/postgresql/0001_create_core_identity.sql",
        "0002_add_tenant_scoping" => "../migrations/postgresql/0002_add_tenant_scoping.sql",
        "0003_add_tenant_lifecycle" => "../migrations/postgresql/0003_add_tenant_lifecycle.sql"
    }
);

/// Dialect migration matrix for Feluqa Core.
pub const MIGRATIONS: ModuleMigrations = ModuleMigrations {
    module: "feluqa.core",
    connections: &["default"],
    supported_dialects: &[Dialect::Sqlite, Dialect::Postgresql],
    variants: &[SQLITE, POSTGRESQL],
};
