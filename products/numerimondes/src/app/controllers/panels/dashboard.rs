#![no_implicit_prelude]

use super::*;

/// Render `/system` only for an authenticated identity with its exact Core grant.
pub async fn system_dashboard(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    match protected_registered_page(&state, &headers, "/system").await {
        Ok(Some((identity, _))) => render_dashboard(&identity, &headers, true),
        Ok(None) => Redirect::to("/system/login").into_response(),
        Err(status) => status.into_response(),
    }
}

/// Render the ERP workspace only for an authenticated identity with its business grant.
pub async fn business_dashboard(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    match protected_registered_page(&state, &headers, "/admin").await {
        Ok(Some((identity, _))) => render_dashboard(&identity, &headers, false),
        Ok(None) => Redirect::to("/system/login").into_response(),
        Err(status) => status.into_response(),
    }
}

/// Render a page declared by an application module after resolving its exact permission.
pub async fn registered_panel_page(
    State(state): State<PanelState>,
    headers: HeaderMap,
    OriginalUri(uri): OriginalUri,
) -> Response {
    let path = uri.path();
    let (_, _, page) = match registered_page_access(&state, &headers, path).await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let mut response = Html(String::from(page.as_str())).into_response();
    response.headers_mut().insert(
        HeaderName::from_static("cache-control"),
        HeaderValue::from_static("no-store"),
    );
    response
}
