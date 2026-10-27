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

/// One isolated customer or application tenant.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_tenants")]
pub struct Model {
    /// Database identity.
    #[sea_orm(primary_key)]
    pub id: i64,
    /// Stable machine-readable tenant slug.
    pub slug: String,
    /// Human-readable tenant name.
    pub display_name: String,
    /// Whether tenant accounts may authenticate.
    pub is_active: i16,
    /// Session generation incremented on lifecycle transitions.
    pub auth_version: i64,
    /// Unix timestamp in seconds.
    pub created_at_epoch: i64,
}

/// Tenant relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
