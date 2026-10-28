#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::cmp::Ord;
use crate::std::string::{String, ToString};
use crate::std::ffi::OsString;
use crate::std::path::Path;
use crate::std::process::{Command, ExitCode};
use crate::std::println;
use crate::std::option::Option::Some;
use crate::std::format;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::feluqa::console::platform::Application;

#[feluqa::command(
    name = "migrate",
    description = "Apply application migrations",
    context = "in_dev",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::feluqa::console::platform::arguments(context);
    let workspace_context = {
        let host = crate::feluqa::console::platform::host(context)?;
        match &host.context {
            crate::feluqa::console::platform::Context::Workspace(_) => true,
            _ => false,
        }
    };
    let mut arguments = arguments;
    if workspace_context && arguments.is_empty() {
        let name = context.argument_or_prompt(
            0,
            "Application",
            Some("e.g. inventory"),
            "usage: feluqa migrate <app>",
        )?;
        arguments.push(OsString::from(name));
    }
    let host = crate::feluqa::console::platform::host(context)?;
    let result = match &host.context {
        crate::feluqa::console::platform::Context::App(application) => {
            execute(&arguments, application)
        }
        crate::feluqa::console::platform::Context::Workspace(workspace) => {
            if arguments.len() == 1 && arguments[0].to_str() == Some("list") {
                return crate::feluqa::console::platform::finish(
                    host,
                    list_migration_targets(workspace),
                );
            }
            if arguments.len() != 1 {
                return crate::std::result::Result::Err(String::from(
                    "usage: feluqa migrate <app>",
                ));
            }
            let name = arguments[0]
                .to_str()
                .ok_or_else(|| String::from("application name must be valid UTF-8"))?;
            let application = crate::feluqa::console::platform::workspace_application(workspace, name)?;
            execute(&[], &application)
        }
        crate::feluqa::console::platform::Context::Global
        | crate::feluqa::console::platform::Context::Platform(_) => {
            return crate::std::result::Result::Err(String::from(
                "migrations require an application or Feluqa workspace context",
            ));
        }
    };
    crate::feluqa::console::platform::finish(host, result)
}

fn list_migration_targets(workspace: &Path) -> Result<ExitCode, String> {
    let mut products = crate::feluqa::definitions::list_workspace_products(workspace)
        .map_err(|error| error.to_string())?;
    products.sort_by(|left, right| left.display_name.cmp(&right.display_name));
    if products.is_empty() {
        println!("No applications are available for migration.");
    } else {
        println!("Applications available for migration:");
        for product in products {
            println!("{} ({})", product.display_name, product.package_name);
        }
    }
    Ok(ExitCode::SUCCESS)
}

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
