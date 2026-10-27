#![no_implicit_prelude]

use crate::feluqa::console::Profile;

/// Profile declarations shared by the product runtime and its build-time command scanner.
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
