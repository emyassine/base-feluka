#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate std;
extern crate syn;

use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;
use quote::quote;
use std::clone::Clone;
use std::convert::{From, Into};
use std::iter::Iterator;
use std::option::Option::{None, Some};
use std::result::Result::{Err, Ok};
use std::string::String;
use std::string::ToString;
use std::vec::Vec;
use syn::parse::Parser;
use syn::punctuated::Punctuated;
use syn::{Expr, ExprArray, ExprLit, ItemConst, ItemFn, Lit, Meta, Token};

#[proc_macro_attribute]
pub fn command(arguments: TokenStream, item: TokenStream) -> TokenStream {
    match expand_command(arguments.into(), item.into()) {
        Ok(expanded) => expanded.into(),
        Err(error) => error.into_compile_error().into(),
    }
}

/// Attach the build-generated command modules to a product's `PROFILES`
/// declaration. This macro performs no environment or filesystem access so
/// rust-analyzer can expand it safely.
#[proc_macro_attribute]
pub fn profile_registry(_arguments: TokenStream, item: TokenStream) -> TokenStream {
    match expand_profile_registry(item.into()) {
        Ok(expanded) => expanded.into(),
        Err(error) => error.into_compile_error().into(),
    }
}

fn expand_profile_registry(item: TokenStream2) -> syn::Result<TokenStream2> {
    let declaration: ItemConst = syn::parse2(item)?;
    if declaration.ident != "PROFILES" {
        return Err(syn::Error::new_spanned(
            declaration.ident,
            "`#[feluqa::console::profile_registry]` belongs on the `PROFILES` constant",
        ));
    }

    Ok(quote! {
        #declaration
        // Cargo's build script creates this file before the product is compiled.
        include!(concat!(env!("OUT_DIR"), "/profile_commands.rs"));
    })
}

fn expand_command(arguments: TokenStream2, item: TokenStream2) -> syn::Result<TokenStream2> {
    let function: ItemFn = syn::parse2(item)?;
    let identifier = function.sig.ident.clone();
    let mut name = None;
    let mut description = None;
    let mut usage = None;
    let mut aliases = Vec::new();
    let mut context = String::from("any");
    let mut hidden = false;

    let parser = Punctuated::<Meta, Token![,]>::parse_terminated;
    for meta in parser.parse2(arguments)? {
        let Meta::NameValue(value) = meta else {
            return Err(syn::Error::new_spanned(
                meta,
                "expected `key = value` command metadata",
            ));
        };
        let key = value
            .path
            .get_ident()
            .ok_or_else(|| {
                syn::Error::new_spanned(&value.path, "metadata key must be an identifier")
            })?
            .to_string();
        match key.as_str() {
            "name" => name = Some(literal_string(&value.value, "name")?),
            "description" => description = Some(literal_string(&value.value, "description")?),
            "usage" => usage = Some(literal_string(&value.value, "usage")?),
            "context" => context = literal_string(&value.value, "context")?,
            "hidden" => hidden = literal_bool(&value.value, "hidden")?,
            "aliases" => aliases = literal_strings(&value.value, "aliases")?,
            _ => {
                return Err(syn::Error::new_spanned(
                    value.path,
                    "unknown command metadata key",
                ));
            }
        }
    }

    let name = name.ok_or_else(|| {
        syn::Error::new_spanned(&identifier, "command metadata requires `name = \"...\"`")
    })?;
    let description = description.ok_or_else(|| {
        syn::Error::new_spanned(
            &identifier,
            "command metadata requires `description = \"...\"`",
        )
    })?;
    if name.trim().is_empty() || description.trim().is_empty() {
        return Err(syn::Error::new_spanned(
            &identifier,
            "command name and description cannot be empty",
        ));
    }
    let alias_literals = aliases.iter();
    let usage_expression = match usage {
        Some(usage) => quote!(::core::option::Option::Some(#usage)),
        None => quote!(::core::option::Option::None),
    };
    let expanded = quote! {
        #function

        ::feluqa::console::inventory::submit! {
            ::feluqa::console::CommandDescriptor {
                name: #name,
                description: #description,
                usage: #usage_expression,
                aliases: &[#(#alias_literals),*],
                module_path: module_path!(),
                context: #context,
                hidden: #hidden,
                handler: #identifier,
            }
        }
    };
    Ok(expanded)
}

fn literal_string(expression: &Expr, name: &str) -> syn::Result<String> {
    match expression {
        Expr::Lit(ExprLit {
            lit: Lit::Str(value),
            ..
        }) => Ok(value.value()),
        _ => Err(syn::Error::new_spanned(
            expression,
            ::std::format!("`{name}` must be a string literal"),
        )),
    }
}

fn literal_bool(expression: &Expr, name: &str) -> syn::Result<bool> {
    match expression {
        Expr::Lit(ExprLit {
            lit: Lit::Bool(value),
            ..
        }) => Ok(value.value),
        _ => Err(syn::Error::new_spanned(
            expression,
            ::std::format!("`{name}` must be a boolean literal"),
        )),
    }
}

fn literal_strings(expression: &Expr, name: &str) -> syn::Result<Vec<String>> {
    let Expr::Array(ExprArray { elems, .. }) = expression else {
        return Err(syn::Error::new_spanned(
            expression,
            ::std::format!("`{name}` must be an array of string literals"),
        ));
    };
    elems
        .iter()
        .map(|entry| literal_string(entry, name))
        .collect()
}
