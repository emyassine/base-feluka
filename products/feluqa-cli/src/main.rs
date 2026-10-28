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
        commands_directory: "profiles/feluqa/src",
        header: concat!(
            "FELUQA v",
            env!("CARGO_PKG_VERSION"),
            "\nSovereign application platform",
            "\nRust · Tokio · Axum · SeaORM",
            "\nAPI reference: crates.feluqa.numerimondes.com/api/docs/"
        ),
        launch_aliases: &[],
    },
    Profile {
        id: "nadim",
        name: "Nadim",
        binary_name: "nadim",
        commands_directory: "profiles/nadim",
        header: concat!(
            "NADIM\nPersonal command profile\nFeluqa v",
            env!("CARGO_PKG_VERSION")
        ),
        launch_aliases: &[],
    },
];

fn main() -> ExitCode {
    MakeConsole::new(PROFILES).run()
}
