#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::string::String;

#[feluqa::command(name = "migrate", description = "Apply application migrations", profiles = ["feluqa", "feluqa-dev"], context = "app-or-workspace")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let result = match &host.context {
        crate::__feluqa_profile_feluqa::context::Context::App(application) => {
            execute(&arguments, application)
        }
        crate::__feluqa_profile_feluqa::context::Context::Workspace(workspace) => {
            if arguments.len() != 1 {
                return crate::std::result::Result::Err(String::from(
                    "usage: feluqa migrate <app>",
                ));
            }
            let name = arguments[0]
                .to_str()
                .ok_or_else(|| String::from("application name must be valid UTF-8"))?;
            let application = crate::__feluqa_profile_feluqa::context::workspace_application(
                workspace,
                name,
            )?;
            execute(&[], &application)
        }
        crate::__feluqa_profile_feluqa::context::Context::Global => {
            return crate::std::result::Result::Err(String::from(
                "migrations require an application or Feluqa workspace context",
            ));
        }
    };
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}

use crate::std::ffi::OsString;
use crate::std::process::{Command, ExitCode};
use crate::std::format;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::__feluqa_profile_feluqa::context::Application;

fn execute(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if !arguments.is_empty() {
        return Err(String::from("usage: feluqa migrate"));
    }
    let mut cargo = Command::new("cargo");
    cargo
        .arg("run")
        .arg("--manifest-path")
        .arg(&application.manifest)
        .arg("--package")
        .arg(&application.package_name)
        .current_dir(&application.directory);
    cargo.arg("--").arg("migrate");
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
