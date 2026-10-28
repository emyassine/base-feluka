#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::fs;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::{Path, PathBuf};
use crate::std::println;
use crate::std::process::{Command, ExitCode};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};

#[feluqa::command(
    name = "new",
    description = "Create a Feluqa application",
    context = "anywhere",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::feluqa::console::platform::arguments(context);
    if arguments.is_empty() {
        let value = context.argument_or_prompt(
            0,
            "Application name",
            Some("e.g. inventory"),
            "usage: feluqa new <name> [--profile web]",
        )?;
        arguments.push(OsString::from(value));
    }
    let interactive = feluqa::console::terminal::interactive();
    let host = crate::feluqa::console::platform::host(context)?;
    let result = match &host.context {
        crate::feluqa::console::platform::Context::Global
        | crate::feluqa::console::platform::Context::Platform(_) => {
            create_app(interactive, &arguments, &host.current, None)
        }
        crate::feluqa::console::platform::Context::Workspace(workspace) => {
            create_app(interactive, &arguments, workspace, Some(workspace))
        }
        crate::feluqa::console::platform::Context::App(_) => {
            Err(String::from(
                "`feluqa new` is global; run it outside an application directory",
            ))
        }
    };
    crate::feluqa::console::platform::finish(host, result)
}


fn create_app(
    interactive: bool,
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
    let default_parent = match workspace {
        Some(workspace) => {
            crate::feluqa::console::platform::workspace_products_root(workspace)?
        }
        None => current.to_path_buf(),
    };
    match workspace {
        Some(_) => feluqa::console::info("Default: products/ (local Feluqa crates)."),
        None => feluqa::console::info("Default: current folder."),
    }
    let parent = if interactive {
        let default_text = default_parent.display().to_string();
        let selected = feluqa::console::terminal::text(
            "Parent folder",
            Some("Enter keeps default"),
            Some(&default_text),
            true,
        )?;
        let selected = PathBuf::from(selected);
        if selected.is_absolute() {
            selected
        } else {
            current.join(selected)
        }
    } else {
        default_parent
    };
    let target = parent.join(&slug);
    let configured_products = workspace
        .map(crate::feluqa::console::platform::workspace_products_root)
        .transpose()?;
    let uses_workspace_crates = configured_products.as_deref() == Some(parent.as_path());
    let confirmation = if uses_workspace_crates {
        format!("Create {} using local Feluqa crates?", target.display())
    } else {
        format!("Create {} using the private registry?", target.display())
    };
    if interactive && !feluqa::console::terminal::confirm(&confirmation, true)? {
        feluqa::console::info("Creation cancelled; no application files were written.");
        return Ok(ExitCode::SUCCESS);
    }
    fs::create_dir_all(&parent)
        .map_err(|error| format!("could not create `{}`: {error}", parent.display()))?;
    fs::create_dir(&target).map_err(|error| {
        format!(
            "could not create `{}`; choose a new project name: {error}",
            target.display()
        )
    })?;

    let dependency = if uses_workspace_crates {
        let workspace = workspace.ok_or_else(|| String::from("workspace context disappeared"))?;
        let context = feluqa::definitions::FeluqaContext::discover(workspace)
            .map_err(|error| format!("could not discover workspace layout: {error}"))?;
        let framework = context.workspace_crates_root()
            .map_err(|error| error.to_string())?
            .join("feluqa");
        let relative = feluqa::definitions::relative_path(&target, &framework)
            .map_err(|error| error.to_string())?;
        let path = relative.to_string_lossy().replace('\\', "/");
        (
            format!("{{ path = \"{path}\" }}"),
            format!("path = \"{path}\""),
        )
    } else {
        (
            format!(
                "{{ version = \"{}\", registry = \"feluqa\" }}",
                crate::feluqa::VERSION
            ),
            format!(
                "version = \"{}\", registry = \"feluqa\"",
                crate::feluqa::VERSION
            ),
        )
    };
    let registry_index = feluqa::definitions::RemoteLink::PrivateCrateRegistry
        .url()
        .ok_or_else(|| String::from("the private Feluqa crate registry is not configured"))?;
    let result = (|| {
        let replacements = [
            ("@@SLUG@@", slug.as_str()),
            ("@@NAME@@", display_name.as_str()),
            ("@@FELUQA_DEPENDENCY@@", dependency.0.as_str()),
            ("@@FELUQA_DEPENDENCY_FIELDS@@", dependency.1.as_str()),
            ("@@FELUQA_REGISTRY_INDEX@@", registry_index),
        ];
        feluqa::console::generator::write_templates_quiet(
            &target,
            WEB_TEMPLATES,
            &replacements,
        )?;
        feluqa::console::generator::create_directories(
            &target,
            [
                "src/modules/app/migrations/sqlite",
                "src/modules/app/migrations/postgresql",
            ],
        )
    })();
    if let Err(error) = result {
        let _ = fs::remove_dir_all(&target);
        return Err(error);
    }
    println!("Created {display_name}: {}", target.display());
    if !uses_workspace_crates {
        feluqa::console::warning(&format!(
            "This app uses Feluqa {} from the private registry and cannot compile until that version is available there.",
            crate::feluqa::VERSION
        ));
    }
    if interactive {
        feluqa::console::info("Scaffold ready.");
        if feluqa::console::terminal::confirm("Start `feluqa dev` now?", false)? {
            let executable = crate::std::env::current_exe()
                .map_err(|error| format!("could not locate the Feluqa executable: {error}"))?;
            let status = Command::new(executable)
                .arg("dev")
                .current_dir(&target)
                .status()
                .map_err(|error| format!("could not start `feluqa dev`: {error}"))?;
            return Ok(ExitCode::from(status.code().unwrap_or(1) as u8));
        }
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

const WEB_TEMPLATES: &[feluqa::console::generator::Template<'_>] = &[
    feluqa::console::generator::Template::new(
        "resources/views/pages/home.view.rs",
        include_str!("../templates/web/home.view.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "config/database.development.toml",
        include_str!("../templates/web/database.development.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "config/database.staging.toml",
        include_str!("../templates/web/database.staging.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "config/database.production.toml",
        include_str!("../templates/web/database.production.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "config/app.development.toml",
        include_str!("../templates/web/app.development.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "config/app.staging.toml",
        include_str!("../templates/web/app.staging.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "config/app.production.toml",
        include_str!("../templates/web/app.production.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/modules/app/module.toml",
        include_str!("../templates/web/module.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "public/assets/site.css",
        include_str!("../templates/web/site.css.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "storage/.gitkeep",
        include_str!("../templates/web/storage.gitkeep.tmpl"),
    ),
];
