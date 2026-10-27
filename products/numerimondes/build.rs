#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

use feluqa::view::compiler::Compiler;
use std::boxed::Box;
use std::convert::From;
use std::env;
use std::error::Error;
use std::path::PathBuf;
use std::println;
use std::result::Result::{self, Ok};

fn main() -> Result<(), Box<dyn Error>> {
    let project = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
    let output = PathBuf::from(env::var("OUT_DIR")?);
    let mut compiler = Compiler::new();
    compiler.add_root("app", &project.join("resources/views"))?;
    for view in [
        "app::pages.home",
        "app::pages.about",
        "app::layouts.main",
        "app::partials.header",
    ] {
        compiler.parameters(view, "page: &crate::handlers::Page")?;
    }
    compiler.parameters(
        "app::components.section",
        "id: &str, eyebrow: &str, title: &str",
    )?;
    compiler.component(
        "site::section",
        "app::components.section",
        &["default", "actions"],
    )?;
    compiler.entry("home", "app::pages.home")?;
    compiler.entry("about", "app::pages.about")?;
    let generated = compiler.generate()?;
    for dependency in &generated.dependencies {
        println!("cargo:rerun-if-changed={}", dependency.display());
    }
    generated.write_to(&output.join("views.rs"))?;
    println!("cargo:rerun-if-changed=build.rs");
    Ok(())
}
