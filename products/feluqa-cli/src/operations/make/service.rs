#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::format;
use crate::std::result::Result::Ok;

use crate::context::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = super::generator::name(arguments, "usage: feluqa make service <name>")?;
    let name = super::generator::pascal_case(&slug);
    let source = format!(
        "#![no_implicit_prelude]\n\n/// Business operations for {name}.\n#[allow(dead_code)] // Remove this allowance when application code starts using the service.\npub struct {name}Service;\n"
    );
    super::generator::write_file(
        application,
        PathBuf::from("src/app/services").join(format!("{slug}.rs")),
        &source,
    )?;
    super::generator::register_module(application, PathBuf::from("src/app/services"), &slug)?;
    Ok(ExitCode::SUCCESS)
}
