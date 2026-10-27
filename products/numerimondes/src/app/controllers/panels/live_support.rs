#![no_implicit_prelude]

use super::*;

pub(super) fn live_error_response(error: feluqa::live::LiveError) -> Response {
    let status = match error {
        feluqa::live::LiveError::Forbidden => StatusCode::FORBIDDEN,
        feluqa::live::LiveError::Replay | feluqa::live::LiveError::RevisionOverflow => {
            StatusCode::CONFLICT
        }
        feluqa::live::LiveError::UnknownAction => StatusCode::NOT_FOUND,
        feluqa::live::LiveError::PayloadTooLarge
        | feluqa::live::LiveError::ActionOutputTooLarge
        | feluqa::live::LiveError::TokenTooLarge => StatusCode::PAYLOAD_TOO_LARGE,
        feluqa::live::LiveError::ReplayStoreFull
        | feluqa::live::LiveError::ReplayStoreUnavailable => StatusCode::SERVICE_UNAVAILABLE,
        feluqa::live::LiveError::ActionFailed | feluqa::live::LiveError::InvalidActionOutput => {
            StatusCode::INTERNAL_SERVER_ERROR
        }
        feluqa::live::LiveError::InvalidActionInput => StatusCode::UNPROCESSABLE_ENTITY,
        feluqa::live::LiveError::WeakSigningKey
        | feluqa::live::LiveError::InvalidSnapshot
        | feluqa::live::LiveError::InvalidSignature
        | feluqa::live::LiveError::InvalidReplayCapacity
        | feluqa::live::LiveError::InvalidActionId
        | feluqa::live::LiveError::InvalidPermission
        | feluqa::live::LiveError::DuplicateAction
        | feluqa::live::LiveError::RequestBindingMismatch => StatusCode::FORBIDDEN,
    };
    status.into_response()
}

pub(super) fn unix_time_seconds() -> Result<u64, StatusCode> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|value| value.as_secs())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
