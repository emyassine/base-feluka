#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::option::Option::None;
use crate::std::option::Option::Some;

pub(crate) mod app;
mod global;
mod help;
pub(crate) mod make;

use crate::context::{self, Application, Context};
use crate::std::clone::Clone;
use crate::std::ffi::OsString;
use crate::std::path::Path;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::vec::Vec;

pub(crate) fn run(arguments: Vec<OsString>, current: &Path) -> Result<ExitCode, String> {
    let command = arguments
        .first()
        .and_then(|argument| argument.to_str())
        .unwrap_or("help");
    let command_arguments = &arguments[1..];
    if command == "help" || command == "--help" || command == "-h" {
        return Ok(help::run(
            command_arguments
                .first()
                .and_then(|argument| argument.to_str()),
        ));
    }
    if command == "make"
        && command_arguments
            .first()
            .and_then(|argument| argument.to_str())
            .is_some_and(|argument| argument == "--help" || argument == "-h")
    {
        return Ok(help::make());
    }
    let make_help_target = if command == "make" {
        command_arguments
            .get(1)
            .and_then(|argument| argument.to_str())
            .filter(|argument| *argument == "--help" || *argument == "-h")
            .and_then(|_| command_arguments.first())
            .and_then(|argument| argument.to_str())
    } else {
        None
    };
    if let Some(target) = make_help_target {
        return Ok(help::make_command(target));
    }
    let context = context::detect(current)?;
    match (command, context) {
        ("help" | "--help" | "-h", _) => Ok(help::run(None)),
        ("--version" | "-V", _) => Ok(global::version::run()),
        ("list", Context::Workspace(workspace)) => global::list::run(&workspace),
        ("list", Context::App(application)) => {
            match context::find_workspace(&application.directory) {
                Some(workspace) => global::list::run(&workspace),
                None => Err(String::from("this app is not inside a Feluqa workspace")),
            }
        }
        ("new", Context::Global) => global::new::run(command_arguments, current, None),
        ("new", Context::Workspace(workspace)) => {
            global::new::run(command_arguments, &workspace, Some(&workspace))
        }
        ("new", Context::App(_)) => Err(String::from(
            "`feluqa new` is global; run it outside an application directory",
        )),
        ("dev", Context::App(application)) => app::dev::run(command_arguments, &application),
        ("build", Context::App(application)) => app::build::run(command_arguments, &application),
        ("check", Context::App(application)) => app::check::run(command_arguments, &application),
        ("test", Context::App(application)) => app::test::run(command_arguments, &application),
        ("migrate", Context::App(application)) => app::migrate::run(command_arguments, &application),
        ("seed", Context::App(application)) => app::seed::run(command_arguments, &application),
        ("migrate", Context::Workspace(workspace)) => {
            let application = migration_target(&workspace, command_arguments)?;
            app::migrate::run(&[], &application)
        }
        ("seed", Context::Workspace(workspace)) => {
            if command_arguments.len() != 2 {
                return Err(String::from("usage: feluqa seed <app> <seeder-id>"));
            }
            let application = context::workspace_application(
                &workspace,
                as_utf8(&command_arguments[0], "application name")?,
            )?;
            app::seed::run(&[command_arguments[1].clone()], &application)
        }
        ("dev" | "build" | "check" | "test", Context::Workspace(_)) => Err(crate::std::format!(
            "`feluqa {command}` requires an application context; change into an app directory"
        )),
        ("migrate" | "seed", Context::Global) => Err(crate::std::format!(
            "`feluqa {command}` changes application data and is restricted to an app or Feluqa workspace"
        )),
        ("list", Context::Global) => Err(String::from(
            "`feluqa list` needs a Feluqa workspace; global commands here are `new`, `help`, and `--version`",
        )),
        ("make", Context::App(application)) => make::run(command_arguments, &application),
        ("make", _) => Err(crate::std::string::String::from(
            "`feluqa make` is app-scoped; change into a valid application directory",
        )),
        ("update", _) => global::update::run(command_arguments),
        (other, _) => Err(crate::std::format!(
            "unknown command `{other}`; run `feluqa help`"
        )),
    }
}

fn migration_target(workspace: &Path, arguments: &[OsString]) -> Result<Application, String> {
    if arguments.len() != 1 {
        return Err(String::from("usage: feluqa migrate <app>"));
    }
    context::workspace_application(workspace, as_utf8(&arguments[0], "application name")?)
}

fn as_utf8<'a>(value: &'a OsString, label: &str) -> Result<&'a str, String> {
    value
        .to_str()
        .ok_or_else(|| crate::std::format!("{label} must be valid UTF-8"))
}

#[cfg(test)]
mod tests;
