use proc_macro::TokenStream;

mod class_macro;
mod model;
mod variant_macro;

#[proc_macro_derive(FeluqaVariant, attributes(feluqa))]
pub fn variant(input: TokenStream) -> TokenStream {
    variant_macro::variant_impl(input)
}

#[proc_macro_derive(FeluqaClass, attributes(feluqa))]
pub fn class(input: TokenStream) -> TokenStream {
    class_macro::class_impl(input)
}
