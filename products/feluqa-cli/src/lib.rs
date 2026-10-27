#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

mod profiles;

pub use profiles::PROFILES;

use feluqa::console::MakeConsole;
use std::process::ExitCode;

feluqa::console::include_profile_commands!();

/// Run this product's console for the executable/profile selected by `binary_name`.
pub fn run_cli(
    binary_name: &str,
    arguments: impl std::iter::IntoIterator<Item = std::ffi::OsString>,
) -> ExitCode {
    MakeConsole::new(PROFILES)
        .run_as::<__feluqa_profile_feluqa::context::CliHost, _>(binary_name, arguments)
}

#[cfg(test)]
#[path = "../tests/support/console.rs"]
mod console_tests;
