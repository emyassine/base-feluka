use crate::runtime::prelude::*;
use crate::feluqa_ui_classnames::class_merge;

#[component]
pub fn AspectRatio(
    #[prop(default = 1.7777777777777777)] ratio: f64,
    #[prop(into, optional)] class: String,
    children: Children,
) -> impl IntoView {
    let style = format!("aspect-ratio: {ratio}");

    view! {
        <div data-name="AspectRatio" class=class_merge!("relative w-full overflow-hidden", class) style=style>
            {children()}
        </div>
    }
}
