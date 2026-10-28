#![no_implicit_prelude]

extern crate sea_orm;
extern crate std;

use sea_orm::entity::prelude::{
    ActiveModelBehavior, DeriveEntityModel, DerivePrimaryKey, DeriveRelation, EnumIter,
    PrimaryKeyTrait,
};
use std::format;
use std::matches;
use std::option::Option;
use std::panic;
use std::prelude::rust_2024::*;
use std::string::String;
use std::write;

/// Append-only record of a privileged action or access decision.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "feluqa_core_audit_events")]
pub struct Model {
    /// Database identity.
    #[sea_orm(primary_key)]
    pub id: i64,
    /// Tenant that owns this audit record.
    pub tenant_id: i64,
    /// Actor account; absent for unauthenticated or system events.
    pub actor_user_id: Option<i64>,
    /// Stable action name.
    pub action: String,
    /// Resource namespace, for example `business.crm.customers`.
    pub resource: String,
    /// Optional record key affected by the action.
    pub record_key: Option<String>,
    /// Result category such as `allowed`, `denied` or `failed`.
    pub outcome: String,
    /// Request correlation identifier, when available.
    pub request_id: Option<String>,
    /// Unix timestamp in seconds.
    pub occurred_at_epoch: i64,
}

/// Audit-event relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
