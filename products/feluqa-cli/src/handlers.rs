#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa;
extern crate std;

use crate::operations::{app, global, make};
use crate::context::{self, Application, Context};
use crate::context::CliHost;
use feluqa::console::{CommandContext, CommandResult};
use std::convert::From;
use std::ffi::OsString;
use std::clone::Clone;
use std::iter::Iterator;
use std::process::ExitCode;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;
use std::option::Option::{None, Some};

fn host<'a, 'b>(context: &'a mut CommandContext<'b>) -> Result<&'a mut CliHost, String> {
    context.host::<CliHost>().ok_or_else(|| String::from("CLI command host was not initialized"))
}

fn args(context: &CommandContext<'_>) -> Vec<OsString> {
    context.arguments().iter().map(|value| OsString::from(value.as_str())).collect()
}

fn store(host: &mut CliHost, result: Result<ExitCode, String>) -> CommandResult {
    match result { Ok(code) => { host.exit_code = code; Ok(()) }, Err(error) => Err(error) }
}

pub(crate) fn help(context: &mut CommandContext<'_>) -> CommandResult {
    let profile = context.profile().to_string();
    let topic = context.arguments().join(" ");
    let registry = feluqa::console::CommandRegistry::discover().map_err(|error| error.to_string())?;
    let topic = if topic.is_empty() { None } else { Some(topic.as_str()) };
    registry.print_help(&profile, "feluqa", topic, false).map_err(|error| error.to_string())?;
    let host = host(context)?;
    host.exit_code = ExitCode::SUCCESS;
    Ok(())
}

pub(crate) fn version(context: &mut CommandContext<'_>) -> CommandResult {
    let host = host(context)?;
    host.exit_code = global::version::run();
    Ok(())
}

pub(crate) fn new(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    let result = match &host.context {
        Context::Global => global::new::run(&arguments, &host.current, None),
        Context::Workspace(workspace) => global::new::run(&arguments, workspace, Some(workspace)),
        Context::App(_) => Err(String::from("`feluqa new` is global; run it outside an application directory")),
    };
    store(host, result)
}

pub(crate) fn list(context: &mut CommandContext<'_>) -> CommandResult {
    let host = host(context)?;
    let workspace = match &host.context {
        Context::Workspace(path) => path.clone(),
        Context::App(application) => context::find_workspace(&application.directory).ok_or_else(|| String::from("this app is not inside a Feluqa workspace"))?,
        Context::Global => return Err(String::from("`feluqa list` needs a Feluqa workspace")),
    };
    store(host, global::list::run(&workspace))
}

pub(crate) fn update(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    store(host, global::update::run(&arguments))
}

pub(crate) fn dev(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    let application = app_context(host)?;
    store(host, app::dev::run(&arguments, application))
}

pub(crate) fn build(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    let application = app_context(host)?;
    store(host, app::build::run(&arguments, application))
}

pub(crate) fn check(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    let application = app_context(host)?;
    store(host, app::check::run(&arguments, application))
}

pub(crate) fn test(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    let application = app_context(host)?;
    store(host, app::test::run(&arguments, application))
}

pub(crate) fn migrate(context: &mut CommandContext<'_>) -> CommandResult {
    let arguments = args(context);
    let host = host(context)?;
    let result = match &host.context {
        Context::App(application) => app::migrate::run(&arguments, application),
        Context::Workspace(workspace) => {
            if arguments.len() != 1 { return Err(String::from("usage: feluqa migrate <app>")); }
            let name = arguments[0].to_str().ok_or_else(|| String::from("application name must be valid UTF-8"))?;
            let application = context::workspace_application(workspace, name)?;
            app::migrate::run(&[], &application)
        }
        Context::Global => return Err(String::from("migrations require an application or Feluqa workspace context")),
    };
    store(host, result)
}

pub(crate) fn seed(context: &mut CommandContext<'_>) -> CommandResult {
    let mut arguments = args(context);
    let host = host(context)?;
    let result = match &host.context {
        Context::App(application) => app::seed::run(&arguments, application),
        Context::Workspace(workspace) => {
            if arguments.len() != 2 { return Err(String::from("usage: feluqa seed <app> <seeder-id>")); }
            let name = arguments[0].to_str().ok_or_else(|| String::from("application name must be valid UTF-8"))?;
            let application = context::workspace_application(workspace, name)?;
            let seeder = arguments.remove(1);
            app::seed::run(&[seeder], &application)
        }
        Context::Global => return Err(String::from("seeders require an application or Feluqa workspace context")),
    };
    store(host, result)
}


fn app_context(host: &CliHost) -> Result<&Application, String> {
    match &host.context { Context::App(application) => Ok(application), Context::Workspace(_) => Err(String::from("this command requires an application directory")), Context::Global => Err(String::from("this command requires a Feluqa application")) }
}

fn make_generator(context: &mut CommandContext<'_>, target: &str) -> CommandResult {
    let mut arguments = args(context);
    arguments.insert(0, OsString::from(target));
    let host = host(context)?;
    let application = app_context(host)?;
    store(host, make::run(&arguments, application))
}

pub(crate) fn make_controller(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "controller") }
pub(crate) fn make_migration(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "migration") }
pub(crate) fn make_model(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "model") }
pub(crate) fn make_module(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "module") }
pub(crate) fn make_panel(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "panel") }
pub(crate) fn make_resource(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "resource") }
pub(crate) fn make_seeder(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "seeder") }
pub(crate) fn make_service(context: &mut CommandContext<'_>) -> CommandResult { make_generator(context, "service") }
