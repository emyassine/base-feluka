#![no_implicit_prelude]

use super::controllers;
use crate::panels::runtime::state::PanelState;
use crate::axum::Router;
use crate::feluqa::web::Route;
use crate::panels::system::controllers as system_controllers;

/// Routes owned by Numerimondes' business panel.
pub fn routes() -> Router<PanelState> {
    Route::<PanelState>::new()
        .get("/admin", controllers::dashboard)
        .get("/admin/{*path}", system_controllers::registered_panel_page)
        .finish()
}
