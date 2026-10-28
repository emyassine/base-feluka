#![no_implicit_prelude]

use crate::panels::site::site_page::SitePage;
use crate::panels::site::site_service;
use crate::panels::runtime::generated_views as views;
use crate::feluqa;
use feluqa::prelude::*;

/// Render the public website home page.
pub async fn home() -> Result<Html<String>, StatusCode> {
    let model = site_service::home_page();
    views::home(&SitePage::new(model.title, model.is_home))
        .map(Html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

/// Render the public company information page.
pub async fn about() -> Result<Html<String>, StatusCode> {
    let model = site_service::about_page();
    views::about(&SitePage::new(model.title, model.is_home))
        .map(Html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
