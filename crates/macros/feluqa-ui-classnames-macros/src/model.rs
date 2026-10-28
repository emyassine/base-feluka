use darling::util::{Flag, IdentString};
use darling::{FromDeriveInput, FromField, FromVariant, ast};

#[derive(Debug, FromDeriveInput)]
#[darling(attributes(feluqa), supports(enum_unit))]
pub struct FeluqaVariantContainer {
    pub ident: syn::Ident,
    pub data: ast::Data<FeluqaVariantOption, ()>,
    /// The base Tailwind class for the variant.
    pub class: Option<syn::LitStr>,
}

#[derive(Debug, FromVariant)]
#[darling(supports(unit), attributes(feluqa, default))]
pub struct FeluqaVariantOption {
    pub ident: syn::Ident,
    pub class: String,
    pub default: Flag,
}

#[derive(Debug, FromDeriveInput)]
#[darling(attributes(feluqa), supports(struct_named))]
pub struct FeluqaClassContainer {
    pub ident: syn::Ident,
    pub data: ast::Data<(), FeluqaClassField>,
    pub class: Option<syn::LitStr>,
    /// Defaults to using `class_merge`.
    pub merger: Option<IdentString>,
}

#[derive(Debug, FromField)]
#[darling(attributes(feluqa))]
pub struct FeluqaClassField {
    pub ty: syn::Type,
    pub ident: Option<syn::Ident>,
}
