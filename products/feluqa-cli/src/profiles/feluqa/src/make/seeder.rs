#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::format;
use crate::std::fs;
use crate::std::iter::Iterator;
use crate::std::println;
use crate::std::result::Result::Err;
use crate::std::result::Result::Ok;
use crate::feluqa::console::platform::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::option::Option::Some;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

#[feluqa::command(
    name = "make seeder",
    description = "Generate a seeder separately from migrations",
    usage = "feluqa make seeder <arguments>",
    context = "in_dev",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::feluqa::console::platform::arguments(context);
    if arguments.is_empty() {
        let value = context.argument_or_prompt(
            0,
            "Seeder name",
            Some("e.g. demo_customers"),
            "usage: feluqa make seeder <name>",
        )?;
        arguments.push(OsString::from(value));
    }
    let host = crate::feluqa::console::platform::host(context)?;
    let application = crate::feluqa::console::platform::application(host)?;
    let result = generate(&arguments, application);
    crate::feluqa::console::platform::finish(host, result)
}

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = feluqa::console::generator::name(arguments, "usage: feluqa make seeder <name>")?;
    let id = format!("{}.{}", application.package_name, slug);
    let source = format!(
        "#![no_implicit_prelude]\n\nuse crate::feluqa;\n\nuse feluqa::database::orm::{{DatabaseConnection, DbErr}};\nuse feluqa::prelude::{{Ok, Result}};\n\n/// Stable identifier used by `feluqa seed {id}`.\npub const ID: &str = \"{id}\";\n\n/// Add idempotent seed data for this module.\npub async fn run(_database: &DatabaseConnection) -> Result<(), DbErr> {{\n    Ok(())\n}}\n"
    );
    feluqa::console::generator::write_file(
        &application.directory,
        PathBuf::from("src/modules/seeders").join(format!("{slug}.rs")),
        &source,
    )?;
    register_seeder(application, &slug)?;
    println!("Registered seeder `{id}`.");
    Ok(ExitCode::SUCCESS)
}

fn register_seeder(application: &Application, slug: &str) -> Result<(), String> {
    let path = application.directory.join("src/modules/seeders/mod.rs");
    let mut source = match fs::read_to_string(&path) {
        Ok(source) => source,
        Err(error) if error.kind() == crate::std::io::ErrorKind::NotFound => String::from(
            "#![no_implicit_prelude]\n\nuse crate::feluqa;\n\nuse feluqa::database::orm::DatabaseConnection;\nuse feluqa::prelude::Result;\nuse crate::std::boxed::Box;\nuse crate::std::error::Error;\nuse crate::std::format;\nuse crate::std::io::{Error as IoError, ErrorKind};\nuse crate::std::result::Result::Err;\n\n#[allow(clippy::match_single_binding)]\npub async fn run(id: &str, _database: &DatabaseConnection) -> Result<(), Box<dyn Error>> {\n    match id {\n        _ => Err(Box::new(IoError::new(ErrorKind::NotFound, format!(\"seeder `{id}` is not registered\")))),\n    }\n}\n",
        ),
        Err(error) => return Err(format!("could not read `{}`: {error}", path.display())),
    };
    if !source.starts_with("#![no_implicit_prelude]") {
        return Err(String::from(
            "src/modules/seeders/mod.rs must start with #![no_implicit_prelude]",
        ));
    }
    let declaration = format!("pub mod {slug};");
    if !source.lines().any(|line| line.trim() == declaration) {
        let marker = "#![no_implicit_prelude]\n";
        source = source.replacen(marker, &format!("{marker}\n{declaration}\n"), 1);
    }
    let arm = format!(
        "        {slug}::ID => {{ {slug}::run(_database).await?; feluqa::prelude::Ok(()) }},"
    );
    if !source.contains(&arm) {
        let marker = "        _ => Err(Box::new(IoError::new(";
        let index = source
            .find(marker)
            .ok_or_else(|| String::from("seeder registry has no unknown-ID fallback"))?;
        source.insert_str(index, &format!("{arm}\n"));
    }
    fs::write(&path, source)
        .map_err(|error| format!("could not update `{}`: {error}", path.display()))
}
