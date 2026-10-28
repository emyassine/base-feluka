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
    name = "make model",
    description = "Generate a model",
    usage = "feluqa make model <arguments>",
    context = "in_app",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::feluqa::console::platform::arguments(context);
    if arguments.is_empty() {
        let value = context.argument_or_prompt(
            0,
            "Model name",
            Some("e.g. Customer"),
            "usage: feluqa make model <name>",
        )?;
        arguments.push(OsString::from(value));
    }
    let host = crate::feluqa::console::platform::host(context)?;
    let application = crate::feluqa::console::platform::application(host)?;
    let result = generate(&arguments, application);
    crate::feluqa::console::platform::finish(host, result)
}

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = feluqa::console::generator::name(arguments, "usage: feluqa make model <name>")?;
    let name = feluqa::console::generator::pascal_case(&slug);
    let source = format!(
        "#![no_implicit_prelude]\n\nuse crate::feluqa;\nuse crate::std;\n\nuse feluqa::prelude::*;\nuse feluqa::database::eloquent::Model;\n\n#[derive(Model, Debug, Clone, Deserialize, Serialize)]\n#[table_name = \"{}\"]\n#[allow(dead_code)] // Remove this allowance when application code starts using the model.\npub struct {name} {{\n    #[primary_key]\n    pub id: i64,\n    #[serde(skip)]\n    #[tenant_key]\n    pub tenant_id: i64,\n    #[serde(skip)]\n    #[owner_key]\n    pub owner_user_id: i64,\n    pub name: String,\n}}\n",
        slug
    );
    feluqa::console::generator::write_file(
        &application.directory,
        PathBuf::from("src/app/models").join(format!("{slug}.rs")),
        &source,
    )?;
    feluqa::console::generator::register_module(&application.directory, PathBuf::from("src/app/models"), &slug)?;
    Ok(ExitCode::SUCCESS)
}
