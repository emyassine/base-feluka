#![no_implicit_prelude]

use crate::feluqa;
use crate::std::result::Result;

pub use feluqa::system_panel::resource;

pub use feluqa::system_panel::SystemPanelProvider as CorePanelProvider;
pub mod controllers;
pub mod routes;

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
