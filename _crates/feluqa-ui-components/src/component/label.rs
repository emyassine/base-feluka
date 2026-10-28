use crate::runtime::prelude::*;
use crate::feluqa_ui_classnames::*;

#[component]
pub fn Label(
    #[prop(optional, into)] class: String,
    #[prop(optional, into)] html_for: String,
    children: Children,
) -> impl IntoView {
    let peer_classes = if !html_for.is_empty() {
        crate::std::format!("peer-disabled/{}:cursor-not-allowed peer-disabled/{}:opacity-50", html_for, html_for)
    } else {
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50".to_string()
    };

    let class = class_merge!(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        &peer_classes,
        class
    );

    view! {
        <label class=class r#for=html_for>
            {children()}
        </label>
    }
}
