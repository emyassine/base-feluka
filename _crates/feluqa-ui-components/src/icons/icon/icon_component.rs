use crate::runtime::prelude::*;

use super::svg_icon::SvgIcon;
use crate::icons::common::icon_registry_getter::get_icon_elements;
use crate::icons::common::icon_type::IconType;

/// Single optimized Icon component that renders any icon via registry lookup
#[component]
pub fn Feluqa UIIcon(icon: IconType, #[prop(into, optional)] class: String) -> impl IntoView {
    // Get elements from static registry, zero allocation
    let elements = get_icon_elements(icon).unwrap_or(&[]);

    view! {
        <SvgIcon class=class data_name=icon.to_string()>
            <title>{format!("Rust/UI Icons - {icon}")}</title>

            {elements.iter().map(|element| { element.to_feluqa_ui_runtime_view() }).collect::<Vec<_>>()}
        </SvgIcon>
    }
}
