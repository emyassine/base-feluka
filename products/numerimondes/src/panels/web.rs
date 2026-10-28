#![no_implicit_prelude]

use crate::app::services::panel::PanelState;
use crate::axum::Router;
use crate::feluqa;
use crate::std::path::PathBuf;

/// Build the composed Numerimondes panel and site application.
pub fn router(state: PanelState) -> Router {
    let panels = crate::app::routes::routes()
        .merge(crate::modules::system::routes::routes())
        .merge(crate::modules::business::routes::routes())
        .merge(crate::modules::live::routes(&state));
    let panels = if state
        .active_modules
        .iter()
        .any(|module| module == "numerimondes.crm")
    {
        panels.merge(crate::modules::crm::routes::routes())
    } else {
        panels
    };
    feluqa::web::public_assets(
        panels,
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("public/assets"),
    )
    .with_state(state)
    .layer(crate::axum::extract::DefaultBodyLimit::max(16 * 1024))
}
