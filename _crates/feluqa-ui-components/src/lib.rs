#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Feluqa's first-party user interface component system.

extern crate core;
extern crate feluqa_ui_autoform;
extern crate feluqa_ui_classnames;
extern crate feluqa_ui_component_macros;
extern crate feluqa_ui_runtime;
extern crate feluqa_ui_navigation;
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

/// Feluqa's UI rendering runtime.
pub use crate::feluqa_ui_runtime as runtime;
/// Feluqa's UI navigation primitives.
pub use crate::feluqa_ui_navigation as navigation;

/// Layout blocks maintained by Feluqa.
pub mod block;
/// Chart components maintained by Feluqa.
pub mod chart;
/// UI components maintained by Feluqa.
pub mod component;
/// Shared component constants.
pub mod constants;
/// UI hooks maintained by Feluqa.
pub mod hook;
/// Shared UI utilities.
pub mod utils;

/// Feluqa's icon set.
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
