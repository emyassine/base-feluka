#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "update", description = "Update Feluqa from its configured distribution source", profiles = ["feluqa"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let result = execute(&arguments);
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}

use crate::std::convert::From;
use crate::std::result::Result::Err;

use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

fn execute(_arguments: &[OsString]) -> Result<ExitCode, String> {
    Err(String::from("global CLI updates are not configured yet"))
}
