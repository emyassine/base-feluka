#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;

use crate::axum::extract::Extension;
use feluqa::core::service::{CoreStore, CoreStoreError};
use feluqa::core::store::SecretToken;
use feluqa::prelude::*;
use crate::subtle::ConstantTimeEq;

pub(crate) mod administration;
pub(crate) mod operations;

const LOGIN_CSRF_COOKIE: &str = "feluqa_login_csrf";
const SESSION_COOKIE: &str = "feluqa_session";
const CSRF_COOKIE: &str = "feluqa_csrf";

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetupForm {
    csrf_token: String,
    display_name: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct LoginForm {
    csrf_token: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct LogoutForm {
    csrf_token: String,
}

/// Render the one-time administrator setup form while Core bootstrap is pending.
pub(crate) async fn setup_form(
    Extension(core): Extension<CoreStore>,
    Extension(secure): Extension<bool>,
) -> Response {
    match core.bootstrap_pending().await {
        Ok(true) => render_anonymous_form(secure, true, "Create the first administrator."),
        Ok(false) => Redirect::to("/system/login").into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Create the first administrator after origin and double-submit CSRF checks.
pub(crate) async fn setup(
    Extension(core): Extension<CoreStore>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<SetupForm>,
) -> Response {
    if !anonymous_csrf_valid(&headers, &form.csrf_token, secure) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match core
        .bootstrap_first_admin(&form.email, &form.display_name, &form.password)
        .await
    {
        Ok(()) | Err(CoreStoreError::BootstrapUnavailable) => {
            let mut response = Redirect::to("/system/login").into_response();
            if clear_cookie(&mut response, LOGIN_CSRF_COOKIE, secure, true) {
                response
            } else {
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
        }
        Err(CoreStoreError::InvalidBootstrap) => {
            render_anonymous_form(secure, true, "Enter a valid name, email and password of at least 12 characters.")
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Render the Core login form, redirecting an already-authenticated browser.
pub(crate) async fn login_form(
    Extension(core): Extension<CoreStore>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
) -> Response {
    if let Some(token) = cookie(&headers, SESSION_COOKIE) {
        match core.authenticate(token).await {
            Ok(Some(_)) => return Redirect::to("/system").into_response(),
            Ok(None) => {}
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        }
    }
    render_anonymous_form(secure, false, "Sign in to continue.")
}

/// Verify credentials, then issue an HttpOnly session and a separate CSRF cookie.
pub(crate) async fn login(
    Extension(core): Extension<CoreStore>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<LoginForm>,
) -> Response {
    if !anonymous_csrf_valid(&headers, &form.csrf_token, secure) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match core.login(&form.email, &form.password).await {
        Ok(session) => {
            let mut response = Redirect::to("/system").into_response();
            if !set_cookie(
                &mut response,
                &cookie_value(SESSION_COOKIE, &session.session_token, true, secure, 28_800),
            ) || !set_cookie(
                &mut response,
                &cookie_value(CSRF_COOKIE, &session.csrf_token, false, secure, 28_800),
            ) || !clear_cookie(&mut response, LOGIN_CSRF_COOKIE, secure, true)
            {
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
            response
        }
        Err(CoreStoreError::InvalidCredentials) => {
            render_anonymous_form(secure, false, "Email or password is invalid.")
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Revoke the current session after origin and session-bound CSRF validation.
pub(crate) async fn logout(
    Extension(core): Extension<CoreStore>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<LogoutForm>,
) -> Response {
    if !origin_valid(&headers, secure) {
        return StatusCode::FORBIDDEN.into_response();
    }
    let (Some(session), Some(csrf_cookie)) = (
        cookie(&headers, SESSION_COOKIE),
        cookie(&headers, CSRF_COOKIE),
    ) else {
        return StatusCode::UNAUTHORIZED.into_response();
    };
    if !constant_time_equal(csrf_cookie, &form.csrf_token) {
        return StatusCode::FORBIDDEN.into_response();
    }
    match core.verify_csrf(session, &form.csrf_token).await {
        Ok(true) => {}
        Ok(false) => return StatusCode::FORBIDDEN.into_response(),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
    if core.logout(session).await.is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    let mut response = Redirect::to("/system/login").into_response();
    if !clear_cookie(&mut response, SESSION_COOKIE, secure, true)
        || !clear_cookie(&mut response, CSRF_COOKIE, secure, false)
    {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    response
}

fn render_anonymous_form(secure: bool, setup: bool, notice: &str) -> Response {
    let token = match SecretToken::generate() {
        Ok(token) => String::from(token.expose()),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let page = if setup {
        crate::views::system_setup(&token, notice)
    } else {
        crate::views::system_login(&token, notice)
    };
    let html = match page {
        Ok(html) => html,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let mut response = Html(html).into_response();
    if set_cookie(
        &mut response,
        &cookie_value(LOGIN_CSRF_COOKIE, &token, true, secure, 600),
    ) {
        response
    } else {
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}

fn anonymous_csrf_valid(headers: &HeaderMap, submitted: &str, secure: bool) -> bool {
    origin_valid(headers, secure)
        && cookie(headers, LOGIN_CSRF_COOKIE)
            .is_some_and(|cookie_value| constant_time_equal(cookie_value, submitted))
}

pub(crate) fn origin_valid(headers: &HeaderMap, secure: bool) -> bool {
    let (Some(origin), Some(host)) = (headers.get(ORIGIN), headers.get(HOST)) else {
        return false;
    };
    let (Ok(origin), Ok(host)) = (origin.to_str(), host.to_str()) else {
        return false;
    };
    let scheme = if secure { "https" } else { "http" };
    origin == format!("{scheme}://{host}")
}

pub(crate) fn constant_time_equal(left: &str, right: &str) -> bool {
    left.len() == right.len() && bool::from(left.as_bytes().ct_eq(right.as_bytes()))
}

pub(crate) fn cookie<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    let mut found = None;
    for header in headers.get_all(COOKIE).iter() {
        let Ok(header) = header.to_str() else {
            return None;
        };
        for pair in header.split(';') {
            let Some((key, value)) = pair.trim().split_once('=') else {
                continue;
            };
            if key.trim() == name {
                if found.is_some() {
                    return None;
                }
                found = Some(value.trim());
            }
        }
    }
    found
}

fn cookie_value(name: &str, value: &str, http_only: bool, secure: bool, max_age: u64) -> String {
    let mut cookie = format!("{name}={value}; Path=/; SameSite=Strict; Max-Age={max_age}");
    if http_only {
        cookie.push_str("; HttpOnly");
    }
    if secure {
        cookie.push_str("; Secure");
    }
    cookie
}

fn set_cookie(response: &mut Response, cookie: &str) -> bool {
    match HeaderValue::from_str(cookie) {
        Ok(value) => {
            response.headers_mut().append(SET_COOKIE, value);
            true
        }
        Err(_) => false,
    }
}

fn clear_cookie(response: &mut Response, name: &str, secure: bool, http_only: bool) -> bool {
    set_cookie(response, &cookie_value(name, "", http_only, secure, 0))
}
