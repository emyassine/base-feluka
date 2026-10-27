use crate::feluqa;
use crate::std::result::Result;

/// The selected application composition root referenced by `feluqa.toml`.
///
/// Add providers here to register modules, panels, routes and commands. Rust keeps
/// these registrations statically linked and checks every provider at compile time.
pub fn panel_catalog() -> Result<feluqa::panel::PanelCatalog, feluqa::panel::PanelCatalogError> {
    crate::modules::panel_catalog()
}
