#![no_implicit_prelude]

extern crate std;

use crate::axum::http::StatusCode;
use crate::axum::response::Html;
use std::format;
use std::result::Result;
use std::string::String;
use std::time::Instant;

mod generated_views {
    include!(concat!(env!("OUT_DIR"), "/views.rs"));
}

pub(crate) struct Page {
    pub(crate) title: &'static str,
    pub(crate) is_home: bool,
    started_at: Instant,
}
impl Page {
    fn new(title: &'static str, is_home: bool) -> Self {
        Self {
            title,
            is_home,
            started_at: Instant::now(),
        }
    }
    pub(crate) fn request_time(&self) -> String {
        format!("{:.3}", self.started_at.elapsed().as_secs_f64() * 1_000.0)
    }
}

pub async fn home() -> Result<Html<String>, StatusCode> {
    generated_views::home(&Page::new("Get started", true))
        .map(Html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn about() -> Result<Html<String>, StatusCode> {
    generated_views::about(&Page::new("About", false))
        .map(Html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

#[cfg(test)]
mod tests {
    use super::{Page, generated_views};
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::iter::Iterator;

    #[test]
    fn both_pages_render_with_shared_layout_and_components() {
        for html in [
            generated_views::home(&Page::new("Get started", true)).expect("home"),
            generated_views::about(&Page::new("About", false)).expect("about"),
        ] {
            assert_eq!(html.matches("<header ").count(), 1);
            assert_eq!(html.matches("<footer>").count(), 1);
            assert!(html.contains("Request "));
            assert!(html.contains("/assets/site.css"));
            assert!(!html.contains("@include"));
            assert!(!html.contains("@yield"));
            assert!(!html.contains("<x-"));
        }
    }

    #[test]
    fn page_title_is_typed_and_escaped() {
        let html = generated_views::home(&Page::new("<script>\"&", true)).expect("home");
        assert!(html.contains("<title>&lt;script&gt;&quot;&amp; · Webkernel</title>"));
        assert!(html.contains("<section id=\"environment\">"));
    }
}
