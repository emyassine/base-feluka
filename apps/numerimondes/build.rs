#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa;
extern crate std;

use std::convert::From;
use std::env;
use std::fs;
use std::io::Write;
use std::iter::Iterator;
use std::panic;
use std::path::PathBuf;
use std::println;
use std::string::String;
use std::vec::Vec;

fn main() {
    let manifest_dir = PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").expect("manifest dir"));
    let view_dir = manifest_dir.join("resources/views");
    let mut paths = fs::read_dir(&view_dir)
        .expect("read resources/views")
        .map(|entry| entry.expect("view directory entry").path())
        .filter(|path| {
            path.extension()
                .is_some_and(|extension| extension == "view")
        })
        .collect::<Vec<_>>();
    paths.sort();

    let mut generated = String::new();
    for path in paths {
        println!("cargo:rerun-if-changed={}", path.display());
        let source = fs::read_to_string(&path).expect("read view source");
        let function_name = path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .expect("view filename must be valid UTF-8");
        let valid_identifier = function_name.chars().enumerate().all(|(index, character)| {
            character == '_'
                || character.is_ascii_alphabetic()
                || index > 0 && character.is_ascii_digit()
        });
        if !valid_identifier || function_name.is_empty() {
            panic!(
                "view filename must form a Rust identifier: {}",
                path.display()
            );
        }
        let compiled = feluqa::view::generate_rust(&source, function_name)
            .unwrap_or_else(|error| panic!("invalid view {}: {error}", path.display()));
        generated.push_str(&compiled);
    }
    let output_dir = PathBuf::from(env::var_os("OUT_DIR").expect("OUT_DIR"));
    let mut output = fs::File::create(output_dir.join("views.rs")).expect("create generated views");
    output
        .write_all(generated.as_bytes())
        .expect("write generated views");
    println!("cargo:rerun-if-changed=build.rs");
}
