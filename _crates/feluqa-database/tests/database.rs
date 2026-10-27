#![no_implicit_prelude]

extern crate core;
extern crate feluqa_database;
extern crate std;
extern crate tokio;

use core::iter::Iterator;
use core::option::Option::Some;
use core::result::Result;
use core::result::Result::Ok;
use feluqa_database::{
    DatabasePools, DatabaseSettings, Dialect, Migration, MigrationRunner, MigrationSet,
    MigrationStatus, ModuleMigrations,
};
use std::assert_eq;
use std::default::Default;
use std::format;
use std::fs;
use std::mem::drop;
use std::path::Path;
use std::process;
use std::vec;
use std::vec::Vec;

const SQLITE_VARIANT: MigrationSet = feluqa_database::migration_set!(
    "crm",
    sqlite,
    { "0001_create_customers" => "fixtures/sqlite/0001_create_customers.sql" }
);
const POSTGRES_VARIANT: MigrationSet = feluqa_database::migration_set!(
    "crm",
    postgresql,
    { "0001_create_customers" => "fixtures/postgresql/0001_create_customers.sql" }
);
const CRM_MIGRATIONS: ModuleMigrations = ModuleMigrations {
    module: "crm",
    connections: &["default"],
    supported_dialects: &[Dialect::Sqlite, Dialect::Postgresql],
    variants: &[SQLITE_VARIANT, POSTGRES_VARIANT],
};
const CHANGED_SQLITE: MigrationSet = MigrationSet {
    module: "crm",
    dialect: Dialect::Sqlite,
    migrations: &[Migration {
        id: "0001_create_customers",
        sql: "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, note TEXT);",
    }],
};
const CONCURRENT_SQLITE: MigrationSet = MigrationSet {
    module: "concurrency",
    dialect: Dialect::Sqlite,
    migrations: &[Migration {
        id: "0001_create_once",
        sql: "CREATE TABLE migration_race (id INTEGER PRIMARY KEY);",
    }],
};

#[tokio::test]
async fn sqlite_migrations_apply_once_and_track_checksums()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    assert_eq!(
        MigrationRunner::run_module(&pools, "default", &CRM_MIGRATIONS).await?,
        vec!["0001_create_customers"]
    );
    assert_eq!(
        MigrationRunner::run_module(&pools, "default", &CRM_MIGRATIONS).await?,
        Vec::<&str>::new()
    );
    assert_eq!(
        MigrationRunner::status(
            &pools,
            "default",
            CRM_MIGRATIONS.for_dialect(Dialect::Sqlite).unwrap()
        )
        .await?,
        vec![("0001_create_customers", MigrationStatus::Applied)]
    );
    assert!(
        MigrationRunner::status(&pools, "default", &CHANGED_SQLITE)
            .await
            .is_err()
    );
    let missing_history = MigrationSet {
        migrations: &[],
        ..CHANGED_SQLITE
    };
    assert!(
        MigrationRunner::status(&pools, "default", &missing_history)
            .await
            .is_err()
    );
    Ok(())
}

#[tokio::test]
async fn concurrent_sqlite_startups_serialize_module_migrations()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let path = std::env::temp_dir().join(format!("feluqa-migration-lock-{}.sqlite", process::id()));
    let _ = fs::remove_file(&path);
    let settings = DatabaseSettings::from_toml(&format!(
        "[connections.default]\nurl = \"sqlite://{}?mode=rwc\"\nmax_connections = 4\n",
        path.display()
    ))?;
    let pools = DatabasePools::connect(&settings).await?;
    let (first, second) = tokio::join!(
        MigrationRunner::run(&pools, "default", &CONCURRENT_SQLITE),
        MigrationRunner::run(&pools, "default", &CONCURRENT_SQLITE),
    );
    let first = first?;
    let second = second?;
    assert_eq!(first.len() + second.len(), 1);
    assert_eq!(
        MigrationRunner::status(&pools, "default", &CONCURRENT_SQLITE).await?,
        vec![("0001_create_once", MigrationStatus::Applied)]
    );
    drop(pools);
    fs::remove_file(path)?;
    Ok(())
}

#[tokio::test]
async fn named_sqlite_connections_are_kept_separate()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n[connections.analytics]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    assert_eq!(pools.dialect("default"), Some(Dialect::Sqlite));
    assert_eq!(pools.dialect("analytics"), Some(Dialect::Sqlite));
    assert_eq!(pools.names().count(), 2);
    Ok(())
}

#[tokio::test]
async fn declared_module_connections_receive_their_dialect_migrations()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n[connections.analytics]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    let module = ModuleMigrations {
        connections: &["default", "analytics"],
        ..CRM_MIGRATIONS
    };
    let outcomes = MigrationRunner::run_declared(&pools, &module).await?;
    assert_eq!(outcomes.len(), 2);
    for (connection, applied) in outcomes {
        assert_eq!(applied, vec!["0001_create_customers"]);
        assert_eq!(
            MigrationRunner::status(
                &pools,
                connection,
                module.for_dialect(Dialect::Sqlite).unwrap()
            )
            .await?,
            vec![("0001_create_customers", MigrationStatus::Applied)]
        );
    }
    let missing = ModuleMigrations {
        connections: &["missing"],
        ..CRM_MIGRATIONS
    };
    assert!(
        MigrationRunner::run_declared(&pools, &missing)
            .await
            .is_err()
    );
    Ok(())
}

#[test]
fn database_settings_require_default_and_known_dialects() {
    assert!(
        DatabaseSettings::from_toml("[connections.analytics]\nurl = \"sqlite::memory:\"\n")
            .is_err()
    );
    assert!(
        DatabaseSettings::from_toml("[connections.default]\nurl = \"mysql://localhost/app\"\n")
            .is_err()
    );
    assert!(
        DatabaseSettings::from_toml("[connections.default]\nurl_env = \"lowercase_name\"\n")
            .is_err()
    );
}

#[test]
fn relative_sqlite_paths_resolve_from_the_application_directory() {
    let mut settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite://storage/app.sqlite?mode=rwc\"\n",
    )
    .expect("valid settings");
    settings.resolve_relative_paths(Path::new("/srv/apps/shop"));
    assert_eq!(
        settings.configured_url("default"),
        Some("sqlite:///srv/apps/shop/storage/app.sqlite?mode=rwc")
    );
}

#[test]
fn a_module_must_provide_every_declared_dialect_variant() {
    assert!(CRM_MIGRATIONS.validate().is_ok());
    let missing_postgresql = ModuleMigrations {
        variants: &[SQLITE_VARIANT],
        ..CRM_MIGRATIONS
    };
    assert!(missing_postgresql.validate().is_err());
}
