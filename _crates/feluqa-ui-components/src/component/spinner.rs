use crate::icons::{Loader, LoaderCircle};
use crate::runtime::prelude::*;
use crate::feluqa_ui_classnames::class_merge;

#[component]
pub fn Spinner(#[prop(into, optional)] class: String) -> impl IntoView {
    let merged_class = class_merge!("size-4 animate-spin", class);

    view! { <LoaderCircle class=merged_class attr:role="status" attr:aria-label="Loading" /> }
}

#[component]
pub fn SpinnerCircle(#[prop(into, optional)] class: String) -> impl IntoView {
    let merged_class = class_merge!("size-4 animate-spin", class);

    view! { <Loader class=merged_class attr:role="status" attr:aria-label="Loading" /> }
}
