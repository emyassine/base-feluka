#![no_implicit_prelude]

#[path = "make/controller.rs"] pub(crate) mod controller;
#[path = "make/generator.rs"] pub(crate) mod generator;
#[path = "make/migration.rs"] pub(crate) mod migration;
#[path = "make/model.rs"] pub(crate) mod model;
#[path = "make/module.rs"] pub(crate) mod module;
#[path = "make/panel.rs"] pub(crate) mod panel;
#[path = "make/resource.rs"] pub(crate) mod resource;
#[path = "make/seeder.rs"] pub(crate) mod seeder;
#[path = "make/service.rs"] pub(crate) mod service;

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::Err;
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let target = arguments.first().and_then(|argument| argument.to_str())
        .ok_or_else(|| String::from("usage: feluqa make <thing> <name>"))?;
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
        _ => Err(crate::std::format!("unknown make target `{target}`; run `feluqa help`")),
    }
}
