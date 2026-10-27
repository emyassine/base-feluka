#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate axum;
extern crate feluqa;
extern crate sea_orm;
extern crate serde;
extern crate serde_json;
extern crate std;
extern crate subtle;
extern crate tokio;
extern crate toml;
#[cfg(test)]
extern crate tower;
extern crate tower_http;

mod app;
mod config;
mod generated_migrations {
    include!(concat!(env!("OUT_DIR"), "/migrations.rs"));
}
mod modules;
mod routes;
mod service_provider {
    include!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/",
        env!("FELUQA_SERVICE_PROVIDER")
    ));
}
mod views;

use std::boxed::Box;
use std::clone::Clone;
use std::convert::Into;
use std::default::Default;
use std::error::Error;
use std::format;
use std::io::{Error as IoError, ErrorKind};
use std::iter::Iterator;
use std::matches;
use std::net::SocketAddr;
use std::option::Option::None;
use std::option::Option::Some;
use std::println;
use std::result::Result::{self, Err, Ok};
use std::str::FromStr;

use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let Some(command) = routes::console::run()? else {
        return Ok(());
    };
    let catalog = service_provider::panel_catalog()?;
    let config = config::AppConfig::load_default()?;
    let mut module_runtime = service_provider::lifecycle_runtime(&config.modules.enabled)?;
    if matches!(&command, routes::console::RuntimeCommand::Seed(_))
        && !config
            .modules
            .enabled
            .iter()
            .any(|enabled| enabled == "numerimondes.crm")
    {
        return Err("cannot seed CRM because module `numerimondes.crm` is disabled".into());
    }
    let live_runtime = if config.security.live_enabled {
        Some(modules::live::runtime(config.live_signing_key()?)?)
    } else {
        None
    };
    let database_source = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("config/database.toml"),
    )?;
    let mut database_settings = feluqa::database::DatabaseSettings::from_toml(&database_source)?;
    database_settings.resolve_relative_paths(std::path::Path::new(env!("CARGO_MANIFEST_DIR")));
    let databases = feluqa::database::DatabasePools::connect(&database_settings).await?;
    let should_migrate = matches!(&command, routes::console::RuntimeCommand::Migrate)
        || (matches!(&command, routes::console::RuntimeCommand::Dev)
            && config.runtime.environment == "development");
    if should_migrate {
        let core_migrations = feluqa::database::MigrationRunner::run_module(
            &databases,
            "default",
            &feluqa::core::MIGRATIONS,
        )
        .await?;
        println!("Applied {} Feluqa Core migration(s)", core_migrations.len());
        for module in service_provider::enabled_migrations(&config.modules.enabled) {
            for (connection, applied) in
                feluqa::database::MigrationRunner::run_declared(&databases, module).await?
            {
                println!(
                    "Applied {} migration(s) for {} on {}",
                    applied.len(),
                    module.module,
                    connection
                );
            }
        }
    }
    if matches!(&command, routes::console::RuntimeCommand::Migrate) {
        return Ok(());
    }
    if let routes::console::RuntimeCommand::Seed(id) = &command {
        modules::crm::seeders::run(&databases, id).await?;
        println!("Completed registered seeder `{id}`");
        return Ok(());
    }
    module_runtime.start()?;
    let active_modules = module_runtime.started_modules().to_vec();
    let core = feluqa::core::service::CoreStore::new(databases.default_connection()?.clone())?;
    let panel_state = app::services::panel::PanelState::new(
        core,
        databases.default_connection()?.clone(),
        databases.clone(),
        catalog,
        live_runtime,
        config.security.secure_cookies,
    )
    .with_active_modules(active_modules);
    let address = SocketAddr::from_str(&format!("{}:{}", config.app.host, config.app.port))?;
    let listener = TcpListener::bind(address)
        .await
        .map_err(|error| listener_bind_error(address, error))?;
    let router = routes::web::routes(panel_state);

    println!(
        "{} ({}) listening on http://{}",
        config.app.name, config.app.profile, address
    );
    let serve_result = axum::serve(listener, router)
        .with_graceful_shutdown(shutdown_signal())
        .await;
    let shutdown_result = module_runtime.shutdown();
    serve_result?;
    shutdown_result?;
    Ok(())
}

fn listener_bind_error(address: SocketAddr, error: IoError) -> IoError {
    let message = if error.kind() == ErrorKind::AddrInUse {
        format!(
            "Feluqa cannot start at http://{address}: port {} is already in use. Stop the process using that port or change `app.port` in config/app.toml.",
            address.port()
        )
    } else {
        format!("Feluqa cannot bind to http://{address}: {error}")
    };
    IoError::new(error.kind(), message)
}

#[cfg(test)]
mod listener_tests {
    use super::listener_bind_error;
    use crate::std::assert;
    use crate::std::io::{Error as IoError, ErrorKind};
    use crate::std::net::SocketAddr;
    use crate::std::str::FromStr;
    use crate::std::string::ToString;

    #[test]
    fn port_conflict_reports_the_full_address_and_config_key() {
        let address = SocketAddr::from_str("127.0.0.1:38127").expect("valid socket address");
        let error = IoError::new(ErrorKind::AddrInUse, "address in use");
        let message = listener_bind_error(address, error).to_string();

        assert!(message.contains("http://127.0.0.1:38127"));
        assert!(message.contains("port 38127 is already in use"));
        assert!(message.contains("app.port"));
    }
}

#[cfg(unix)]
async fn shutdown_signal() {
    let control_c = tokio::signal::ctrl_c();
    match tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()) {
        Ok(mut terminate) => {
            tokio::select! {
                _ = control_c => {},
                _ = terminate.recv() => {},
            }
        }
        Err(_) => {
            let _signal_result = control_c.await;
        }
    }
}

#[cfg(not(unix))]
async fn shutdown_signal() {
    let _signal_result = tokio::signal::ctrl_c().await;
}

#[cfg(test)]
#[path = "../tests/support/app.rs"]
mod app_tests;
