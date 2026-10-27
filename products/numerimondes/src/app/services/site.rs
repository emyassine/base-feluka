#![no_implicit_prelude]

use crate::app::models::site_page::SitePage;

/// Build the public home-page view model.
pub fn home_page() -> SitePage {
    SitePage {
        title: "Get started",
        is_home: true,
    }
}

/// Build the company information view model.
pub fn about_page() -> SitePage {
    SitePage {
        title: "About",
        is_home: false,
    }
}
