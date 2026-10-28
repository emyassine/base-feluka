#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

use crate::feluqa;
use crate::std;
use crate::std::boxed::Box;
use crate::std::error::Error;
use crate::std::format;
use crate::std::iter::Iterator;
use crate::std::matches;
use crate::std::net::SocketAddr;
use crate::std::result::Result::{self, Err, Ok};
use crate::std::str::FromStr;

pub async fn run(catalog: feluqa::panel::PanelCatalog) -> Result<(), Box<dyn Error>> {
    let Some(command) = crate::routes::console::run()? else {
        return Ok(());
    };
    let project_directory = std::path::Path::new(env!("CARGO_MANIFEST_DIR"));
    let config = feluqa::application::ApplicationSettings::load_from(project_directory)?;
    let mut module_runtime = crate::modules::lifecycle_runtime(&config.modules.enabled)?;
    if matches!(&command, crate::routes::console::RuntimeCommand::Seed(_))
        && !config
            .modules
            .enabled
            .iter()
            .any(|enabled| enabled == "numerimondes.crm")
    {
        return Err("cannot seed CRM because module `numerimondes.crm` is disabled".into());
    }
    let live_runtime = if config.security.live_enabled {
        Some(crate::modules::live::runtime(config.live_signing_key()?)?)
    } else {
        None
    };
    let database_source = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("config/database.toml"),
    )?;
    let mut database_settings = feluqa::database::DatabaseSettings::from_toml(&database_source)?;
    database_settings.resolve_relative_paths(std::path::Path::new(env!("CARGO_MANIFEST_DIR")));
    let databases = feluqa::database::DatabasePools::connect(&database_settings).await?;
    let should_migrate = matches!(&command, crate::routes::console::RuntimeCommand::Migrate)
        || (matches!(&command, crate::routes::console::RuntimeCommand::Dev)
            && config.runtime.environment == "development");
    if should_migrate {
        let core_migrations = feluqa::database::MigrationRunner::run_module(
            &databases,
            "default",
            &feluqa::core::MIGRATIONS,
        )
        .await?;
        crate::std::println!("Applied {} Feluqa Core migration(s)", core_migrations.len());
        for module in crate::modules::enabled_migrations(&config.modules.enabled) {
            for (connection, applied) in
                feluqa::database::MigrationRunner::run_declared(&databases, module).await?
            {
                crate::std::println!(
                    "Applied {} migration(s) for {} on {}",
                    applied.len(),
                    module.module,
                    connection
                );
            }
        }
    }
    if matches!(&command, crate::routes::console::RuntimeCommand::Migrate) {
        return Ok(());
    }
    if let crate::routes::console::RuntimeCommand::Seed(id) = &command {
        crate::modules::crm::seeders::run(&databases, id).await?;
        crate::std::println!("Completed registered seeder `{id}`");
        return Ok(());
    }
    module_runtime.start()?;
    let active_modules = module_runtime.started_modules().to_vec();
    let core = feluqa::core::service::CoreStore::new(databases.default_connection()?.clone())?;
    let panel_state = crate::app::services::panel::PanelState::new(
        core,
        databases.default_connection()?.clone(),
        databases.clone(),
        catalog,
        live_runtime,
        config.security.secure_cookies,
    )
    .with_active_modules(active_modules);
    let address = SocketAddr::from_str(&format!("{}:{}", config.app.host, config.app.port))?;
    let router = crate::panels::web::router(panel_state);
    let serve_result =
        feluqa::web::serve(router, address, &config.app.name, &config.app.profile).await;
    let shutdown_result = module_runtime.shutdown();
    serve_result?;
    shutdown_result?;
    Ok(())
}
