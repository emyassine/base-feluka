#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa_cli;
extern crate std;

use std::iter::Iterator;
use std::process::ExitCode;

fn main() -> ExitCode {
    feluqa_cli::run_cli("nadim", std::env::args_os().skip(1))
}
