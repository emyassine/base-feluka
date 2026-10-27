#![no_implicit_prelude]

use crate::feluqa;
use crate::std::env;
use crate::std::eprintln;
use crate::std::io;
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::println;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use feluqa::console::Command;

pub enum RuntimeCommand {
    Dev,
    Migrate,
    Seed(String),
}

pub fn run() -> Result<Option<RuntimeCommand>, io::Error> {
    let mut arguments = env::args().skip(1);
    let command = arguments.next();
    match Command::parse(command.as_deref()) {
        Ok(Command::Help) => {
            println!("Commands: dev, migrate, seed <seeder-id>, help");
            Ok(None)
        }
        Ok(Command::Dev) => Ok(Some(RuntimeCommand::Dev)),
        Ok(Command::Migrate) => Ok(Some(RuntimeCommand::Migrate)),
        Ok(Command::Seed) => match arguments.next() {
            Some(seed_id) if arguments.next().is_none() => Ok(Some(RuntimeCommand::Seed(seed_id))),
            _ => Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "usage: feluqa seed <seeder-id>",
            )),
        },
        Err(error) => {
            eprintln!("{error}");
            Err(io::Error::other(error))
        }
    }
}
