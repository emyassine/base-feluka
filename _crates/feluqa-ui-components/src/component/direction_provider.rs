use crate::runtime::prelude::*;
use crate::strum::AsRefStr;
use crate::feluqa_ui_classnames::*;

#[derive(Default, Clone, Copy, PartialEq, Eq, AsRefStr, crate::strum::Display)]
#[strum(serialize_all = "lowercase")]
pub enum Direction {
    #[default]
    Ltr,
    Rtl,
}

#[component]
pub fn DirectionProvider(
    children: Children,
    #[prop(optional)] dir: Direction,
    #[prop(optional, into)] class: String,
) -> impl IntoView {
    let class = class_merge!(class);

    view! {
        <div data-slot="direction-provider" dir=dir.to_string() class=class>
            {children()}
        </div>
    }
}
