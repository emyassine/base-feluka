#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(missing_docs)]

//! Typed model metadata used by the Feluqa web profile.

use ::core::convert::From;

/// Metadata shared by models generated with [`Model`].
pub trait Model {
    /// Type used by the model's primary key.
    type Id;

    /// Database table mapped by the model.
    const TABLE_NAME: &'static str;

    /// Whether unscoped model helpers must be refused by the generated implementation.
    const TENANT_SCOPED: bool = false;
}

/// Refuse a generic model helper when its model declares a tenant key.
pub fn ensure_unscoped_allowed<T: Model>() -> ::core::result::Result<(), crate::orm::DbErr> {
    if T::TENANT_SCOPED {
        ::core::result::Result::Err(crate::orm::DbErr::Custom(::std::string::String::from(
            "tenant-scoped model requires an *_in_tenant operation",
        )))
    } else {
        ::core::result::Result::Ok(())
    }
}

/// Derive a SeaORM-backed Feluqa model.
pub use crate::feluqa_model_derive::Model;
