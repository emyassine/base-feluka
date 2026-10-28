use crate::runtime::prelude::*;
use crate::feluqa_ui_classnames::*;

#[component]
pub fn Separator(
    #[prop(into, optional)] orientation: Signal<SeparatorOrientation>,
    #[prop(into, optional)] class: String,
    // children: Children,
) -> impl IntoView {
    let merged_class = Memo::new(move |_| {
        let orientation = orientation.get();
        let separator = SeparatorClass { orientation };
        separator.with_class(class.clone())
    });

    view! { <div class=merged_class role="separator" /> }
}

/* ========================================================== */
/*                       🧬 STRUCT 🧬                         */
/* ========================================================== */

#[derive(FeluqaClass, Default)]
#[feluqa(class = "shrink-0 bg-border")]
pub struct SeparatorClass {
    orientation: SeparatorOrientation,
}

#[derive(FeluqaVariant)]
pub enum SeparatorOrientation {
    #[feluqa(default, class = "w-full h-[1px]")]
    Default,
    #[feluqa(class = "h-full w-[1px]")]
    Vertical,
}
