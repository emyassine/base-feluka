use crate::runtime::prelude::*;
use crate::feluqa_ui_classnames::*;

/// TODO UI 🐛 : Fix MaskColor (-> demo)

#[component]
pub fn MaskWrapper(#[prop(into, optional)] class: String, children: Children) -> impl IntoView {
    let merged_class = class_merge!(
        "flex justify-center items-center",
        "relative w-full h-full",
        "rounded-lg border",
        "overflow-hidden",
        "min-h-[300px]",
        class
    );

    view! { <div class=merged_class>{children()}</div> }
}

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

#[derive(FeluqaClass, Clone, Copy)]
#[feluqa(class = "absolute inset-y-0 pointer-events-none from-white dark:from-background")]
pub struct MaskClass {
    pub side: MaskSide,
    // TODO. Fix MaskColor
}

#[derive(FeluqaVariant)]
pub enum MaskSide {
    #[feluqa(default, class = "")]
    Default,
    #[feluqa(class = "left-0 w-1/3 bg-gradient-to-r")]
    Left,
    #[feluqa(class = "right-0 w-1/3 bg-gradient-to-l")]
    Right,
    #[feluqa(class = "top-0 w-full bg-gradient-to-b")]
    Top,
    #[feluqa(class = "bottom-0 w-full bg-gradient-to-t")]
    Bottom,
}

#[derive(FeluqaVariant)]
pub enum MaskColor {
    #[feluqa(default, class = "from-pink-500 to-violet-500 dark:from-purple-700 dark:to-indigo-700")]
    Pink,
}

#[component]
pub fn Mask(
    #[prop(into, optional)] side: Signal<MaskSide>,
    // #[prop(into, optional)] color: Signal<MaskColor>,
    // TODO. └──> Not working properly, fix this later.
    #[prop(into, optional)] class: String,
) -> impl IntoView {
    let merged_class = Memo::new(move |_| {
        let side = side.get();

        let mask = MaskClass { side };
        mask.with_class(class.clone())
    });

    view! { <div class=merged_class /> }
}
