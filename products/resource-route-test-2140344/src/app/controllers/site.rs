#![no_implicit_prelude]

use crate::axum::http::StatusCode;
use crate::axum::response::{Html, IntoResponse, Response};
use crate::views;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;

pub(crate) async fn home() -> Response {
    match views::home("Resource Route Test 2140344") {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) async fn health() -> &'static str {
    "ok"
}
