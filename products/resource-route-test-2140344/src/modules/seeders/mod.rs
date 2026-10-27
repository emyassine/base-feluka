#![no_implicit_prelude]

use crate::feluqa;

use feluqa::database::orm::DatabaseConnection;
use feluqa::prelude::Result;
use crate::std::boxed::Box;
use crate::std::error::Error;
use crate::std::format;
use crate::std::io::{Error as IoError, ErrorKind};
use crate::std::result::Result::Err;

#[allow(clippy::match_single_binding)]
pub async fn run(id: &str, _database: &DatabaseConnection) -> Result<(), Box<dyn Error>> {
    match id {
        _ => Err(Box::new(IoError::new(
            ErrorKind::NotFound,
            format!("seeder `{id}` is not registered"),
        ))),
    }
}
