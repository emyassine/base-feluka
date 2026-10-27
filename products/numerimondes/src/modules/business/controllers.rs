#![no_implicit_prelude]

use crate::app::services::panel::PanelState;
use crate::axum::extract::State;
use crate::axum::http::HeaderMap;
use crate::axum::response::{IntoResponse, Redirect, Response};
use crate::modules::system::controllers::{protected_registered_page, render_dashboard};
use crate::std::option::Option::{None, Some};
use crate::std::result::Result::{Err, Ok};

/// Render the business workspace using the exact grant registered on its panel page.
pub async fn dashboard(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    match protected_registered_page(&state, &headers, "/admin").await {
        Ok(Some((identity, _))) => render_dashboard(&state, &identity, &headers, false).await,
        Ok(None) => Redirect::to("/system/login").into_response(),
        Err(status) => status.into_response(),
    }
}
