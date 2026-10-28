#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::process::{Command, ExitCode};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::feluqa::console::platform::Application;

#[feluqa::command(
    name = "build",
    description = "Build the current application for release",
    context = "in_app",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::feluqa::console::platform::arguments(context);
    let host = crate::feluqa::console::platform::host(context)?;
    let application = crate::feluqa::console::platform::application(host)?;
    let result = execute(&arguments, application);
    crate::feluqa::console::platform::finish(host, result)
}

fn execute(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if !arguments.is_empty() {
        return Err(String::from("usage: feluqa build"));
    }
    let mut cargo = Command::new("cargo");
    cargo
        .arg("build")
        .arg("--manifest-path")
        .arg(&application.manifest)
        .arg("--package")
        .arg(&application.package_name)
        .current_dir(&application.directory);
    cargo.arg("--release");
    let status = cargo
        .status()
        .map_err(|error| format!("could not start Cargo for this application: {error}"))?;
    let code = status.code().unwrap_or(1);
    Ok(ExitCode::from(if (0..=255).contains(&code) {
        code as u8
    } else {
        1
    }))
}
