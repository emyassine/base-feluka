#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::format;
use crate::std::println;
use crate::std::result::Result::{Err, Ok};

use crate::context::Application;
use crate::std::ffi::OsString;
use crate::std::fs::{self, OpenOptions};
use crate::std::io::Write;
use crate::std::iter::Iterator;
use crate::std::path::PathBuf;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::string::ToString;

pub(crate) fn name(arguments: &[OsString], usage: &str) -> Result<String, String> {
    if arguments.len() != 1 {
        return Err(String::from(usage));
    }
    let name = arguments[0]
        .to_str()
        .ok_or_else(|| String::from("name must be valid UTF-8"))?;
    slugify(name)
}

pub(crate) fn slugify(value: &str) -> Result<String, String> {
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

pub(crate) fn pascal_case(slug: &str) -> String {
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

pub(crate) fn write_file(
    application: &Application,
    relative: PathBuf,
    contents: &str,
) -> Result<(), String> {
    let path = application.directory.join(relative);
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
        path.strip_prefix(&application.directory)
            .unwrap_or(&path)
            .display()
    );
    Ok(())
}

/// Add a generated source file to its Rust parent module.
pub(crate) fn register_module(
    application: &Application,
    parent: PathBuf,
    module: &str,
) -> Result<(), String> {
    let path = application.directory.join(parent).join("mod.rs");
    fs::create_dir_all(
        path.parent()
            .ok_or_else(|| String::from("module path has no parent"))?,
    )
    .map_err(|error| format!("could not create module directory: {error}"))?;

    let mut source = match fs::read_to_string(&path) {
        Ok(source) => source,
        Err(error) if error.kind() == crate::std::io::ErrorKind::NotFound => {
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

    fs::write(&path, source).map_err(|error| {
        format!(
            "could not register `{module}` in `{}`: {error}",
            path.display()
        )
    })
}
