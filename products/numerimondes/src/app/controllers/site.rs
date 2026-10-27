#![no_implicit_prelude]

use crate::app::services::site;
use crate::feluqa;
use crate::views::{self, Page};
use feluqa::prelude::*;

/// Render the public website home page.
pub async fn home() -> Result<Html<String>, StatusCode> {
    let model = site::home_page();
    views::generated_views::home(&Page::new(model.title, model.is_home))
        .map(Html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

/// Render the public company information page.
pub async fn about() -> Result<Html<String>, StatusCode> {
    let model = site::about_page();
    views::generated_views::about(&Page::new(model.title, model.is_home))
        .map(Html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

/// Serve the shared Feluqa Live client to the website and every panel.
pub async fn live_client() -> Response {
    feluqa::web::live_client()
}

/// Serve the framework panel theme and browser runtime to every panel.
pub async fn filament_asset(Path(asset): Path<String>) -> Result<Response, StatusCode> {
    match asset.as_str() {
        "theme.css" => Ok(feluqa::web::panel_stylesheet()),
        "panel.js" => Ok(feluqa::web::panel_client()),
        "echo.js" => Ok(feluqa::web::panel_echo_client()),
        _ => Err(StatusCode::NOT_FOUND),
    }
}
