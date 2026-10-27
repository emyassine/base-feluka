#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa;
extern crate std;

#[path = "src/profiles.rs"]
mod profiles;

fn main() {
    if let std::result::Result::Err(error) =
        feluqa::console::build::compile_profiles("src", profiles::PROFILES)
    {
        std::panic!("could not compile profile commands: {error}");
    }
}
