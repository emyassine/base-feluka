#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(missing_docs)]

//! Persistent identity and session operations for the Feluqa Core panel.

extern crate core;
extern crate feluqa_database;
extern crate sea_orm;
extern crate std;
extern crate subtle;
extern crate thiserror;
extern crate tokio;

use crate::entities::{audit_event, permission, role, session, setting, tenant, user, user_role};
use crate::store::{
    PasswordError, SecretToken, TokenError, digest_token, hash_password, verify_password,
};
use core::result::Result;
use core::result::Result::{Err, Ok};
use feluqa_database::orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, DatabaseTransaction,
    DbErr, EntityTrait, QueryFilter, QueryOrder, TransactionTrait,
};
use std::clone::Clone;
use std::collections::{BTreeMap, BTreeSet};
use std::convert::{From, Into};
use std::default::Default;
use std::format;
use std::iter::{Extend, IntoIterator, Iterator};
use std::matches;
use std::option::Option;
use std::option::Option::{None, Some};
use std::string::String;
use std::string::ToString;
use std::time::{SystemTime, UNIX_EPOCH};
use std::vec::Vec;
use thiserror::Error;

const SESSION_LIFETIME_SECONDS: i64 = 28_800;
const SUPERADMIN_GRANTS: &[&str] = &[
    "system.dashboard.read",
    "system.users.read",
    "system.users.write",
    "system.roles.read",
    "system.roles.write",
    "system.modules.read",
    "system.connections.read",
    "system.migrations.read",
    "system.migrations.run",
    "system.audit.read",
    "system.tenants.read",
    "system.tenants.write",
    "business.erp.manage",
];
const TENANT_ADMIN_GRANTS: &[&str] = &[
    "system.dashboard.read",
    "system.users.read",
    "system.users.write",
    "system.roles.read",
    "system.roles.write",
    "system.modules.read",
    "system.connections.read",
    "system.migrations.read",
    "system.migrations.run",
    "system.audit.read",
    "business.erp.manage",
];

/// Persistent service for Core account, role, session, permission and audit data.
#[derive(Clone)]
pub struct CoreStore {
    database: DatabaseConnection,
    dummy_password_hash: String,
}

/// One-time credentials returned after bootstrap or successful login.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct IssuedSession {
    /// Authenticated account identity.
    pub user_id: i64,
    /// Tenant that owns this account; used to scope every authenticated request.
    pub tenant_id: i64,
    /// Normalized login address.
    pub email: String,
    /// Account display name.
    pub display_name: String,
    /// Raw opaque session value; send only as an HttpOnly cookie.
    pub session_token: String,
    /// Independent CSRF value; send as a readable cookie and require on mutations.
    pub csrf_token: String,
    /// Unix expiration timestamp.
    pub expires_at_epoch: i64,
}

/// Validated server-side identity for a browser session.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SessionIdentity {
    /// Authenticated account identity.
    pub user_id: i64,
    /// Tenant that owns this account.
    pub tenant_id: i64,
    /// Normalized login address.
    pub email: String,
    /// Account display name.
    pub display_name: String,
    /// Persisted session identifier, safe for audit correlation.
    pub session_id: String,
}

/// User fields safe to expose in a system panel; password hashes are excluded.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct UserSummary {
    /// Database account identity.
    pub id: i64,
    /// Current role identity, when the account has a role assignment.
    pub role_id: Option<i64>,
    /// Normalized login address.
    pub email: String,
    /// Human-readable name.
    pub display_name: String,
    /// Whether new sessions may be created.
    pub is_active: bool,
}

/// Role and exact grants safe to expose in a system panel.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RoleSummary {
    /// Database role identity.
    pub id: i64,
    /// Stable policy slug.
    pub slug: String,
    /// Human-readable label.
    pub display_name: String,
    /// Whether the role is maintained by Feluqa.
    pub is_system: bool,
    /// Exact server-side permissions granted by this role.
    pub permissions: Vec<String>,
}

/// Tenant details safe to show in the platform administration panel.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TenantSummary {
    /// Database tenant identity.
    pub id: i64,
    /// Stable machine-readable tenant slug.
    pub slug: String,
    /// Human-readable tenant name.
    pub display_name: String,
    /// Whether tenant accounts may authenticate.
    pub is_active: bool,
    /// Creation time as Unix seconds.
    pub created_at_epoch: i64,
}

/// Core persistence, credential, token or state-transition failure.
#[derive(Debug, Error)]
pub enum CoreStoreError {
    /// Database operation failed.
    #[error("Core database operation failed: {0}")]
    Database(#[from] DbErr),
    /// Bootstrap input did not meet validation requirements.
    #[error("bootstrap details are invalid")]
    InvalidBootstrap,
    /// Role identifier or permission grant is malformed.
    #[error("role details or permission grants are invalid")]
    InvalidRole,
    /// Tenant or its initial owner details are malformed or conflict with existing data.
    #[error("tenant or initial owner details are invalid")]
    InvalidTenant,
    /// Platform policy prevents changing this tenant's active state.
    #[error("this tenant cannot be suspended by the current administrator")]
    TenantLifecycleDenied,
    /// A tenant's session generation can no longer be advanced safely.
    #[error("tenant authentication generation is exhausted")]
    TenantAuthVersionExhausted,
    /// A user's session generation can no longer be advanced safely.
    #[error("user authentication generation is exhausted")]
    UserAuthVersionExhausted,
    /// A user state transition is not permitted, including self-deactivation.
    #[error("user lifecycle transition is not permitted")]
    UserLifecycleDenied,
    /// The actor attempted to delegate a permission they do not hold.
    #[error("role grants exceed the actor's delegated permissions")]
    GrantEscalation,
    /// An administrator already completed or claimed the bootstrap.
    #[error("initial administrator has already been configured")]
    BootstrapUnavailable,
    /// Login failed or the account is disabled.
    #[error("email or password is invalid")]
    InvalidCredentials,
    /// A valid password could not be created.
    #[error("password hashing failed: {0}")]
    Password(#[from] PasswordError),
    /// Secure token generation failed.
    #[error("secure token generation failed: {0}")]
    Token(#[from] TokenError),
    /// The operating-system clock is earlier than the Unix epoch.
    #[error("system clock is invalid")]
    Clock,
    /// Password worker stopped unexpectedly.
    #[error("password worker failed")]
    PasswordWorker,
}

impl CoreStore {
    /// Create a service bound to an already migrated connection and prepare a dummy
    /// Argon2 hash once for constant-work unknown-account login failures.
    pub fn new(database: DatabaseConnection) -> Result<Self, CoreStoreError> {
        let dummy_password_hash = hash_password("Feluqa-invalid-login-sentinel")?;
        Ok(Self {
            database,
            dummy_password_hash,
        })
    }

    /// Return whether the one-time first-administrator setup is still available.
    pub async fn bootstrap_pending(&self) -> Result<bool, CoreStoreError> {
        let state = setting::Entity::find_by_id("bootstrap_state")
            .one(&self.database)
            .await?;
        Ok(state.is_some_and(|value| value.setting_value == "pending"))
    }

    /// List account summaries without returning credential hashes.
    pub async fn users(&self, tenant_id: i64) -> Result<Vec<UserSummary>, CoreStoreError> {
        let accounts = user::Entity::find()
            .filter(user::Column::TenantId.eq(tenant_id))
            .order_by_asc(user::Column::Id)
            .all(&self.database)
            .await?;
        let assignments = user_role::Entity::find()
            .order_by_asc(user_role::Column::UserId)
            .all(&self.database)
            .await?;
        let mut roles_by_user = BTreeMap::new();
        for assignment in assignments {
            roles_by_user.insert(assignment.user_id, assignment.role_id);
        }
        Ok(accounts
            .into_iter()
            .map(|account| UserSummary {
                id: account.id,
                role_id: roles_by_user.get(&account.id).copied(),
                email: account.email,
                display_name: account.display_name,
                is_active: account.is_active == 1,
            })
            .collect())
    }

    /// List roles with their exact permission grants.
    pub async fn roles(&self, tenant_id: i64) -> Result<Vec<RoleSummary>, CoreStoreError> {
        let roles = role::Entity::find()
            .filter(role::Column::TenantId.eq(tenant_id))
            .order_by_asc(role::Column::Id)
            .all(&self.database)
            .await?;
        let mut summaries = Vec::with_capacity(roles.len());
        for item in roles {
            let permissions = permission::Entity::find()
                .filter(permission::Column::RoleId.eq(item.id))
                .order_by_asc(permission::Column::Permission)
                .all(&self.database)
                .await?
                .into_iter()
                .map(|permission| permission.permission)
                .collect();
            summaries.push(RoleSummary {
                id: item.id,
                slug: item.slug,
                display_name: item.display_name,
                is_system: item.is_system == 1,
                permissions,
            });
        }
        Ok(summaries)
    }

    /// List all tenants for an actor holding the platform tenant-read grant.
    pub async fn tenants(&self, actor_user_id: i64) -> Result<Vec<TenantSummary>, CoreStoreError> {
        let grants = self.permissions_for(actor_user_id).await?;
        if !grants.iter().any(|grant| grant == "system.tenants.read") {
            return Err(CoreStoreError::GrantEscalation);
        }
        let tenants = tenant::Entity::find()
            .order_by_asc(tenant::Column::Id)
            .all(&self.database)
            .await?;
        Ok(tenants
            .into_iter()
            .map(|item| TenantSummary {
                id: item.id,
                slug: item.slug,
                display_name: item.display_name,
                is_active: item.is_active == 1,
                created_at_epoch: item.created_at_epoch,
            })
            .collect())
    }

    /// Create a tenant and its initial tenant administrator as one audited transaction.
    ///
    /// The actor must hold the platform-only `system.tenants.write` grant. The initial
    /// administrator receives ordinary tenant operations, never platform tenant access.
    pub async fn create_tenant(
        &self,
        slug: &str,
        display_name: &str,
        owner_name: &str,
        owner_email: &str,
        owner_password: &str,
        actor_user_id: i64,
    ) -> Result<TenantSummary, CoreStoreError> {
        let slug = slug.trim();
        let display_name = display_name.trim();
        let owner_name = owner_name.trim();
        let owner_email = normalize_email(owner_email).ok_or(CoreStoreError::InvalidTenant)?;
        if !valid_tenant_slug(slug)
            || display_name.is_empty()
            || display_name.len() > 160
            || display_name.chars().any(char::is_control)
            || owner_name.is_empty()
            || owner_name.len() > 160
            || owner_name.chars().any(char::is_control)
            || owner_password.len() < 12
            || owner_password.len() > 256
            || owner_password.chars().any(char::is_control)
        {
            return Err(CoreStoreError::InvalidTenant);
        }
        let password = owner_password.to_string();
        let password_hash = tokio::task::spawn_blocking(move || hash_password(&password))
            .await
            .map_err(|_| CoreStoreError::PasswordWorker)??;
        let now = now_epoch()?;
        let transaction = self.database.begin().await?;
        let Some(actor) = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
            .filter(|actor| actor.is_active == 1)
        else {
            transaction.rollback().await?;
            return Err(CoreStoreError::GrantEscalation);
        };
        let grants = delegated_grants(&transaction, actor_user_id).await?;
        if !grants.contains("system.tenants.write") {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.tenants.create",
                "system.tenants",
                Some(slug),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        if tenant::Entity::find()
            .filter(tenant::Column::Slug.eq(slug))
            .one(&transaction)
            .await?
            .is_some()
            || user::Entity::find()
                .filter(user::Column::Email.eq(&owner_email))
                .one(&transaction)
                .await?
                .is_some()
        {
            transaction.rollback().await?;
            return Err(CoreStoreError::InvalidTenant);
        }
        let created = tenant::ActiveModel {
            slug: Set(slug.to_string()),
            display_name: Set(display_name.to_string()),
            created_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        let owner_role = role::ActiveModel {
            tenant_id: Set(created.id),
            slug: Set(format!("tenant_admin_{}", created.id)),
            display_name: Set(String::from("Tenant administrator")),
            is_system: Set(1),
            created_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        for grant in TENANT_ADMIN_GRANTS {
            permission::ActiveModel {
                role_id: Set(owner_role.id),
                permission: Set((*grant).to_string()),
                ..Default::default()
            }
            .insert(&transaction)
            .await?;
        }
        let owner = user::ActiveModel {
            tenant_id: Set(created.id),
            email: Set(owner_email),
            display_name: Set(owner_name.to_string()),
            password_hash: Set(password_hash),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(now),
            updated_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        user_role::ActiveModel {
            user_id: Set(owner.id),
            role_id: Set(owner_role.id),
            assigned_at_epoch: Set(now),
        }
        .insert(&transaction)
        .await?;
        audit_event::ActiveModel {
            tenant_id: Set(actor.tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from("system.tenants.create")),
            resource: Set(String::from("system.tenants")),
            record_key: Set(Some(created.id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(TenantSummary {
            id: created.id,
            slug: created.slug,
            display_name: created.display_name,
            is_active: created.is_active == 1,
            created_at_epoch: created.created_at_epoch,
        })
    }

    /// Activate or suspend a tenant, revoking every existing tenant session on suspension.
    ///
    /// Only a platform administrator may change another tenant. The default platform
    /// tenant and the actor's own tenant cannot be suspended to prevent lockout.
    pub async fn set_tenant_active(
        &self,
        tenant_id: i64,
        active: bool,
        actor_user_id: i64,
    ) -> Result<TenantSummary, CoreStoreError> {
        let transaction = self.database.begin().await?;
        let Some(actor) = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
            .filter(|actor| actor.is_active == 1)
        else {
            transaction.rollback().await?;
            return Err(CoreStoreError::GrantEscalation);
        };
        let grants = delegated_grants(&transaction, actor_user_id).await?;
        if !grants.contains("system.tenants.write") {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.tenants.status",
                "system.tenants",
                Some(&tenant_id.to_string()),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        let Some(mut target) = tenant::Entity::find_by_id(tenant_id)
            .one(&transaction)
            .await?
        else {
            transaction.rollback().await?;
            return Err(CoreStoreError::InvalidTenant);
        };
        if target.id == 1 || target.id == actor.tenant_id {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.tenants.status",
                "system.tenants",
                Some(&tenant_id.to_string()),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::TenantLifecycleDenied);
        }
        if (target.is_active == 1) == active {
            transaction.rollback().await?;
            return Ok(TenantSummary {
                id: target.id,
                slug: target.slug,
                display_name: target.display_name,
                is_active: active,
                created_at_epoch: target.created_at_epoch,
            });
        }

        target.is_active = if active { 1 } else { 0 };
        let Some(next_auth_version) = target.auth_version.checked_add(1) else {
            transaction.rollback().await?;
            return Err(CoreStoreError::TenantAuthVersionExhausted);
        };
        target.auth_version = next_auth_version;
        let summary = TenantSummary {
            id: target.id,
            slug: target.slug.clone(),
            display_name: target.display_name.clone(),
            is_active: active,
            created_at_epoch: target.created_at_epoch,
        };
        let mut target: tenant::ActiveModel = target.into();
        target.is_active = Set(if active { 1 } else { 0 });
        target.auth_version = Set(next_auth_version);
        target.update(&transaction).await?;

        if !active {
            let tenant_users = user::Entity::find()
                .filter(user::Column::TenantId.eq(tenant_id))
                .all(&transaction)
                .await?;
            let user_ids = tenant_users
                .into_iter()
                .map(|account| account.id)
                .collect::<Vec<_>>();
            if !user_ids.is_empty() {
                session::Entity::delete_many()
                    .filter(session::Column::UserId.is_in(user_ids))
                    .exec(&transaction)
                    .await?;
            }
        }
        audit_event::ActiveModel {
            tenant_id: Set(actor.tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from(if active {
                "system.tenants.activate"
            } else {
                "system.tenants.deactivate"
            })),
            resource: Set(String::from("system.tenants")),
            record_key: Set(Some(tenant_id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now_epoch()?),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(summary)
    }

    /// List only roles whose exact permission grants the actor may delegate.
    pub async fn delegable_roles(
        &self,
        actor_user_id: i64,
    ) -> Result<Vec<RoleSummary>, CoreStoreError> {
        let tenant_id = user::Entity::find_by_id(actor_user_id)
            .one(&self.database)
            .await?
            .map(|actor| actor.tenant_id)
            .ok_or(CoreStoreError::GrantEscalation)?;
        let grants = self
            .permissions_for(actor_user_id)
            .await?
            .into_iter()
            .collect::<BTreeSet<_>>();
        Ok(self
            .roles(tenant_id)
            .await?
            .into_iter()
            .filter(|role| may_delegate(&grants, &role.permissions))
            .collect())
    }

    /// Create a role with a bounded set of exact system/business permission names.
    pub async fn create_role(
        &self,
        slug: &str,
        display_name: &str,
        grants: &[String],
        actor_user_id: i64,
    ) -> Result<RoleSummary, CoreStoreError> {
        let slug = slug.trim();
        let display_name = display_name.trim();
        if !valid_role_slug(slug)
            || slug == "superadmin"
            || display_name.is_empty()
            || display_name.len() > 160
            || display_name.chars().any(char::is_control)
            || grants.is_empty()
            || grants.len() > 128
            || grants.iter().any(|grant| !valid_permission(grant))
        {
            return Err(CoreStoreError::InvalidRole);
        }
        let now = now_epoch()?;
        let transaction = self.database.begin().await?;
        let Some(actor) = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
        else {
            transaction.rollback().await?;
            return Err(CoreStoreError::GrantEscalation);
        };
        let allowed_grants = delegated_grants(&transaction, actor_user_id).await?;
        if !may_delegate(&allowed_grants, grants) {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.roles.create",
                "system.roles",
                Some(slug),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        let created = role::ActiveModel {
            tenant_id: Set(actor.tenant_id),
            slug: Set(slug.to_string()),
            display_name: Set(display_name.to_string()),
            is_system: Set(0),
            created_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        for grant in grants {
            permission::ActiveModel {
                role_id: Set(created.id),
                permission: Set(grant.clone()),
                ..Default::default()
            }
            .insert(&transaction)
            .await?;
        }
        audit_event::ActiveModel {
            tenant_id: Set(actor.tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from("system.roles.create")),
            resource: Set(String::from("system.roles")),
            record_key: Set(Some(created.id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(RoleSummary {
            id: created.id,
            slug: created.slug,
            display_name: created.display_name,
            is_system: false,
            permissions: grants.to_vec(),
        })
    }

    /// Replace a role's exact grants after checking the actor's delegation authority.
    pub async fn update_role_grants(
        &self,
        role_id: i64,
        grants: &[String],
        actor_user_id: i64,
    ) -> Result<RoleSummary, CoreStoreError> {
        let unique_grants: BTreeSet<&String> = grants.iter().collect();
        if role_id <= 0
            || grants.is_empty()
            || grants.len() > 128
            || grants.iter().any(|grant| !valid_permission(grant))
            || unique_grants.len() != grants.len()
        {
            return Err(CoreStoreError::InvalidRole);
        }

        let transaction = self.database.begin().await?;
        let Some(target) = role::Entity::find_by_id(role_id).one(&transaction).await? else {
            transaction.rollback().await?;
            return Err(CoreStoreError::InvalidRole);
        };
        let actor_tenant_id = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
            .map(|actor| actor.tenant_id);
        if target.is_system != 0 || actor_tenant_id != Some(target.tenant_id) {
            transaction.rollback().await?;
            return Err(CoreStoreError::InvalidRole);
        }

        let allowed_grants = delegated_grants(&transaction, actor_user_id).await?;
        if !may_delegate(&allowed_grants, grants) {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.roles.update",
                "system.roles",
                Some(&role_id.to_string()),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }

        permission::Entity::delete_many()
            .filter(permission::Column::RoleId.eq(role_id))
            .exec(&transaction)
            .await?;
        for grant in grants {
            permission::ActiveModel {
                role_id: Set(role_id),
                permission: Set(grant.clone()),
                ..Default::default()
            }
            .insert(&transaction)
            .await?;
        }
        audit_event::ActiveModel {
            tenant_id: Set(target.tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from("system.roles.update")),
            resource: Set(String::from("system.roles")),
            record_key: Set(Some(role_id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now_epoch()?),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;

        Ok(RoleSummary {
            id: target.id,
            slug: target.slug,
            display_name: target.display_name,
            is_system: false,
            permissions: grants.to_vec(),
        })
    }

    /// Create a named user and assign one existing role in the same transaction.
    pub async fn create_user(
        &self,
        email: &str,
        display_name: &str,
        password: &str,
        role_id: i64,
        actor_user_id: i64,
    ) -> Result<UserSummary, CoreStoreError> {
        let email = normalize_email(email).ok_or(CoreStoreError::InvalidBootstrap)?;
        let display_name = display_name.trim();
        if display_name.is_empty()
            || display_name.len() > 160
            || display_name.chars().any(char::is_control)
        {
            return Err(CoreStoreError::InvalidBootstrap);
        }
        let actor_tenant_id = user::Entity::find_by_id(actor_user_id)
            .one(&self.database)
            .await?
            .map(|actor| actor.tenant_id)
            .ok_or(CoreStoreError::GrantEscalation)?;
        let Some(target_role) = role::Entity::find_by_id(role_id)
            .one(&self.database)
            .await?
        else {
            return Err(CoreStoreError::InvalidBootstrap);
        };
        if target_role.tenant_id != actor_tenant_id {
            return Err(CoreStoreError::GrantEscalation);
        }
        // Reject unauthorized role assignment before paying the Argon2 password cost.
        let requested_grants = permission::Entity::find()
            .filter(permission::Column::RoleId.eq(role_id))
            .all(&self.database)
            .await?
            .into_iter()
            .map(|permission| permission.permission)
            .collect::<Vec<_>>();
        let actor_grants = self
            .permissions_for(actor_user_id)
            .await?
            .into_iter()
            .collect::<BTreeSet<_>>();
        if !may_delegate(&actor_grants, &requested_grants) {
            self.record_audit(
                Some(actor_user_id),
                "system.users.create",
                "system.users",
                Some(&email),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        let password = password.to_string();
        let password_hash = tokio::task::spawn_blocking(move || hash_password(&password))
            .await
            .map_err(|_| CoreStoreError::PasswordWorker)??;
        let now = now_epoch()?;
        let transaction = self.database.begin().await?;
        let Some(actor) = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
        else {
            transaction.rollback().await?;
            return Err(CoreStoreError::GrantEscalation);
        };
        let role_tenant_id = role::Entity::find_by_id(role_id)
            .one(&transaction)
            .await?
            .map(|target| target.tenant_id);
        if role_tenant_id != Some(actor.tenant_id) {
            transaction.rollback().await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        let requested_grants = permission::Entity::find()
            .filter(permission::Column::RoleId.eq(role_id))
            .all(&transaction)
            .await?
            .into_iter()
            .map(|permission| permission.permission)
            .collect::<Vec<_>>();
        let actor_grants = delegated_grants(&transaction, actor_user_id).await?;
        if !may_delegate(&actor_grants, &requested_grants) {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.users.create",
                "system.users",
                Some(&email),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        let account = user::ActiveModel {
            tenant_id: Set(actor.tenant_id),
            email: Set(email),
            display_name: Set(display_name.to_string()),
            password_hash: Set(password_hash),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(now),
            updated_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        user_role::ActiveModel {
            user_id: Set(account.id),
            role_id: Set(role_id),
            assigned_at_epoch: Set(now),
        }
        .insert(&transaction)
        .await?;
        audit_event::ActiveModel {
            tenant_id: Set(actor.tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from("system.users.create")),
            resource: Set(String::from("system.users")),
            record_key: Set(Some(account.id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(UserSummary {
            id: account.id,
            role_id: Some(role_id),
            email: account.email,
            display_name: account.display_name,
            is_active: true,
        })
    }

    /// Enable or disable an account, increment its auth version and revoke all sessions.
    pub async fn set_user_active(
        &self,
        user_id: i64,
        active: bool,
        actor_user_id: i64,
    ) -> Result<bool, CoreStoreError> {
        let transaction = self.database.begin().await?;
        let Some(account) = user::Entity::find_by_id(user_id).one(&transaction).await? else {
            transaction.rollback().await?;
            return Ok(false);
        };
        let Some(actor) = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
        else {
            transaction.rollback().await?;
            return Ok(false);
        };
        if actor.tenant_id != account.tenant_id {
            transaction.rollback().await?;
            return Ok(false);
        }
        if actor.id == user_id && !active {
            transaction.rollback().await?;
            return Err(CoreStoreError::UserLifecycleDenied);
        }
        let grants = delegated_grants(&transaction, actor_user_id).await?;
        if !grants.contains("system.users.write") {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.users.update",
                "system.users",
                Some(&user_id.to_string()),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }
        if (account.is_active == 1) == active {
            transaction.rollback().await?;
            return Ok(true);
        }
        let Some(next_auth_version) = account.auth_version.checked_add(1) else {
            transaction.rollback().await?;
            return Err(CoreStoreError::UserAuthVersionExhausted);
        };
        let tenant_id = account.tenant_id;
        let mut model: user::ActiveModel = account.into();
        model.is_active = Set(if active { 1 } else { 0 });
        model.auth_version = Set(next_auth_version);
        model.updated_at_epoch = Set(now_epoch()?);
        model.update(&transaction).await?;
        session::Entity::delete_many()
            .filter(session::Column::UserId.eq(user_id))
            .exec(&transaction)
            .await?;
        audit_event::ActiveModel {
            tenant_id: Set(tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from("system.users.update")),
            resource: Set(String::from("system.users")),
            record_key: Set(Some(user_id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now_epoch()?),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(true)
    }

    /// Replace one user's role after delegation checks and revoke all existing sessions.
    pub async fn set_user_role(
        &self,
        user_id: i64,
        role_id: i64,
        actor_user_id: i64,
    ) -> Result<bool, CoreStoreError> {
        if user_id <= 0 || role_id <= 0 {
            return Err(CoreStoreError::InvalidRole);
        }
        let transaction = self.database.begin().await?;
        let Some(account) = user::Entity::find_by_id(user_id).one(&transaction).await? else {
            transaction.rollback().await?;
            return Ok(false);
        };
        let actor_tenant_id = user::Entity::find_by_id(actor_user_id)
            .one(&transaction)
            .await?
            .map(|actor| actor.tenant_id);
        let target_role = role::Entity::find_by_id(role_id).one(&transaction).await?;
        if actor_tenant_id != Some(account.tenant_id)
            || target_role
                .as_ref()
                .is_none_or(|target_role| target_role.tenant_id != account.tenant_id)
        {
            transaction.rollback().await?;
            return Ok(false);
        };
        let Some(next_auth_version) = account.auth_version.checked_add(1) else {
            transaction.rollback().await?;
            return Err(CoreStoreError::UserAuthVersionExhausted);
        };
        let target_grants = permission::Entity::find()
            .filter(permission::Column::RoleId.eq(role_id))
            .all(&transaction)
            .await?
            .into_iter()
            .map(|permission| permission.permission)
            .collect::<Vec<_>>();
        let actor_grants = delegated_grants(&transaction, actor_user_id).await?;
        if !may_delegate(&actor_grants, &target_grants) {
            transaction.rollback().await?;
            self.record_audit(
                Some(actor_user_id),
                "system.users.role.update",
                "system.users",
                Some(&user_id.to_string()),
                "denied",
            )
            .await?;
            return Err(CoreStoreError::GrantEscalation);
        }

        user_role::Entity::delete_many()
            .filter(user_role::Column::UserId.eq(user_id))
            .exec(&transaction)
            .await?;
        user_role::ActiveModel {
            user_id: Set(user_id),
            role_id: Set(role_id),
            assigned_at_epoch: Set(now_epoch()?),
        }
        .insert(&transaction)
        .await?;
        let mut updated: user::ActiveModel = account.clone().into();
        updated.auth_version = Set(next_auth_version);
        updated.updated_at_epoch = Set(now_epoch()?);
        updated.update(&transaction).await?;
        session::Entity::delete_many()
            .filter(session::Column::UserId.eq(user_id))
            .exec(&transaction)
            .await?;
        audit_event::ActiveModel {
            tenant_id: Set(account.tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(String::from("system.users.role.update")),
            resource: Set(String::from("system.users")),
            record_key: Set(Some(user_id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now_epoch()?),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(true)
    }

    /// Atomically create the first superadministrator and its system role.
    ///
    /// The database bootstrap setting is transitioned from `pending` inside the
    /// same transaction as account/role creation, preventing two concurrent setup
    /// requests from both becoming administrators.
    pub async fn bootstrap_first_admin(
        &self,
        email: &str,
        display_name: &str,
        password: &str,
    ) -> Result<(), CoreStoreError> {
        let email = normalize_email(email).ok_or(CoreStoreError::InvalidBootstrap)?;
        let display_name = display_name.trim();
        if display_name.is_empty()
            || display_name.len() > 160
            || display_name.chars().any(char::is_control)
        {
            return Err(CoreStoreError::InvalidBootstrap);
        }
        let password = password.to_string();
        let password_hash = tokio::task::spawn_blocking(move || hash_password(&password))
            .await
            .map_err(|_| CoreStoreError::PasswordWorker)??;
        let now = now_epoch()?;
        let transaction = self.database.begin().await?;

        let claim = setting::ActiveModel {
            setting_key: Set(String::from("bootstrap_state")),
            setting_value: Set(String::from("complete")),
            updated_at_epoch: Set(now),
        };
        let claim_result = setting::Entity::update_many()
            .filter(setting::Column::SettingKey.eq("bootstrap_state"))
            .filter(setting::Column::SettingValue.eq("pending"))
            .set(claim)
            .exec(&transaction)
            .await?;
        if claim_result.rows_affected != 1 {
            transaction.rollback().await?;
            return Err(CoreStoreError::BootstrapUnavailable);
        }

        let role = role::ActiveModel {
            tenant_id: Set(1),
            slug: Set(String::from("superadmin")),
            display_name: Set(String::from("Superadministrator")),
            is_system: Set(1),
            created_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        let account = user::ActiveModel {
            tenant_id: Set(1),
            email: Set(email),
            display_name: Set(display_name.to_string()),
            password_hash: Set(password_hash),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(now),
            updated_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        user_role::ActiveModel {
            user_id: Set(account.id),
            role_id: Set(role.id),
            assigned_at_epoch: Set(now),
        }
        .insert(&transaction)
        .await?;
        for grant in SUPERADMIN_GRANTS {
            permission::ActiveModel {
                role_id: Set(role.id),
                permission: Set((*grant).to_string()),
                ..Default::default()
            }
            .insert(&transaction)
            .await?;
        }
        audit_event::ActiveModel {
            tenant_id: Set(1),
            actor_user_id: Set(Some(account.id)),
            action: Set(String::from("system.bootstrap.complete")),
            resource: Set(String::from("system.users")),
            record_key: Set(Some(account.id.to_string())),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;
        Ok(())
    }

    /// Verify credentials and persist a revocable server-side session.
    pub async fn login(
        &self,
        email: &str,
        password: &str,
    ) -> Result<IssuedSession, CoreStoreError> {
        let email = normalize_email(email).ok_or(CoreStoreError::InvalidCredentials)?;
        let account = user::Entity::find()
            .filter(user::Column::Email.eq(email))
            .one(&self.database)
            .await?;
        let failed_login_actor = account.as_ref().map(|account| account.id);
        let encoded_hash = account
            .as_ref()
            .filter(|account| account.is_active == 1)
            .map(|account| account.password_hash.clone())
            .unwrap_or_else(|| self.dummy_password_hash.clone());
        let password = password.to_string();
        let verified =
            tokio::task::spawn_blocking(move || verify_password(&password, &encoded_hash))
                .await
                .map_err(|_| CoreStoreError::PasswordWorker)?;
        let Some(account) = account.filter(|account| account.is_active == 1 && verified) else {
            self.record_audit(
                failed_login_actor,
                "system.auth.login",
                "system.sessions",
                None,
                "denied",
            )
            .await?;
            return Err(CoreStoreError::InvalidCredentials);
        };
        let tenant_active = tenant::Entity::find_by_id(account.tenant_id)
            .one(&self.database)
            .await?
            .filter(|tenant| tenant.is_active == 1);
        let Some(tenant) = tenant_active else {
            self.record_audit(
                Some(account.id),
                "system.auth.login",
                "system.sessions",
                None,
                "denied",
            )
            .await?;
            return Err(CoreStoreError::InvalidCredentials);
        };

        let now = now_epoch()?;
        let expires_at_epoch = now + SESSION_LIFETIME_SECONDS;
        let session_token = SecretToken::generate()?;
        let csrf_token = SecretToken::generate()?;
        let session_id = SecretToken::generate()?.expose().to_string();
        let transaction = self.database.begin().await?;
        let tenant_still_active = tenant::Entity::find_by_id(account.tenant_id)
            .one(&transaction)
            .await?
            .is_some_and(|current| {
                current.is_active == 1 && current.auth_version == tenant.auth_version
            });
        if !tenant_still_active {
            transaction.rollback().await?;
            self.record_audit(
                Some(account.id),
                "system.auth.login",
                "system.sessions",
                None,
                "denied",
            )
            .await?;
            return Err(CoreStoreError::InvalidCredentials);
        }
        session::ActiveModel {
            id: Set(session_id.clone()),
            user_id: Set(account.id),
            token_hash: Set(session_token.digest().to_string()),
            csrf_hash: Set(digest_token(csrf_token.expose().as_bytes())),
            auth_version: Set(account.auth_version),
            tenant_auth_version: Set(tenant.auth_version),
            expires_at_epoch: Set(expires_at_epoch),
            created_at_epoch: Set(now),
            last_seen_at_epoch: Set(now),
        }
        .insert(&transaction)
        .await?;
        audit_event::ActiveModel {
            tenant_id: Set(account.tenant_id),
            actor_user_id: Set(Some(account.id)),
            action: Set(String::from("system.auth.login")),
            resource: Set(String::from("system.sessions")),
            record_key: Set(Some(session_id)),
            outcome: Set(String::from("allowed")),
            request_id: Set(None),
            occurred_at_epoch: Set(now),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
        transaction.commit().await?;

        Ok(IssuedSession {
            user_id: account.id,
            tenant_id: account.tenant_id,
            email: account.email,
            display_name: account.display_name,
            session_token: session_token.expose().to_string(),
            csrf_token: csrf_token.expose().to_string(),
            expires_at_epoch,
        })
    }

    /// Resolve a raw browser token to an active identity and refresh its last-used time.
    pub async fn authenticate(
        &self,
        raw_token: &str,
    ) -> Result<Option<SessionIdentity>, CoreStoreError> {
        if raw_token.len() != 64 {
            return Ok(None);
        }
        let now = now_epoch()?;
        let token_hash = digest_token(raw_token.as_bytes());
        let Some(stored) = session::Entity::find()
            .filter(session::Column::TokenHash.eq(token_hash))
            .filter(session::Column::ExpiresAtEpoch.gt(now))
            .one(&self.database)
            .await?
        else {
            return Ok(None);
        };
        let Some(account) = user::Entity::find_by_id(stored.user_id)
            .one(&self.database)
            .await?
        else {
            return Ok(None);
        };
        if account.is_active != 1 || stored.auth_version != account.auth_version {
            return Ok(None);
        }
        let Some(current_tenant) = tenant::Entity::find_by_id(account.tenant_id)
            .one(&self.database)
            .await?
        else {
            return Ok(None);
        };
        if current_tenant.is_active != 1
            || current_tenant.auth_version != stored.tenant_auth_version
        {
            return Ok(None);
        }
        if now.saturating_sub(stored.last_seen_at_epoch) >= 60 {
            let mut active: session::ActiveModel = stored.clone().into();
            active.last_seen_at_epoch = Set(now);
            active.update(&self.database).await?;
        }
        Ok(Some(SessionIdentity {
            user_id: account.id,
            tenant_id: account.tenant_id,
            email: account.email,
            display_name: account.display_name,
            session_id: stored.id,
        }))
    }

    /// Verify a CSRF form/header token against the authenticated session.
    pub async fn verify_csrf(
        &self,
        raw_session_token: &str,
        csrf_token: &str,
    ) -> Result<bool, CoreStoreError> {
        if raw_session_token.len() != 64 || csrf_token.len() != 64 {
            return Ok(false);
        }
        let now = now_epoch()?;
        let token_hash = digest_token(raw_session_token.as_bytes());
        let Some(stored) = session::Entity::find()
            .filter(session::Column::TokenHash.eq(token_hash))
            .filter(session::Column::ExpiresAtEpoch.gt(now))
            .one(&self.database)
            .await?
        else {
            return Ok(false);
        };
        let submitted = digest_token(csrf_token.as_bytes());
        use subtle::ConstantTimeEq;
        Ok(stored
            .csrf_hash
            .as_bytes()
            .ct_eq(submitted.as_bytes())
            .into())
    }

    /// Revoke a browser session by deleting its token digest from persistent storage.
    pub async fn logout(&self, raw_token: &str) -> Result<(), CoreStoreError> {
        if raw_token.len() != 64 {
            return Ok(());
        }
        let hash = digest_token(raw_token.as_bytes());
        let stored = session::Entity::find()
            .filter(session::Column::TokenHash.eq(hash.clone()))
            .one(&self.database)
            .await?;
        session::Entity::delete_many()
            .filter(session::Column::TokenHash.eq(hash))
            .exec(&self.database)
            .await?;
        if let Some(stored) = stored {
            self.record_audit(
                Some(stored.user_id),
                "system.auth.logout",
                "system.sessions",
                Some(&stored.id),
                "allowed",
            )
            .await?;
        }
        Ok(())
    }

    /// Return exact permissions resolved from the account's assigned roles.
    pub async fn permissions_for(&self, user_id: i64) -> Result<Vec<String>, CoreStoreError> {
        let Some(account) = user::Entity::find_by_id(user_id)
            .one(&self.database)
            .await?
        else {
            return Ok(Vec::new());
        };
        if account.is_active != 1
            || !tenant::Entity::find_by_id(account.tenant_id)
                .one(&self.database)
                .await?
                .is_some_and(|tenant| tenant.is_active == 1)
        {
            return Ok(Vec::new());
        }
        let assignments = user_role::Entity::find()
            .filter(user_role::Column::UserId.eq(user_id))
            .all(&self.database)
            .await?;
        let mut grants = BTreeSet::new();
        for assignment in assignments {
            let role_tenant_id = role::Entity::find_by_id(assignment.role_id)
                .one(&self.database)
                .await?
                .map(|role| role.tenant_id);
            if role_tenant_id != Some(account.tenant_id) {
                continue;
            }
            let rows = permission::Entity::find()
                .filter(permission::Column::RoleId.eq(assignment.role_id))
                .all(&self.database)
                .await?;
            grants.extend(rows.into_iter().map(|row| row.permission));
        }
        Ok(grants.into_iter().collect())
    }

    /// Append one audit record with no secret-bearing fields.
    pub async fn record_audit(
        &self,
        actor_user_id: Option<i64>,
        action: &str,
        resource: &str,
        record_key: Option<&str>,
        outcome: &str,
    ) -> Result<(), CoreStoreError> {
        let tenant_id = match actor_user_id {
            Some(actor_user_id) => user::Entity::find_by_id(actor_user_id)
                .one(&self.database)
                .await?
                .map(|actor| actor.tenant_id)
                .unwrap_or(1),
            None => 1,
        };
        audit_event::ActiveModel {
            tenant_id: Set(tenant_id),
            actor_user_id: Set(actor_user_id),
            action: Set(action.to_string()),
            resource: Set(resource.to_string()),
            record_key: Set(record_key.map(ToString::to_string)),
            outcome: Set(outcome.to_string()),
            request_id: Set(None),
            occurred_at_epoch: Set(now_epoch()?),
            ..Default::default()
        }
        .insert(&self.database)
        .await?;
        Ok(())
    }

    /// Append an audit event into the caller's transaction after verifying actor scope.
    pub async fn record_audit_in(
        transaction: &DatabaseTransaction,
        tenant_id: i64,
        actor_user_id: i64,
        action: &str,
        resource: &str,
        record_key: Option<&str>,
    ) -> Result<(), CoreStoreError> {
        let actor = user::Entity::find_by_id(actor_user_id)
            .one(transaction)
            .await?
            .ok_or(CoreStoreError::InvalidTenant)?;
        if actor.tenant_id != tenant_id || actor.is_active != 1 {
            return Err(CoreStoreError::InvalidTenant);
        }
        audit_event::ActiveModel {
            tenant_id: Set(tenant_id),
            actor_user_id: Set(Some(actor_user_id)),
            action: Set(action.to_string()),
            resource: Set(resource.to_string()),
            record_key: Set(record_key.map(ToString::to_string)),
            outcome: Set(String::from("success")),
            request_id: Set(None),
            occurred_at_epoch: Set(now_epoch()?),
            ..Default::default()
        }
        .insert(transaction)
        .await?;
        Ok(())
    }
}

async fn delegated_grants(
    transaction: &DatabaseTransaction,
    actor_user_id: i64,
) -> Result<BTreeSet<String>, CoreStoreError> {
    let Some(actor) = user::Entity::find_by_id(actor_user_id)
        .one(transaction)
        .await?
    else {
        return Ok(BTreeSet::new());
    };
    if actor.is_active != 1
        || !tenant::Entity::find_by_id(actor.tenant_id)
            .one(transaction)
            .await?
            .is_some_and(|tenant| tenant.is_active == 1)
    {
        return Ok(BTreeSet::new());
    }
    let assignments = user_role::Entity::find()
        .filter(user_role::Column::UserId.eq(actor_user_id))
        .all(transaction)
        .await?;
    let mut grants = BTreeSet::new();
    for assignment in assignments {
        let role_tenant_id = role::Entity::find_by_id(assignment.role_id)
            .one(transaction)
            .await?
            .map(|role| role.tenant_id);
        if role_tenant_id != Some(actor.tenant_id) {
            continue;
        }
        let permissions = permission::Entity::find()
            .filter(permission::Column::RoleId.eq(assignment.role_id))
            .all(transaction)
            .await?;
        grants.extend(
            permissions
                .into_iter()
                .map(|permission| permission.permission),
        );
    }
    Ok(grants)
}

fn may_delegate(allowed_grants: &BTreeSet<String>, requested: &[String]) -> bool {
    let may_manage_business = allowed_grants.contains("business.erp.manage");
    requested.iter().all(|grant| {
        allowed_grants.contains(grant) || (may_manage_business && grant.starts_with("business."))
    })
}

fn normalize_email(value: &str) -> Option<String> {
    let normalized = value.trim().to_ascii_lowercase();
    let (local, domain) = normalized.split_once('@')?;
    if normalized.len() > 254
        || local.is_empty()
        || domain.is_empty()
        || domain.starts_with('.')
        || domain.ends_with('.')
        || !domain.contains('.')
        || normalized.chars().any(char::is_control)
    {
        return None;
    }
    Some(normalized)
}

fn valid_role_slug(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_' || byte == b'-'
        })
}

fn valid_tenant_slug(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.as_bytes()[0].is_ascii_lowercase()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'-')
        && !value.ends_with('-')
        && !value.contains("--")
}

fn valid_permission(value: &str) -> bool {
    let mut parts = value.split('.');
    let Some(namespace) = parts.next() else {
        return false;
    };
    if !matches!(namespace, "system" | "business") {
        return false;
    }
    let mut segments = 1;
    for part in parts {
        segments += 1;
        if part.is_empty()
            || !part
                .bytes()
                .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        {
            return false;
        }
    }
    segments >= 2
}

fn now_epoch() -> Result<i64, CoreStoreError> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .map_err(|_| CoreStoreError::Clock)
}
