#![no_implicit_prelude]

//! Canonical remote endpoints used by Feluqa products.

extern crate std;

use std::option::Option;
use std::option::Option::None;
use std::option::Option::Some;

const PRIVATE_CRATE_INDEX: &str = "sparse+https://crates.feluqa.numerimondes.com/api/v1/crates/";

/// A named Feluqa service endpoint.
///
/// This is the sole source of distribution URLs in the Rust products. An
/// unconfigured endpoint returns `None`; callers must not guess or construct
/// fallback URLs.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum RemoteLink {
    /// Sparse index used by Cargo for private Feluqa crates.
    PrivateCrateRegistry,
    /// Private registry source used to distribute the `feluqa-cli` package.
    ///
    /// The CLI package is not yet published, so this endpoint does not imply
    /// that CLI self-update is currently available.
    CliUpdate,
    /// Signed platform release manifest endpoint, not configured yet.
    PlatformUpdate,
}

impl RemoteLink {
    /// Return this endpoint's configured URL, if one exists.
    pub const fn url(self) -> Option<&'static str> {
        match self {
            Self::PrivateCrateRegistry | Self::CliUpdate => Some(PRIVATE_CRATE_INDEX),
            Self::PlatformUpdate => None,
        }
    }
}
