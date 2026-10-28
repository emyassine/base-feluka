#![no_implicit_prelude]

extern crate std;

use crate::std::format;
use crate::std::string::String;
use crate::std::time::Instant;

/// Data required to render a public site page.
pub struct SitePage {
    /// Page title passed to the compiled view.
    pub title: &'static str,
    /// Whether the page is the public home page.
    pub is_home: bool,
    started_at: Instant,
}

impl SitePage {
    /// Create page runtime data for one request.
    pub fn new(title: &'static str, is_home: bool) -> Self {
        Self {
            title,
            is_home,
            started_at: Instant::now(),
        }
    }

    /// Elapsed request time formatted for the page footer.
    pub fn request_time(&self) -> String {
        format!("{:.3}", self.started_at.elapsed().as_secs_f64() * 1_000.0)
    }
}
