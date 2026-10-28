#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::result::Result::Err;
use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

#[feluqa::command(
    name = "update",
    description = "Update Feluqa from its configured distribution source",
    context = "anywhere",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::feluqa::console::platform::arguments(context);
    let host = crate::feluqa::console::platform::host(context)?;
    let result = execute(&arguments);
    crate::feluqa::console::platform::finish(host, result)
}

fn execute(_arguments: &[OsString]) -> Result<ExitCode, String> {
    Err(String::from("global CLI updates are not configured yet"))
}
