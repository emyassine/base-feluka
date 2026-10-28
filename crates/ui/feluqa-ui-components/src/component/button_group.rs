use crate::feluqa_ui_classnames::*;
use crate::feluqa_ui_component_macros::clx;
use crate::runtime::prelude::*;

use super::separator::{Separator, SeparatorOrientation};

mod components {
    use super::*;
    clx! {ButtonGroupText, span, "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"}
}

pub use components::*;

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

#[component]
pub fn ButtonGroup(
    #[prop(into, optional)] orientation: Signal<ButtonGroupOrientation>,
    #[prop(into, optional)] class: String,
    children: Children,
) -> impl IntoView {
    let merged_class = Memo::new(move |_| {
        let orientation = orientation.get();
        let button_group = ButtonGroupClass { orientation };
        button_group.with_class(class.clone())
    });

    view! {
        <div data-name="ButtonGroup" role="group" class=merged_class>
            {children()}
        </div>
    }
}

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

#[derive(FeluqaClass, Default)]
#[feluqa(
    class = "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2"
)]
pub struct ButtonGroupClass {
    pub orientation: ButtonGroupOrientation,
}

#[derive(FeluqaVariant)]
pub enum ButtonGroupOrientation {
    #[feluqa(
        default,
        class = "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none"
    )]
    Horizontal,
    #[feluqa(
        class = "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
    )]
    Vertical,
}

#[component]
pub fn ButtonGroupSeparator(
    #[prop(into, optional, default = SeparatorOrientation::Vertical.into())] orientation: Signal<
        SeparatorOrientation,
    >,
    #[prop(into, optional)] class: String,
) -> impl IntoView {
    let merged_class = class_merge!(
        "relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        class
    );

    view! { <Separator attr:data-name="ButtonGroupSeparator" orientation=orientation class=merged_class /> }
}
