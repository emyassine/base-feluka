#![no_implicit_prelude]

extern crate std;

use std::convert::{AsRef, From};
use std::ffi::OsString;
use std::format;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::iter::Iterator;
use std::path::Path;
use std::println;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;

/// Normalize a one-argument generator name.
pub fn name(arguments: &[OsString], usage: &str) -> Result<String, String> {
    if arguments.len() != 1 {
        return Err(String::from(usage));
    }
    let value = arguments[0]
        .to_str()
        .ok_or_else(|| String::from("name must be valid UTF-8"))?;
    slugify(value)
}

/// Convert a name to a lowercase snake-case identifier.
pub fn slugify(value: &str) -> Result<String, String> {
    let mut slug = String::new();
    let mut separator = false;
    for byte in value.bytes() {
        if byte.is_ascii_alphanumeric() {
            if separator && !slug.is_empty() && !slug.ends_with('_') {
                slug.push('_');
            }
            slug.push((byte as char).to_ascii_lowercase());
            separator = false;
        } else {
            separator = true;
        }
    }
    if slug.is_empty() || slug.len() > 70 {
        return Err(String::from(
            "name must contain 1 to 70 ASCII letters or digits",
        ));
    }
    Ok(slug)
}

/// Convert a project name to a lowercase hyphen-separated directory name.
pub fn project_slugify(value: &str) -> Result<String, String> {
    let mut slug = String::new();
    let mut separator = false;
    for character in value.chars() {
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

/// Convert a snake-case identifier to PascalCase.
pub fn pascal_case(slug: &str) -> String {
    slug.split('_')
        .map(|part| {
            let mut chars = part.chars();
            chars
                .next()
                .map(|first| first.to_ascii_uppercase().to_string() + chars.as_str())
                .unwrap_or_default()
        })
        .collect()
}

/// Convert a hyphen-separated project slug to a display name.
pub fn project_display_name(slug: &str) -> String {
    slug.split('-')
        .map(|part| {
            let mut chars = part.chars();
            chars
                .next()
                .map(|first| first.to_ascii_uppercase().to_string() + chars.as_str())
                .unwrap_or_default()
        })
        .collect::<Vec<String>>()
        .join(" ")
}

/// Create a file without overwriting an existing file, creating its parents first.
pub fn write_file(root: &Path, relative: impl AsRef<Path>, contents: &str) -> Result<(), String> {
    let path = root.join(relative);
    fs::create_dir_all(
        path.parent()
            .ok_or_else(|| String::from("generated path has no parent"))?,
    )
    .map_err(|error| format!("could not create generator directory: {error}"))?;
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path)
        .map_err(|error| {
            format!(
                "could not create `{}` without overwriting an existing file: {error}",
                path.display()
            )
        })?;
    file.write_all(contents.as_bytes())
        .map_err(|error| format!("could not write `{}`: {error}", path.display()))?;
    println!(
        "Created {}",
        path.strip_prefix(root).unwrap_or(&path).display()
    );
    Ok(())
}

/// Register a generated file in the parent Rust `mod.rs` file.
pub fn register_module(root: &Path, parent: impl AsRef<Path>, module: &str) -> Result<(), String> {
    let path = root.join(parent).join("mod.rs");
    fs::create_dir_all(
        path.parent()
            .ok_or_else(|| String::from("module path has no parent"))?,
    )
    .map_err(|error| format!("could not create module directory: {error}"))?;

    let mut source = match fs::read_to_string(&path) {
        Ok(source) => source,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            String::from("#![no_implicit_prelude]\n\n")
        }
        Err(error) => return Err(format!("could not read `{}`: {error}", path.display())),
    };
    let declaration = format!("pub mod {module};");
    if source.lines().any(|line| line.trim() == declaration) {
        return Ok(());
    }
    if !source.ends_with('\n') {
        source.push('\n');
    }
    if !source.ends_with("\n\n") {
        source.push('\n');
    }
    source.push_str(&declaration);
    source.push('\n');
    fs::write(&path, source)
        .map_err(|error| format!("could not update `{}`: {error}", path.display()))
}

const WEB_FILES: &[(&str, &str)] = &[
    (
        "Cargo.toml",
        include_str!("../templates/web/Cargo.toml.tmpl"),
    ),
    (
        ".cargo/config.toml",
        include_str!("../templates/web/cargo-config.toml.tmpl"),
    ),
    (
        ".gitignore",
        include_str!("../templates/web/gitignore.tmpl"),
    ),
    ("README.md", include_str!("../templates/web/README.md.tmpl")),
    (
        "feluqa.toml",
        include_str!("../templates/web/feluqa.toml.tmpl"),
    ),
    ("build.rs", include_str!("../templates/web/build.rs.tmpl")),
    ("src/main.rs", include_str!("../templates/web/main.rs.tmpl")),
    (
        "src/service_provider.rs",
        include_str!("../templates/web/service-provider.rs.tmpl"),
    ),
    (
        "src/config.rs",
        include_str!("../templates/web/config.rs.tmpl"),
    ),
    (
        "src/modules/mod.rs",
        include_str!("../templates/web/modules-mod.rs.tmpl"),
    ),
    (
        "src/modules/system/mod.rs",
        include_str!("../templates/web/system-mod.rs.tmpl"),
    ),
    (
        "src/modules/live.rs",
        include_str!("../templates/web/live-module.rs.tmpl"),
    ),
    (
        "src/modules/seeders/mod.rs",
        include_str!("../templates/web/modules-seeders-mod.rs.tmpl"),
    ),
    (
        "src/routes/mod.rs",
        include_str!("../templates/web/routes-mod.rs.tmpl"),
    ),
    (
        "src/routes/web.rs",
        include_str!("../templates/web/routes-web.rs.tmpl"),
    ),
    (
        "src/app/mod.rs",
        include_str!("../templates/web/app-mod.rs.tmpl"),
    ),
    (
        "src/app/models/mod.rs",
        include_str!("../templates/web/models-mod.rs.tmpl"),
    ),
    (
        "src/app/services/mod.rs",
        include_str!("../templates/web/services-mod.rs.tmpl"),
    ),
    (
        "src/app/controllers/mod.rs",
        include_str!("../templates/web/controllers-mod.rs.tmpl"),
    ),
    (
        "src/app/controllers/resources.rs",
        include_str!("../templates/web/resources.rs.tmpl"),
    ),
    (
        "src/app/controllers/site.rs",
        include_str!("../templates/web/site.rs.tmpl"),
    ),
    (
        "src/app/controllers/panels.rs",
        include_str!("../templates/web/panels.rs.tmpl"),
    ),
    (
        "src/app/controllers/system.rs",
        include_str!("../templates/web/system.rs.tmpl"),
    ),
    (
        "src/app/controllers/live.rs",
        include_str!("../templates/web/live.rs.tmpl"),
    ),
    (
        "src/app/controllers/system/administration.rs",
        include_str!("../templates/web/system-administration.rs.tmpl"),
    ),
    (
        "src/app/controllers/system/operations.rs",
        include_str!("../templates/web/system-operations.rs.tmpl"),
    ),
    (
        "resources/views/pages/home.view.rs",
        include_str!("../templates/web/home.view.rs.tmpl"),
    ),
    (
        "config/database.development.toml",
        include_str!("../templates/web/database.development.toml.tmpl"),
    ),
    (
        "config/database.staging.toml",
        include_str!("../templates/web/database.staging.toml.tmpl"),
    ),
    (
        "config/database.production.toml",
        include_str!("../templates/web/database.production.toml.tmpl"),
    ),
    (
        "config/app.development.toml",
        include_str!("../templates/web/app.development.toml.tmpl"),
    ),
    (
        "config/app.staging.toml",
        include_str!("../templates/web/app.staging.toml.tmpl"),
    ),
    (
        "config/app.production.toml",
        include_str!("../templates/web/app.production.toml.tmpl"),
    ),
    (
        "src/modules/app/module.toml",
        include_str!("../templates/web/module.toml.tmpl"),
    ),
    (
        "public/assets/site.css",
        include_str!("../templates/web/site.css.tmpl"),
    ),
    (
        "storage/.gitkeep",
        include_str!("../templates/web/storage.gitkeep.tmpl"),
    ),
];

/// Create the built-in web application scaffold using embedded templates.
pub fn scaffold_web_project(
    root: &Path,
    slug: &str,
    display_name: &str,
    dependency: &str,
    dependency_fields: &str,
) -> Result<(), String> {
    for (relative, template) in WEB_FILES {
        let source = template
            .replace("@@SLUG@@", slug)
            .replace("@@NAME@@", display_name)
            .replace("@@FELUQA_DEPENDENCY@@", dependency)
            .replace("@@FELUQA_DEPENDENCY_FIELDS@@", dependency_fields);
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
