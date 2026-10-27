#![no_implicit_prelude]

use crate::std::println;
use crate::std::process::ExitCode;

pub(crate) fn run() -> ExitCode {
    println!("feluqa {}", env!("CARGO_PKG_VERSION"));
    ExitCode::SUCCESS
}
