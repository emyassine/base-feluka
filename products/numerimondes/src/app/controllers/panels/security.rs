#![no_implicit_prelude]

use super::*;

pub(super) async fn session_csrf_valid(
    state: &PanelState,
    headers: &HeaderMap,
    submitted: &str,
) -> bool {
    if !origin_valid(headers, state) {
        return false;
    }
    let (Some(session), Some(csrf_cookie)) = (
        cookie(headers, SESSION_COOKIE),
        cookie(headers, CSRF_COOKIE),
    ) else {
        return false;
    };
    constant_time_equal(csrf_cookie, submitted)
        && matches!(state.core.verify_csrf(session, submitted).await, Ok(true))
}

pub(super) fn anonymous_csrf_valid(
    headers: &HeaderMap,
    submitted: &str,
    state: &PanelState,
) -> bool {
    if !origin_valid(headers, state) {
        return false;
    }
    cookie(headers, LOGIN_CSRF_COOKIE)
        .is_some_and(|cookie_value| constant_time_equal(cookie_value, submitted))
}

pub(super) fn origin_valid(headers: &HeaderMap, state: &PanelState) -> bool {
    let (Some(origin), Some(host)) = (headers.get(ORIGIN), headers.get(HOST)) else {
        return false;
    };
    let (Ok(origin), Ok(host)) = (origin.to_str(), host.to_str()) else {
        return false;
    };
    let scheme = if state.secure_cookies {
        "https"
    } else {
        "http"
    };
    origin == format!("{scheme}://{host}")
}

pub(super) fn constant_time_equal(left: &str, right: &str) -> bool {
    left.len() == right.len() && bool::from(left.as_bytes().ct_eq(right.as_bytes()))
}

pub(super) fn cookie<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    let value = headers.get(COOKIE)?.to_str().ok()?;
    let mut matches = value
        .split(';')
        .filter_map(|pair| pair.trim().split_once('='))
        .filter(|(key, _)| *key == name)
        .map(|(_, value)| value);
    let first = matches.next()?;
    if matches.next().is_some() {
        None
    } else {
        Some(first)
    }
}

pub(super) fn cookie_value(
    name: &str,
    value: &str,
    http_only: bool,
    secure: bool,
    max_age: u64,
) -> String {
    let mut cookie = format!("{name}={value}; Path=/; SameSite=Strict; Max-Age={max_age}");
    if http_only {
        cookie.push_str("; HttpOnly");
    }
    if secure {
        cookie.push_str("; Secure");
    }
    cookie
}

pub(super) fn set_cookie(response: &mut Response, cookie: &str) -> bool {
    match HeaderValue::from_str(cookie) {
        Ok(value) => {
            response.headers_mut().append(SET_COOKIE, value);
            true
        }
        Err(_) => false,
    }
}

pub(super) fn clear_cookie(response: &mut Response, name: &str, secure: bool) -> bool {
    set_cookie(response, &cookie_value(name, "", true, secure, 0))
}
