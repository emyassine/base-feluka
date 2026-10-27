#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::format;
use crate::std::fs::{self, OpenOptions};
use crate::std::io::Write;
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::Path;
use crate::std::println;
use crate::std::result::Result::{Err, Ok};

use crate::std::ffi::OsString;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::string::ToString;
use crate::std::vec::Vec;

const WEB_FILES: &[(&str, &str)] = &[
    (
        "Cargo.toml",
        include_str!("../../templates/web/Cargo.toml.tmpl"),
    ),
    (
        ".cargo/config.toml",
        include_str!("../../templates/web/cargo-config.toml.tmpl"),
    ),
    (
        ".gitignore",
        include_str!("../../templates/web/gitignore.tmpl"),
    ),
    (
        "README.md",
        include_str!("../../templates/web/README.md.tmpl"),
    ),
    (
        "feluqa.toml",
        include_str!("../../templates/web/feluqa.toml.tmpl"),
    ),
    (
        "build.rs",
        include_str!("../../templates/web/build.rs.tmpl"),
    ),
    (
        "src/main.rs",
        include_str!("../../templates/web/main.rs.tmpl"),
    ),
    (
        "src/service_provider.rs",
        include_str!("../../templates/web/service-provider.rs.tmpl"),
    ),
    (
        "src/config.rs",
        include_str!("../../templates/web/config.rs.tmpl"),
    ),
    (
        "src/modules/mod.rs",
        include_str!("../../templates/web/modules-mod.rs.tmpl"),
    ),
    (
        "src/modules/system/mod.rs",
        include_str!("../../templates/web/system-mod.rs.tmpl"),
    ),
    (
        "src/modules/live.rs",
        include_str!("../../templates/web/live-module.rs.tmpl"),
    ),
    (
        "src/modules/seeders/mod.rs",
        include_str!("../../templates/web/modules-seeders-mod.rs.tmpl"),
    ),
    (
        "src/routes/mod.rs",
        include_str!("../../templates/web/routes-mod.rs.tmpl"),
    ),
    (
        "src/routes/web.rs",
        include_str!("../../templates/web/routes-web.rs.tmpl"),
    ),
    (
        "src/app/mod.rs",
        include_str!("../../templates/web/app-mod.rs.tmpl"),
    ),
    (
        "src/app/models/mod.rs",
        include_str!("../../templates/web/models-mod.rs.tmpl"),
    ),
    (
        "src/app/services/mod.rs",
        include_str!("../../templates/web/services-mod.rs.tmpl"),
    ),
    (
        "src/app/controllers/mod.rs",
        include_str!("../../templates/web/controllers-mod.rs.tmpl"),
    ),
    (
        "src/app/controllers/resources.rs",
        include_str!("../../templates/web/resources.rs.tmpl"),
    ),
    (
        "src/app/controllers/site.rs",
        include_str!("../../templates/web/site.rs.tmpl"),
    ),
    (
        "src/app/controllers/panels.rs",
        include_str!("../../templates/web/panels.rs.tmpl"),
    ),
    (
        "src/app/controllers/system.rs",
        include_str!("../../templates/web/system.rs.tmpl"),
    ),
    (
        "src/app/controllers/live.rs",
        include_str!("../../templates/web/live.rs.tmpl"),
    ),
    (
        "src/app/controllers/system/administration.rs",
        include_str!("../../templates/web/system-administration.rs.tmpl"),
    ),
    (
        "src/app/controllers/system/operations.rs",
        include_str!("../../templates/web/system-operations.rs.tmpl"),
    ),
    (
        "resources/views/pages/home.view.rs",
        include_str!("../../templates/web/home.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_setup.view.rs",
        include_str!("../../templates/web/system-setup.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_login.view.rs",
        include_str!("../../templates/web/system-login.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_users.view.rs",
        include_str!("../../templates/web/system-users.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_roles.view.rs",
        include_str!("../../templates/web/system-roles.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_modules.view.rs",
        include_str!("../../templates/web/system-modules.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_connections.view.rs",
        include_str!("../../templates/web/system-connections.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_migrations.view.rs",
        include_str!("../../templates/web/system-migrations.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_audit.view.rs",
        include_str!("../../templates/web/system-audit.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_tenants.view.rs",
        include_str!("../../templates/web/system-tenants.view.rs.tmpl"),
    ),
    (
        "src/modules/system/views/pages/system_dashboard.view.rs",
        include_str!("../../templates/web/system-dashboard.view.rs.tmpl"),
    ),
    (
        "config/database.development.toml",
        include_str!("../../templates/web/database.development.toml.tmpl"),
    ),
    (
        "config/database.staging.toml",
        include_str!("../../templates/web/database.staging.toml.tmpl"),
    ),
    (
        "config/database.production.toml",
        include_str!("../../templates/web/database.production.toml.tmpl"),
    ),
    (
        "config/app.development.toml",
        include_str!("../../templates/web/app.development.toml.tmpl"),
    ),
    (
        "config/app.staging.toml",
        include_str!("../../templates/web/app.staging.toml.tmpl"),
    ),
    (
        "config/app.production.toml",
        include_str!("../../templates/web/app.production.toml.tmpl"),
    ),
    (
        "src/modules/app/module.toml",
        include_str!("../../templates/web/module.toml.tmpl"),
    ),
    (
        "public/assets/site.css",
        include_str!("../../templates/web/site.css.tmpl"),
    ),
    (
        "storage/.gitkeep",
        include_str!("../../templates/web/storage.gitkeep.tmpl"),
    ),
];

pub(crate) fn run(
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
    let slug = slugify(raw_name)?;
    let display_name = display_name(&slug);
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
            "{ path = \"../../_crates/feluqa\" }",
            "path = \"../../_crates/feluqa\"",
        ),
        None => (
            "{ version = \"0.2.0\", registry = \"feluqa\" }",
            "version = \"0.2.0\", registry = \"feluqa\"",
        ),
    };
    let result = write_web_project(&target, &slug, &display_name, dependency);
    if let Err(error) = result {
        let _ = fs::remove_dir_all(&target);
        return Err(error);
    }
    println!("Created {display_name} at {}", target.display());
    if workspace.is_none() {
        println!(
            "This standalone app requires Feluqa 0.2.0 from the private registry before it can compile."
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

fn slugify(name: &str) -> Result<String, String> {
    let mut slug = String::new();
    let mut separator = false;
    for character in name.chars() {
        if character.is_ascii_alphanumeric() {
            if separator && !slug.is_empty() {
                slug.push('-');
            }
            slug.push(character.to_ascii_lowercase());
            separator = false;
        } else if character == '-' || character == '_' || character.is_ascii_whitespace() {
            separator = true;
        } else {
            return Err(String::from(
                "project name may contain only ASCII letters, digits, spaces, `-` and `_`",
            ));
        }
    }
    if slug.is_empty() || slug.len() > 64 {
        return Err(String::from(
            "project name must contain 1 to 64 ASCII characters",
        ));
    }
    Ok(slug)
}

fn display_name(slug: &str) -> String {
    slug.split('-')
        .map(|word| {
            let mut characters = word.chars();
            match characters.next() {
                Some(first) => first.to_ascii_uppercase().to_string() + characters.as_str(),
                None => String::new(),
            }
        })
        .collect::<Vec<String>>()
        .join(" ")
}

fn write_web_project(
    root: &Path,
    slug: &str,
    display_name: &str,
    dependency: (&str, &str),
) -> Result<(), String> {
    for (relative, template) in WEB_FILES {
        let source = template
            .replace("@@SLUG@@", slug)
            .replace("@@NAME@@", display_name)
            .replace("@@FELUQA_DEPENDENCY@@", dependency.0)
            .replace("@@FELUQA_DEPENDENCY_FIELDS@@", dependency.1);
        let path = root.join(relative);
        fs::create_dir_all(
            path.parent()
                .ok_or_else(|| String::from("template file has no parent directory"))?,
        )
        .map_err(|error| format!("could not create template directory: {error}"))?;
        let mut file = OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&path)
            .map_err(|error| format!("could not create `{}`: {error}", path.display()))?;
        file.write_all(source.as_bytes())
            .map_err(|error| format!("could not write `{}`: {error}", path.display()))?;
    }
    fs::create_dir_all(root.join("src/modules/app/migrations/sqlite"))
        .map_err(|error| format!("could not create SQLite migration directory: {error}"))?;
    fs::create_dir_all(root.join("src/modules/app/migrations/postgresql"))
        .map_err(|error| format!("could not create PostgreSQL migration directory: {error}"))?;
    Ok(())
}
