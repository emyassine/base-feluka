#![no_implicit_prelude]

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::Err;
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if arguments.len() != 1 {
        return Err(crate::std::string::String::from(
            "usage: feluqa seed <seeder-id>",
        ));
    }
    let seeder_id = arguments[0]
        .to_str()
        .ok_or_else(|| crate::std::string::String::from("seeder ID must be valid UTF-8"))?;
    let mut cargo = super::cargo(application, "run");
    cargo.arg("--").arg("seed").arg(seeder_id);
    super::run(&mut cargo)
}
