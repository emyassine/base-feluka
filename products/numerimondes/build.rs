#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate feluqa_build;
extern crate std;

use feluqa::view::compiler::Compiler;
use std::boxed::Box;
use std::convert::From;
use std::env;
use std::error::Error;
use std::path::{Path, PathBuf};
use std::println;
use std::result::Result::{self, Ok};

fn main() -> Result<(), Box<dyn Error>> {
    let project = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
    let output = PathBuf::from(env::var("OUT_DIR")?);
    let scan = feluqa_build::scan_application(&project)?;
    let target = env::var_os("CARGO_TARGET_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| project.join("../../target"));
    scan.write_manifest(&project, target, &env::var("CARGO_PKG_NAME")?)?;
    let mut compiler = Compiler::new();
    compiler.add_root("app", &project.join("resources/views"))?;
    compiler.add_root("feluqa-panel", Path::new(feluqa::panel::VIEW_ROOT))?;
    compiler.add_root("business", &project.join("src/panels/business/views"))?;
    compiler.add_root("crm", &project.join("src/panels/business/crm/views"))?;
    for view in [
        "app::pages.home",
        "app::pages.about",
        "app::layouts.main",
        "app::partials.header",
    ] {
        }
    generated.write_to(&output.join("views.rs"))?;
    feluqa::database::build_support::generate_migration_registry_from(
        &project.join("src/panels/business"),
        &output.join("migrations.rs"),
    )?;
    println!("cargo:rerun-if-changed=build.rs");
    Ok(())
}
