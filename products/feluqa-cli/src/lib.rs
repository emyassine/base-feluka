#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

mod commands;
mod context;
mod runtime;

use feluqa::console::Profile;
use std::eprintln;
use std::format;
use std::process::ExitCode;
use std::result::Result::{Err, Ok};
use std::vec::Vec;
use std::ffi::OsString;

/// Profile declarations for this console product.
pub const PROFILES: &[Profile] = &[
    Profile {
        id: "feluqa",
        name: "Feluqa platform",
        binary_name: "feluqa",
        commands_directory: "profiles/feluqa/commands",
        header: "FELUQA\nSovereign application platform",
        launch_aliases: &[],
    },
    Profile {
        id: "nadim",
        name: "Nadim",
        binary_name: "nadim",
        commands_directory: "profiles/nadim/commands",
        header: "NADIM\nPersonal command profile",
        launch_aliases: &[],
    },
    Profile {
        id: "feluqa-dev",
        name: "Feluqa developer tools",
        binary_name: "feluqa-dev",
        commands_directory: "profiles/feluqa-dev/commands",
        header: "FELUQA DEV\nDeveloper command profile",
        launch_aliases: &[],
    },
];

include!(concat!(env!("OUT_DIR"), "/profile_commands.rs"));

/// Run this product's console for the executable/profile selected by `binary_name`.
pub fn run_cli(binary_name: &str, arguments: Vec<OsString>) -> ExitCode {
    let current = std::env::current_dir().map_err(|error| format!("could not read current directory: {error}"));
    match current.and_then(|directory| runtime::dispatcher::run(arguments, &directory, binary_name)) {
        Ok(code) => code,
        Err(error) => {
            eprintln!("{binary_name}: {error}");
            ExitCode::FAILURE
        }
    }
}
