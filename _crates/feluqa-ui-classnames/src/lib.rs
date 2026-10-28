#![forbid(missing_docs)]

//! # Feluqa class composition
//!
//! Two main utils are included in this crate:
//!
//! 1. Merge: Merge multiple Tailwind classes, with optional conflict resolution.
//!     > Inspired by [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
//! 2. Variants: Compose type-safe variant classes
//!     > Inspired by [Class Variance Authority](https://github.com/joe-bell/cva)
//!
//!
//! ## Installation
//!
//! Variants requires the `variant` feature to be enabled.
//!
//! #### With variant
//! ```bash
//! Add `feluqa-ui-classnames` with the `variant` feature.
//! ```
//!
//! #### Without variant
//! ```bash
//! Add `feluqa-ui-classnames`.
//! ```
//!
//! ## Macros: class_join! and class_merge!
//!
//! You can use [`class_join!`] to join Tailwind classes, and [`class_merge!`] to merge Tailwind Classes handling conflicts.
//!
//!
//! You can use anything that implements [`AsTailwindClass`]
//!
//! ```
//! use feluqa_ui_classnames::*;
//!
//! // No conflict resolution
//! assert_eq!(
//!    "flex items-center justify-center",
//!    class_join!("flex", "items-center", "justify-center")
//! );
//!
//! // Conflict resolution
//! // Right most class takes precedence
//! assert_eq!(
//!    "p-4",
//!    class_merge!("py-2 px-4", "p-4")
//! );
//!
//! // Refinements are permitted
//! assert_eq!(
//!    "p-4 py-2",
//!    class_merge!("p-4", "py-2")
//! );
//! ```
//!
//! You can use Options to exclude certain classes from being merged
//!
//! ```
//! use feluqa_ui_classnames::*;
//!
//! assert_eq!(
//!   "flex justify-center",
//!   class_join!("flex", (false).then_some("items-center"), (true).then_some("justify-center"))
//! )
//! ```
//!
//! ### Custom Tailwind Prefix/Separator
//!
//! Use [`merge::set_merge_options`] to set global options for [`class_merge!`] and variant macros.
//!
//! This can only be set once. Subsequent calls will be ignored.
//!
//! ```
//! use feluqa_ui_classnames::{*, merge::*};
//!
//! const OPTIONS: MergeOptions = MergeOptions {
//!     prefix: "tw-",
//!     separator: ":",
//! };
//!
//! // Before setting options, the default (no prefix) is used
//! assert_eq!(
//!   "tw-bg-black tw-bg-white",
//!   class_merge!("tw-bg-black", "tw-bg-white"),
//! );
//!
//! set_merge_options(OPTIONS);
//!
//! assert_eq!(
//!   "tw-bg-white",
//!   class_merge!("tw-bg-black", "tw-bg-white"),
//! );
//!
//! ```
//!
//!
//! ## Usage: Variants
//!
//! Useful for building components with first class support for tailwind. By default, conflicts are merged using [`class_merge()`].
//!
//! Each [`FeluqaClass`] represents a UI element with customizable properties (property is a "variant"). Each variant is represented by a [`FeluqaVariant`], which must be an enum with a default case.
//!
//! The classes are merged in the following order, with the last class takes precedence:
//! 1. Base class from [`FeluqaClass`]
//! 2. Base class from [`FeluqaVariant`]
//! 3. Enum variant class from [`FeluqaVariant`]
//! 4. Override class using [`IntoTailwindClass::with_class`] on the struct or builder
//!
//! ```ignore
//! use feluqa_ui_classnames::*;
//!
//! // Your Component Type
//! #[derive(FeluqaClass)]
//! // Optional base class
//! #[feluqa(class = "flex")]
//! struct Btn {
//!     size: BtnSize,
//!     color: BtnColor,
//! }
//!
//! // Variant for size
//! #[derive(FeluqaVariant)]
//! enum BtnSize {
//!     #[feluqa(default, class = "px-4 py-2 h-9")]
//!     Default,
//!     #[feluqa(class = "h-8 px-3")]
//!     Sm,
//!     #[feluqa(class = "h-10 px-8")]
//!     Lg,
//! }
//!
//! // Variant for color
//! #[derive(FeluqaVariant)]
//! enum BtnColor {
//!     #[feluqa(default, class = "text-blue-100 bg-blue-500")]
//!     Blue,
//!     #[feluqa(class = "text-red-100 bg-red-500")]
//!     Red,
//! }
//! ```
//!
//! You can now use the `Btn` struct to generate Tailwind classes, using builder syntax, or using the struct directly
//!
//! ### Struct Syntax
//! ```ignore
//! # use feluqa_ui_classnames::*;
//! # // Your Component Type
//! # #[derive(FeluqaClass)]
//! # // Optional base class
//! # #[feluqa(class = "flex")]
//! # struct Btn {
//! #     size: BtnSize,
//! #     color: BtnColor,
//! # }
//! # // Variant for size
//! # #[derive(FeluqaVariant)]
//! # enum BtnSize {
//! #     #[feluqa(default, class = "px-4 py-2 h-9")]
//! #     Default,
//! #     #[feluqa(class = "h-8 px-3")]
//! #     Sm,
//! #     #[feluqa(class = "h-10 px-8")]
//! #     Lg,
//! # }
//! # // Variant for color
//! # #[derive(FeluqaVariant)]
//! # enum BtnColor {
//! #     #[feluqa(default, class = "text-blue-100 bg-blue-500")]
//! #     Blue,
//! #     #[feluqa(class = "text-red-100 bg-red-500")]
//! #     Red,
//! # }
//! let button = Btn {
//!     size: BtnSize::Default,
//!     color: BtnColor::Blue,
//! };
//!
//! assert_eq!(
//!    "flex h-9 px-4 py-2 bg-blue-500 text-blue-100",
//!    button.to_class()
//! );
//!
//! // Conflicts are resolved (bg-blue-500 is knocked out in favor of override)
//! assert_eq!(
//!    "flex h-9 px-4 py-2 text-blue-100 bg-green-500",
//!    button.with_class("bg-green-500")
//! );
//! ```
//!
//! ### Builder Syntax
//! You access the builder using the `variants` method. Every variant that is not provided will be replaced with the default variant.
//!
//! ```ignore
//! # use feluqa_ui_classnames::*;
//! #
//! # #[derive(FeluqaClass)]
//! # // Optional base class
//! # #[feluqa(class = "flex")]
//! # struct Btn {
//! #     size: BtnSize,
//! #     color: BtnColor,
//! # }
//! #
//! # // Variant for size
//! # #[derive(FeluqaVariant)]
//! # enum BtnSize {
//! #     #[feluqa(default, class = "px-4 py-2 h-9")]
//! #     Default,
//! #     #[feluqa(class = "h-8 px-3")]
//! #     Sm,
//! #     #[feluqa(class = "h-10 px-8")]
//! #     Lg,
//! # }
//! #
//! # // Variant for color
//! # #[derive(FeluqaVariant)]
//! # enum BtnColor {
//! #     #[feluqa(default, class = "text-blue-100 bg-blue-500")]
//! #     Blue,
//! #     #[feluqa(class = "text-red-100 bg-red-500")]
//! #     Red,
//! # }
//!
//! assert_eq!(
//!    "flex h-8 px-3 bg-red-500 text-red-100",
//!    Btn::builder()
//!       .size(BtnSize::Sm)
//!       .color(BtnColor::Red)
//!       .to_class()
//! );
//!
//! assert_eq!(
//!    "flex h-8 px-3 text-red-100 bg-green-500",
//!    Btn::builder()
//!       .size(BtnSize::Sm)
//!       .color(BtnColor::Red)
//!       .with_class("bg-green-500")
//! );
//!
//! ```
//!
//! #### VSCode Intellisense
//!
//! You can enable autocompletion inside `#[feluqa()]` using the steps below:
//!
//! 1. [Install the "Tailwind CSS IntelliSense" Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
//!
//! 2. Add the following to your [`settings.json`](https://code.visualstudio.com/docs/getstarted/settings):
//!
//! ```json
//! {
//!   "tailwindCSS.experimental.classRegex": [
//!     ["#[tw\\\\([^\\]]*class\\s*=\\s*\"([^\"]*)\"\\)]", "\"([^\"]*)\""]
//!   ]
//! }
//! ```
//!

#[cfg(feature = "variant")]
extern crate feluqa_ui_classnames_macros;
extern crate nom;
extern crate std;

pub use crate::core::{merge, *};

mod ast;
mod core;

/// Internal utilities exposed for benchmarking only. Not part of the public API.
#[doc(hidden)]
pub mod __bench {
    #[doc(hidden)]
    pub use crate::ast::AstParseOptions;
    #[doc(hidden)]
    pub use crate::ast::AstStyle;
    #[doc(hidden)]
    pub use crate::ast::parse_tailwind;
}

#[cfg(feature = "variant")]
pub use variant::*;

#[cfg(feature = "variant")]
mod variant {
    /// Used to Combine Tailwind Classes together.
    pub trait TailwindCompose {
        /// Strings are not guaranteed to be single class nor free of whitespace.
        fn compose_classes(&self, class: &[&str]) -> String;
    }

    /// Will merge Tailwind classes and handle conflicts using [`crate::merge::class_merge_slice`]
    pub struct TailwindMerge;

    impl TailwindCompose for TailwindMerge {
        fn compose_classes(&self, class: &[&str]) -> String {
            crate::merge::class_merge_slice(class)
        }
    }

    /// Will simply join Tailwind classes together without handling conflicts
    pub struct TailwindJoin;

    impl TailwindCompose for TailwindJoin {
        fn compose_classes(&self, class: &[&str]) -> String {
            class
                .iter()
                .flat_map(|s| s.split_whitespace())
                .map(|s| s.trim())
                .filter(|s| !s.is_empty())
                .fold(String::new(), |mut acc, s| {
                    if !acc.is_empty() {
                        acc.push(' ');
                    }
                    acc.push_str(s);
                    acc
                })
        }
    }

    /// Derives a class for use with Tailwind CSS in Rust components.
    ///
    /// Allows building components with first-class support for Tailwind.
    ///
    /// Defaults to using [`crate::class_merge()`] to resolve conflicts.
    ///
    /// Resolves conflicts using the following merge order:
    /// - [`FeluqaClass`] base class
    /// - [`FeluqaVariant`] base class
    /// - [`FeluqaVariant`] enum variant class
    /// - Override class with `with_class`
    ///
    /// # Example
    ///
    /// ```rust
    /// use feluqa_ui_classnames::*;
    ///
    /// #[derive(FeluqaClass, Debug)]
    /// // Optional base class.
    /// #[feluqa(class = "flex")]
    /// struct Btn {
    ///     size: BtnSize,
    ///     color: BtnColor,
    /// }
    ///
    /// #[derive(FeluqaVariant, Debug)]
    /// enum BtnSize {
    ///     #[feluqa(default, class = "px-4 py-2 h-9")]
    ///     Default,
    ///     #[feluqa(class = "h-8 px-3")]
    ///     Sm,
    ///     #[feluqa(class = "h-10 px-8")]
    ///     Lg,
    /// }
    ///
    /// #[derive(FeluqaVariant, Debug)]
    /// enum BtnColor {
    ///     #[feluqa(default, class = "text-blue-100 bg-blue-500")]
    ///     Blue,
    ///     #[feluqa(class = "text-red-100 bg-red-500")]
    ///     Red,
    /// }
    ///
    /// let btn = Btn { size: BtnSize::Default, color: BtnColor::Blue };
    /// assert_eq!(btn.to_class(), "flex px-4 py-2 h-9 text-blue-100 bg-blue-500");
    ///
    /// let btn_variant = Btn::builder().color(BtnColor::Red).to_class();
    /// assert_eq!(btn_variant, "flex px-4 py-2 h-9 text-red-100 bg-red-500");
    /// ```
    ///
    pub use feluqa_ui_classnames_macros::FeluqaClass;
    /// Represents a customizable property (variant) of a UI element.
    /// Each variant must be an enum with a default case.
    ///
    /// Use `.to_class()` to get the class for the variant and `.with_class()` to append a class.
    ///
    /// # Example
    ///
    /// ```rust
    /// use feluqa_ui_classnames::*;
    ///
    /// #[derive(FeluqaVariant, Debug)]
    /// // Optional base class
    /// #[feluqa(class = "hover:brightness-50")]
    /// enum BtnColor {
    ///     #[feluqa(default, class = "text-blue-100 bg-blue-500")]
    ///     Default,
    ///     #[feluqa(class = "text-red-100 bg-red-500")]
    ///     Red,
    /// }
    ///
    /// assert_eq!("hover:brightness-50 text-blue-100 bg-blue-500", BtnColor::Default.as_class());
    /// assert_eq!("hover:brightness-50 text-red-100 bg-red-500", BtnColor::Red.as_class());
    /// ```
    ///
    pub use feluqa_ui_classnames_macros::FeluqaVariant;

    /// A trait to convert a type into a Tailwind class.
    /// Implemented automatically for usages of [`FeluqaClass`] and [`FeluqaVariant`].
    pub trait IntoTailwindClass {
        /// Convert the type into a Tailwind class.
        fn to_class(&self) -> String;
        /// Append to the class (with override precedence) and return the new class.
        fn with_class(&self, class: impl AsRef<str>) -> String;
    }

    /// Converts a type into it's builder.
    /// Automatically implemented for usages of [`FeluqaClass`].
    pub trait IntoBuilder {
        /// The builder type.
        type Builder;
        /// Get a builder instance
        fn builder() -> Self::Builder;
        /// Convert the instance into the builder.
        fn into_builder(self) -> Self::Builder;
    }
}
