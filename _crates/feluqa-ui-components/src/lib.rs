#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Leptos components exposed by Feluqa's web UI facade.

extern crate leptos;
extern crate core;

/// Basic interactive and presentational controls.
pub mod button;

/// Leptos component and class composition primitives for Feluqa's web UI.
pub mod component {
    /// Button and button style variants.
    pub use crate::button::{Button, ButtonSize, ButtonVariant};
    /// Conditionally joins class names without introducing duplicate spaces.
    pub use crate::button::clx;
}
