#![no_implicit_prelude]

pub(crate) mod app;
pub(crate) mod global;
pub(crate) mod make;
use crate::std::ffi::OsString;
use crate::std::path::Path;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::vec::Vec;

pub(crate) fn run(arguments: Vec<OsString>, current: &Path) -> Result<ExitCode, String> {
    crate::runtime::dispatcher::run(arguments, current, "feluqa")
}

#[cfg(test)]
mod tests;
