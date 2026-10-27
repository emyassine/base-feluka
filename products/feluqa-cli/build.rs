#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate std;

use std::convert::From;
use std::env;
use std::ffi::OsStr;
use std::fmt::Write;
use std::fs;
use std::option::Option::Some;
use std::path::{Path, PathBuf};
use std::println;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;

fn main() {
    if let Err(error) = generate() {
        std::panic!("could not generate CLI command modules: {error}");
    }
}

fn generate() -> Result<(), String> {
    let manifest = PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").ok_or("CARGO_MANIFEST_DIR is missing")?);
    let profile_root = manifest.join("src/profiles");
    let output = PathBuf::from(env::var_os("OUT_DIR").ok_or("OUT_DIR is missing")?).join("profile_commands.rs");
    println!("cargo:rerun-if-changed={}", profile_root.display());
    let mut files = Vec::new();
    collect_rust_files(&profile_root, &mut files)?;
    files.sort();
    let mut generated = String::new();
    for file in files {
        let relative = file.strip_prefix(&profile_root).map_err(|error| error.to_string())?;
        let module = module_name(relative);
        println!("cargo:rerun-if-changed={}", file.display());
        std::writeln!(&mut generated, "#[path = {:?}] mod {module};", file).map_err(|error| error.to_string())?;
    }
    fs::write(output, generated).map_err(|error| error.to_string())
}

fn collect_rust_files(directory: &Path, files: &mut Vec<PathBuf>) -> Result<(), String> {
    if !directory.exists() { return Ok(()); }
    for entry in fs::read_dir(directory).map_err(|error| error.to_string())? {
        let path = entry.map_err(|error| error.to_string())?.path();
        if path.is_dir() {
            collect_rust_files(&path, files)?;
        } else if path.extension() == Some(OsStr::new("rs")) {
            files.push(path);
        }
    }
    Ok(())
}

fn module_name(path: &Path) -> String {
    let mut name = String::from("__feluqa_command");
    for component in path.components() {
        name.push('_');
        for character in component.as_os_str().to_string_lossy().chars() {
            name.push(if character.is_ascii_alphanumeric() { character.to_ascii_lowercase() } else { '_' });
        }
    }
    name
}
