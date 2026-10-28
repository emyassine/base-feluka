#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::vec;
use feluqa::panel::{PanelCatalog, PanelCatalogError, PanelProvider};

/// Provider for CRM's permission-checked customer resource.
pub struct CrmPanelProvider;
impl PanelProvider for CrmPanelProvider {
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {
        catalog.register_resource(super::resource::CUSTOMERS)
    }
}

/// Registers CRM's migrations and its dependency on Feluqa Core.
pub struct CrmServiceProvider;
impl feluqa::module::ServiceProvider<feluqa::module::ModuleRuntime> for CrmServiceProvider {
    type Error = feluqa::module::LifecycleError;
    fn id(&self) -> &str {
        "numerimondes.crm"
    }
    fn register(&self, runtime: &mut feluqa::module::ModuleRuntime) -> Result<(), Self::Error> {
        runtime.register(crate::panels::runtime::CompiledModule::new(
            "numerimondes.crm",
            vec![String::from("feluqa.core")],
            &crate::panels::runtime::generated_migrations::crm::MIGRATIONS,
        ))
    }
}
