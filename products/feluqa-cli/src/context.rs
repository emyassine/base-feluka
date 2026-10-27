#![no_implicit_prelude]

extern crate serde;
extern crate std;
extern crate toml;

use serde::Deserialize;
use std::cmp::Ord;
use std::format;
use std::fs;
use std::iter::Iterator;
use std::option::Option;
use std::option::Option::Some;
use std::path::{Path, PathBuf};
use std::println;
use std::process::ExitCode;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::String;
use std::vec::Vec;

/// Validated application descriptor resolved from Cargo and Feluqa manifests.
#[derive(Clone, Debug)]
pub(crate) struct Application {
    pub(crate) display_name: String,
    pub(crate) package_name: String,
    pub(crate) profile: String,
    pub(crate) manifest: PathBuf,
    pub(crate) directory: PathBuf,
}

/// Execution location used to enforce app command boundaries.
pub(crate) enum Context {
    App(Application),
    Workspace(PathBuf),
    Global,
}

/// Product state supplied to registered console handlers.
pub(crate) struct CliHost {
    pub(crate) current: PathBuf,
    pub(crate) context: Context,
    pub(crate) exit_code: ExitCode,
}

impl CliHost {
    pub(crate) fn new(current: &Path) -> Result<Self, String> {
        Ok(Self { current: current.to_path_buf(), context: detect(current)?, exit_code: ExitCode::SUCCESS })
    }
}

#[derive(Deserialize)]
struct CargoDocument {
    package: CargoPackage,
}

#[derive(Deserialize)]
struct CargoPackage {
    name: String,
}

#[derive(Deserialize)]
struct FeluqaDocument {
    app: FeluqaApp,
}

#[derive(Deserialize)]
struct FeluqaApp {
    name: String,
    profile: String,
}

/// Detect the nearest valid app first, then a containing workspace.
pub(crate) fn detect(current: &Path) -> Result<Context, String> {
    for directory in current.ancestors() {
        if directory.join("feluqa.toml").is_file() {
            return read_application(directory).map(Context::App);
        }
    }
    if let Some(workspace) = find_workspace(current) {
        return Ok(Context::Workspace(workspace));
    }
    Ok(Context::Global)
}

pub(crate) fn find_workspace(current: &Path) -> Option<PathBuf> {
    current
        .ancestors()
        .find(|directory| directory.join("_crates/Cargo.toml").is_file())
        .map(Path::to_path_buf)
}

pub(crate) fn read_application(directory: &Path) -> Result<Application, String> {
    let manifest = directory.join("Cargo.toml");
    let entrypoint = directory.join("src/main.rs");
    let config_path = directory.join("feluqa.toml");
    if !manifest.is_file() || !entrypoint.is_file() {
        return Err(format!(
            "`{}` has feluqa.toml but is not a valid app root (Cargo.toml and src/main.rs are required)",
            directory.display()
        ));
    }
    let cargo_source = fs::read_to_string(&manifest)
        .map_err(|error| format!("could not read `{}`: {error}", manifest.display()))?;
    let cargo: CargoDocument = toml::from_str(&cargo_source)
        .map_err(|error| format!("invalid Cargo manifest `{}`: {error}", manifest.display()))?;
    let config_source = fs::read_to_string(&config_path)
        .map_err(|error| format!("could not read `{}`: {error}", config_path.display()))?;
    let config: FeluqaDocument = toml::from_str(&config_source)
        .map_err(|error| format!("invalid Feluqa config `{}`: {error}", config_path.display()))?;
    if config.app.name.trim().is_empty() || config.app.profile.trim().is_empty() {
        return Err(format!(
            "`{}` has an empty app name or profile",
            config_path.display()
        ));
    }
    Ok(Application {
        display_name: config.app.name,
        package_name: cargo.package.name,
        profile: config.app.profile,
        manifest,
        directory: directory.to_path_buf(),
    })
}

pub(crate) fn list_applications(workspace: &Path) -> Result<ExitCode, String> {
    let products = workspace.join("products");
    let entries = fs::read_dir(&products)
        .map_err(|error| format!("could not read `{}`: {error}", products.display()))?;
    let mut apps = Vec::new();
    for entry in entries {
        let path = entry
            .map_err(|error| format!("could not read product entry: {error}"))?
            .path();
        if path.is_dir() && path.join("feluqa.toml").is_file() {
            apps.push(read_application(&path)?);
        }
    }
    apps.sort_by(|left, right| left.display_name.cmp(&right.display_name));
    for app in apps {
        println!("{}  ({})", app.display_name, app.profile);
    }
    Ok(ExitCode::SUCCESS)
}

pub(crate) fn workspace_application(
    workspace: &Path,
    requested: &str,
) -> Result<Application, String> {
    let products = workspace.join("products");
    let entries = fs::read_dir(&products)
        .map_err(|error| format!("could not read `{}`: {error}", products.display()))?;
    for entry in entries {
        let path = entry
            .map_err(|error| format!("could not read product entry: {error}"))?
            .path();
        if path.is_dir() && path.join("feluqa.toml").is_file() {
            let application = read_application(&path)?;
            if application.display_name == requested || application.package_name == requested {
                return Ok(application);
            }
        }
    }
    Err(format!(
        "application `{requested}` was not found in this workspace"
    ))
}
