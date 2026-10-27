#![no_implicit_prelude]

/// Data required to render a public site page.
pub struct SitePage {
    /// Page title passed to the compiled view.
    pub title: &'static str,
    /// Whether the page is the public home page.
    pub is_home: bool,
}
