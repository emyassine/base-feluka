#![no_implicit_prelude]
#![no_std]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

#[cfg(feature = "auth")]
pub extern crate feluqa_auth as auth;
#[cfg(feature = "console")]
pub extern crate feluqa_console as console;
#[cfg(feature = "live")]
pub extern crate feluqa_live as live;
#[cfg(feature = "module")]
pub extern crate feluqa_module as module;
#[cfg(feature = "panel")]
pub extern crate feluqa_panel as panel;
#[cfg(feature = "ui")]
pub extern crate feluqa_ui as ui;
#[cfg(feature = "view")]
pub extern crate feluqa_view as view;
