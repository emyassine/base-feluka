#![no_implicit_prelude]

extern crate core;
extern crate feluqa_core;
extern crate feluqa_database;
extern crate std;
extern crate tokio;

use core::clone::Clone;
use core::matches;
use core::result::Result;
use core::result::Result::{Err, Ok};
use feluqa_core::MIGRATIONS;
use feluqa_core::service::{CoreStore, CoreStoreError};
use feluqa_database::orm::ConnectionTrait;
use feluqa_database::{DatabasePools, DatabaseSettings, MigrationRunner};
use std::assert;
use std::assert_eq;
use std::iter::Iterator;

#[tokio::test]
async fn core_identity_migration_creates_the_persistent_system_schema()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    let applied = MigrationRunner::run_module(&pools, "default", &MIGRATIONS).await?;
    assert_eq!(
        applied,
        [
            "0001_create_core_identity",
            "0002_add_tenant_scoping",
            "0003_add_tenant_lifecycle"
        ]
    );
    let database = pools.default_connection()?;
    let tables = database
        .query_all(feluqa_database::orm::Statement::from_string(
            feluqa_database::orm::DbBackend::Sqlite,
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'feluqa_core_%' ORDER BY name",
        ))
        .await?;
    assert_eq!(tables.len(), 8);
    let service = CoreStore::new(database.clone())?;
    service
        .bootstrap_first_admin(
            "Owner@numerimondes.com",
            "Yassine EL MOUMEN",
            "correct horse battery staple",
        )
        .await?;
    assert!(matches!(
        service
            .bootstrap_first_admin(
                "second@numerimondes.com",
                "Second Admin",
                "another correct horse battery",
            )
            .await,
        Err(CoreStoreError::BootstrapUnavailable)
    ));
    let issued = service
        .login("owner@numerimondes.com", "correct horse battery staple")
        .await?;
    assert!(matches!(
        service
            .login("owner@numerimondes.com", "incorrect password")
            .await,
        Err(CoreStoreError::InvalidCredentials)
    ));
    let identity = service.authenticate(&issued.session_token).await?;
    assert!(identity.is_some());
    let identity = identity.unwrap();
    assert_eq!(identity.user_id, issued.user_id);
    assert_eq!(identity.tenant_id, 1);
    assert_eq!(issued.tenant_id, 1);
    assert!(
        service
            .verify_csrf(&issued.session_token, &issued.csrf_token)
            .await?
    );
    assert!(
        !service
            .verify_csrf(&issued.session_token, "invalid-csrf-token")
            .await?
    );
    assert!(
        service
            .permissions_for(issued.user_id)
            .await?
            .iter()
            .any(|permission| permission == "system.users.write")
    );
    service.logout(&issued.session_token).await?;
    assert!(!service.authenticate(&issued.session_token).await?.is_some());
    Ok(())
}
