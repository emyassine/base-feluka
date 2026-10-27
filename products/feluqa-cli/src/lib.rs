#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

mod profiles;

pub use profiles::PROFILES;

use feluqa::console::MakeConsole;
use std::format;
use std::iter::IntoIterator;
use std::process::ExitCode;

feluqa::console::include_profile_commands!();

/// Run this product's console for the executable/profile selected by `binary_name`.
pub fn run_cli(
    binary_name: &str,
    arguments: impl IntoIterator<Item = std::ffi::OsString>,
) -> ExitCode {
    MakeConsole::new(PROFILES).run_process(
        binary_name,
        arguments,
        || {
            let current = std::env::current_dir()
                .map_err(|error| format!("could not read current directory: {error}"))?;
            __feluqa_profile_feluqa::context::CliHost::new(&current)
        },
        |host| host.exit_code,
    )
}
