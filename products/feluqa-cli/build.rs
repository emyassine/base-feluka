#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa;
extern crate std;

fn main() {
    if let std::result::Result::Err(error) = feluqa::console::build::compile_profiles("src/profiles") {
        std::panic!("could not compile profile commands: {error}");
    }
}
