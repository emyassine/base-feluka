use crate::runtime::prelude::*;
use crate::feluqa_ui_classnames::*;

const PING_ANIMATION: &str = "animate-ping";
const RELATIVE: &str = "relative";

#[component]
pub fn Status(
    #[prop(into, optional)] class: String,
    #[prop(into, optional)] variant: StatusIndactorVariant,
    children: Children,
) -> impl IntoView {
    let merged_class = class_merge!(RELATIVE, class);

    view! {
        <div class=merged_class>
            {children()} <StatusIndactor variant=variant class=PING_ANIMATION /> <StatusIndactor variant=variant />
        </div>
    }
}

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

#[derive(FeluqaClass, Clone, Copy)]
#[feluqa(class = "absolute top-0 right-0 -mt-1 -mr-1 rounded-full size-4")]
pub struct StatusIndactorClass {
    pub variant: StatusIndactorVariant,
}

#[derive(FeluqaVariant)]
pub enum StatusIndactorVariant {
    #[feluqa(default, class = "bg-neutral-300")]
    Default,
    #[feluqa(class = "bg-green-300 ")]
    Active,
    #[feluqa(class = "bg-orange-300 ")]
    Inactive,
    #[feluqa(class = "bg-sky-300 ")]
    Normal,
}

#[component]
pub fn StatusIndactor(
    #[prop(into, optional)] variant: Signal<StatusIndactorVariant>,
    #[prop(into, optional)] class: String,
) -> impl IntoView {
    let merged_class = move || {
        let status_indicator = StatusIndactorClass { variant: variant.get() };
        status_indicator.with_class(class.clone())
    };

    view! { <div class=merged_class /> }
}
