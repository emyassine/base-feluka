#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::result::Result::Err;

use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

pub(crate) fn run(_arguments: &[OsString]) -> Result<ExitCode, String> {
    Err(String::from("global CLI updates are not configured yet"))
}
