#![no_implicit_prelude]

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::fs;
use crate::std::iter::Iterator;
use crate::std::option::Option::{None, Some};
use crate::std::path::PathBuf;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;

pub(crate) fn run(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let usage = "usage: feluqa make controller <name> [--model <model>] [--connection <name>]";
    let Some(name_argument) = arguments.first() else {
        return Err(String::from(usage));
    };
    let mut model_argument = None;
    let mut connection_name = String::from("default");
    let mut index = 1;
    while index < arguments.len() {
        let flag = arguments[index]
            .to_str()
            .ok_or_else(|| String::from("controller options must be valid UTF-8"))?;
        index += 1;
        let value = arguments.get(index).ok_or_else(|| String::from(usage))?;
        let value = value
            .to_str()
            .ok_or_else(|| String::from("controller options must be valid UTF-8"))?;
        match flag {
            "--model" if model_argument.is_none() => {
                model_argument = Some(OsString::from(value));
            }
            "--connection" if valid_connection_name(value) => {
                connection_name = String::from(value);
            }
            _ => return Err(String::from(usage)),
        }
        index += 1;
    }

    let raw_name = name_argument
        .to_str()
        .ok_or_else(|| String::from("controller name must be valid UTF-8"))?;
    let slug = super::generator::slugify(raw_name)?;
    let name = super::generator::pascal_case(&slug);
    if model_argument.is_none() && connection_name != "default" {
        return Err(String::from("--connection requires --model"));
    }
    let source = match model_argument {
        Some(model) => {
            let model_slug = super::generator::slugify(
                model
                    .to_str()
                    .ok_or_else(|| String::from("model name must be valid UTF-8"))?,
            )?;
            let model_name = super::generator::pascal_case(&model_slug);
            ensure_model_exists(application, &model_slug, &model_name)?;
            model_action_source(&slug, &name, &model_slug, &model_name, &connection_name)
        }
        None => basic_controller_source(&name),
    };
    super::generator::write_file(
        application,
        PathBuf::from("src/app/controllers").join(format!("{slug}.rs")),
        &source,
    )?;
    super::generator::register_module(application, PathBuf::from("src/app/controllers"), &slug)?;
    Ok(ExitCode::SUCCESS)
}

fn ensure_model_exists(
    application: &Application,
    model_slug: &str,
    model_name: &str,
) -> Result<(), String> {
    let model_path = application
        .directory
        .join("src/app/models")
        .join(format!("{model_slug}.rs"));
    let source = fs::read_to_string(&model_path).map_err(|_| {
        format!("model `{model_name}` does not exist; run `feluqa make model {model_name}` first")
    })?;
    if source.contains("#[tenant_key]") && source.contains("#[owner_key]") {
        Ok(())
    } else {
        Err(format!(
            "model `{model_name}` needs tenant and owner keys; mark its fields with `#[tenant_key]` and `#[owner_key]` before generating a model-backed controller"
        ))
    }
}

fn valid_connection_name(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 96
        && !value.starts_with('.')
        && !value.ends_with('.')
        && !value.contains("..")
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase()
                || byte.is_ascii_digit()
                || byte == b'_'
                || byte == b'-'
                || byte == b'.'
        })
}

fn basic_controller_source(name: &str) -> String {
    format!(
        r##"#![no_implicit_prelude]

use crate::feluqa;
use feluqa::prelude::*;

#[allow(dead_code)] // Remove when routes call this controller.
pub struct {name}Controller;

#[allow(dead_code)] // Remove when routes call this controller.
impl {name}Controller {{
    pub async fn index() -> Html<String> {{
        Html(String::from("{name} index"))
    }}
}}
"##
    )
}

fn model_action_source(
    slug: &str,
    name: &str,
    model_slug: &str,
    model_name: &str,
    connection_name: &str,
) -> String {
    format!(
        r##"#![no_implicit_prelude]

use crate::feluqa;
use feluqa::prelude::*;
use feluqa::web;
use feluqa::core::service::SessionIdentity;
use crate::app::models::{model_slug}::{model_name};

#[allow(dead_code)] // Remove when routes call this controller.
pub struct {name}Controller;

#[allow(dead_code)] // Remove when routes call this controller.
impl {name}Controller {{
    pub async fn show(
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
    ) -> Result<JsonResponse<{model_name}>, StatusCode> {{
        web::authorize(&principal, "business.{slug}.read")?;
        let database = databases
            .get("{connection_name}")
            .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
        {model_name}::find_or_fail_in_tenant(database, id, identity.tenant_id, identity.user_id)
            .await
            .map(response::json)
            .map_err(web::database_error)
    }}
}}
"##,
    )
}
