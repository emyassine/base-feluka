#![no_implicit_prelude]

use crate::feluqa;
use crate::std::option::Option;
use crate::std::string::String;
use crate::std::sync::Arc;
use crate::std::vec::Vec;
use feluqa::core::service::CoreStore;
use feluqa::database::{DatabasePools, orm::DatabaseConnection};
use feluqa::live::LiveRuntime;
use feluqa::panel::PanelCatalog;

/// Runtime dependencies shared by protected Core and business panel routes.
#[derive(Clone)]
pub struct PanelState {
    /// Persistent authentication and policy data store.
    pub core: CoreStore,
    /// Named default application connection used by product resources.
    pub database: DatabaseConnection,
    /// All named configured connections, for Core operations and diagnostics.
    pub pools: DatabasePools,
    /// Validated page and resource routes registered by application modules.
    pub catalog: PanelCatalog,
    /// Registered Live actions, signer and one-process replay guard.
    pub live: Option<Arc<LiveRuntime>>,
    /// Emit the Secure cookie attribute for HTTPS deployments.
    pub secure_cookies: bool,
    /// Static modules started successfully by the application lifecycle runtime.
    pub active_modules: Vec<String>,
}

impl PanelState {
    /// Construct panel state from the configured Core service and transport mode.
    pub fn new(
        core: CoreStore,
        database: DatabaseConnection,
        pools: DatabasePools,
        catalog: PanelCatalog,
        live: Option<LiveRuntime>,
        secure_cookies: bool,
    ) -> Self {
        Self {
            core,
            database,
            pools,
            catalog,
            live: live.map(Arc::new),
            secure_cookies,
            active_modules: Vec::new(),
        }
    }

    /// Attach the validated startup order used by the system modules page.
    pub fn with_active_modules(mut self, active_modules: Vec<String>) -> Self {
        self.active_modules = active_modules;
        self
    }
}
