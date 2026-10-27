#![no_implicit_prelude]

use super::*;

/// Persist the selected Webkernel-compatible language after session CSRF validation.
pub async fn set_language(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<LanguageForm>,
) -> Response {
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !matches!(
        form.locale.as_str(),
        "en" | "fr" | "ar" | "es" | "de" | "pt"
    ) || !(form.return_to.starts_with("/system") || form.return_to.starts_with("/admin"))
        || form.return_to.starts_with("//")
        || form
            .return_to
            .bytes()
            .any(|byte| byte.is_ascii_control() || byte == b'\\')
    {
        return StatusCode::BAD_REQUEST.into_response();
    }

    let mut response = Redirect::to(&form.return_to).into_response();
    if !set_cookie(
        &mut response,
        &cookie_value(
            "feluqa_locale",
            &form.locale,
            false,
            state.secure_cookies,
            31_536_000,
        ),
    ) {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    response
}
