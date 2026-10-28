#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::format;
use crate::std::result::Result::Ok;
use crate::feluqa::console::platform::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::option::Option::Some;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

#[feluqa::command(
    name = "make service",
    description = "Generate a business service",
    usage = "feluqa make service <arguments>",
    context = "in_dev",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::feluqa::console::platform::arguments(context);
    if arguments.is_empty() {
        let value = context.argument_or_prompt(
            0,
            "Service name",
            Some("e.g. CustomerImport"),
            "usage: feluqa make service <name>",
        )?;
        arguments.push(OsString::from(value));
    }
    let host = crate::feluqa::console::platform::host(context)?;
    let application = crate::feluqa::console::platform::application(host)?;
    let result = generate(&arguments, application);
    crate::feluqa::console::platform::finish(host, result)
}

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = feluqa::console::generator::name(arguments, "usage: feluqa make service <name>")?;
    let name = feluqa::console::generator::pascal_case(&slug);
    let source = format!(
        "#![no_implicit_prelude]\n\n/// Business operations for {name}.\n#[allow(dead_code)] // Remove this allowance when application code starts using the service.\npub struct {name}Service;\n"
    );
    feluqa::console::generator::write_file(
        &application.directory,
        PathBuf::from("src/app/services").join(format!("{slug}.rs")),
        &source,
    )?;
    feluqa::console::generator::register_module(&application.directory, PathBuf::from("src/app/services"), &slug)?;
    Ok(ExitCode::SUCCESS)
}
