#![no_implicit_prelude]
#![no_std]
#![deny(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Feature-gated public namespace for Feluqa runtime and shared contracts.

/// Authentication and permission contracts for the selected target.
#[cfg(feature = "auth")]
pub extern crate feluqa_auth as auth;
/// CLI and console command contracts.
#[cfg(feature = "console")]
pub extern crate feluqa_console as console;
/// Signed, authorized server action dispatch.
#[cfg(feature = "live")]
pub extern crate feluqa_live as live;
/// Deterministic lifecycle for statically linked modules.
#[cfg(feature = "module")]
pub extern crate feluqa_module as module;
/// Validated system and business panel registry.
#[cfg(feature = "panel")]
pub extern crate feluqa_panel as panel;
/// Versioned UI schema and safe component renderer.
#[cfg(feature = "ui")]
pub extern crate feluqa_ui as ui;
/// Compiled view runtime and optional build-time compiler.
#[cfg(feature = "view")]
pub extern crate feluqa_view as view;
