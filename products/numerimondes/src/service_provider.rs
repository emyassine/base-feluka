use crate::feluqa;
use crate::app::services::panel::PanelState;
use crate::axum::Router;
use crate::std::iter::Iterator;
use crate::std::result::Result;
use crate::std::string::String;

/// Numerimondes application composition root selected in `feluqa.toml`.
pub fn panel_catalog() -> Result<feluqa::panel::PanelCatalog, feluqa::panel::PanelCatalogError> {
    crate::modules::panel_catalog()
}

/// Compose application routes from the selected site, panel and module providers.
pub fn web_routes(state: &PanelState) -> Router<PanelState> {
    let mut routes = crate::app::routes::routes()
        .merge(crate::modules::system::routes::routes())
        .merge(crate::modules::business::routes::routes())
        .merge(crate::modules::live::routes(state));
    if state
        .active_modules
        .iter()
        .any(|module| module == "numerimondes.crm")
    {
        routes = routes.merge(crate::modules::crm::routes::routes());
    }
    routes
}

/// Register Numerimondes modules from its validated app configuration.
pub fn lifecycle_runtime(
    enabled_modules: &[String],
) -> Result<feluqa::module::ModuleRuntime, feluqa::module::LifecycleError> {
    crate::modules::lifecycle_runtime(enabled_modules)
}

/// Select migration bundles only for configured modules.
pub fn enabled_migrations<'a>(
    enabled_modules: &'a [String],
) -> impl crate::std::iter::Iterator<Item = &'static feluqa::database::ModuleMigrations> + 'a {
    crate::modules::enabled_migrations(enabled_modules)
}
