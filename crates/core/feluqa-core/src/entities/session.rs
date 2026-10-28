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

/// Server-side session state; only token digests are stored.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_sessions")]
pub struct Model {
    /// Opaque database session identity.
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: String,
    /// Authenticated account identity.
    pub user_id: i64,
    /// SHA-256 digest of the random browser session token.
    pub token_hash: String,
    /// SHA-256 digest of the independent CSRF token.
    pub csrf_hash: String,
    /// User authentication version captured when the session was issued.
    pub auth_version: i64,
    /// Tenant authentication version captured when the session was issued.
    pub tenant_auth_version: i64,
    /// Unix timestamp in seconds when the session expires.
    pub expires_at_epoch: i64,
    /// Unix timestamp in seconds when the session was created.
    pub created_at_epoch: i64,
    /// Unix timestamp in seconds when the session was last used.
    pub last_seen_at_epoch: i64,
}

/// Session relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
