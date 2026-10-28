#![no_implicit_prelude]

use crate::feluqa;
use crate::std::boxed::Box;
use crate::std::error::Error;
use crate::std::format;
use crate::std::io;
use crate::std::result::Result;
use crate::std::result::Result::Err;
use crate::std::result::Result::Ok;
use feluqa::database::DatabasePools;

pub mod demo_customers;

/// Run an explicitly registered CRM seeder by stable identifier.
pub async fn run(pools: &DatabasePools, id: &str) -> Result<(), Box<dyn Error>> {
    run_on_connections(
        pools,
        id,
        crate::generated_migrations::crm::MIGRATIONS.connections,
    )
    .await
}

/// Run an explicitly registered CRM seeder on a module's declared connection set.
pub async fn run_on_connections(
    pools: &DatabasePools,
    id: &str,
    connections: &[&str],
) -> Result<(), Box<dyn Error>> {
    match id {
        demo_customers::ID => {
            if connections.is_empty() {
                return Err(Box::new(io::Error::new(
                    io::ErrorKind::InvalidInput,
                    "CRM seeder needs at least one database connection",
                )));
            }
            for connection in connections {
                let database = pools.get(connection).ok_or_else(|| {
                    io::Error::new(
                        io::ErrorKind::NotFound,
                        format!("CRM seeder requires missing database connection `{connection}`"),
                    )
                })?;
                demo_customers::run(database).await?;
            }
            Ok(())
        }
        _ => Err(Box::new(io::Error::new(
            io::ErrorKind::NotFound,
            "unknown CRM seeder ID",
        ))),
    }
}
