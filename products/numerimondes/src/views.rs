#![no_implicit_prelude]

extern crate std;

use std::format;
use std::string::String;
use std::time::Instant;

pub(crate) mod generated_views {
    include!(concat!(env!("OUT_DIR"), "/views.rs"));
}

/// Runtime presentation values supplied to compiled page and layout views.
pub(crate) struct Page {
    pub(crate) title: &'static str,
    pub(crate) is_home: bool,
    started_at: Instant,
}

impl Page {
    pub(crate) fn new(title: &'static str, is_home: bool) -> Self {
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

#[cfg(test)]
mod tests {
    use super::{Page, generated_views};
    use crate::app::services::site;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::iter::Iterator;

    #[test]
    fn compiled_public_pages_render_with_shared_layout() {
        for model in [site::home_page(), site::about_page()] {
            let html = if model.is_home {
                generated_views::home(&Page::new(model.title, model.is_home)).expect("home")
            } else {
                generated_views::about(&Page::new(model.title, model.is_home)).expect("about")
            };
            assert_eq!(html.matches("<header ").count(), 1);
            assert_eq!(html.matches("<footer>").count(), 1);
            assert!(html.contains("Request "));
            assert!(html.contains("/assets/site.css"));
            assert!(!html.contains("@include"));
        }
    }

    #[test]
    fn compiled_view_escapes_model_data() {
        let html = generated_views::home(&Page::new("<script>\"&", true)).expect("render");
        assert!(html.contains("&lt;script&gt;&quot;&amp;"));
    }
}
