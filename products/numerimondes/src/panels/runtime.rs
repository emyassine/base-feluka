#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

use crate::feluqa;
use crate::std;
use crate::std::boxed::Box;
use crate::std::clone::Clone;
use crate::std::convert::{From, Into};
use crate::std::default::Default;
use crate::std::error::Error;
use crate::std::format;
use crate::std::iter::Iterator;
use crate::std::matches;
use crate::std::net::SocketAddr;
use crate::std::option::Option::{None, Some};
use crate::std::result::Result::{self, Err, Ok};
use crate::std::str::FromStr;
use crate::std::string::String;
use crate::std::vec::Vec;

/// Compiled application views, generated from the declared view roots.
pub(crate) mod generated_views {
    include!(concat!(env!("OUT_DIR"), "/views.rs"));
}

#[path = "runtime/console.rs"]
pub mod console;
#[path = "runtime/state.rs"]
pub(crate) mod state;

/// SQL migrations embedded in this application at compile time.
pub(crate) mod generated_migrations {
    include!(concat!(env!("OUT_DIR"), "/migrations.rs"));
}

/// Runtime representation of a statically linked module and its migration set.
pub(crate) struct CompiledModule {
    id: String,
    dependencies: Vec<String>,
    migrations: &'static feluqa::database::ModuleMigrations,
    started: bool,
}

impl CompiledModule {
    /// Construct a lifecycle module backed by its compiled migrations.
    pub(crate) fn new(
        id: &str,
        dependencies: Vec<String>,
        migrations: &'static feluqa::database::ModuleMigrations,
    ) -> Self {
        Self {
            id: String::from(id),
            dependencies,
            migrations,
            started: false,
        }
    }
}

impl feluqa::module::Module for CompiledModule {
    fn id(&self) -> &str {
        &self.id
    }

    fn dependencies(&self) -> &[String] {
        &self.dependencies
    }

    fn start(&mut self) -> Result<(), String> {
        self.migrations
            .validate()
            .map_err(|error| format!("module migration contract is invalid: {error}"))?;
        self.started = true;
        Ok(())
    }

    fn stop(&mut self) -> Result<(), String> {
        self.started = false;
        Ok(())
    }
}

/// Compose the enabled static modules in dependency order.
pub(crate) fn lifecycle_runtime(
    enabled_modules: &[String],
) -> Result<feluqa::module::ModuleRuntime, feluqa::module::LifecycleError> {
    let mut runtime = feluqa::module::ModuleRuntime::default();
    for module in enabled_modules {
        match module.as_str() {
            "numerimondes.crm" => feluqa::module::ServiceProvider::register(
                &crate::panels::business::crm::providers::CrmServiceProvider,
                &mut runtime,
            )?,
            _ => {
                return Err(feluqa::module::LifecycleError::UnknownModule(module.clone()));
            }
        }
    }
    Ok(runtime)
}

/// Select migration bundles declared by enabled application modules.
pub(crate) fn enabled_migrations<'a>(
    enabled_modules: &'a [String],
) -> impl crate::std::iter::Iterator<Item = &'static feluqa::database::ModuleMigrations> + 'a {
    generated_migrations::ALL.iter().copied().filter(move |module| {
        enabled_modules
            .iter()
            .any(|enabled| enabled == module.module)
    })
}

pub async fn run(catalog: feluqa::panel::PanelCatalog) -> Result<(), Box<dyn Error>> {
    let Some(command) = console::run()? else {
        return Ok(());
    };
    let project_directory = std::path::Path::new(env!("CARGO_MANIFEST_DIR"));
    let config = feluqa::application::ApplicationSettings::load_from(project_directory)?;
    let mut module_runtime = crate::panels::runtime::lifecycle_runtime(&config.modules.enabled)?;
    if matches!(&command, console::RuntimeCommand::Seed(_))
        && !config
            .modules
            .enabled
            .iter()
            .any(|enabled| enabled == "numerimondes.crm")
    {
        return Err("cannot seed CRM because module `numerimondes.crm` is disabled".into());
    }
    let database_source = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("config/database.toml"),
    )?;
    let mut database_settings = feluqa::database::DatabaseSettings::from_toml(&database_source)?;
    database_settings.resolve_relative_paths(std::path::Path::new(env!("CARGO_MANIFEST_DIR")));
    let databases = feluqa::database::DatabasePools::connect(&database_settings).await?;
    let should_migrate = matches!(&command, console::RuntimeCommand::Migrate)
        || (matches!(&command, console::RuntimeCommand::Dev)
            && config.runtime.environment == "development");
    if should_migrate {
        let core_migrations = feluqa::database::MigrationRunner::run_module(
            &databases,
            "default",
            &feluqa::core::MIGRATIONS,
        )
        .await?;
        crate::std::println!("Applied {} Feluqa Core migration(s)", core_migrations.len());
        for module in crate::panels::runtime::enabled_migrations(&config.modules.enabled) {
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
    if matches!(&command, console::RuntimeCommand::Migrate) {
        return Ok(());
    }
    if let console::RuntimeCommand::Seed(id) = &command {
        crate::panels::business::crm::seeders::run(&databases, &id).await?;
        crate::std::println!("Completed registered seeder `{id}`");
        return Ok(());
    }
    module_runtime.start()?;
    let active_modules = module_runtime.started_modules().to_vec();
    let core = feluqa::core::service::CoreStore::new(databases.default_connection()?.clone())?;
    let panel_state = crate::panels::runtime::state::PanelState::new(
        core,
        databases.default_connection()?.clone(),
        databases.clone(),
        catalog,
        None,
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
