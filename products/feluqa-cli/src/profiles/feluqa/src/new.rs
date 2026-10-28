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
    profiles = ["feluqa"],
    context = "any",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
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
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let result = match &host.context {
        crate::__feluqa_profile_feluqa::context::Context::Global => {
            create_app(interactive, &arguments, &host.current, None)
        }
        crate::__feluqa_profile_feluqa::context::Context::Workspace(workspace) => {
            create_app(interactive, &arguments, workspace, Some(workspace))
        }
        crate::__feluqa_profile_feluqa::context::Context::App(_) => {
            Err(String::from(
                "`feluqa new` is global; run it outside an application directory",
            ))
        }
    };
    crate::__feluqa_profile_feluqa::context::finish(host, result)
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
        Some(workspace) => workspace.join("products"),
        None => current.to_path_buf(),
    };
    match workspace {
        Some(_) => feluqa::console::info(&format!(
            "The default project path is {}/{}\necause this checkout keeps application consumers in products/\n and resolves Feluqa from local workspace crates.\nYou can choose another parent directory.",
            default_parent.display(), slug
        )),
        None => feluqa::console::info(&format!(
            "The default project path is {}/{} because this is not a detected Feluqa workspace. You can choose another parent directory.",
            default_parent.display(), slug
        )),
    }
    let parent = if interactive {
        let default_text = default_parent.display().to_string();
        let selected = feluqa::console::terminal::text(
            "Parent directory for the application",
            Some("press Enter to keep the default"),
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
    let uses_workspace_crates = workspace
        .map(|workspace| parent == workspace.join("products"))
        .unwrap_or(false);
    if uses_workspace_crates {
        feluqa::console::info(&format!(
            "The application will be created at {} and will use this checkout's local Feluqa crates.",
            target.display()
        ));
    } else {
        feluqa::console::info(&format!(
            "The application will be created at {} and will use Feluqa from the configured private registry.",
            target.display()
        ));
    }
    if interactive
        && !feluqa::console::terminal::confirm(
            "Create the application at this location?",
            true,
        )?
    {
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
        (
            String::from("{ path = \"../../_crates/feluqa\" }"),
            String::from("path = \"../../_crates/feluqa\""),
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
    let result = (|| {
        let replacements = [
            ("@@SLUG@@", slug.as_str()),
            ("@@NAME@@", display_name.as_str()),
            ("@@FELUQA_DEPENDENCY@@", dependency.0.as_str()),
            ("@@FELUQA_DEPENDENCY_FIELDS@@", dependency.1.as_str()),
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
    println!("Created {display_name} at {}", target.display());
    if !uses_workspace_crates {
        feluqa::console::warning(&format!(
            "This app uses Feluqa {} from the private registry and cannot compile until that version is available there.",
            crate::feluqa::VERSION
        ));
    }
    if interactive {
        feluqa::console::info("The scaffold is ready. `feluqa dev` compiles the app, applies its development setup and starts the local server with file watching.");
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
        "Cargo.toml",
        include_str!("../templates/web/Cargo.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        ".cargo/config.toml",
        include_str!("../templates/web/cargo-config.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        ".gitignore",
        include_str!("../templates/web/gitignore.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "README.md",
        include_str!("../templates/web/README.md.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "feluqa.toml",
        include_str!("../templates/web/feluqa.toml.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "build.rs",
        include_str!("../templates/web/build.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/main.rs",
        include_str!("../templates/web/main.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/service_provider.rs",
        include_str!("../templates/web/service-provider.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/config.rs",
        include_str!("../templates/web/config.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/modules/mod.rs",
        include_str!("../templates/web/modules-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/modules/system/mod.rs",
        include_str!("../templates/web/system-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/modules/live.rs",
        include_str!("../templates/web/live-module.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/modules/seeders/mod.rs",
        include_str!("../templates/web/modules-seeders-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/routes/mod.rs",
        include_str!("../templates/web/routes-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/routes/web.rs",
        include_str!("../templates/web/routes-web.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/mod.rs",
        include_str!("../templates/web/app-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/models/mod.rs",
        include_str!("../templates/web/models-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/services/mod.rs",
        include_str!("../templates/web/services-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/mod.rs",
        include_str!("../templates/web/controllers-mod.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/resources.rs",
        include_str!("../templates/web/resources.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/site.rs",
        include_str!("../templates/web/site.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/panels.rs",
        include_str!("../templates/web/panels.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/system.rs",
        include_str!("../templates/web/system.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/live.rs",
        include_str!("../templates/web/live.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/system/administration.rs",
        include_str!("../templates/web/system-administration.rs.tmpl"),
    ),
    feluqa::console::generator::Template::new(
        "src/app/controllers/system/operations.rs",
        include_str!("../templates/web/system-operations.rs.tmpl"),
    ),
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
