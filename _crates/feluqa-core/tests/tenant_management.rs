#![no_implicit_prelude]

extern crate feluqa_core;
extern crate feluqa_database;
extern crate sea_orm;
extern crate std;
extern crate tokio;

use feluqa_core::MIGRATIONS;
use feluqa_core::entities::{audit_event, session, tenant as tenant_entity};
use feluqa_core::service::{CoreStore, CoreStoreError};
use feluqa_core::store::{SecretToken, digest_token};
use feluqa_database::orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter, TransactionTrait,
};
use feluqa_database::{DatabasePools, DatabaseSettings, MigrationRunner};
use std::assert;
use std::assert_eq;
use std::clone::Clone;
use std::convert::From;
use std::iter::Iterator;
use std::matches;
use std::option::Option::{None, Some};
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::String;
use std::string::ToString;

#[tokio::test]
async fn platform_admin_creates_tenant_and_isolated_initial_owner_atomically()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    MigrationRunner::run_module(&pools, "default", &MIGRATIONS).await?;
    let service = CoreStore::new(pools.default_connection()?.clone())?;
    service
        .bootstrap_first_admin(
            "platform@example.test",
            "Platform Administrator",
            "strong-platform-password",
        )
        .await?;
    let platform = service
        .login("platform@example.test", "strong-platform-password")
        .await?;

    let before = service.tenants(platform.user_id).await?;
    assert_eq!(before.len(), 1);
    assert_eq!(before[0].slug, "default");

    let tenant = service
        .create_tenant(
            "acme-west",
            "Acme West",
            "Acme Owner",
            "owner@acme-west.test",
            "strong-acme-owner-password",
            platform.user_id,
        )
        .await?;
    assert_eq!(tenant.slug, "acme-west");
    assert!(tenant.is_active);
    assert_eq!(service.tenants(platform.user_id).await?.len(), 2);

    let owner = service
        .login("owner@acme-west.test", "strong-acme-owner-password")
        .await?;
    assert_eq!(owner.tenant_id, tenant.id);
    let owner_grants = service.permissions_for(owner.user_id).await?;
    assert!(
        owner_grants
            .iter()
            .any(|grant| grant == "system.users.write")
    );
    assert!(
        !owner_grants
            .iter()
            .any(|grant| grant == "system.tenants.read")
    );
    assert!(
        !owner_grants
            .iter()
            .any(|grant| grant == "system.tenants.write")
    );
    assert!(matches!(
        service.tenants(owner.user_id).await,
        Err(CoreStoreError::GrantEscalation)
    ));
    assert!(matches!(
        service
            .set_tenant_active(tenant.id, false, owner.user_id)
            .await,
        Err(CoreStoreError::GrantEscalation)
    ));
    assert!(matches!(
        service
            .create_tenant(
                "forbidden",
                "Forbidden tenant",
                "Forbidden Owner",
                "owner@forbidden.test",
                "strong-forbidden-password",
                owner.user_id,
            )
            .await,
        Err(CoreStoreError::GrantEscalation)
    ));
    assert!(matches!(
        service
            .create_tenant(
                "acme-west",
                "Duplicate tenant",
                "Second Owner",
                "second@acme-west.test",
                "strong-second-owner-password",
                platform.user_id,
            )
            .await,
        Err(CoreStoreError::InvalidTenant)
    ));
    assert_eq!(service.tenants(platform.user_id).await?.len(), 2);

    assert!(matches!(
        service.set_tenant_active(1, false, platform.user_id).await,
        Err(CoreStoreError::TenantLifecycleDenied)
    ));
    let suspended = service
        .set_tenant_active(tenant.id, false, platform.user_id)
        .await?;
    assert!(!suspended.is_active);
    assert!(
        service.tenants(platform.user_id).await?[1..]
            .iter()
            .all(|item| !item.is_active)
    );
    assert!(service.authenticate(&owner.session_token).await?.is_none());
    assert!(matches!(
        service
            .login("owner@acme-west.test", "strong-acme-owner-password")
            .await,
        Err(CoreStoreError::InvalidCredentials)
    ));
    assert!(service.permissions_for(owner.user_id).await?.is_empty());

    // Model a login racing with suspension: a late insert with the old tenant
    // generation must remain invalid after the administrator reactivates it.
    let stale_token = SecretToken::generate()?.expose().to_string();
    session::ActiveModel {
        id: Set(String::from("racing-login-session")),
        user_id: Set(owner.user_id),
        token_hash: Set(digest_token(stale_token.as_bytes())),
        csrf_hash: Set(digest_token(b"racing-login-csrf")),
        auth_version: Set(0),
        tenant_auth_version: Set(0),
        expires_at_epoch: Set(i64::MAX),
        created_at_epoch: Set(1),
        last_seen_at_epoch: Set(1),
    }
    .insert(pools.default_connection()?)
    .await?;

    let reactivated = service
        .set_tenant_active(tenant.id, true, platform.user_id)
        .await?;
    assert!(reactivated.is_active);
    let stored_tenant = tenant_entity::Entity::find_by_id(tenant.id)
        .one(pools.default_connection()?)
        .await?
        .ok_or("reactivated tenant missing")?;
    assert_eq!(stored_tenant.auth_version, 2);
    assert!(service.authenticate(&owner.session_token).await?.is_none());
    assert!(service.authenticate(&stale_token).await?.is_none());
    let new_owner_session = service
        .login("owner@acme-west.test", "strong-acme-owner-password")
        .await?;
    assert_eq!(new_owner_session.tenant_id, tenant.id);
    Ok(())
}

#[tokio::test]
async fn audit_writes_follow_the_callers_transaction_and_validate_the_actor()
-> Result<(), std::boxed::Box<dyn std::error::Error>> {
    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )?;
    let pools = DatabasePools::connect(&settings).await?;
    MigrationRunner::run_module(&pools, "default", &MIGRATIONS).await?;
    let service = CoreStore::new(pools.default_connection()?.clone())?;
    service
        .bootstrap_first_admin(
            "audit-admin@example.test",
            "Audit Administrator",
            "strong-audit-password",
        )
        .await?;
    let identity = service
        .login("audit-admin@example.test", "strong-audit-password")
        .await?;
    let database = pools.default_connection()?;

    let transaction = database.begin().await?;
    CoreStore::record_audit_in(
        &transaction,
        identity.tenant_id,
        identity.user_id,
        "test.rollback",
        "test.audit",
        None,
    )
    .await?;
    transaction.rollback().await?;
    assert!(
        audit_event::Entity::find()
            .filter(audit_event::Column::Action.eq("test.rollback"))
            .all(database)
            .await?
            .is_empty()
    );

    let transaction = database.begin().await?;
    CoreStore::record_audit_in(
        &transaction,
        identity.tenant_id,
        identity.user_id,
        "test.commit",
        "test.audit",
        Some("record-1"),
    )
    .await?;
    transaction.commit().await?;
    let committed = audit_event::Entity::find()
        .filter(audit_event::Column::Action.eq("test.commit"))
        .all(database)
        .await?;
    assert_eq!(committed.len(), 1);
    assert_eq!(committed[0].tenant_id, identity.tenant_id);
    assert_eq!(committed[0].actor_user_id, Some(identity.user_id));
    assert_eq!(committed[0].record_key.as_deref(), Some("record-1"));

    let transaction = database.begin().await?;
    assert!(matches!(
        CoreStore::record_audit_in(
            &transaction,
            identity.tenant_id + 1,
            identity.user_id,
            "test.invalid_actor",
            "test.audit",
            None,
        )
        .await,
        Err(CoreStoreError::InvalidTenant)
    ));
    transaction.rollback().await?;
    assert!(
        audit_event::Entity::find()
            .filter(audit_event::Column::Action.eq("test.invalid_actor"))
            .all(database)
            .await?
            .is_empty()
    );

    Ok(())
}
