#![no_implicit_prelude]

use crate::axum::Router;
use crate::axum::extract::Request;
use crate::axum::http::{HeaderName, HeaderValue};
use crate::axum::middleware::{Next, from_fn};
use crate::axum::response::Response;
use crate::axum::routing::get;
use crate::handlers;
use crate::std::convert::From;
use crate::std::eprintln;
use crate::std::format;
use crate::std::path::PathBuf;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use crate::std::time::Instant;
use crate::tower_http::services::ServeDir;

pub fn routes() -> Router {
    Router::new()
        .route("/", get(handlers::home))
        .route("/about", get(handlers::about))
        .nest_service(
            "/assets",
            ServeDir::new(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("public/assets")),
        )
        .layer(from_fn(binary_timing))
}

async fn binary_timing(request: Request, next: Next) -> Response {
    let method = String::from(request.method().as_str());
    let path = String::from(request.uri().path());
    let started_at = Instant::now();
    let mut response = next.run(request).await;
    let duration_ms = started_at.elapsed().as_secs_f64() * 1_000.0;
    eprintln!("[feluqa] {method} {path} binary response: {duration_ms:.3} ms");

    if let Ok(header) = HeaderValue::from_str(&format!("feluqa_binary;dur={duration_ms:.3}")) {
        response
            .headers_mut()
            .insert(HeaderName::from_static("server-timing"), header);
    }

    response
}
