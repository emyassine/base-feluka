#![no_implicit_prelude]
#![forbid(unsafe_code)]

use crate::feluqa;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use feluqa::panel::{Panel, PanelCatalog, PanelCatalogError};

pub mod business;
pub mod pages;
pub mod resources;
pub mod runtime;
pub mod web;

/// The product's panel composition: platform controls plus business workspaces.
pub fn declaration(business: Panel) -> Result<PanelCatalog, PanelCatalogError> {
    let mut panels = PanelCatalog::default();
    panels.register_provider(&feluqa::system_panel::SystemPanelProvider)?;
    panels.register_panel(business)?;
    Ok(panels)
}
