#![no_implicit_prelude]

pub(crate) mod build;
pub(crate) mod check;
pub(crate) mod dev;
pub(crate) mod migrate;
pub(crate) mod seed;
pub(crate) mod test;

use crate::context::Application;
use crate::std::convert::From;
use crate::std::process::{Command, ExitCode};
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;

pub(crate) fn cargo(application: &Application, action: &str) -> Command {
    let mut cargo = Command::new("cargo");
    cargo
        .arg(action)
        .arg("--manifest-path")
        .arg(&application.manifest)
        .arg("--package")
        .arg(&application.package_name)
        .current_dir(&application.directory);
    cargo
}

pub(crate) fn run(command: &mut Command) -> Result<ExitCode, String> {
    let status = command.status().map_err(|error| {
        crate::std::format!("could not start Cargo in the app directory: {error}")
    })?;
    let code = status.code().unwrap_or(1);
    Ok(ExitCode::from(if !(0..=255).contains(&code) {
        1
    } else {
        code as u8
    }))
}
