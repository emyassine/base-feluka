#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

use feluqa::console::{MakeConsole, Profile};
use std::process::ExitCode;

/// Every executable and the build-time command scanner use this single profile table.
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

feluqa::console::include_profile_commands!();

fn main() -> ExitCode {
    MakeConsole::new(PROFILES).run_as::<__feluqa_profile_feluqa::context::CliHost, _>(
        env!("CARGO_BIN_NAME"),
        std::env::args_os().skip(1),
    )
}

// These tests cover private
// CLI context and generator helpers
// across multiple command modules.
// Cargo integration tests remain
// standalone in `tests/*.rs`.
#[cfg(test)]
#[path = "../tests/support/console.rs"]
mod console_tests;
