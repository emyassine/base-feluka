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
