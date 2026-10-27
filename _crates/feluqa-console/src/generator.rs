#![no_implicit_prelude]

extern crate std;

use std::convert::{AsRef, From};
use std::ffi::OsString;
use std::format;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::iter::{IntoIterator, Iterator};
use std::matches;
use std::path::{Component, Path};
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
    let relative = relative.as_ref();
    validate_relative_path(relative)?;
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

/// A compile-time template supplied by the consuming product.
#[derive(Clone, Copy)]
pub struct Template<'a> {
    /// Relative destination inside the generated project.
    pub path: &'a str,
    /// Embedded template source.
    pub contents: &'a str,
}

impl<'a> Template<'a> {
    /// Declare one embedded template and its generated relative path.
    pub const fn new(path: &'a str, contents: &'a str) -> Self {
        Self { path, contents }
    }
}

/// Write supplied templates after replacing declared placeholder pairs.
pub fn write_templates(
    root: &Path,
    templates: &[Template<'_>],
    replacements: &[(&str, &str)],
) -> Result<(), String> {
    for template in templates {
        let mut contents = template.contents.to_string();
        for (placeholder, value) in replacements {
            contents = contents.replace(placeholder, value);
        }
        write_file(root, template.path, &contents)?;
    }
    Ok(())
}

/// Create a set of relative directories under a project root.
pub fn create_directories<'a>(
    root: &Path,
    paths: impl IntoIterator<Item = &'a str>,
) -> Result<(), String> {
    for relative in paths {
        validate_relative_path(Path::new(relative))?;
        let path = root.join(relative);
        fs::create_dir_all(&path)
            .map_err(|error| format!("could not create `{}`: {error}", path.display()))?;
    }
    Ok(())
}

fn validate_relative_path(path: &Path) -> Result<(), String> {
    if path.as_os_str().is_empty()
        || path
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(format!(
            "generated path must be a safe relative path: `{}`",
            path.display()
        ));
    }
    Ok(())
}
