#![no_implicit_prelude]

use crate::feluqa;
use crate::feluqa::console::platform::Application;
use crate::std::collections::BTreeMap;
use crate::std::cmp::Ord;
use crate::std::clone::Clone;
use crate::std::convert::From;
use crate::std::eprintln;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::fs;
use crate::std::io::ErrorKind;
use crate::std::iter::{Extend, Iterator};
use crate::std::matches;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::{Path, PathBuf};
use crate::std::println;
use crate::std::process::{Child, Command, ExitCode, ExitStatus};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};
use crate::std::thread;
use crate::std::time::{Duration, SystemTime};
use crate::std::vec::Vec;
use serde::Deserialize;

extern crate serde;
extern crate serde_json;
extern crate std;

#[feluqa::command(
    name = "dev",
    description = "Build and run the current application with file watching",
    usage = "feluqa dev [<app>|--app=<app>]",
    context = "in_dev",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let mut arguments = crate::feluqa::console::platform::arguments(context);
    let workspace = {
        let host = crate::feluqa::console::platform::host(context)?;
        match &host.context {
            crate::feluqa::console::platform::Context::Workspace(path) => Some(path.clone()),
            _ => None,
        }
    };
    if workspace.is_some() && arguments.is_empty() {
        let name = context.argument_or_prompt(
            0,
            "Application",
            Some("e.g. bookstore"),
            "usage: feluqa dev <app>",
        )?;
        arguments.push(OsString::from(name));
    }
    let host = crate::feluqa::console::platform::host(context)?;
    let result = match &host.context {
        crate::feluqa::console::platform::Context::App(application) => {
            if arguments.is_empty() {
                watch(application)
            } else {
                Err(crate::std::string::String::from(
                    "inside an application, run `feluqa dev` without an app name",
                ))
            }
        }
        crate::feluqa::console::platform::Context::Workspace(path) => {
            let name = application_argument(&arguments)?;
            let application =
                crate::feluqa::console::platform::workspace_application(path, name)?;
            watch(&application)
        }
        crate::feluqa::console::platform::Context::Global
        | crate::feluqa::console::platform::Context::Platform(_) => Err(
            crate::std::string::String::from(
                "run `feluqa dev` inside an application, or `feluqa dev <app>` from its workspace",
            ),
        ),
    };
    crate::feluqa::console::platform::finish(host, result)
}

fn application_argument(arguments: &[OsString]) -> Result<&str, String> {
    match arguments {
        [argument] => {
            let value = argument
                .to_str()
                .ok_or_else(|| String::from("application name must be valid UTF-8"))?;
            match value.strip_prefix("--app=") {
                Some(name) if !name.is_empty() => Ok(name),
                Some(_) => Err(String::from("usage: feluqa dev <app>")),
                None if !value.starts_with('-') => Ok(value),
                None => Err(String::from(
                    "usage: feluqa dev <app> or `feluqa dev --app=<app>`",
                )),
            }
        }
        [flag, name] if flag.to_str() == Some("--app") => name
            .to_str()
            .filter(|name| !name.is_empty())
            .ok_or_else(|| String::from("usage: feluqa dev --app <app>")),
        _ => Err(String::from(
            "usage: feluqa dev <app> or `feluqa dev --app=<app>`",
        )),
    }
}

const POLL_INTERVAL: Duration = Duration::from_millis(400);
const SHUTDOWN_TIMEOUT: Duration = Duration::from_secs(5);

#[derive(Deserialize)]
struct CargoMetadata {
    packages: Vec<MetadataPackage>,
    workspace_root: PathBuf,
    target_directory: PathBuf,
}

#[derive(Deserialize)]
struct MetadataPackage {
    name: String,
    manifest_path: PathBuf,
    targets: Vec<MetadataTarget>,
}

#[derive(Deserialize)]
struct MetadataTarget {
    name: String,
    kind: Vec<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
struct FileStamp {
    modified: Option<SystemTime>,
    length: u64,
}

struct DevTarget {
    executable: PathBuf,
    watch_roots: Vec<PathBuf>,
}

fn watch(application: &Application) -> Result<ExitCode, String> {
    feluqa::console::info(&format!(
        "Preparing {} for development (checking the Rust project)...",
        application.display_name
    ));
    let target = resolve_target(application)?;
    feluqa::console::info(&format!(
        "Building {} for development...",
        application.display_name
    ));
    let status = build(application)?;
    if !status.success() {
        return Ok(exit_code(status));
    }

    let mut snapshot = fingerprint(&target.watch_roots)?;
    feluqa::console::info(&format!(
        "Starting {} development server...",
        application.display_name
    ));
    let mut server = start_server(&target.executable, application)?;
    println!("Development server ready. Press Ctrl+C to stop.");

    loop {
        thread::sleep(POLL_INTERVAL);
        let next = fingerprint(&target.watch_roots)?;
        if next != snapshot {
            println!("Detected app changes. Rebuilding while the current server stays online.");
            snapshot = next;
            match build(application) {
                Ok(status) if status.success() => {
                    stop_server(&mut server)?;
                    server = start_server(&target.executable, application)?;
                    println!("Development server restarted with the latest build.");
                }
                Ok(status) => {
                    eprintln!(
                        "Feluqa: development build failed ({}); keeping the last running server. Fix the error to retry.",
                        status.code().unwrap_or(1)
                    );
                }
                Err(error) => {
                    eprintln!(
                        "Feluqa: could not run the development build: {error}; keeping the last running server."
                    );
                }
            }
        }

        if let Some(status) = server
            .try_wait()
            .map_err(|error| format!("could not observe the development server: {error}"))?
        {
            return Ok(exit_code(status));
        }
    }
}

fn resolve_target(application: &Application) -> Result<DevTarget, String> {
    let output = Command::new("cargo")
        .arg("metadata")
        .arg("--manifest-path")
        .arg(&application.manifest)
        .arg("--no-deps")
        .arg("--format-version")
        .arg("1")
        .current_dir(&application.directory)
        .output()
        .map_err(|error| format!("could not inspect the app's Cargo targets: {error}"))?;
    if !output.status.success() {
        return Err(format!(
            "cargo metadata failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }
    let metadata: CargoMetadata = serde_json::from_slice(&output.stdout)
        .map_err(|error| format!("could not parse Cargo metadata: {error}"))?;
    let package = metadata
        .packages
        .iter()
        .find(|package| package.manifest_path == application.manifest)
        .ok_or_else(|| {
            format!(
                "Cargo metadata does not include app package `{}`",
                application.package_name
            )
        })?;
    if package.name != application.package_name {
        return Err(format!(
            "Cargo package changed from `{}` to `{}`; reload the Feluqa app context",
            application.package_name, package.name
        ));
    }
    let mut binaries = package
        .targets
        .iter()
        .filter(|target| target.kind.iter().any(|kind| kind == "bin"));
    let binary = binaries
        .next()
        .ok_or_else(|| format!("app `{}` declares no binary target", package.name))?;
    if binaries.next().is_some() {
        return Err(format!(
            "app `{}` declares multiple binary targets; Feluqa dev requires one app binary",
            package.name
        ));
    }
    let mut executable = metadata.target_directory.join("debug").join(&binary.name);
    if cfg!(windows) {
        executable.set_extension("exe");
    }

    let mut watch_roots = Vec::new();
    add_watch_roots(&mut watch_roots, &application.directory, true);
    watch_roots.extend([
        metadata.workspace_root.join("Cargo.toml"),
        metadata.workspace_root.join("Cargo.lock"),
        metadata.workspace_root.join(".cargo/config.toml"),
        metadata.workspace_root.join("rust-toolchain.toml"),
        metadata.workspace_root.join("rust-toolchain"),
    ]);
    for package in &metadata.packages {
        let Some(directory) = package.manifest_path.parent() else {
            continue;
        };
        if directory == application.directory {
            continue;
        }
        let workspace_root = metadata.workspace_root.as_path();
        let in_framework_tree = directory.starts_with(workspace_root.join("crates"))
            || directory.starts_with(workspace_root.join("tools"));
        if !in_framework_tree {
            continue;
        }
        add_watch_roots(&mut watch_roots, directory, false);
    }
    watch_roots.sort();
    watch_roots.dedup();

    Ok(DevTarget {
        executable,
        watch_roots,
    })
}

fn add_watch_roots(roots: &mut Vec<PathBuf>, directory: &Path, include_app_files: bool) {
    roots.push(directory.join("Cargo.toml"));
    roots.push(directory.join("Cargo.lock"));
    roots.push(directory.join(".cargo/config.toml"));
    roots.push(directory.join("build.rs"));
    roots.push(directory.join("src"));
    if include_app_files {
        for name in [
            "feluqa.toml",
            "config",
            "routes",
            "modules",
            "resources/views",
        ] {
            roots.push(directory.join(name));
        }
    }
}

fn build(application: &Application) -> Result<ExitStatus, String> {
    let mut cargo = Command::new("cargo");
    let jobs = thread::available_parallelism()
        .map(|parallelism| parallelism.get().saturating_sub(2).max(1))
        .unwrap_or(1)
        .to_string();
    cargo.arg("build").arg("--jobs").arg(jobs).arg("--manifest-path").arg(&application.manifest)
        .arg("--package").arg(&application.package_name)
        .current_dir(&application.directory)
        .env("FELUQA_ENV", "development");
    cargo
        .status()
        .map_err(|error| format!("could not start Cargo in the app directory: {error}"))
}

fn start_server(executable: &Path, application: &Application) -> Result<Child, String> {
    Command::new(executable)
        .arg("dev")
        .env("FELUQA_ENV", "development")
        .current_dir(&application.directory)
        .spawn()
        .map_err(|error| {
            format!(
                "could not start the app binary `{}`: {error}",
                executable.display()
            )
        })
}

#[cfg(unix)]
fn stop_server(child: &mut Child) -> Result<(), String> {
    let pid = child.id().to_string();
    let signal = Command::new("kill").arg("-TERM").arg(&pid).status();
    if !matches!(signal, Ok(status) if status.success()) {
        if child
            .try_wait()
            .map_err(|error| format!("could not observe the previous app process: {error}"))?
            .is_some()
        {
            return Ok(());
        }
        child
            .kill()
            .map_err(|error| format!("could not stop the previous app process: {error}"))?;
    }
    let started = std::time::Instant::now();
    loop {
        if child
            .try_wait()
            .map_err(|error| format!("could not wait for the previous app process: {error}"))?
            .is_some()
        {
            return Ok(());
        }
        if started.elapsed() >= SHUTDOWN_TIMEOUT {
            child.kill().map_err(|error| {
                format!("could not force-stop the previous app process: {error}")
            })?;
            child
                .wait()
                .map_err(|error| format!("could not reap the previous app process: {error}"))?;
            return Ok(());
        }
        thread::sleep(Duration::from_millis(50));
    }
}

#[cfg(not(unix))]
fn stop_server(child: &mut Child) -> Result<(), String> {
    child
        .kill()
        .map_err(|error| format!("could not stop the previous app process: {error}"))?;
    child
        .wait()
        .map_err(|error| format!("could not reap the previous app process: {error}"))?;
    Ok(())
}

fn exit_code(status: ExitStatus) -> ExitCode {
    let code = status.code().unwrap_or(1);
    ExitCode::from(if (0..=255).contains(&code) {
        code as u8
    } else {
        1
    })
}

fn fingerprint(roots: &[PathBuf]) -> Result<BTreeMap<PathBuf, FileStamp>, String> {
    let mut snapshot = BTreeMap::new();
    for root in roots {
        visit(root, &mut snapshot)?;
    }
    Ok(snapshot)
}

fn visit(path: &Path, snapshot: &mut BTreeMap<PathBuf, FileStamp>) -> Result<(), String> {
    let metadata = match fs::symlink_metadata(path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == ErrorKind::NotFound => return Ok(()),
        Err(error) => return Err(format!("could not inspect `{}`: {error}", path.display())),
    };
    if metadata.file_type().is_symlink() {
        return Ok(());
    }
    if metadata.is_dir() {
        let entries = fs::read_dir(path)
            .map_err(|error| format!("could not read `{}`: {error}", path.display()))?;
        let mut children = entries
            .map(|entry| {
                entry.map(|entry| entry.path()).map_err(|error| {
                    format!("could not read an entry in `{}`: {error}", path.display())
                })
            })
            .collect::<Result<Vec<_>, _>>()?;
        children.sort();
        for child in children {
            visit(&child, snapshot)?;
        }
    } else if metadata.is_file() {
        snapshot.insert(
            path.to_path_buf(),
            FileStamp {
                modified: metadata.modified().ok(),
                length: metadata.len(),
            },
        );
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::fingerprint;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::assert_ne;
    use crate::std::clone::Clone;
    use crate::std::convert::From;
    use crate::std::env;
    use crate::std::format;
    use crate::std::fs;
    use crate::std::option::Option::Some;
    use crate::std::path::PathBuf;
    use crate::std::result::Result::{self, Ok};
    use crate::std::string::String;
    use crate::std::string::ToString;
    use crate::std::sync::atomic::{AtomicU64, Ordering};

    #[test]
    fn fingerprint_observes_new_changed_and_removed_template_files() -> Result<(), String> {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        let directory = env::temp_dir().join(format!(
            "feluqa-watch-{}-{}",
            crate::std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(&directory).map_err(|error| error.to_string())?;
        let template = directory.join("home.view.rs");
        fs::write(&template, "hello").map_err(|error| error.to_string())?;
        let roots = [directory.clone()];
        let original = fingerprint(&roots)?;

        fs::write(&template, "a changed view").map_err(|error| error.to_string())?;
        let changed = fingerprint(&roots)?;
        assert_ne!(original, changed);

        fs::remove_file(&template).map_err(|error| error.to_string())?;
        let removed = fingerprint(&roots)?;
        assert_ne!(changed, removed);
        fs::remove_dir_all(directory).map_err(|error| error.to_string())?;
        Ok(())
    }

    #[test]
    fn dev_target_uses_the_application_binary_and_watches_local_framework_sources()
    -> Result<(), String> {
        let app_directory = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .canonicalize()
            .map_err(|error| error.to_string())?;
        let application = Application {
            display_name: String::from("Feluqa CLI"),
            package_name: String::from("feluqa-cli"),
            profile: String::from("web"),
            manifest: app_directory.join("Cargo.toml"),
            directory: app_directory.clone(),
        };
        let target = super::resolve_target(&application)?;

        assert_eq!(
            target.executable.file_name(),
            Some(crate::std::ffi::OsStr::new("feluqa"))
        );
        assert!(
            target
                .watch_roots
                .contains(&app_directory.join("resources/views"))
        );
        let framework_source = app_directory
            .join("../../crates/ui/feluqa-view/src")
            .canonicalize()
            .map_err(|error| error.to_string())?;
        let workspace_manifest = app_directory
            .join("../../Cargo.toml")
            .canonicalize()
            .map_err(|error| error.to_string())?;
        assert!(target.watch_roots.contains(&framework_source));
        assert!(target.watch_roots.contains(&workspace_manifest));
        Ok(())
    }
}
