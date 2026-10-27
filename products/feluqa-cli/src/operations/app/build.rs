#![no_implicit_prelude]

use crate::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::Err;
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if !arguments.is_empty() {
        return Err(crate::std::string::String::from("usage: feluqa build"));
    }
    let mut cargo = super::cargo(application, "build");
    cargo.arg("--release");
    super::run(&mut cargo)
}
