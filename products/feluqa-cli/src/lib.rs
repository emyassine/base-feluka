#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

mod handlers;
mod operations;
mod context;

use feluqa::console::Profile;
use std::eprintln;
use std::format;
use std::iter::{IntoIterator, Iterator};
use std::process::ExitCode;
use std::result::Result::{Err, Ok};
use std::vec::Vec;
use std::ffi::OsString;
use std::string::String;

/// Profile declarations for this console product.
pub const PROFILES: &[Profile] = &[
    Profile {
        id: "feluqa",
        name: "Feluqa platform",
        binary_name: "feluqa",
        commands_directory: "profiles/feluqa",
        header: "FELUQA\nSovereign application platform",
        launch_aliases: &[],
    },
    Profile {
        id: "nadim",
        name: "Nadim",
        binary_name: "nadim",
        commands_directory: "profiles/nadim",
        header: "NADIM\nPersonal command profile",
        launch_aliases: &[],
    },
    Profile {
        id: "feluqa-dev",
        name: "Feluqa developer tools",
        binary_name: "feluqa-dev",
        commands_directory: "profiles/feluqa-dev",
        header: "FELUQA DEV\nDeveloper command profile",
        launch_aliases: &[],
    },
];

include!(concat!(env!("OUT_DIR"), "/profile_commands.rs"));

/// Run this product's console for the executable/profile selected by `binary_name`.
pub fn run_cli(binary_name: &str, arguments: Vec<OsString>) -> ExitCode {
    let current = match std::env::current_dir() {
        Ok(directory) => directory,
        Err(error) => {
            eprintln!("{binary_name}: could not read current directory: {error}");
            return ExitCode::FAILURE;
        }
    };
    let mut host = match context::CliHost::new(&current) {
        Ok(host) => host,
        Err(error) => {
            eprintln!("{binary_name}: {error}");
            return ExitCode::FAILURE;
        }
    };
    let arguments = match arguments.into_iter().map(|value| value.into_string().map_err(|_| String::from("command arguments must be valid UTF-8"))).collect::<Result<Vec<_>, _>>() {
        Ok(arguments) => arguments,
        Err(error) => {
            eprintln!("{binary_name}: {error}");
            return ExitCode::FAILURE;
        }
    };
    match feluqa::console::run(PROFILES, binary_name, &arguments, &mut host) {
        Ok(()) => host.exit_code,
        Err(error) => {
            eprintln!("{binary_name}: {error}");
            ExitCode::FAILURE
        }
    }
}
