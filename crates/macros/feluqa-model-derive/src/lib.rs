#![no_implicit_prelude]

extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate std;
extern crate syn;

use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::{format_ident, quote};
use std::clone::Clone;
use std::convert::From;
use std::iter::Iterator;
use std::matches;
use std::option::Option;
use std::option::Option::{None, Some};
use std::result::Result::{Err, Ok};
use std::string::String;
use std::string::ToString;
use std::vec::Vec;
use syn::{Data, DeriveInput, Error, Fields, Lit, Meta, Type};

/// Derive a Feluqa database model with table metadata and async find helpers.
#[proc_macro_derive(Model, attributes(table_name, primary_key, tenant_key, owner_key))]
pub fn derive_model(input: TokenStream) -> TokenStream {
    match expand(syn::parse_macro_input!(input as DeriveInput)) {
        Ok(tokens) => TokenStream::from(tokens),
        Err(error) => TokenStream::from(error.to_compile_error()),
    }
}

fn expand(input: DeriveInput) -> syn::Result<proc_macro2::TokenStream> {
    if !input.generics.params.is_empty() {
        return Err(Error::new_spanned(
            input.generics,
            "Feluqa models cannot have generic parameters",
        ));
    }
    let table_name = input
        .attrs
        .iter()
        .find(|attribute| attribute.path().is_ident("table_name"))
        .and_then(|attribute| match &attribute.meta {
            Meta::NameValue(value) => match &value.value {
                syn::Expr::Lit(expression) => match &expression.lit {
                    Lit::Str(value) => Some(value.value()),
                    _ => None,
                },
                _ => None,
            },
            _ => None,
        })
        .ok_or_else(|| Error::new(Span::call_site(), "expected #[table_name = \"table\"]"))?;
    let name = input.ident;
    let entity_module = format_ident!("__feluqa_entity_{}", name.to_string().to_lowercase());
    let Data::Struct(data) = input.data else {
        return Err(Error::new_spanned(
            name,
            "Model can only be derived for a struct",
        ));
    };
    let Fields::Named(fields) = data.fields else {
        return Err(Error::new_spanned(
            name,
            "Model requires a struct with named fields",
        ));
    };

    let mut field_names = Vec::new();
    let mut field_types: Vec<Type> = Vec::new();
    let mut primary = None;
    let mut tenant = None;
    let mut owner = None;
    for field in fields.named {
        let ident = field
            .ident
            .ok_or_else(|| Error::new(Span::call_site(), "model fields must be named"))?;
        let is_primary = field
            .attrs
            .iter()
            .any(|attribute| attribute.path().is_ident("primary_key"));
        if is_primary {
            if primary.is_some() {
                return Err(Error::new_spanned(
                    ident,
                    "Model requires exactly one primary key",
                ));
            }
            primary = Some((ident.clone(), field.ty.clone()));
        }
        if field
            .attrs
            .iter()
            .any(|attribute| attribute.path().is_ident("tenant_key"))
        {
            if tenant.is_some() {
                return Err(Error::new_spanned(
                    ident,
                    "Model supports at most one #[tenant_key] field",
                ));
            }
            tenant = Some((ident.clone(), field.ty.clone()));
        }
        if field
            .attrs
            .iter()
            .any(|attribute| attribute.path().is_ident("owner_key"))
        {
            if owner.is_some() {
                return Err(Error::new_spanned(
                    ident,
                    "Model supports at most one #[owner_key] field",
                ));
            }
            owner = Some((ident.clone(), field.ty.clone()));
        }
        field_names.push(ident);
        field_types.push(field.ty);
    }
    let Some((primary_name, primary_type)) = primary else {
        return Err(Error::new_spanned(
            name,
            "Model requires one #[primary_key] field",
        ));
    };
    if tenant
        .as_ref()
        .is_some_and(|(tenant_name, _)| *tenant_name == primary_name)
    {
        return Err(Error::new_spanned(
            primary_name,
            "the primary key cannot also be the #[tenant_key] field",
        ));
    }
    if let Some((tenant_name, tenant_type)) = &tenant {
        if !matches!(tenant_type, Type::Path(path) if path.path.is_ident("i64")) {
            return Err(Error::new_spanned(
                tenant_name,
                "the #[tenant_key] field must be typed as i64",
            ));
        }
    }
    if let Some((owner_name, owner_type)) = &owner {
        if tenant.is_none() {
            return Err(Error::new_spanned(
                owner_name,
                "#[owner_key] requires a #[tenant_key] field",
            ));
        }
        if !matches!(owner_type, Type::Path(path) if path.path.is_ident("i64")) {
            return Err(Error::new_spanned(
                owner_name,
                "the #[owner_key] field must be typed as i64",
            ));
        }
        if *owner_name == primary_name
            || tenant
                .as_ref()
                .is_some_and(|(tenant_name, _)| *owner_name == *tenant_name)
        {
            return Err(Error::new_spanned(
                owner_name,
                "the #[owner_key] field must be distinct from the primary and tenant keys",
            ));
        }
    }
    let row_fields = field_names
        .iter()
        .zip(field_types.iter())
        .map(|(field, ty)| {
            if *field == primary_name {
                quote! { #[sea_orm(primary_key)] pub #field: #ty }
            } else {
                quote! { pub #field: #ty }
            }
        });
    let from_row: Vec<_> = field_names
        .iter()
        .map(|field| quote! { #field: row.#field })
        .collect();
    let from_row_again: Vec<_> = field_names
        .iter()
        .map(|field| quote! { #field: row.#field })
        .collect();
    let insert_fields: Vec<_> = field_names
        .iter()
        .filter(|field| **field != primary_name)
        .map(|field| quote! { #field: ::feluqa::database::orm::ActiveValue::Set(self.#field.clone()) })
        .collect();
    let update_fields: Vec<_> = field_names
        .iter()
        .map(|field| quote! { #field: ::feluqa::database::orm::ActiveValue::Set(self.#field.clone()) })
        .collect();
    let update_by_id_fields: Vec<_> = field_names
        .iter()
        .map(|field| {
            if *field == primary_name {
                quote! { #field: ::feluqa::database::orm::ActiveValue::Set(id) }
            } else {
                quote! { #field: ::feluqa::database::orm::ActiveValue::Set(values.#field.clone()) }
            }
        })
        .collect();
    let primary_column = format_ident!("{}", upper_camel(&primary_name.to_string()));
    let model_label = name.to_string();
    let is_tenant_scoped = tenant.is_some();
    let unscoped_guard = quote! {
        ::feluqa::database::eloquent::ensure_unscoped_allowed::<Self>()?;
    };
    let attributes_name = format_ident!("{}Attributes", name);
    let attribute_fields: Vec<_> = field_names
        .iter()
        .zip(field_types.iter())
        .filter(|(field, _)| **field != primary_name && !is_scoped_field(field, &tenant, &owner))
        .map(|(field, ty)| quote! { pub #field: #ty })
        .collect();
    let create_attribute_fields: Vec<_> = field_names
        .iter()
        .filter(|field| **field != primary_name && !is_scoped_field(field, &tenant, &owner))
        .map(|field| quote! { #field: ::feluqa::database::orm::ActiveValue::Set(values.#field.clone()) })
        .collect();
    let update_attribute_fields: Vec<_> = field_names
        .iter()
        .filter(|field| !is_scoped_field(field, &tenant, &owner))
        .map(|field| {
            if *field == primary_name {
                quote! { #field: ::feluqa::database::orm::ActiveValue::Set(id) }
            } else {
                quote! { #field: ::feluqa::database::orm::ActiveValue::Set(values.#field.clone()) }
            }
        })
        .collect();
    let tenant_methods = tenant.as_ref().map(|(tenant_name, tenant_type)| {
        let tenant_column = format_ident!("{}", upper_camel(&tenant_name.to_string()));
        let owner_parameter = owner
            .as_ref()
            .map(|_| quote! { owner_id: i64, });
        let owner_filter = owner.as_ref().map(|(owner_name, _)| {
            let owner_column = format_ident!("{}", upper_camel(&owner_name.to_string()));
            quote! { .filter(#entity_module::Column::#owner_column.eq(owner_id)) }
        });
        let owner_insert = owner.as_ref().map(|(owner_name, _)| {
            quote! { #owner_name: ::feluqa::database::orm::ActiveValue::Set(owner_id), }
        });
        let create_fields: Vec<_> = field_names
            .iter()
            .filter(|field| {
                **field != primary_name
                    && **field != *tenant_name
                    && !owner.as_ref().is_some_and(|(owner_name, _)| **field == *owner_name)
            })
            .map(|field| quote! { #field: ::feluqa::database::orm::ActiveValue::Set(values.#field.clone()) })
            .collect();
        let update_fields: Vec<_> = field_names
            .iter()
            .filter(|field| {
                **field != primary_name
                    && **field != *tenant_name
                    && !owner.as_ref().is_some_and(|(owner_name, _)| **field == *owner_name)
            })
            .map(|field| quote! { active.#field = ::feluqa::database::orm::ActiveValue::Set(values.#field.clone()); })
            .collect();
        quote! {
            /// Fetch one record only if it belongs to the authenticated tenant.
            pub async fn find_or_fail_in_tenant(
                database: &::feluqa::database::orm::DatabaseConnection,
                id: #primary_type,
                tenant_id: #tenant_type,
                #owner_parameter
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                use ::feluqa::database::orm::{ColumnTrait, EntityTrait, QueryFilter};
                let row = #entity_module::Entity::find_by_id(id)
                    .filter(#entity_module::Column::#tenant_column.eq(tenant_id))
                    #owner_filter
                    .one(database)
                    .await?
                    .ok_or_else(|| ::feluqa::database::orm::DbErr::RecordNotFound(
                        ::std::string::String::from(#model_label),
                    ))?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Fetch one bounded page after the tenant predicate has been applied in SQL.
            pub async fn page_in_tenant(
                database: &::feluqa::database::orm::DatabaseConnection,
                tenant_id: #tenant_type,
                #owner_parameter
                requested_page: u64,
            ) -> ::core::result::Result<::feluqa::database::ModelPage<Self>, ::feluqa::database::orm::DbErr> {
                use ::feluqa::database::orm::{ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect};
                let paginator = #entity_module::Entity::find()
                    .filter(#entity_module::Column::#tenant_column.eq(tenant_id))
                    #owner_filter
                    .order_by_asc(#entity_module::Column::#primary_column)
                    .paginate(database, 20);
                let raw_page_count = paginator.num_pages().await?;
                let page_count = if raw_page_count == 0 { 1 } else { raw_page_count };
                let page = if requested_page == 0 { 1 } else if requested_page > page_count { page_count } else { requested_page };
                let rows = paginator.fetch_page(page - 1).await?;
                let items = rows.into_iter().map(|row| Self { #(#from_row_again,)* }).collect();
                ::core::result::Result::Ok(::feluqa::database::ModelPage { items, page, page_count })
            }

            /// Create a row using trusted session tenant state; tenant is not writable input.
            pub async fn create_from_in_tenant<C>(
                database: &C,
                values: &#attributes_name,
                tenant_id: #tenant_type,
                #owner_parameter
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr>
            where
                C: ::feluqa::database::orm::ConnectionTrait,
            {
                use ::feluqa::database::orm::ActiveModelTrait;
                let row = #entity_module::ActiveModel {
                    #(#create_fields,)*
                    #tenant_name: ::feluqa::database::orm::ActiveValue::Set(tenant_id),
                    #owner_insert
                    ..::core::default::Default::default()
                }.insert(database).await?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Update a row only inside its tenant; the tenant key is immutable.
            pub async fn update_from_in_tenant<C>(
                database: &C,
                id: #primary_type,
                tenant_id: #tenant_type,
                #owner_parameter
                values: &#attributes_name,
            ) -> ::core::result::Result<::core::option::Option<Self>, ::feluqa::database::orm::DbErr>
            where
                C: ::feluqa::database::orm::ConnectionTrait,
            {
                use ::feluqa::database::orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter};
                let row = #entity_module::Entity::find_by_id(id)
                    .filter(#entity_module::Column::#tenant_column.eq(tenant_id))
                    #owner_filter
                    .one(database).await?;
                let ::core::option::Option::Some(row) = row else {
                    return ::core::result::Result::Ok(::core::option::Option::None);
                };
                let mut active = #entity_module::ActiveModel::from(row);
                #(#update_fields)*
                let row = active.update(database).await?;
                ::core::result::Result::Ok(::core::option::Option::Some(Self { #(#from_row,)* }))
            }

            /// Delete a row only when its ID and tenant match the trusted request identity.
            pub async fn delete_in_tenant<C>(
                database: &C,
                id: #primary_type,
                tenant_id: #tenant_type,
                #owner_parameter
            ) -> ::core::result::Result<bool, ::feluqa::database::orm::DbErr>
            where
                C: ::feluqa::database::orm::ConnectionTrait,
            {
                use ::feluqa::database::orm::{ColumnTrait, EntityTrait, QueryFilter};
                let result = #entity_module::Entity::delete_many()
                    .filter(#entity_module::Column::#tenant_column.eq(tenant_id))
                    #owner_filter
                    .filter(#entity_module::Column::#primary_column.eq(id))
                    .exec(database).await?;
                ::core::result::Result::Ok(result.rows_affected > 0)
            }
        }
    });

    Ok(quote! {
        #[allow(unused_imports)]
        use ::feluqa::database::orm::{ActiveModelTrait, EntityTrait, PaginatorTrait, QueryOrder, QuerySelect};
        #[allow(unused_imports)]
        use ::core::iter::{IntoIterator, Iterator};
        #[allow(unused_imports)]
        use ::std::panic;

        #[allow(non_snake_case)]
        mod #entity_module {
            use ::feluqa::database::orm as sea_orm;
            use sea_orm::entity::prelude::*;
            use ::core::iter::Iterator;
            use super::*;

            #[derive(::core::clone::Clone, ::core::fmt::Debug, PartialEq, sea_orm::DeriveEntityModel)]
            #[sea_orm(table_name = #table_name)]
            pub struct Model {
                #(#row_fields,)*
            }

            #[derive(Copy, ::core::clone::Clone, ::core::fmt::Debug, sea_orm::EnumIter, sea_orm::DeriveRelation)]
            pub enum Relation {}

            impl ActiveModelBehavior for ActiveModel {}
        }

        impl ::feluqa::database::eloquent::Model for #name {
            type Id = #primary_type;
            const TABLE_NAME: &'static str = #table_name;
            const TENANT_SCOPED: bool = #is_tenant_scoped;
        }

        /// Writable fields accepted by generated CRUD actions; the primary key is never mass-assigned.
        #[derive(crate::serde::Deserialize, crate::serde::Serialize)]
        #[serde(deny_unknown_fields)]
        pub struct #attributes_name {
            #(#attribute_fields,)*
        }

        impl #name {
            /// Find one model by primary key.
            pub async fn find(
                database: &::feluqa::database::orm::DatabaseConnection,
                id: #primary_type,
            ) -> ::core::result::Result<
                ::core::option::Option<Self>,
                ::feluqa::database::orm::DbErr,
            > {
                #unscoped_guard
                let row = #entity_module::Entity::find_by_id(id).one(database).await?;
                ::core::result::Result::Ok(row.map(|row| Self { #(#from_row,)* }))
            }

            /// Find one model or return SeaORM's typed record-not-found error.
            pub async fn find_or_fail(
                database: &::feluqa::database::orm::DatabaseConnection,
                id: #primary_type,
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                match Self::find(database, id).await? {
                    ::core::option::Option::Some(model) => ::core::result::Result::Ok(model),
                    ::core::option::Option::None => ::core::result::Result::Err(
                        ::feluqa::database::orm::DbErr::RecordNotFound(
                            ::std::string::String::from(#model_label),
                        ),
                    ),
                }
            }

            /// Fetch one deterministic page of rows, capped at twenty records.
            pub async fn page(
                database: &::feluqa::database::orm::DatabaseConnection,
                requested_page: u64,
            ) -> ::core::result::Result<::feluqa::database::ModelPage<Self>, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let paginator = #entity_module::Entity::find()
                    .order_by_asc(#entity_module::Column::#primary_column)
                    .paginate(database, 20);
                let raw_page_count = paginator.num_pages().await?;
                let page_count = if raw_page_count == 0 { 1 } else { raw_page_count };
                let page = if requested_page == 0 {
                    1
                } else if requested_page > page_count {
                    page_count
                } else {
                    requested_page
                };
                let rows = paginator.fetch_page(page - 1).await?;
                let items = rows
                    .into_iter()
                    .map(|row| Self { #(#from_row_again,)* })
                    .collect();
                ::core::result::Result::Ok(::feluqa::database::ModelPage {
                    items,
                    page,
                    page_count,
                })
            }

            /// Insert this model's non-key fields and return the database-assigned model.
            pub async fn create(
                &self,
                database: &::feluqa::database::orm::DatabaseConnection,
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let row = #entity_module::ActiveModel {
                    #(#insert_fields,)*
                    ..::core::default::Default::default()
                }
                .insert(database)
                .await?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Insert only the writable fields exposed by the generated attributes type.
            pub async fn create_from(
                database: &::feluqa::database::orm::DatabaseConnection,
                values: &#attributes_name,
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let row = #entity_module::ActiveModel {
                    #(#create_attribute_fields,)*
                    ..::core::default::Default::default()
                }
                .insert(database)
                .await?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Replace this row's fields by primary key and return the saved model.
            pub async fn update(
                &self,
                database: &::feluqa::database::orm::DatabaseConnection,
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let row = #entity_module::ActiveModel {
                    #(#update_fields,)*
                }
                .update(database)
                .await?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Update a model's non-key fields by an explicit primary key.
            pub async fn update_by_id(
                database: &::feluqa::database::orm::DatabaseConnection,
                id: #primary_type,
                values: &Self,
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let row = #entity_module::ActiveModel {
                    #(#update_by_id_fields,)*
                }
                .update(database)
                .await?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Update only the writable fields exposed by the generated attributes type.
            pub async fn update_from(
                database: &::feluqa::database::orm::DatabaseConnection,
                id: #primary_type,
                values: &#attributes_name,
            ) -> ::core::result::Result<Self, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let row = #entity_module::ActiveModel {
                    #(#update_attribute_fields,)*
                    ..::core::default::Default::default()
                }
                .update(database)
                .await?;
                ::core::result::Result::Ok(Self { #(#from_row,)* })
            }

            /// Delete one row by primary key; return `false` when it does not exist.
            pub async fn delete(
                database: &::feluqa::database::orm::DatabaseConnection,
                id: #primary_type,
            ) -> ::core::result::Result<bool, ::feluqa::database::orm::DbErr> {
                #unscoped_guard
                let result = #entity_module::Entity::delete_by_id(id).exec(database).await?;
                ::core::result::Result::Ok(result.rows_affected > 0)
            }

            #tenant_methods
        }
    })
}

fn upper_camel(value: &str) -> String {
    let mut output = String::new();
    let mut uppercase = true;
    for character in value.chars() {
        if character == '_' {
            uppercase = true;
        } else if uppercase {
            output.push(character.to_ascii_uppercase());
            uppercase = false;
        } else {
            output.push(character);
        }
    }
    output
}

fn is_scoped_field(
    field: &syn::Ident,
    tenant: &Option<(syn::Ident, Type)>,
    owner: &Option<(syn::Ident, Type)>,
) -> bool {
    tenant
        .as_ref()
        .is_some_and(|(tenant_name, _)| field == tenant_name)
        || owner
            .as_ref()
            .is_some_and(|(owner_name, _)| field == owner_name)
}
