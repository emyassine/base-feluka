#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::env;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::option::Option;
use crate::std::option::Option::Some;
use crate::std::path::{Path, PathBuf};
use crate::std::print;
use crate::std::process::{Command, ExitCode};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;

#[feluqa::command(
    name = "update",
    description = "Update the Feluqa CLI or inspect platform update support",
    context = "anywhere",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::feluqa::console::platform::arguments(context);
    let host = crate::feluqa::console::platform::host(context)?;
    let result = execute(&arguments);
    crate::feluqa::console::platform::finish(host, result)
}

fn execute(arguments: &[OsString]) -> Result<ExitCode, String> {
    match arguments {
        [target] if target == "cli" => update_cli(false),
        [target, option] if target == "cli" && option == "--check" => update_cli(true),
        [target] if target == "platform" => update_platform(),
        _ => Err(String::from(
            "usage: feluqa update <cli|platform> [--check]",
        )),
    }
}

fn update_platform() -> Result<ExitCode, String> {
    if feluqa::definitions::RemoteLink::PlatformUpdate.url().is_none() {
        return Err(String::from(
            "platform updates are unavailable because no release source is configured; no platform files were changed",
        ));
    }
    Err(String::from(
        "platform update activation is not implemented; no platform files were changed",
    ))
}

fn update_cli(check_only: bool) -> Result<ExitCode, String> {
    let install_root = tracked_install_root()?;
    let registry = feluqa::definitions::RemoteLink::CliUpdate
        .url()
        .ok_or_else(|| String::from("the private Feluqa crate registry is not configured"))?;

    let mut info = Command::new("cargo");
    info.arg("info")
        .arg("feluqa-cli")
        .arg("--registry")
        .arg("feluqa");
    configure_registry(&mut info, registry);
    let info = info
        .output()
        .map_err(|error| format!("could not start Cargo to check CLI releases: {error}"))?;
    if !info.status.success() {
        let detail = String::from_utf8_lossy(&info.stderr);
        return Err(format!(
            "could not check the private CLI release; the package may not be published yet: {}",
            detail.trim()
        ));
    }
    print!("{}", String::from_utf8_lossy(&info.stdout));
    if check_only {
        return Ok(ExitCode::SUCCESS);
    }

    let mut install = Command::new("cargo");
    install
        .arg("install")
        .arg("feluqa-cli")
        .arg("--registry")
        .arg("feluqa")
        .arg("--root")
        .arg(install_root)
        .arg("--bin")
        .arg("feluqa")
        .arg("--locked");
    configure_registry(&mut install, registry);
    let status = install
        .status()
        .map_err(|error| format!("could not start Cargo to update the Feluqa CLI: {error}"))?;
    Ok(exit_code(status.code()))
}

fn tracked_install_root() -> Result<PathBuf, String> {
    let executable = env::current_exe()
        .map_err(|error| format!("could not locate this Feluqa executable: {error}"))?;
    let bin_directory = executable
        .parent()
        .ok_or_else(|| String::from("could not determine the Feluqa install directory"))?;
    if bin_directory.file_name().and_then(|name| name.to_str()) != Some("bin") {
        return Err(String::from(
            "this executable is not in a Cargo install directory; update it with its installation method",
        ));
    }
    let install_root = bin_directory
        .parent()
        .ok_or_else(|| String::from("could not determine the Cargo install root"))?;
    let expected_executable = bin_directory.join(format!(
        "feluqa{}",
        env::consts::EXE_SUFFIX
    ));
    if !same_path(&executable, &expected_executable) {
        return Err(String::from(
            "this executable is not the Cargo-managed `feluqa` binary; no files were changed",
        ));
    }

    let mut list = Command::new("cargo");
    list.arg("install").arg("--list").arg("--root").arg(install_root);
    let output = list
        .output()
        .map_err(|error| format!("could not inspect Cargo-installed binaries: {error}"))?;
    if !output.status.success() {
        return Err(String::from(
            "Cargo could not inspect the installation; no files were changed",
        ));
    }
    let installed = String::from_utf8_lossy(&output.stdout);
    let mut package_is_cli = false;
    let mut tracks_cli_binary = false;
    for line in installed.lines() {
        if line.starts_with(' ') || line.starts_with('\t') {
            if package_is_cli && line.trim() == "feluqa" {
                tracks_cli_binary = true;
            }
        } else {
            package_is_cli = line.starts_with("feluqa-cli v");
        }
    }
    if !tracks_cli_binary {
        return Err(String::from(
            "Cargo does not track this executable as the `feluqa` binary from `feluqa-cli`; no files were changed",
        ));
    }
    Ok(install_root.to_path_buf())
}

fn same_path(left: &Path, right: &Path) -> bool {
    match (left.canonicalize(), right.canonicalize()) {
        (Ok(left), Ok(right)) => left == right,
        _ => false,
    }
}

fn configure_registry(command: &mut Command, index: &str) {
    let index_config = format!("registries.feluqa.index=\"{index}\"");
    command.arg("--config").arg(index_config);
    command
        .arg("--config")
        .arg("registries.feluqa.credential-provider=[\"cargo:token\"]");
}

fn exit_code(code: Option<i32>) -> ExitCode {
    let code = code.unwrap_or(1);
    ExitCode::from(if (0..=255).contains(&code) {
        code as u8
    } else {
        1
    })
}
