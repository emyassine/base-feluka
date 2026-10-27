#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

mod commands;
mod context;

use std::env;
use std::eprintln;
use std::format;
use std::iter::Iterator;
use std::process::ExitCode;
use std::result::Result::{Err, Ok};

fn main() -> ExitCode {
    match env::current_dir()
        .map_err(|error| format!("could not read current directory: {error}"))
        .and_then(|current| commands::run(env::args_os().skip(1).collect(), &current))
    {
        Ok(code) => code,
        Err(error) => {
            eprintln!("feluqa: {error}");
            ExitCode::FAILURE
        }
    }
}
