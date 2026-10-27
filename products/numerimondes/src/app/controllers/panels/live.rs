#![no_implicit_prelude]

use super::*;
use crate::feluqa;

/// Issue a short-lived Live snapshot for one registered action.
pub async fn live_snapshot(
    State(state): State<PanelState>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Path(action): Path<String>,
    Query(query): Query<LiveSnapshotQuery>,
    headers: HeaderMap,
) -> Response {
    let Some(live) = &state.live else {
        return StatusCode::NOT_FOUND.into_response();
    };
    let Some(csrf) = cookie(&headers, CSRF_COOKIE) else {
        return StatusCode::FORBIDDEN.into_response();
    };
    let now = match unix_time_seconds() {
        Ok(value) => value,
        Err(status) => return status.into_response(),
    };
    let nonce = match SecretToken::generate() {
        Ok(value) => String::from(value.expose()),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    match live.issue_snapshot(
        &principal,
        feluqa::live::SnapshotIssue {
            session: identity.session_id,
            csrf: String::from(csrf),
            action,
            nonce,
            revision: query.revision,
            now,
            lifetime_seconds: 300,
        },
        &PermissionSetAuthorizer,
    ) {
        Ok(snapshot) => Json(snapshot).into_response(),
        Err(error) => live_error_response(error),
    }
}

/// Validate session-bound CSRF, then dispatch one typed, signed Live action.
pub async fn live_action(
    State(state): State<PanelState>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    headers: HeaderMap,
    Json(request): Json<feluqa::live::ClientActionRequest>,
) -> Response {
    let Some(live) = &state.live else {
        return StatusCode::NOT_FOUND.into_response();
    };
    if let Err(status) = feluqa::web::verify_csrf(&state.core, &headers).await {
        return status.into_response();
    }
    let Some(csrf) = headers
        .get("x-csrf-token")
        .and_then(|value| value.to_str().ok())
    else {
        return StatusCode::FORBIDDEN.into_response();
    };
    let now = match unix_time_seconds() {
        Ok(value) => value,
        Err(status) => return status.into_response(),
    };
    match live.dispatch(
        &principal,
        identity.session_id,
        String::from(csrf),
        request,
        now,
        &PermissionSetAuthorizer,
    ) {
        Ok(response) => Json(response).into_response(),
        Err(error) => live_error_response(error),
    }
}
