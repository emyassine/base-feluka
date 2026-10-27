#![no_implicit_prelude]

extern crate sea_orm;
extern crate std;

use sea_orm::entity::prelude::{
    ActiveModelBehavior, DeriveEntityModel, DerivePrimaryKey, DeriveRelation, EnumIter,
    PrimaryKeyTrait,
};
use std::format;
use std::matches;
use std::panic;
use std::prelude::rust_2024::*;
use std::string::String;
use std::write;

/// A local user account used by Feluqa Core and app-scoped panels.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_users")]
pub struct Model {
    /// Database identity.
    #[sea_orm(primary_key)]
    pub id: i64,
    /// Application tenant that owns this account.
    pub tenant_id: i64,
    /// Normalized, unique login address.
    pub email: String,
    /// Human-readable account name.
    pub display_name: String,
    /// Argon2 PHC password hash; never a plaintext password.
    pub password_hash: String,
    /// One when enabled, zero when access is disabled.
    pub is_active: i16,
    /// Incremented to revoke sessions after credential/security changes.
    pub auth_version: i64,
    /// Unix timestamp in seconds.
    pub created_at_epoch: i64,
    /// Unix timestamp in seconds.
    pub updated_at_epoch: i64,
}

/// User relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
