#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Platform-wide context, ownership and portable filesystem path definitions.
//!
//! These definitions describe where Feluqa code runs and who owns its data.
//! They are independent of CLI command filtering and product-specific behavior.

extern crate std;

mod context;
mod path;

pub use context::{ContextError, ContextScope, FeluqaContext, PathScope};
pub use path::{PortablePath, PortablePathError};
