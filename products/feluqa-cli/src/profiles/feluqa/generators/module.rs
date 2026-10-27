#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::format;
use crate::std::fs;
use crate::std::result::Result::Ok;

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = super::generator::name(arguments, "usage: feluqa make module <name>")?;
    let source = format!(
        "id = \"{}.{}\"\nversion = \"0.1.0\"\ncapabilities = []\nsupported_databases = [\"sqlite\", \"postgresql\"]\ndatabase_connections = [\"default\"]\n",
        application.package_name, slug
    );
    let manifest = PathBuf::from("src/modules").join(&slug).join("module.toml");
    super::generator::write_file(application, manifest, &source)?;
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
