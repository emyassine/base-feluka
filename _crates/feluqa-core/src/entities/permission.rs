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

/// A single explicit permission granted through a role.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_permissions")]
pub struct Model {
    /// Database identity.
    #[sea_orm(primary_key)]
    pub id: i64,
    /// Role receiving the grant.
    pub role_id: i64,
    /// Exact namespaced permission such as `system.users.read`.
    pub permission: String,
}

/// Permission relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
