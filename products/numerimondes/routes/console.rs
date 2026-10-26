#![no_implicit_prelude]

use crate::feluqa::console::Command;
use crate::std::env;
use crate::std::eprintln;
use crate::std::io;
use crate::std::iter::Iterator;
use crate::std::println;
use crate::std::result::Result::{self, Err, Ok};

pub fn run() -> Result<bool, io::Error> {
    let command = env::args().nth(1);
    match Command::parse(command.as_deref()) {
        Ok(Command::Help) => {
            println!("Commands: dev, help");
            Ok(false)
        }
        Ok(Command::Dev) => Ok(true),
        Err(error) => {
            eprintln!("{error}");
            Err(io::Error::other(error))
        }
    }
}
