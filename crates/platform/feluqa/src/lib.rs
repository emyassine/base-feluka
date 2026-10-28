#![no_implicit_prelude]
#![no_std]
#![deny(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Feature-gated public namespace for Feluqa runtime and shared contracts.

/// Version of the Feluqa facade crate, embedded by Cargo at build time.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

extern crate alloc;
#[cfg(feature = "web")]
extern crate axum;
extern crate core as rust_core;
#[cfg(feature = "web")]
extern crate serde;
#[cfg(feature = "web")]
extern crate std;
#[cfg(feature = "web")]
extern crate toml;
#[cfg(test)]
extern crate std;
extern crate subtle;
#[cfg(feature = "web")]
extern crate tokio;
#[cfg(test)]
extern crate tokio;
#[cfg(test)]
extern crate tower;
#[cfg(feature = "web")]
extern crate tower_http;

/// Authentication and permission contracts for the selected target.
#[cfg(feature = "auth")]
pub extern crate feluqa_auth as auth;
/// CLI and console command contracts.
#[cfg(feature = "console")]
pub extern crate feluqa_console as console;
/// Register a compiled command in `feluqa::console`'s distributed inventory.
#[cfg(feature = "console")]
pub use crate::console::command;
/// Attach compiled command modules and test support to a profile declaration.
#[cfg(feature = "console")]
pub use crate::console::profile_registry;
/// Register a product-specific console host for selected profiles.
#[cfg(feature = "console")]
pub use crate::console::register_host;
/// Feluqa Core identity, roles, persistent session and audit contracts.
#[cfg(feature = "core")]
pub extern crate feluqa_core as core;
/// Named database pools and dialect-specific migrations.
#[cfg(feature = "database")]
pub extern crate feluqa_database as database;
/// Platform contexts, ownership roots and portable filesystem paths.
#[cfg(feature = "definitions")]
pub extern crate feluqa_definitions as definitions;
/// Self-hosted SVG icon collections and safe asset-path helpers.
#[cfg(feature = "imagery")]
pub extern crate feluqa_imagery as imagery;
/// Signed, authorized server action dispatch.
#[cfg(feature = "live")]
pub extern crate feluqa_live as live;
/// Server-driven interaction contracts. The current runtime uses signed HTTP actions;
/// WebSocket-backed component sessions remain a separate transport capability.
#[cfg(feature = "live")]
pub use crate::live as liveview;
/// Deterministic lifecycle for statically linked modules.
#[cfg(feature = "module")]
pub extern crate feluqa_module as module;
/// Typed -style notification contracts and bounded mailbox behavior.
#[cfg(feature = "notifications")]
pub extern crate feluqa_notifications as notifications;
/// Validated system and business panel registry.
#[cfg(feature = "panel")]
pub extern crate feluqa_panel as panel;
/// Versioned UI schema and safe component renderer.
#[cfg(feature = "ui")]
pub extern crate feluqa_ui as ui;
/// Compiled view runtime and optional build-time compiler.
#[cfg(feature = "view")]
pub extern crate feluqa_view as view;

/// High-level router and response builders for web applications.
#[cfg(feature = "web")]
pub mod web;

/// Typed Feluqa application settings and environment validation.
#[cfg(feature = "web")]
pub mod application;

/// Axum-backed request and response types exposed by the Feluqa web profile.
#[cfg(feature = "web")]
pub mod http {
    pub use crate::axum::Json;
    pub use crate::axum::Router;
    pub use crate::axum::extract::{Extension, Form, Path, Query, State};
    pub use crate::axum::http::header::{COOKIE, HOST, ORIGIN, SET_COOKIE};
    pub use crate::axum::http::{HeaderMap, HeaderName, HeaderValue, Method, Request, StatusCode};
    pub use crate::axum::response::{Html, IntoResponse, Redirect, Response};

    /// JSON response type for controller actions.
    pub type JsonResponse<T> = Json<T>;
    /// HTTP response alias used by controller actions.
    pub type HttpResponse = Response;

    /// Small response constructors used by controller actions.
    pub mod response {
        /// Build a JSON response from any serializable value.
        pub fn json<T>(value: T) -> super::Json<T>
        where
            T: crate::serde::Serialize,
        {
            super::Json(value)
        }
    }
}

/// Common application imports; explicit opt-in, not Rust's implicit prelude.
#[cfg(feature = "web")]
pub mod prelude {
    pub use crate::alloc::borrow::ToOwned;
    pub use crate::alloc::format;
    pub use crate::alloc::string::String;
    pub use crate::alloc::string::ToString;
    pub use crate::alloc::vec::Vec;
    pub use crate::application::{
        ApplicationSettings, ModulesSettings, RuntimeSettings, SecuritySettings,
    };
    #[cfg(feature = "auth")]
    pub use crate::auth::Principal;
    pub use crate::database;
    #[cfg(feature = "database")]
    pub use crate::database::DatabasePools;
    pub use crate::http::response;
    pub use crate::http::{
        COOKIE, Extension, Form, HOST, HeaderMap, HeaderName, HeaderValue, Html, HttpResponse,
        IntoResponse, Json, JsonResponse, ORIGIN, Path, Query, Redirect, Request, Response, Router,
        SET_COOKIE, State, StatusCode,
    };
    pub use crate::rust_core::clone::Clone;
    pub use crate::rust_core::convert::{From, Into, TryFrom, TryInto};
    pub use crate::rust_core::default::Default;
    pub use crate::rust_core::fmt::Debug;
    pub use crate::rust_core::iter::{DoubleEndedIterator, ExactSizeIterator, Iterator};
    pub use crate::rust_core::matches;
    pub use crate::rust_core::option::Option;
    pub use crate::rust_core::option::Option::{None, Some};
    pub use crate::rust_core::result::Result;
    pub use crate::rust_core::result::Result::{Err, Ok};
    pub use crate::rust_core::write;
    pub use crate::serde::{Deserialize, Serialize};
    pub use crate::web::{Route, Routes};
}
