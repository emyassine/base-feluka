#![no_implicit_prelude]

use super::*;
use crate::feluqa;

/// Render the initial administrator setup form while bootstrap remains available.
pub async fn setup_form(State(state): State<PanelState>) -> Response {
    match state.core.bootstrap_pending().await {
        Ok(true) => render_anonymous_form(&state, true, "Create the first administrator."),
        Ok(false) => Redirect::to("/system/login").into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Create the one-time initial administrator after same-origin CSRF validation.
pub async fn setup(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<SetupForm>,
) -> Response {
    if !anonymous_csrf_valid(&headers, &form.csrf_token, &state) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state
        .core
        .bootstrap_first_admin(&form.email, &form.display_name, &form.password)
        .await
    {
        Ok(()) => Redirect::to("/system/login").into_response(),
        Err(feluqa::core::service::CoreStoreError::BootstrapUnavailable) => {
            Redirect::to("/system/login").into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidBootstrap) => render_anonymous_form(
            &state,
            true,
            "Enter a valid name, email and password of at least 12 characters.",
        ),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Render the Feluqa Core login form with a short-lived same-origin CSRF token.
pub async fn login_form(State(state): State<PanelState>) -> Response {
    render_anonymous_form(&state, false, "Sign in to continue.")
}

/// Verify credentials and issue HttpOnly session plus CSRF cookies.
pub async fn login(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<LoginForm>,
) -> Response {
    if !anonymous_csrf_valid(&headers, &form.csrf_token, &state) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state.core.login(&form.email, &form.password).await {
        Ok(issued) => {
            let mut response = Redirect::to("/system").into_response();
            if !set_cookie(
                &mut response,
                &cookie_value(
                    SESSION_COOKIE,
                    &issued.session_token,
                    true,
                    state.secure_cookies,
                    28_800,
                ),
            ) || !set_cookie(
                &mut response,
                &cookie_value(
                    CSRF_COOKIE,
                    &issued.csrf_token,
                    false,
                    state.secure_cookies,
                    28_800,
                ),
            ) || !clear_cookie(&mut response, LOGIN_CSRF_COOKIE, state.secure_cookies)
            {
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
            response
        }
        Err(feluqa::core::service::CoreStoreError::InvalidCredentials) => {
            render_anonymous_form(&state, false, "Email or password is invalid.")
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Revoke the current persistent session after session-bound CSRF validation.
pub async fn logout(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<CsrfForm>,
) -> Response {
    let Some(raw_session) = cookie(&headers, SESSION_COOKIE) else {
        return Redirect::to("/system/login").into_response();
    };
    if !origin_valid(&headers, &state) {
        return StatusCode::FORBIDDEN.into_response();
    }
    let Some(csrf_cookie) = cookie(&headers, CSRF_COOKIE) else {
        return StatusCode::FORBIDDEN.into_response();
    };
    if !constant_time_equal(csrf_cookie, &form.csrf_token) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state.core.verify_csrf(raw_session, &form.csrf_token).await {
        Ok(true) => {}
        Ok(false) => return StatusCode::FORBIDDEN.into_response(),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
    if state.core.logout(raw_session).await.is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    let mut response = Redirect::to("/system/login").into_response();
    if !clear_cookie(&mut response, SESSION_COOKIE, state.secure_cookies)
        || !clear_cookie(&mut response, CSRF_COOKIE, state.secure_cookies)
    {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    response
}
