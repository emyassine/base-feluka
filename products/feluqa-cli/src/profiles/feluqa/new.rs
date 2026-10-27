#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::format;
use crate::std::fs;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::Path;
use crate::std::println;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::ffi::OsString;

#[feluqa::command(
    name = "new",
    description = "Create a Feluqa application",
    profiles = ["feluqa"],
    context = "any",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let result = match &host.context {
        crate::__feluqa_profile_feluqa::context::Context::Global => {
            create_app(
                &arguments,
                &host.current,
                ::core::option::Option::None,
            )
        }
        crate::__feluqa_profile_feluqa::context::Context::Workspace(workspace) => {
            create_app(
                &arguments,
                workspace,
                ::core::option::Option::Some(workspace),
            )
        }
        crate::__feluqa_profile_feluqa::context::Context::App(_) => {
            crate::std::result::Result::Err(
            String::from("`feluqa new` is global; run it outside an application directory"),
            )
        }
    };
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}


fn create_app(
    arguments: &[OsString],
    current: &Path,
    workspace: Option<&Path>,
) -> Result<ExitCode, String> {
    let (raw_name, profile) = parse_arguments(arguments)?;
    if profile != "web" {
        return Err(format!(
            "profile `{profile}` is not available yet; supported profile: web"
        ));
    }
    let slug = feluqa::console::generator::project_slugify(raw_name)?;
    let display_name = feluqa::console::generator::project_display_name(&slug);
    let parent = match workspace {
        Some(workspace) => workspace.join("products"),
        None => current.to_path_buf(),
    };
    let target = parent.join(&slug);
    fs::create_dir_all(&parent)
        .map_err(|error| format!("could not create `{}`: {error}", parent.display()))?;
    fs::create_dir(&target).map_err(|error| {
        format!(
            "could not create `{}`; choose a new project name: {error}",
            target.display()
        )
    })?;

    let dependency = match workspace {
        Some(_) => (
            String::from("{ path = \"../../_crates/feluqa\" }"),
            String::from("path = \"../../_crates/feluqa\""),
        ),
        None => (
            format!(
                "{{ version = \"{}\", registry = \"feluqa\" }}",
                crate::feluqa::VERSION
            ),
            format!(
                "version = \"{}\", registry = \"feluqa\"",
                crate::feluqa::VERSION
            ),
        ),
    };
    let result = feluqa::console::generator::scaffold_web_project(
        &target,
        &slug,
        &display_name,
        &dependency.0,
        &dependency.1,
    );
    if let Err(error) = result {
        let _ = fs::remove_dir_all(&target);
        return Err(error);
    }
    println!("Created {display_name} at {}", target.display());
    if workspace.is_none() {
        println!(
            "This standalone app requires Feluqa {} from the private registry before it can compile.",
            crate::feluqa::VERSION
        );
    }
    println!("Next: cd {} && feluqa dev", target.display());
    Ok(ExitCode::SUCCESS)
}

fn parse_arguments(arguments: &[OsString]) -> Result<(&str, &str), String> {
    match arguments {
        [name] => Ok((
            name.to_str()
                .ok_or_else(|| String::from("project name must be valid UTF-8"))?,
            "web",
        )),
        [name, profile_flag, profile] if profile_flag.to_str() == Some("--profile") => Ok((
            name.to_str()
                .ok_or_else(|| String::from("project name must be valid UTF-8"))?,
            profile
                .to_str()
                .ok_or_else(|| String::from("profile must be valid UTF-8"))?,
        )),
        _ => Err(String::from("usage: feluqa new <name> [--profile web]")),
    }
}
