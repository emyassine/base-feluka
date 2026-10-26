#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate std;

use std::clone::Clone;
use std::cmp::Ord;
use std::convert::From;
use std::env;
use std::eprintln;
use std::ffi::OsString;
use std::format;
use std::fs;
use std::iter::IntoIterator;
use std::iter::Iterator;
use std::option::Option;
use std::option::Option::{None, Some};
use std::path::Path;
use std::path::PathBuf;
use std::println;
use std::process::Command;
use std::process::ExitCode;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::String;
use std::vec;
use std::vec::Vec;

#[derive(Clone)]
struct Application {
    name: String,
    profile: String,
    manifest: PathBuf,
    directory: PathBuf,
}

fn main() -> ExitCode {
    match run(env::args_os().skip(1).collect()) {
        Ok(code) => code,
        Err(error) => {
            eprintln!("feluqa: {error}");
            ExitCode::FAILURE
        }
    }
}

fn run(arguments: Vec<OsString>) -> Result<ExitCode, String> {
    let command = arguments
        .first()
        .and_then(|argument| argument.to_str())
        .unwrap_or("help");
    match command {
        "help" | "--help" | "-h" => {
            print_help();
            Ok(ExitCode::SUCCESS)
        }
        "list" => {
            for application in applications()? {
                println!("{}  ({})", application.name, application.profile);
            }
            Ok(ExitCode::SUCCESS)
        }
        "dev" | "build" | "check" => {
            let available_apps = applications()?;
            let requested_app = arguments
                .get(1)
                .and_then(|argument| argument.to_str())
                .map(String::from);
            let application = match requested_app {
                Some(name) => available_apps
                    .into_iter()
                    .find(|application| application.name == name)
                    .ok_or_else(|| {
                        format!("application `{name}` was not found; run `feluqa list`")
                    })?,
                None if available_apps.len() == 1 => available_apps[0].clone(),
                None if available_apps.is_empty() => {
                    return Err(String::from(
                        "no Feluqa application was found in this directory",
                    ));
                }
                None => return Err(String::from("choose an application: feluqa dev <app>")),
            };
            run_cargo_command(command, &application)
        }
        other => Err(format!("unknown command `{other}`; run `feluqa help`")),
    }
}

fn applications() -> Result<Vec<Application>, String> {
    let current =
        env::current_dir().map_err(|error| format!("could not read current directory: {error}"))?;
    if let Some(workspace_directory) = find_workspace_directory(&current) {
        let products_directory = workspace_directory.join("products");
        let entries = fs::read_dir(&products_directory)
            .map_err(|error| format!("could not read products directory: {error}"))?;
        let mut applications = Vec::new();
        for entry in entries {
            let entry = entry.map_err(|error| format!("could not read product entry: {error}"))?;
            let directory = entry.path();
            if directory.is_dir() && directory.join("feluqa.toml").is_file() {
                applications.push(read_application(&directory)?);
            }
        }
        applications.sort_by(|left, right| left.name.cmp(&right.name));
        return Ok(applications);
    }

    for directory in current.ancestors() {
        if directory.join("feluqa.toml").is_file() && directory.join("Cargo.toml").is_file() {
            return Ok(vec![read_application(directory)?]);
        }
    }
    Err(String::from(
        "no Feluqa application found; run this from an app directory",
    ))
}

fn find_workspace_directory(current: &Path) -> Option<PathBuf> {
    for directory in current.ancestors() {
        if directory.join("_crates/Cargo.toml").is_file() {
            return Some(directory.to_path_buf());
        }
    }
    let cli_directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let candidate = cli_directory.join("../../_crates/Cargo.toml");
    if candidate.is_file() {
        return candidate.parent()?.parent().map(Path::to_path_buf);
    }
    None
}

fn read_application(directory: &Path) -> Result<Application, String> {
    let manifest = directory.join("Cargo.toml");
    let manifest_source = fs::read_to_string(&manifest)
        .map_err(|error| format!("could not read `{}`: {error}", manifest.display()))?;
    let mut in_package = false;
    let mut name = None;
    for line in manifest_source.lines() {
        let line = line.trim();
        if line.starts_with('[') {
            in_package = line == "[package]";
        } else if in_package {
            if let Some(value) = line.strip_prefix("name = ") {
                name = Some(String::from(value.trim_matches('"')));
                break;
            }
        }
    }
    let name = name.ok_or_else(|| format!("`{}` has no package name", manifest.display()))?;
    let config_path = directory.join("feluqa.toml");
    let config = fs::read_to_string(&config_path)
        .map_err(|error| format!("could not read `{}`: {error}", config_path.display()))?;
    let profile = config
        .lines()
        .find_map(|line| line.trim().strip_prefix("profile = "))
        .map(|value| String::from(value.trim_matches('"')))
        .unwrap_or_else(|| String::from("unknown"));
    Ok(Application {
        name,
        profile,
        manifest,
        directory: directory.to_path_buf(),
    })
}

fn run_cargo_command(command: &str, application: &Application) -> Result<ExitCode, String> {
    let cargo_command = if command == "dev" { "run" } else { command };
    let mut cargo = Command::new("cargo");
    cargo
        .arg(cargo_command)
        .arg("--manifest-path")
        .arg(&application.manifest)
        .arg("-p")
        .arg(&application.name)
        .current_dir(&application.directory);
    match command {
        "dev" => {
            cargo.arg("--").arg("dev");
        }
        "build" => {
            cargo.arg("--release");
        }
        "check" => {}
        _ => unreachable!(),
    }
    let status = cargo
        .status()
        .map_err(|error| format!("could not start Cargo: {error}"))?;
    Ok(ExitCode::from(
        status.code().unwrap_or(1).clamp(0, 255) as u8
    ))
}

fn print_help() {
    println!("Feluqa — application platform CLI");
    println!();
    println!("Commands:");
    println!("  feluqa list       List applications");
    println!("  feluqa dev [app]  Run a web application in development mode");
    println!("  feluqa build [app] Build an application for production");
    println!("  feluqa check [app] Check an application");
    println!("  feluqa help       Show this help");
}
