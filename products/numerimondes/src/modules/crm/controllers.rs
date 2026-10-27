#![no_implicit_prelude]

use crate::app::controllers::panels::{protected_customer_page, session_csrf_valid};
use crate::app::services::panel::PanelState;
use crate::feluqa;
use crate::modules::crm::validation::{valid_customer, valid_customer_email, valid_customer_name};
use crate::views;
use feluqa::prelude::*;

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CustomerForm {
    csrf_token: String,
    name: String,
    email: String,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CustomerPageQuery {
    page: Option<u64>,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct UpdateCustomerForm {
    csrf_token: String,
    id: i64,
    name: Option<String>,
    email: Option<String>,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct DeleteCustomerForm {
    csrf_token: String,
    id: i64,
}

pub(crate) struct CustomerPageAccess<'a> {
    pub(crate) identity: feluqa::core::service::SessionIdentity,
    pub(crate) csrf: &'a str,
    pub(crate) scope: crate::modules::crm::policies::CustomerScope,
    pub(crate) fields: crate::modules::crm::policies::CustomerFields,
    pub(crate) can_create: bool,
    pub(crate) can_delete: bool,
    pub(crate) resource: feluqa::panel::ResourceAccess,
    pub(crate) create_resource: Option<feluqa::panel::ResourceAccess>,
    pub(crate) update_resource: Option<feluqa::panel::ResourceAccess>,
}

/// Render the CRM customer resource after checking its business permission.
pub async fn crm_customers(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Query(query): Query<CustomerPageQuery>,
) -> Response {
    let access = match protected_customer_page(
        &state,
        &headers,
        crate::modules::crm::policies::CustomerAction::Read,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let customer_page = match crate::modules::crm::services::list_customers_page(
        &state.database,
        access.scope,
        query.page.unwrap_or(1),
    )
    .await
    {
        Ok(page) => page,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let table =
        match crate::modules::crm::view::customer_table(&customer_page.customers, &access.resource)
        {
            Ok(table) => table,
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        };
    let mut customers = Vec::with_capacity(customer_page.customers.len());
    for customer in &customer_page.customers {
        let edit_form = match access.update_resource.as_ref() {
            Some(update_access) if !update_access.fields.writable.is_empty() => {
                match crate::modules::crm::view::customer_form(
                    update_access,
                    access.csrf,
                    Some(customer),
                    "Save changes",
                ) {
                    Ok(form) => form,
                    Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
                }
            }
            _ => crate::modules::crm::view::empty_panel_html(),
        };
        customers.push(crate::modules::crm::view::CustomerRow::with_form(
            customer.id,
            edit_form,
        ));
    }
    let create_form = match access.create_resource.as_ref() {
        Some(create_access) if access.can_create => {
            match crate::modules::crm::view::customer_form(
                create_access,
                access.csrf,
                None,
                "Create customer",
            ) {
                Ok(form) => form,
                Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
            }
        }
        _ => crate::modules::crm::view::empty_panel_html(),
    };
    let panel = crate::modules::crm::view::CustomerPanel {
        table,
        create_form,
        customers,
        can_create: access.can_create,
        can_delete: access.can_delete,
        page: customer_page.page,
        page_count: customer_page.page_count,
    };
    match views::generated_views::crm_customers(
        &access.identity.display_name,
        &access.identity.email,
        access.csrf,
        &panel,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Create a CRM customer after session-bound CSRF and business policy checks.
pub async fn create_customer(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<CustomerForm>,
) -> Response {
    let access = match protected_customer_page(
        &state,
        &headers,
        crate::modules::crm::policies::CustomerAction::Create,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !access.fields.write_name || !access.fields.write_email {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !valid_customer(&form.name, &form.email) {
        return StatusCode::BAD_REQUEST.into_response();
    }
    let created = crate::modules::crm::services::create_customer(
        &state.database,
        access.identity.user_id,
        access.identity.tenant_id,
        &form.name,
        &form.email,
    )
    .await;
    match created {
        Ok(_) => Redirect::to("/admin/customers").into_response(),
        Err(_) => StatusCode::CONFLICT.into_response(),
    }
}

/// Update a CRM customer while enforcing the same resource policy as the list.
pub async fn update_customer(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<UpdateCustomerForm>,
) -> Response {
    let access = match protected_customer_page(
        &state,
        &headers,
        crate::modules::crm::policies::CustomerAction::Update,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    if form.name.is_none() && form.email.is_none()
        || form
            .name
            .as_deref()
            .is_some_and(|name| !valid_customer_name(name))
        || form
            .email
            .as_deref()
            .is_some_and(|email| !valid_customer_email(email))
    {
        return StatusCode::BAD_REQUEST.into_response();
    }
    if form.name.is_some() && !access.fields.write_name
        || form.email.is_some() && !access.fields.write_email
    {
        return StatusCode::FORBIDDEN.into_response();
    }
    match crate::modules::crm::services::update_customer(
        &state.database,
        access.identity.user_id,
        form.id,
        form.name.as_deref(),
        form.email.as_deref(),
        access.scope,
    )
    .await
    {
        Ok(Some(_)) => Redirect::to("/admin/customers").into_response(),
        Ok(None) => StatusCode::NOT_FOUND.into_response(),
        Err(_) => StatusCode::CONFLICT.into_response(),
    }
}

/// Delete one CRM customer under the server-side business policy.
pub async fn delete_customer(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<DeleteCustomerForm>,
) -> Response {
    let access = match protected_customer_page(
        &state,
        &headers,
        crate::modules::crm::policies::CustomerAction::Delete,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match crate::modules::crm::services::delete_customer(
        &state.database,
        access.identity.user_id,
        form.id,
        access.scope,
    )
    .await
    {
        Ok(true) => Redirect::to("/admin/customers").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
