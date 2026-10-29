#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa;
extern crate std;

// Root used to resolve each Profile::commands_directory.
const SOURCE_ROOT: &str = "src";
// Rust file containing the PROFILES declaration.
const PROFILE_SOURCE: &str = "src/main.rs";

fn main() {
    if let std::result::Result::Err(error) =
        feluqa::console::build::compile_profiles_from_source(SOURCE_ROOT, PROFILE_SOURCE)
    {
        std::panic!("could not compile profile commands: {error}");
    }
}
