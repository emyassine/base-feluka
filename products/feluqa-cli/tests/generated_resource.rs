#![no_implicit_prelude]

extern crate std;

use std::env;
use std::format;
use std::fs;
use std::ops::Drop;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::result::Result::{self, Err, Ok};
use std::string::String;

struct GeneratedApp(PathBuf);

impl Drop for GeneratedApp {
    fn drop(&mut self) {
        let _cleanup = fs::remove_dir_all(&self.0);
    }
}

#[test]
fn generated_resource_is_registered_and_requires_a_core_session() -> Result<(), String> {
    let workspace = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let name = format!("resource-route-test-{}", std::process::id());
    let app = GeneratedApp(workspace.join("products").join(&name));
    if app.0.exists() {
        return Err(format!("test app path already exists: {}", app.0.display()));
    }

    run_cli(&workspace, &["new", &name, "--profile", "web"])?;
    run_cli(&app.0, &["make", "model", "Invoice"])?;
    run_cli(&app.0, &["make", "resource", "Invoice"])?;

    let output = Command::new("cargo")
        .arg("test")
        .arg("--manifest-path")
        .arg(app.0.join("Cargo.toml"))
        .arg("--target-dir")
        .arg(workspace.join("target"))
        .arg("registered_resource_")
        .current_dir(&workspace)
        .output()
        .map_err(|error| format!("could not run scaffold tests: {error}"))?;
    if !output.status.success() {
        return successful(output, "generated resource route test");
    }
    let test_output = String::from_utf8_lossy(&output.stdout);
    if !test_output.contains("3 passed")
        || !test_output.contains("registered_resource_requires_a_core_session")
        || !test_output.contains("registered_resource_checks_permission_and_owner_scope")
        || !test_output.contains("registered_resource_mutations_require_csrf_and_complete_crud")
    {
        return Err(format!(
            "generated app did not run all resource tests:\n{test_output}{}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }
    Ok(())
}

fn run_cli(directory: &Path, arguments: &[&str]) -> Result<(), String> {
    let output = Command::new(env!("CARGO_BIN_EXE_feluqa"))
        .args(arguments)
        .current_dir(directory)
        .output()
        .map_err(|error| format!("could not run `feluqa {}`: {error}", arguments.join(" ")))?;
    successful(output, &format!("feluqa {}", arguments.join(" ")))
}

fn successful(output: Output, action: &str) -> Result<(), String> {
    if output.status.success() {
        return Ok(());
    }
    Err(format!(
        "{action} failed ({}):\n{}{}",
        output.status,
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    ))
}
