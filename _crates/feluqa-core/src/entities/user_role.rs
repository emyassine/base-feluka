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
use std::write;

/// Join row associating one user with one role.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_user_roles")]
pub struct Model {
    /// User identity; part of the composite primary key.
    #[sea_orm(primary_key, auto_increment = false)]
    pub user_id: i64,
    /// Role identity; part of the composite primary key.
    #[sea_orm(primary_key, auto_increment = false)]
    pub role_id: i64,
    /// Unix timestamp in seconds when the role was assigned.
    pub assigned_at_epoch: i64,
}

/// User-role relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
