#![no_implicit_prelude]

mod watcher;

use crate::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::Err;
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if !arguments.is_empty() {
        return Err(String::from("usage: feluqa dev"));
    }
    watcher::run(application)
}
