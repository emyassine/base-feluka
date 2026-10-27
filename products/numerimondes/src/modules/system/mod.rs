#![no_implicit_prelude]

use crate::feluqa;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use feluqa::panel::{PanelCatalog, PanelCatalogError, PanelProvider};

pub mod resource;

/// Provider for Feluqa Core's system panel and administration resources.
pub struct CorePanelProvider;
impl PanelProvider for CorePanelProvider {
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {
        catalog.register_panel(crate::modules::system_panel()?)?;
        catalog.register_resource(resource::USERS)?;
        catalog.register_resource(resource::ROLES)?;
        catalog.register_resource(resource::MODULES)?;
        catalog.register_resource(resource::CONNECTIONS)?;
        catalog.register_resource(resource::MIGRATIONS)?;
        catalog.register_resource(resource::AUDIT)?;
        catalog.register_resource(resource::TENANTS)?;
        Ok(())
    }
}

/// Registers Feluqa Core's compiled migration and lifecycle participant.
pub struct CoreServiceProvider;
impl feluqa::module::ServiceProvider<feluqa::module::ModuleRuntime> for CoreServiceProvider {
    type Error = feluqa::module::LifecycleError;
    fn id(&self) -> &str {
        "feluqa.core"
    }
    fn register(&self, runtime: &mut feluqa::module::ModuleRuntime) -> Result<(), Self::Error> {
        runtime.register(crate::modules::CompiledModule::new(
            "feluqa.core",
            crate::std::vec![],
            &feluqa::core::MIGRATIONS,
        ))
    }
}
