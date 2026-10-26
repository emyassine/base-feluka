#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate alloc;
extern crate core;

use alloc::string::String;
use alloc::string::ToString;
use core::fmt;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::write;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Command {
    Dev,
    Help,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnknownCommand {
    name: String,
}

impl UnknownCommand {
    pub fn name(&self) -> &str {
        &self.name
    }
}

impl fmt::Display for UnknownCommand {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "unknown command `{}`", self.name)
    }
}

impl core::error::Error for UnknownCommand {}

impl Command {
    pub fn parse(command: Option<&str>) -> Result<Self, UnknownCommand> {
        match command {
            None | Some("dev") => Ok(Self::Dev),
            Some("help" | "--help" | "-h") => Ok(Self::Help),
            Some(name) => Err(UnknownCommand {
                name: name.to_string(),
            }),
        }
    }
}
