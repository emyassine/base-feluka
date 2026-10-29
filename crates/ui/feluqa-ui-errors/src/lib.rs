#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(missing_docs)]

//! Shared error handling types used by Feluqa's UI runtime.
//!
//! Re-exporting `throw_error` keeps error IDs and wrapped errors identical to
//! the types used by `hydration_context` during server-side rendering and
//! hydration.

extern crate throw_error;

pub use throw_error::*;
