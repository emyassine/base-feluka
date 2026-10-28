#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Platform-wide context, ownership and portable filesystem path definitions.
//!
//! These definitions describe where Feluqa code runs and who owns its data.
//! They are independent of CLI command filtering and product-specific behavior.

extern crate serde;
extern crate std;
extern crate toml;

mod context;
mod path;
mod product;
mod remote_link;

pub use context::{ContextError, ContextScope, FeluqaContext, PathScope};
pub use path::{PortablePath, PortablePathError};
pub use product::{
    FeluqaProduct, ProductError, list_workspace_products, read_product, relative_path,
    workspace_product,
};
pub use remote_link::RemoteLink;
