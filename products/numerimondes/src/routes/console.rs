#![no_implicit_prelude]

use crate::std::env;
use crate::std::eprintln;
use crate::std::format;
use crate::std::io;
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::println;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;

pub enum RuntimeCommand {
    Dev,
    Migrate,
    Seed(String),
}

pub fn run() -> Result<Option<RuntimeCommand>, io::Error> {
    let mut arguments = env::args().skip(1);
    let command = arguments.next();
    match command.as_deref() {
        None | Some("help") | Some("--help") | Some("-h") => {
            println!("Commands: dev, migrate, seed <seeder-id>, help");
            Ok(None)
        }
        Some("dev") => Ok(Some(RuntimeCommand::Dev)),
        Some("migrate") => Ok(Some(RuntimeCommand::Migrate)),
        Some("seed") => match arguments.next() {
            Some(seed_id) if arguments.next().is_none() => Ok(Some(RuntimeCommand::Seed(seed_id))),
            _ => Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "usage: feluqa seed <seeder-id>",
            )),
        },
        Some(unknown) => {
            let error = format!("unknown command `{unknown}`; use `help` to list commands");
            eprintln!("{error}");
            Err(io::Error::other(error))
        }
    }
}
