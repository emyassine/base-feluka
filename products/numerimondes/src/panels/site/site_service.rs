#![no_implicit_prelude]

use crate::panels::site::site_page::SitePage;

/// Build the public home-page view model.
pub fn home_page() -> SitePage {
    SitePage::new("Get started", true)
}

/// Build the company information view model.
pub fn about_page() -> SitePage {
    SitePage::new("About", false)
}
