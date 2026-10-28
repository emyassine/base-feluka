#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::format;
use crate::std::fs;
use crate::std::result::Result::Ok;
use crate::feluqa::console::platform::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::option::Option::Some;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

#[feluqa::command(
    name = "make module",
    description = "Generate a Feluqa module source",
    usage = "feluqa make module <arguments>",
    context = "in_app",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::feluqa::console::platform::arguments(context);
    if arguments.is_empty() {
        let value = context.argument_or_prompt(
            0,
            "Module name",
            Some("e.g. inventory"),
            "usage: feluqa make module <name>",
        )?;
        arguments.push(OsString::from(value));
    }
    let host = crate::feluqa::console::platform::host(context)?;
    let application = crate::feluqa::console::platform::application(host)?;
    let result = generate(&arguments, application);
    crate::feluqa::console::platform::finish(host, result)
}

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = feluqa::console::generator::name(arguments, "usage: feluqa make module <name>")?;
    let source = format!(
        "id = \"{}.{}\"\nversion = \"0.1.0\"\ncapabilities = []\nsupported_databases = [\"sqlite\", \"postgresql\"]\ndatabase_connections = [\"default\"]\n",
        application.package_name, slug
    );
    let manifest = PathBuf::from("src/modules").join(&slug).join("module.toml");
    feluqa::console::generator::write_file(&application.directory, manifest, &source)?;
    for database in ["sqlite", "postgresql"] {
        fs::create_dir_all(
            application
                .directory
                .join("src/modules")
                .join(&slug)
                .join("migrations")
                .join(database),
        )
        .map_err(|error| format!("could not create {database} migrations directory: {error}"))?;
    }
    Ok(ExitCode::SUCCESS)
}
