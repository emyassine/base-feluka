#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Feluqa's first-party user interface component system.

extern crate core;
extern crate feluqa_ui_autoform;
extern crate feluqa_ui_classnames;
pub extern crate feluqa_ui_component_macros;
pub extern crate feluqa_ui_navigation;
pub extern crate feluqa_ui_runtime;
extern crate heck;
extern crate js_sys;
extern crate serde;
extern crate serde_json;
extern crate std;
extern crate strum;
extern crate time;
extern crate validator;
extern crate wasm_bindgen;
extern crate wasm_bindgen_futures;
extern crate web_sys;

/// Feluqa's UI navigation primitives.
pub use crate::feluqa_ui_navigation as navigation;
/// Feluqa's UI rendering runtime.
pub use crate::feluqa_ui_runtime as runtime;

/// Layout blocks maintained by Feluqa.
#[cfg(feature = "full-catalog")]
pub mod block;
/// Chart components maintained by Feluqa.
#[cfg(feature = "full-catalog")]
pub mod chart;
/// UI components maintained by Feluqa.
pub mod component;
/// Shared component constants.
#[cfg(feature = "full-catalog")]
pub mod constants;
/// UI hooks maintained by Feluqa.
#[cfg(feature = "full-catalog")]
pub mod hook;
/// Shared UI utilities.
#[cfg(feature = "full-catalog")]
pub mod utils;

/// Feluqa's icon set.
#[cfg(feature = "full-catalog")]
pub mod icons {
    pub mod animated;
    pub mod common;
    pub mod icon;

    pub use crate::icons::animated::*;
    pub use crate::icons::icon::*;
}
/// Feluqa's component macros.
pub use crate::feluqa_ui_component_macros as macros;
/// Common rendering types and traits.
pub use crate::runtime::prelude;
/// Component view macro.
pub use crate::runtime::view;
