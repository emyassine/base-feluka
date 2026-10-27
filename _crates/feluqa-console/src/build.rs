#![no_implicit_prelude]

extern crate std;

use crate::Profile;
use std::clone::Clone;
use std::convert::From;
use std::env;
use std::ffi::OsStr;
use std::fmt::Write;
use std::fs;
use std::iter::Iterator;
use std::option::Option::{None, Some};
use std::path::{Path, PathBuf};
use std::println;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;

/// Recursively scan each declared profile command directory, compile only Rust files carrying a
/// `#[feluqa::command]` declaration and include top-level profile runtime
/// modules automatically. Write declarations to
/// `OUT_DIR/profile_commands.rs`.
/// Call from `build.rs` with the runtime profile slice.
/// Command directory paths are relative to `source_root`, matching each
/// profile's `commands_directory` field.
pub fn compile_profiles(source_root: &str, profiles: &[Profile]) -> Result<(), String> {
    let profiles: Vec<(String, String)> = profiles
        .iter()
        .map(|profile| {
            (
                profile.id.to_string(),
                profile.commands_directory.to_string(),
            )
        })
        .collect();
    compile_profile_sources(source_root, &profiles)
}

/// Read `PROFILES` from a product's Rust entrypoint and compile those
/// declared command directories. This lets a single `main.rs` be the
/// source of truth for both Cargo's build script and the running product.
pub fn compile_profiles_from_source(source_root: &str, profile_source: &str) -> Result<(), String> {
    let manifest =
        PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").ok_or("CARGO_MANIFEST_DIR is missing")?);
    let profile_source = manifest.join(profile_source);
    println!("cargo:rerun-if-changed={}", profile_source.display());
    let contents = fs::read_to_string(&profile_source).map_err(|error| {
        std::format!(
            "could not read profile declarations `{}`: {error}",
            profile_source.display()
        )
    })?;
    let profiles = profile_specs(&contents)?;
    compile_profile_sources(source_root, &profiles)
}

fn profile_specs(contents: &str) -> Result<Vec<(String, String)>, String> {
    use crate::syn;
    use crate::syn::{Expr, ExprLit, ExprStruct, Item, Lit, Member};

    let syntax = syn::parse_file(contents).map_err(|error| error.to_string())?;
    let declaration = syntax
        .items
        .iter()
        .find_map(|item| match item {
            Item::Const(item) if item.ident == "PROFILES" => Some(item),
            _ => None,
        })
        .ok_or_else(|| String::from("entrypoint must declare `const PROFILES`"))?;
    let array = match &*declaration.expr {
        Expr::Reference(reference) => &*reference.expr,
        expression => expression,
    };
    let Expr::Array(array) = array else {
        return Err(String::from(
            "`PROFILES` must be an array of Profile values",
        ));
    };
    let mut profiles = Vec::new();
    for entry in &array.elems {
        let Expr::Struct(ExprStruct { fields, .. }) = entry else {
            return Err(String::from(
                "each `PROFILES` entry must be a Profile struct",
            ));
        };
        let mut id = None;
        let mut directory = None;
        for field in fields {
            let Member::Named(name) = &field.member else {
                continue;
            };
            let Expr::Lit(ExprLit {
                lit: Lit::Str(value),
                ..
            }) = &field.expr
            else {
                continue;
            };
            match name.to_string().as_str() {
                "id" => id = Some(value.value()),
                "commands_directory" => directory = Some(value.value()),
                _ => {}
            }
        }
        profiles.push((
            id.ok_or_else(|| String::from("profile is missing its `id`"))?,
            directory.ok_or_else(|| String::from("profile is missing its `commands_directory`"))?,
        ));
    }
    if profiles.is_empty() {
        return Err(String::from("`PROFILES` must contain at least one profile"));
    }
    Ok(profiles)
}

fn compile_profile_sources(source_root: &str, profiles: &[(String, String)]) -> Result<(), String> {
    let manifest =
        PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").ok_or("CARGO_MANIFEST_DIR is missing")?);
    let root = manifest.join(source_root);
    let output = PathBuf::from(env::var_os("OUT_DIR").ok_or("OUT_DIR is missing")?)
        .join("profile_commands.rs");
    println!("cargo:rerun-if-changed={}", root.display());
    let mut source = String::new();
    let mut visited = Vec::new();
    for (profile_id, command_directory) in profiles {
        let relative = Path::new(command_directory);
        if relative.is_absolute()
            || relative.components().any(|part| match part {
                std::path::Component::ParentDir
                | std::path::Component::RootDir
                | std::path::Component::Prefix(_) => true,
                _ => false,
            })
        {
            return Err(std::format!(
                "profile `{}` command directory must stay under the configured source root",
                profile_id
            ));
        }
        let profile_directory = root.join(relative);
        if !profile_directory.is_dir() {
            return Err(std::format!(
                "profile `{}` command directory `{}` does not exist",
                profile_id,
                profile_directory.display()
            ));
        }
        if visited.contains(&profile_directory) {
            continue;
        }
        visited.push(profile_directory.clone());
        println!("cargo:rerun-if-changed={}", profile_directory.display());
        let mut files = Vec::new();
        collect(&profile_directory, &mut files)?;
        files.sort();
        let profile_module = profile_support_name(profile_id);
        let mut runtime_modules = Vec::new();
        for file in files {
            println!("cargo:rerun-if-changed={}", file.display());
            let contents = fs::read_to_string(&file).map_err(|error| {
                std::format!(
                    "could not read command source `{}`: {error}",
                    file.display()
                )
            })?;
            if !contents.contains("#[feluqa::command") {
                if file.parent() == Some(profile_directory.as_path()) && file.file_stem().is_some()
                {
                    runtime_modules.push((
                        file.file_stem()
                            .and_then(OsStr::to_str)
                            .ok_or_else(|| String::from("profile module name is not UTF-8"))?
                            .to_string(),
                        file.clone(),
                    ));
                }
                continue;
            }
            let command_relative = file
                .strip_prefix(&profile_directory)
                .map_err(|error| error.to_string())?;
            let module = module_name(profile_id, command_relative);
            std::writeln!(&mut source, "#[path = {:?}] mod {module};", file)
                .map_err(|error| error.to_string())?;
        }
        if !runtime_modules.is_empty() {
            let mut module_source = String::new();
            for (name, path) in runtime_modules {
                std::writeln!(
                    &mut module_source,
                    "#[path = {:?}] pub(crate) mod {name};",
                    path
                )
                .map_err(|error| error.to_string())?;
            }
            std::writeln!(&mut source, "mod {profile_module} {{ {module_source} }}")
                .map_err(|error| error.to_string())?;
        }
    }
    fs::write(output, source).map_err(|error| error.to_string())
}

fn collect(directory: &Path, files: &mut Vec<PathBuf>) -> Result<(), String> {
    if !directory.exists() {
        return Ok(());
    }
    for entry in fs::read_dir(directory).map_err(|error| error.to_string())? {
        let path = entry.map_err(|error| error.to_string())?.path();
        if path.is_dir() {
            collect(&path, files)?;
        } else if path.extension() == Some(OsStr::new("rs")) {
            files.push(path);
        }
    }
    Ok(())
}

fn module_name(profile: &str, path: &Path) -> String {
    let mut name = String::from("__feluqa_command_");
    for character in profile.chars() {
        name.push(if character.is_ascii_alphanumeric() {
            character.to_ascii_lowercase()
        } else {
            '_'
        });
    }
    for component in path.components() {
        name.push('_');
        for character in component.as_os_str().to_string_lossy().chars() {
            name.push(if character.is_ascii_alphanumeric() {
                character.to_ascii_lowercase()
            } else {
                '_'
            });
        }
    }
    name
}

fn profile_support_name(profile: &str) -> String {
    let mut name = String::from("__feluqa_profile_");
    for character in profile.chars() {
        name.push(if character.is_ascii_alphanumeric() {
            character.to_ascii_lowercase()
        } else {
            '_'
        });
    }
    name
}
