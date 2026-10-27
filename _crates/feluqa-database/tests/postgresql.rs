#![no_implicit_prelude]

extern crate feluqa_database;
extern crate std;
extern crate tokio;

use feluqa_database::orm::ConnectionTrait;
use feluqa_database::{
    DatabasePools, DatabaseSettings, Dialect, Migration, MigrationRunner, MigrationSet,
    MigrationStatus, ModuleMigrations,
};
use std::assert_eq;
use std::default::Default;
use std::result::Result;
use std::result::Result::Ok;
use std::vec;

const POSTGRES_MIGRATION: MigrationSet = MigrationSet {
    module: "feluqa_postgresql_test",
    dialect: Dialect::Postgresql,
    migrations: &[Migration {
        id: "0001_create_migration_lock_smoke",
        sql: "CREATE TABLE feluqa_postgresql_migration_smoke (id BIGINT PRIMARY KEY);",
    }],
};

const POSTGRES_MODULE: ModuleMigrations = ModuleMigrations {
    module: "feluqa_postgresql_test",
    connections: &["default"],
    supported_dialects: &[Dialect::Postgresql],
    variants: &[POSTGRES_MIGRATION],
};

#[tokio::test]
#[ignore = "requires FELUQA_TEST_POSTGRES_URL pointing to a disposable PostgreSQL database"]
async fn concurrent_postgresql_startups_serialize_module_migrations()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl_env = \"FELUQA_TEST_POSTGRES_URL\"\nmax_connections = 4\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    let database = pools.default_connection()?;
    database
        .execute_unprepared("DROP TABLE IF EXISTS _feluqa_migration_locks")
        .await?;
    database
        .execute_unprepared("DROP TABLE IF EXISTS _feluqa_migrations")
        .await?;
    database
        .execute_unprepared("DROP TABLE IF EXISTS feluqa_postgresql_migration_smoke")
        .await?;
    let (first, second) = tokio::join!(
        MigrationRunner::run_module(&pools, "default", &POSTGRES_MODULE),
        MigrationRunner::run_module(&pools, "default", &POSTGRES_MODULE),
    );
    let first = first?;
    let second = second?;
    assert_eq!(first.len() + second.len(), 1);
    assert_eq!(
        MigrationRunner::status(&pools, "default", &POSTGRES_MIGRATION).await?,
        vec![("0001_create_migration_lock_smoke", MigrationStatus::Applied)]
    );
    Ok(())
}
