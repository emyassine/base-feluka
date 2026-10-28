#![no_implicit_prelude]

//! Button styles adapted from Rust UI's Leptos Button registry component.

extern crate alloc;

use alloc::string::String;
use crate::leptos::prelude::Children;
use crate::leptos::prelude::ClassAttribute;
use crate::leptos::prelude::ElementChild;
use crate::leptos::prelude::IntoView;
use crate::core::clone::Clone;
use crate::core::convert::Into;
use crate::core::option::Option;
use crate::core::option::Option::Some;

/// Visual treatment for a Feluqa button.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum ButtonVariant {
    /// Primary action.
    #[default]
    Default,
    /// Destructive action.
    Destructive,
    /// Bordered secondary action.
    Outline,
    /// Muted secondary action.
    Secondary,
    /// Minimal action without a background.
    Ghost,
    /// Link-like action.
    Link,
}

impl ButtonVariant {
    const fn class(self) -> &'static str {
        match self {
            Self::Default => "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            Self::Destructive => "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            Self::Outline => "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/5",
            Self::Secondary => "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            Self::Ghost => "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            Self::Link => "text-primary underline-offset-4 hover:underline",
        }
    }
}

/// Button dimensions.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum ButtonSize {
    /// Standard control height.
    #[default]
    Default,
    /// Compact control height.
    Small,
    /// Large control height.
    Large,
    /// Square icon control.
    Icon,
}

impl ButtonSize {
    const fn class(self) -> &'static str {
        match self {
            Self::Default => "h-9 px-4 py-2 has-[>svg]:px-3",
            Self::Small => "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            Self::Large => "h-10 rounded-md px-6 has-[>svg]:px-4",
            Self::Icon => "size-9",
        }
    }
}

/// Join enabled class strings, preserving their declared order.
pub fn clx(classes: &[(&str, bool)]) -> String {
    let mut result = String::new();
    for &(class, enabled) in classes {
        if enabled && !class.is_empty() {
            if !result.is_empty() {
                result.push(' ');
            }
            result.push_str(class);
        }
    }
    result
}

/// Render a semantic button with consistent variants, sizes, and conditional classes.
#[crate::leptos::component]
pub fn Button(
    #[doc = "Button visual treatment."]
    #[prop(default = ButtonVariant::Default)] variant: ButtonVariant,
    #[doc = "Button dimensions."]
    #[prop(default = ButtonSize::Default)] size: ButtonSize,
    #[doc = "Additional CSS classes."]
    #[prop(into, optional)] class: Option<String>,
    #[doc = "Whether the button is disabled."]
    #[prop(default = false)] disabled: bool,
    children: Children,
) -> impl IntoView {
    let custom_class = class.unwrap_or_default();
    let class = clx(&[
        (
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation select-none",
            true,
        ),
        (variant.class(), true),
        (size.class(), true),
        (&custom_class, true),
    ]);

    crate::leptos::view! {
        <button type="button" class=class disabled=disabled>
            {children()}
        </button>
    }
}
