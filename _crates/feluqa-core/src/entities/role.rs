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

/// A named permission set assigned to local user accounts.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_roles")]
pub struct Model {
    /// Database identity.
    #[sea_orm(primary_key)]
    pub id: i64,
    /// Tenant that owns this role and its permission grants.
    pub tenant_id: i64,
    /// Stable slug used by policies.
    pub slug: String,
    /// Human-readable label.
    pub display_name: String,
    /// One when the role is maintained by Feluqa and cannot be deleted.
    pub is_system: i16,
    /// Unix timestamp in seconds.
    pub created_at_epoch: i64,
}

/// Role relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
