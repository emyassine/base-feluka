#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;

use crate::app::controllers::system::cookie;
use crate::axum::extract::Extension;
use feluqa::auth::{PermissionSetAuthorizer, Principal};
use feluqa::core::service::{CoreStore, SessionIdentity};
use feluqa::core::store::SecretToken;
use feluqa::live::{LiveError, LiveRuntime, SnapshotIssue};
use feluqa::prelude::*;
use crate::std::convert::From;
use crate::std::option::Option;
use crate::std::option::Option::Some;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::sync::Arc;
use crate::std::time::{SystemTime, UNIX_EPOCH};

const CSRF_COOKIE: &str = "feluqa_csrf";

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SnapshotQuery {
    revision: u64,
}

/// Issue a short-lived action snapshot bound to the authenticated session and CSRF token.
pub(crate) async fn snapshot(
    Extension(live): Extension<Option<Arc<LiveRuntime>>>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Path(action): Path<String>,
    Query(query): Query<SnapshotQuery>,
    headers: HeaderMap,
) -> Response {
    let Some(live) = live else {
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
        SnapshotIssue {
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

/// Verify the session CSRF token, then dispatch the signed typed action once.
pub(crate) async fn action(
    Extension(live): Extension<Option<Arc<LiveRuntime>>>,
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    headers: HeaderMap,
    Json(request): Json<feluqa::live::ClientActionRequest>,
) -> Response {
    let Some(live) = live else {
        return StatusCode::NOT_FOUND.into_response();
    };
    if let Err(status) = feluqa::web::verify_csrf(&core, &headers).await {
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

fn unix_time_seconds() -> Result<u64, StatusCode> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|value| value.as_secs())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

fn live_error_response(error: LiveError) -> Response {
    let status = match error {
        LiveError::Forbidden | LiveError::InvalidSignature | LiveError::InvalidSnapshot => {
            StatusCode::FORBIDDEN
        }
        LiveError::Replay | LiveError::RevisionOverflow => StatusCode::CONFLICT,
        LiveError::UnknownAction => StatusCode::NOT_FOUND,
        LiveError::PayloadTooLarge | LiveError::ActionOutputTooLarge | LiveError::TokenTooLarge => {
            StatusCode::PAYLOAD_TOO_LARGE
        }
        LiveError::ReplayStoreFull | LiveError::ReplayStoreUnavailable => {
            StatusCode::SERVICE_UNAVAILABLE
        }
        LiveError::InvalidActionInput => StatusCode::UNPROCESSABLE_ENTITY,
        LiveError::ActionFailed | LiveError::InvalidActionOutput => {
            StatusCode::INTERNAL_SERVER_ERROR
        }
        LiveError::WeakSigningKey
        | LiveError::InvalidReplayCapacity
        | LiveError::InvalidActionId
        | LiveError::InvalidPermission
        | LiveError::DuplicateAction
        | LiveError::RequestBindingMismatch => StatusCode::FORBIDDEN,
    };
    status.into_response()
}
