#![no_implicit_prelude]

use crate::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::Err;
use crate::std::string::String;

pub(crate) mod controller;
mod generator;
pub(crate) mod migration;
pub(crate) mod model;
pub(crate) mod module;
pub(crate) mod panel;
mod resource;
pub(crate) mod seeder;
pub(crate) mod service;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let target = arguments
        .first()
        .and_then(|argument| argument.to_str())
        .ok_or_else(|| String::from("usage: feluqa make <thing> <name>"))?;
    if target.is_empty() {
        return Err(String::from("usage: feluqa make <thing> <name>"));
    }
    let arguments = &arguments[1..];
    match target {
        "migration" => migration::run(arguments, application),
        "panel" => panel::run(arguments, application),
        "controller" => controller::run(arguments, application),
        "resource" => resource::run(arguments, application),
        "model" => model::run(arguments, application),
        "service" => service::run(arguments, application),
        "module" => module::run(arguments, application),
        "seeder" => seeder::run(arguments, application),
        _ => Err(crate::std::format!(
            "unknown make target `{target}`; run `feluqa help`"
        )),
    }
}
