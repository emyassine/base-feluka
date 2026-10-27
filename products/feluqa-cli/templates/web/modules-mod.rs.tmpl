#![no_implicit_prelude]

use crate::feluqa;

use feluqa::panel::{Panel, PanelCatalog, PanelCatalogError, PanelKind, PanelProvider};
use feluqa::prelude::{Default, Result};
use crate::std::result::Result::Ok;

pub mod seeders;
pub mod live;
pub mod system;

pub struct AppPanelProvider;
impl PanelProvider for AppPanelProvider {
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {
        catalog.register_provider(&system::CorePanelProvider)?;
        catalog.register_panel(Panel::single_page(
            "feluqa-erp", "ERP Workspace", "/admin", PanelKind::Business,
            "business.erp.manage", "ERP modules will appear here",
        )?)?;
        Ok(())
    }
}

pub fn panel_catalog() -> Result<PanelCatalog, PanelCatalogError> {
    let mut catalog = PanelCatalog::default();
    catalog.register_provider(&AppPanelProvider)?;
    Ok(catalog)
}
