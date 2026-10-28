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

/// A key/value setting maintained by Feluqa Core.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_settings")]
pub struct Model {
    /// Stable setting key.
    #[sea_orm(primary_key, auto_increment = false)]
    pub setting_key: String,
    /// Setting value.
    pub setting_value: String,
    /// Unix timestamp in seconds of the last change.
    pub updated_at_epoch: i64,
}

/// Setting relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
