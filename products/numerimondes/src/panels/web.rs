#![no_implicit_prelude]

use crate::panels::runtime::state::PanelState;
use crate::axum::Router;
use crate::feluqa;
use crate::std::convert::From;
use crate::std::iter::Iterator;
use crate::std::path::PathBuf;

/// Build the composed Numerimondes panel and site application.
pub fn router(state: PanelState) -> Router {
    let panels = crate::panels::site::routes::routes()
        .merge(crate::panels::system::routes::routes())
        .merge(crate::panels::business::routes::routes())
        .merge(crate::panels::system::live::routes(&state));
    let panels = if state
        .active_modules
        .iter()
        .any(|module| module == "numerimondes.crm")
    {
        panels.merge(crate::panels::business::crm::routes::routes())
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
