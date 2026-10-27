#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

use feluqa::console::{MakeConsole, Profile};
use std::process::ExitCode;

/// Every executable, build-time scanner and command help use this profile table.
#[feluqa::console::profile_registry]
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

fn main() -> ExitCode {
    MakeConsole::new(PROFILES).run()
}
