#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Database connections and per-dialect SQL migrations for Feluqa applications.

extern crate core;
extern crate feluqa_model_derive;
pub extern crate sea_orm as orm;
extern crate serde;
extern crate sha2;
extern crate std;
extern crate thiserror;
extern crate toml;

/// Build-time discovery and compilation of per-module SQL migrations.
pub mod build_support;
/// Eloquent-style model contract and derive macro.
pub mod eloquent;

use core::clone::Clone;
use core::iter::Iterator;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use orm::{
    ConnectOptions, ConnectionTrait, Database, DatabaseConnection, DbBackend, DbErr, Statement,
    TransactionTrait,
};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};
use std::env;
use std::format;
use std::path::Path;
use std::string::{String, ToString};
use std::vec::Vec;
use thiserror::Error;

/// Error returned by database configuration and migration operations.
#[derive(Debug, Error)]
pub enum DatabaseError {
    /// The settings or migration declaration is invalid.
    #[error("invalid database configuration: {0}")]
    Invalid(String),
    /// A named connection could not be established.
    #[error("database connection `{name}` failed: {source}")]
    Connect {
        /// Connection name from `database.toml`.
        name: String,
        /// Underlying database error.
        #[source]
        source: DbErr,
    },
    /// A migration could not be checked or applied.
    #[error("migration `{module}/{migration}` failed: {source}")]
    Migration {
        /// Owning module identifier.
        module: String,
        /// Migration identifier.
        migration: String,
        /// Underlying database error.
        #[source]
        source: DbErr,
    },
    /// A previously applied migration has changed since it was recorded.
    #[error("migration checksum changed for `{module}/{migration}`")]
    ChecksumChanged {
        /// Owning module identifier.
        module: String,
        /// Migration identifier.
        migration: String,
    },
    /// A database contains an applied migration absent from the compiled module manifest.
    #[error("database has unknown applied migration `{module}/{migration}`")]
    UnknownAppliedMigration {
        /// Owning module identifier.
        module: String,
        /// Migration identifier recorded by the database but missing from the binary.
        migration: String,
    },
}

/// Supported SQL dialects in the initial Web profile.
#[derive(Clone, Copy, Debug, Deserialize, Eq, Ord, PartialEq, PartialOrd)]
#[serde(rename_all = "lowercase")]
pub enum Dialect {
    /// Embedded SQLite database.
    Sqlite,
    /// PostgreSQL database server.
    Postgresql,
}

impl Dialect {
    fn backend(self) -> DbBackend {
        match self {
            Self::Sqlite => DbBackend::Sqlite,
            Self::Postgresql => DbBackend::Postgres,
        }
    }

    fn from_url(url: &str) -> Result<Self, DatabaseError> {
        if url.starts_with("sqlite:") {
            Ok(Self::Sqlite)
        } else if url.starts_with("postgres:") || url.starts_with("postgresql:") {
            Ok(Self::Postgresql)
        } else {
            Err(DatabaseError::Invalid(
                "only sqlite and postgresql URLs are supported".to_string(),
            ))
        }
    }
}

/// Settings for one named database connection.
#[derive(Clone, Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ConnectionSettings {
    /// SQLx URL for non-secret local settings; mutually exclusive with `url_env`.
    pub url: Option<String>,
    /// Environment variable containing the SQLx URL, recommended for deployment secrets.
    pub url_env: Option<String>,
    /// Maximum number of pooled connections; defaults to SeaORM's backend default.
    pub max_connections: Option<u32>,
}

/// Complete deserialized `config/database.toml` document.
#[derive(Clone, Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DatabaseSettings {
    /// Named connections. The `default` entry is required.
    pub connections: BTreeMap<String, ConnectionSettings>,
}

impl DatabaseSettings {
    /// Parse database settings from TOML.
    pub fn from_toml(source: &str) -> Result<Self, DatabaseError> {
        let settings: Self =
            toml::from_str(source).map_err(|error| DatabaseError::Invalid(error.to_string()))?;
        settings.validate()?;
        Ok(settings)
    }

    /// Validate connection names and ensure the default connection exists.
    pub fn validate(&self) -> Result<(), DatabaseError> {
        if !self.connections.contains_key("default") {
            return Err(DatabaseError::Invalid(
                "a `default` connection is required".to_string(),
            ));
        }
        for (name, connection) in &self.connections {
            if !valid_identifier(name) {
                return Err(DatabaseError::Invalid(format!(
                    "invalid connection name `{name}`"
                )));
            }
            if connection.url.is_some() == connection.url_env.is_some() {
                return Err(DatabaseError::Invalid(format!(
                    "connection `{name}` must set exactly one of `url` or `url_env`"
                )));
            }
            if let Some(variable) = &connection.url_env {
                if variable.is_empty()
                    || !variable.bytes().all(|byte| {
                        byte.is_ascii_uppercase() || byte.is_ascii_digit() || byte == b'_'
                    })
                {
                    return Err(DatabaseError::Invalid(format!(
                        "invalid environment variable name for connection `{name}`"
                    )));
                }
            }
            if let Some(url) = &connection.url {
                Dialect::from_url(url)?;
            }
        }
        Ok(())
    }

    /// Resolve relative SQLite file URLs against the application's configuration directory.
    pub fn resolve_relative_paths(&mut self, application_directory: &Path) {
        for connection in self.connections.values_mut() {
            let Some(url) = connection.url.as_ref() else {
                continue;
            };
            let Some(path_and_query) = url.strip_prefix("sqlite://") else {
                continue;
            };
            let (path, query) = match path_and_query.split_once('?') {
                Some((path, query)) => (path, Some(query)),
                None => (path_and_query, None),
            };
            if path.is_empty() || Path::new(path).is_absolute() || path == ":memory:" {
                continue;
            }
            let absolute = application_directory.join(path);
            let mut resolved = format!("sqlite://{}", absolute.to_string_lossy());
            if let Some(query) = query {
                resolved.push('?');
                resolved.push_str(query);
            }
            connection.url = Some(resolved);
        }
    }

    /// Return a literal URL configured for a named connection, if one is present.
    pub fn configured_url(&self, name: &str) -> Option<&str> {
        self.connections
            .get(name)
            .and_then(|connection| connection.url.as_deref())
    }
}

/// Connected named pools for one running application.
#[derive(Clone)]
pub struct DatabasePools {
    connections: BTreeMap<String, DatabaseConnection>,
    dialects: BTreeMap<String, Dialect>,
}

/// Bounded page of typed model rows returned by a derived Feluqa model.
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct ModelPage<T> {
    /// Rows on this one-based page.
    pub items: Vec<T>,
    /// One-based page number, clamped to the available range.
    pub page: u64,
    /// Available page count; empty tables report one page.
    pub page_count: u64,
}

impl DatabasePools {
    /// Establish each configured pool in name order and fail if any connection fails.
    pub async fn connect(settings: &DatabaseSettings) -> Result<Self, DatabaseError> {
        settings.validate()?;
        let mut connections = BTreeMap::new();
        let mut dialects = BTreeMap::new();
        for (name, config) in &settings.connections {
            let url = match (&config.url, &config.url_env) {
                (Some(url), None) => url.clone(),
                (None, Some(variable)) => env::var(variable).map_err(|_| {
                    DatabaseError::Invalid(format!(
                        "environment variable `{variable}` for connection `{name}` is unavailable"
                    ))
                })?,
                _ => {
                    return Err(DatabaseError::Invalid(format!(
                        "connection `{name}` must set exactly one of `url` or `url_env`"
                    )));
                }
            };
            let dialect = Dialect::from_url(&url)?;
            if config.max_connections == Some(0) {
                return Err(DatabaseError::Invalid(format!(
                    "connection `{name}` max_connections must be greater than zero"
                )));
            }
            let mut options = ConnectOptions::new(url);
            if let Some(maximum) = config.max_connections {
                options.max_connections(maximum);
            }
            let connection =
                Database::connect(options)
                    .await
                    .map_err(|source| DatabaseError::Connect {
                        name: name.clone(),
                        source,
                    })?;
            connections.insert(name.clone(), connection);
            dialects.insert(name.clone(), dialect);
        }
        Ok(Self {
            connections,
            dialects,
        })
    }

    /// Borrow a named database pool.
    pub fn get(&self, name: &str) -> Option<&DatabaseConnection> {
        self.connections.get(name)
    }

    /// Borrow the required default database pool.
    pub fn default_connection(&self) -> Result<&DatabaseConnection, DatabaseError> {
        self.connections.get("default").ok_or_else(|| {
            DatabaseError::Invalid("the default database connection is not connected".to_string())
        })
    }

    /// Return the dialect for a named connection.
    pub fn dialect(&self, name: &str) -> Option<Dialect> {
        self.dialects.get(name).copied()
    }

    /// Iterate over configured connection names.
    pub fn names(&self) -> impl Iterator<Item = &str> {
        self.connections.keys().map(String::as_str)
    }

    /// Return the distinct SQL dialects configured in this application.
    pub fn dialects(&self) -> Vec<Dialect> {
        let mut dialects: Vec<Dialect> = self.dialects.values().copied().collect();
        dialects.sort_by_key(|dialect| match dialect {
            Dialect::Sqlite => 0_u8,
            Dialect::Postgresql => 1_u8,
        });
        dialects.dedup();
        dialects
    }
}

/// One SQL migration compiled into the application binary.
#[derive(Clone, Copy, Debug)]
pub struct Migration {
    /// Stable, sortable identifier such as `0001_create_customers`.
    pub id: &'static str,
    /// SQL source for the dialect selected by the target connection.
    pub sql: &'static str,
}

/// Migrations for one module and one database dialect.
#[derive(Clone, Copy, Debug)]
pub struct MigrationSet {
    /// Stable module identifier.
    pub module: &'static str,
    /// Dialect these files target.
    pub dialect: Dialect,
    /// Ordered migration files embedded in the binary.
    pub migrations: &'static [Migration],
}

/// Complete dialect matrix declared by one module.
#[derive(Clone, Copy, Debug)]
pub struct ModuleMigrations {
    /// Stable module identifier shared by every variant.
    pub module: &'static str,
    /// Named database connections this module owns and migrates.
    pub connections: &'static [&'static str],
    /// Dialects this module claims to support.
    pub supported_dialects: &'static [Dialect],
    /// One SQL migration set for each module-supported database dialect.
    pub variants: &'static [MigrationSet],
}

impl ModuleMigrations {
    /// Require exactly one migration set for every dialect the module supports.
    pub fn validate(&self) -> Result<(), DatabaseError> {
        if !valid_identifier(self.module)
            || self.connections.is_empty()
            || self.supported_dialects.is_empty()
        {
            return Err(DatabaseError::Invalid(
                "module ID, named connections, and supported dialects are required".to_string(),
            ));
        }
        let mut connections = BTreeSet::new();
        if self
            .connections
            .iter()
            .any(|name| !valid_connection_name(name) || !connections.insert(*name))
        {
            return Err(DatabaseError::Invalid(format!(
                "module `{}` has an invalid or duplicate database connection",
                self.module
            )));
        }
        let mut declared = BTreeSet::new();
        for variant in self.variants {
            variant.validate()?;
            if variant.module != self.module || !declared.insert(variant.dialect) {
                return Err(DatabaseError::Invalid(format!(
                    "module `{}` has a mismatched or duplicate migration variant",
                    self.module
                )));
            }
        }
        let required: BTreeSet<Dialect> = self.supported_dialects.iter().copied().collect();
        if required.len() != self.supported_dialects.len() || declared != required {
            return Err(DatabaseError::Invalid(format!(
                "module `{}` must provide exactly one migration set for each supported dialect",
                self.module
            )));
        }
        Ok(())
    }

    /// Select the migration set for a specific database dialect.
    pub fn for_dialect(&self, dialect: Dialect) -> Option<&MigrationSet> {
        self.variants
            .iter()
            .find(|variant| variant.dialect == dialect)
    }
}

impl MigrationSet {
    /// Check the module ID, migration IDs, and duplicate IDs before database access.
    pub fn validate(&self) -> Result<(), DatabaseError> {
        if !valid_identifier(self.module) {
            return Err(DatabaseError::Invalid(format!(
                "invalid module ID `{}`",
                self.module
            )));
        }
        let mut previous: Option<&str> = None;
        let mut seen = BTreeSet::new();
        for migration in self.migrations {
            if !valid_identifier(migration.id) || !seen.insert(migration.id) {
                return Err(DatabaseError::Invalid(format!(
                    "invalid or duplicate migration ID `{}`",
                    migration.id
                )));
            }
            if previous.is_some_and(|prior| prior >= migration.id) {
                return Err(DatabaseError::Invalid(
                    "migration IDs must be in ascending order".to_string(),
                ));
            }
            if migration.sql.trim().is_empty() {
                return Err(DatabaseError::Invalid(format!(
                    "migration `{}` is empty",
                    migration.id
                )));
            }
            previous = Some(migration.id);
        }
        Ok(())
    }
}

/// Status of one migration in one database.
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MigrationStatus {
    /// Migration is not applied.
    Pending,
    /// Migration has been applied and its source checksum matches.
    Applied,
}

/// Inspect and apply compiled migration sets against a configured database pool.
pub struct MigrationRunner;

impl MigrationRunner {
    /// Apply each supported SQL variant to every connection declared by a module.
    pub async fn run_declared(
        pools: &DatabasePools,
        module: &ModuleMigrations,
    ) -> Result<Vec<(&'static str, Vec<&'static str>)>, DatabaseError> {
        module.validate()?;
        for connection in module.connections {
            let dialect = pools.dialect(connection).ok_or_else(|| {
                DatabaseError::Invalid(format!(
                    "module `{}` requires missing database connection `{connection}`",
                    module.module
                ))
            })?;
            if module.for_dialect(dialect).is_none() {
                return Err(DatabaseError::Invalid(format!(
                    "module `{}` does not support the dialect configured for connection `{connection}`",
                    module.module
                )));
            }
        }
        let mut outcomes = Vec::new();
        for connection in module.connections {
            let applied = Self::run_module(pools, connection, module).await?;
            outcomes.push((*connection, applied));
        }
        Ok(outcomes)
    }

    /// Apply a module's dialect-specific variant to one named connection.
    pub async fn run_module(
        pools: &DatabasePools,
        connection_name: &str,
        module: &ModuleMigrations,
    ) -> Result<Vec<&'static str>, DatabaseError> {
        module.validate()?;
        let dialect = pools.dialect(connection_name).ok_or_else(|| {
            DatabaseError::Invalid(format!("unknown database connection `{connection_name}`"))
        })?;
        let migrations = module.for_dialect(dialect).ok_or_else(|| {
            DatabaseError::Invalid(format!(
                "module `{}` has no migration variant for the configured dialect",
                module.module
            ))
        })?;
        Self::run(pools, connection_name, migrations).await
    }

    /// Return whether every migration is pending or applied on the named connection.
    pub async fn status(
        pools: &DatabasePools,
        connection_name: &str,
        set: &MigrationSet,
    ) -> Result<Vec<(&'static str, MigrationStatus)>, DatabaseError> {
        set.validate()?;
        let connection = pools.get(connection_name).ok_or_else(|| {
            DatabaseError::Invalid(format!("unknown database connection `{connection_name}`"))
        })?;
        let dialect = pools.dialect(connection_name).ok_or_else(|| {
            DatabaseError::Invalid(format!("unknown database connection `{connection_name}`"))
        })?;
        ensure_compatible(set, dialect)?;
        prepare_migration_tables(connection, dialect, set.module).await?;
        let rows = connection
            .query_all(Statement::from_string(
                dialect.backend(),
                format!(
                    "SELECT migration_id, checksum FROM _feluqa_migrations WHERE module_id = '{}'",
                    set.module
                ),
            ))
            .await
            .map_err(|source| migration_error(set.module, "status", source))?;
        let mut applied = BTreeMap::new();
        for row in rows {
            let id: String = row
                .try_get("", "migration_id")
                .map_err(|source| migration_error(set.module, "status", source))?;
            let checksum: String = row
                .try_get("", "checksum")
                .map_err(|source| migration_error(set.module, &id, source))?;
            applied.insert(id, checksum);
        }
        for migration_id in applied.keys() {
            if !set
                .migrations
                .iter()
                .any(|migration| migration.id == migration_id)
            {
                return Err(DatabaseError::UnknownAppliedMigration {
                    module: set.module.to_string(),
                    migration: migration_id.clone(),
                });
            }
        }
        set.migrations
            .iter()
            .map(|migration| {
                let checksum = checksum(migration.sql);
                match applied.get(migration.id) {
                    Some(stored) if stored == &checksum => {
                        Ok((migration.id, MigrationStatus::Applied))
                    }
                    Some(_) => Err(DatabaseError::ChecksumChanged {
                        module: set.module.to_string(),
                        migration: migration.id.to_string(),
                    }),
                    None => Ok((migration.id, MigrationStatus::Pending)),
                }
            })
            .collect()
    }

    /// Apply pending migrations in ascending order, recording checksums in the same transaction.
    pub async fn run(
        pools: &DatabasePools,
        connection_name: &str,
        set: &MigrationSet,
    ) -> Result<Vec<&'static str>, DatabaseError> {
        set.validate()?;
        let connection = pools.get(connection_name).ok_or_else(|| {
            DatabaseError::Invalid(format!("unknown database connection `{connection_name}`"))
        })?;
        let dialect = pools.dialect(connection_name).ok_or_else(|| {
            DatabaseError::Invalid(format!("unknown database connection `{connection_name}`"))
        })?;
        ensure_compatible(set, dialect)?;
        prepare_migration_tables(connection, dialect, set.module).await?;
        let mut applied = Vec::new();
        for migration in set.migrations {
            let transaction = connection
                .begin()
                .await
                .map_err(|source| migration_error(set.module, migration.id, source))?;
            lock_module_migrations(&transaction, dialect, set.module).await?;
            let current = transaction
                .query_one(Statement::from_string(
                    dialect.backend(),
                    format!(
                        "SELECT checksum FROM _feluqa_migrations WHERE module_id = '{}' AND migration_id = '{}'",
                        set.module, migration.id
                    ),
                ))
                .await
                .map_err(|source| migration_error(set.module, migration.id, source))?;
            if let Some(row) = current {
                let stored: String = row
                    .try_get("", "checksum")
                    .map_err(|source| migration_error(set.module, migration.id, source))?;
                if stored != checksum(migration.sql) {
                    return Err(DatabaseError::ChecksumChanged {
                        module: set.module.to_string(),
                        migration: migration.id.to_string(),
                    });
                }
                transaction
                    .commit()
                    .await
                    .map_err(|source| migration_error(set.module, migration.id, source))?;
                continue;
            }
            transaction
                .execute_unprepared(migration.sql)
                .await
                .map_err(|source| migration_error(set.module, migration.id, source))?;
            let digest = checksum(migration.sql);
            let statement = Statement::from_string(
                dialect.backend(),
                format!(
                    "INSERT INTO _feluqa_migrations (module_id, migration_id, checksum) VALUES ('{}', '{}', '{}')",
                    set.module, migration.id, digest
                ),
            );
            transaction
                .execute(statement)
                .await
                .map_err(|source| migration_error(set.module, migration.id, source))?;
            transaction
                .commit()
                .await
                .map_err(|source| migration_error(set.module, migration.id, source))?;
            applied.push(migration.id);
        }
        Ok(applied)
    }
}

fn ensure_compatible(set: &MigrationSet, actual: Dialect) -> Result<(), DatabaseError> {
    if set.dialect != actual {
        return Err(DatabaseError::Invalid(format!(
            "module `{}` migration dialect does not match connection dialect",
            set.module
        )));
    }
    Ok(())
}

async fn prepare_migration_tables(
    connection: &DatabaseConnection,
    dialect: Dialect,
    module: &str,
) -> Result<(), DatabaseError> {
    let transaction = connection
        .begin()
        .await
        .map_err(|source| migration_error(module, "migration-bootstrap-lock", source))?;
    if dialect == Dialect::Postgresql {
        let _ = transaction
            .query_one(Statement::from_string(
                dialect.backend(),
                format!("SELECT pg_advisory_xact_lock(hashtext('feluqa:migrations:{module}'))"),
            ))
            .await
            .map_err(|source| migration_error(module, "migration-bootstrap-lock", source))?;
    }
    transaction
        .execute_unprepared("CREATE TABLE IF NOT EXISTS _feluqa_migrations (module_id TEXT NOT NULL, migration_id TEXT NOT NULL, checksum TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (module_id, migration_id))")
        .await
        .map_err(|source| migration_error(module, "_feluqa_migrations", source))?;
    transaction
        .execute_unprepared(
            "CREATE TABLE IF NOT EXISTS _feluqa_migration_locks (module_id TEXT PRIMARY KEY NOT NULL)",
        )
        .await
        .map_err(|source| migration_error(module, "_feluqa_migration_locks", source))?;
    transaction
        .execute(Statement::from_string(
            dialect.backend(),
            format!(
                "INSERT INTO _feluqa_migration_locks (module_id) VALUES ('{module}') ON CONFLICT (module_id) DO NOTHING"
            ),
        ))
        .await
        .map_err(|source| migration_error(module, "_feluqa_migration_locks", source))?;
    transaction
        .commit()
        .await
        .map_err(|source| migration_error(module, "migration-bootstrap-lock", source))?;
    Ok(())
}

async fn lock_module_migrations(
    transaction: &orm::DatabaseTransaction,
    dialect: Dialect,
    module: &str,
) -> Result<(), DatabaseError> {
    match dialect {
        Dialect::Sqlite => {
            transaction
                .execute_unprepared(&format!(
                    "UPDATE _feluqa_migration_locks SET module_id = module_id WHERE module_id = '{module}'"
                ))
                .await
                .map_err(|source| migration_error(module, "migration-lock", source))?;
        }
        Dialect::Postgresql => {
            let _ = transaction
                .query_one(Statement::from_string(
                    dialect.backend(),
                    format!(
                        "SELECT module_id FROM _feluqa_migration_locks WHERE module_id = '{module}' FOR UPDATE"
                    ),
                ))
                .await
                .map_err(|source| migration_error(module, "migration-lock", source))?;
        }
    }
    Ok(())
}

fn migration_error(module: &str, migration: &str, source: DbErr) -> DatabaseError {
    DatabaseError::Migration {
        module: module.to_string(),
        migration: migration.to_string(),
        source,
    }
}

fn checksum(sql: &str) -> String {
    Sha256::digest(sql.as_bytes())
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect::<Vec<String>>()
        .join("")
}

fn valid_identifier(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 96
        && !value.starts_with('.')
        && !value.ends_with('.')
        && !value.contains("..")
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase()
                || byte.is_ascii_digit()
                || byte == b'_'
                || byte == b'-'
                || byte == b'.'
        })
}

fn valid_connection_name(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.as_bytes()[0].is_ascii_lowercase()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
}

/// Construct a migration slice from included files while keeping paths relative to the Rust source.
#[macro_export]
macro_rules! migration_set {
    ($module:literal, sqlite, { $($id:literal => $path:literal),* $(,)? }) => {
        $crate::MigrationSet {
            module: $module,
            dialect: $crate::Dialect::Sqlite,
            migrations: &[$($crate::Migration { id: $id, sql: ::core::include_str!($path) }),*],
        }
    };
    ($module:literal, postgresql, { $($id:literal => $path:literal),* $(,)? }) => {
        $crate::MigrationSet {
            module: $module,
            dialect: $crate::Dialect::Postgresql,
            migrations: &[$($crate::Migration { id: $id, sql: ::core::include_str!($path) }),*],
        }
    };
}
