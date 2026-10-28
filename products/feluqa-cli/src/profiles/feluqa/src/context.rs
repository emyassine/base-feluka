#![no_implicit_prelude]

extern crate serde;
extern crate std;
extern crate toml;

use serde::Deserialize;
use std::convert::From;
use std::ffi::OsString;
use std::format;
use std::fs;
use std::iter::Iterator;
use std::option::Option;
use std::option::Option::None;
use std::option::Option::Some;
use std::path::{Path, PathBuf};
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

/// Product state initialized by the console for profile commands.
pub(crate) struct CliHost {
    pub(crate) current: PathBuf,
    pub(crate) context: Context,
    pub(crate) exit_code: ExitCode,
}

/// Read the command's arguments in the native form expected by process APIs.
pub(crate) fn arguments(
    command: &crate::feluqa::console::CommandContext<'_>,
) -> Vec<OsString> {
    command
        .arguments()
        .iter()
        .map(|argument| OsString::from(argument.as_str()))
        .collect()
}

/// Access the profile's execution context installed by `MakeConsole`.
pub(crate) fn host<'a, 'b>(
    command: &'a mut crate::feluqa::console::CommandContext<'b>,
) -> Result<&'a mut CliHost, String> {
    command
        .host::<CliHost>()
        .ok_or_else(|| String::from("Feluqa CLI context is unavailable"))
}

/// Require an app context for commands that operate on one application.
pub(crate) fn application(host: &CliHost) -> Result<&Application, String> {
    match &host.context {
        Context::App(application) => Ok(application),
        Context::Workspace(_) => Err(String::from(
            "this command requires an application directory",
        )),
        Context::Global => Err(String::from(
            "this command requires a Feluqa application",
        )),
    }
}

/// Store an operation's exit status in the console host.
pub(crate) fn finish(
    host: &mut CliHost,
    result: Result<ExitCode, String>,
) -> crate::feluqa::console::CommandResult {
    host.exit_code = result?;
    Ok(())
}

impl CliHost {
    pub(crate) fn new(current: &Path) -> Result<Self, String> {
        Ok(Self { current: current.to_path_buf(), context: detect(current)?, exit_code: ExitCode::SUCCESS })
    }
}

impl crate::feluqa::console::ConsoleHost for CliHost {
    fn create(current_directory: &Path) -> Result<Self, String> {
        Self::new(current_directory)
    }

    fn exit_code(&self) -> ExitCode {
        self.exit_code
    }

    fn command_context(&self) -> &'static str {
        match &self.context {
            Context::App(_) => "app",
            Context::Workspace(_) => "workspace",
            Context::Global => "global",
        }
    }

    fn context_notice(&self, profile: &str) -> Option<&'static str> {
        if profile == "nadim" {
            return None;
        }
        match &self.context {
            Context::App(_) => Some(
                "Application detected. This help lists application and global commands; workspace commands appear at the workspace root.",
            ),
            Context::Workspace(_) => Some(
                "Feluqa workspace detected. Application commands appear when you run Feluqa inside an application.",
            ),
            Context::Global => Some(
                "No application or workspace detected. Enter one to see its context-specific commands.",
            ),
        }
    }
}

crate::feluqa::console::register_host!(
    feluqa_cli_context,
    super::CliHost,
    &["feluqa", "nadim"]
);

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
