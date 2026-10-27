#![no_implicit_prelude]

use crate::app::controllers::site;
use crate::app::services::panel::PanelState;
use crate::axum::Router;
use crate::feluqa::web::Route;

/// Routes owned by the public Numerimondes website.
pub fn routes() -> Router<PanelState> {
    Route::<PanelState>::new()
        .get(
            crate::feluqa::panel::LIVE_CLIENT_PATH,
            crate::feluqa::web::serve_live_client,
        )
        .get(
            "/assets/feluqa/{asset}",
            crate::feluqa::web::serve_panel_asset,
        )
        .get("/", site::home)
        .get("/about", site::about)
        .finish()
}
