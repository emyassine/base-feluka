#![no_implicit_prelude]

#[path = "app/build.rs"] pub(crate) mod build;
#[path = "app/check.rs"] pub(crate) mod check;
#[path = "app/dev.rs"] pub(crate) mod dev;
#[path = "app/migrate.rs"] pub(crate) mod migrate;
#[path = "app/seed.rs"] pub(crate) mod seed;
#[path = "app/test.rs"] pub(crate) mod test;

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::convert::From;
use crate::std::process::{Command, ExitCode};
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;

pub(crate) fn cargo(application: &Application, action: &str) -> Command {
    let mut cargo = Command::new("cargo");
    cargo.arg(action).arg("--manifest-path").arg(&application.manifest)
        .arg("--package").arg(&application.package_name)
        .current_dir(&application.directory);
    cargo
}

pub(crate) fn run(command: &mut Command) -> Result<ExitCode, String> {
    let status = command.status().map_err(|error| crate::std::format!("could not start Cargo in the app directory: {error}"))?;
    let code = status.code().unwrap_or(1);
    Ok(ExitCode::from(if !(0..=255).contains(&code) { 1 } else { code as u8 }))
}
