#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Feluqa's card container component.

extern crate feluqa_ui_classnames;
extern crate feluqa_ui_component_macros;
extern crate feluqa_ui_runtime;
extern crate std;

use crate::std::clone::Clone;
use crate::std::convert::Into;
use crate::std::string::String;
use crate::feluqa_ui_runtime::prelude::*;

/// Card density preset.
#[derive(Clone, Copy, PartialEq, Default)]
pub enum CardSize {
    /// Standard card spacing.
    #[default]
    Default,
    /// Compact card spacing.
    Sm,
}

/// Render a card container with optional compact spacing.
#[component]
pub fn Card(
    /// Selects the standard or compact spacing preset.
    #[prop(into, optional)] size: CardSize,
    /// Adds classes after merging them with the card defaults.
    #[prop(into, optional)] class: String,
    /// Content rendered inside the card.
    children: Children,
) -> impl IntoView {
    let size_classes = match size {
        CardSize::Default => "py-6 gap-4",
        CardSize::Sm => "py-4 gap-3",
    };
    let data_size = match size {
        CardSize::Default => "default",
        CardSize::Sm => "sm",
    };
    let merged = crate::feluqa_ui_classnames::class_merge!(
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        size_classes,
        class
    );

    view! {
        <div class=merged data-size=data_size data-name="Card">
            {children()}
        </div>
    }
}
