#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "make model", description = "Generate a model", usage = "feluqa make model <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let application = crate::__feluqa_profile_feluqa::context::application(host)?;
    let result = generate(&arguments, application);
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}

use crate::std::convert::From;
use crate::std::format;
use crate::std::result::Result::Ok;

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = crate::__feluqa_profile_feluqa::generator::name(arguments, "usage: feluqa make model <name>")?;
    let name = crate::__feluqa_profile_feluqa::generator::pascal_case(&slug);
    let source = format!(
        "#![no_implicit_prelude]\n\nuse crate::feluqa;\nuse crate::std;\n\nuse feluqa::prelude::*;\nuse feluqa::database::eloquent::Model;\n\n#[derive(Model, Debug, Clone, Deserialize, Serialize)]\n#[table_name = \"{}\"]\n#[allow(dead_code)] // Remove this allowance when application code starts using the model.\npub struct {name} {{\n    #[primary_key]\n    pub id: i64,\n    #[serde(skip)]\n    #[tenant_key]\n    pub tenant_id: i64,\n    #[serde(skip)]\n    #[owner_key]\n    pub owner_user_id: i64,\n    pub name: String,\n}}\n",
        slug
    );
    crate::__feluqa_profile_feluqa::generator::write_file(
        application,
        PathBuf::from("src/app/models").join(format!("{slug}.rs")),
        &source,
    )?;
    crate::__feluqa_profile_feluqa::generator::register_module(application, PathBuf::from("src/app/models"), &slug)?;
    Ok(ExitCode::SUCCESS)
}
