#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::process::{Command, ExitCode};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::__feluqa_profile_feluqa::context::Application;

#[feluqa::command(
    name = "check",
    description = "Check the current application",
    profiles = ["feluqa"],
    context = "app",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let application = crate::__feluqa_profile_feluqa::context::application(host)?;
    let result = execute(&arguments, application);
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}

fn execute(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if !arguments.is_empty() {
        return Err(String::from("usage: feluqa check"));
    }
    let mut cargo = Command::new("cargo");
    cargo
        .arg("check")
        .arg("--manifest-path")
        .arg(&application.manifest)
        .arg("--package")
        .arg(&application.package_name)
        .current_dir(&application.directory);
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
