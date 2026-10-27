#![no_implicit_prelude]

use crate::feluqa;
extern crate sea_orm;
extern crate std;

use crate::std::borrow::ToOwned;
use crate::std::clone::Clone;
use crate::std::convert::{Into, TryInto};
use crate::std::default::Default;
use crate::std::format;
use crate::std::iter::{DoubleEndedIterator, ExactSizeIterator, Iterator};
use crate::std::matches;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::panic;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::string::ToString;
use crate::std::write;
use feluqa::database::orm::entity::prelude::*;

/// CRM customer persistence model.
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "crm_customers")]
pub struct Model {
    /// Database identity.
    #[sea_orm(primary_key)]
    pub id: i64,
    /// Tenant that owns this customer record.
    pub tenant_id: i64,
    /// Display name.
    pub name: String,
    /// Unique customer email.
    pub email: String,
    /// Core account responsible for this record; old imports may have no owner.
    pub owner_user_id: Option<i64>,
}

/// Customer relationship declarations.
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
