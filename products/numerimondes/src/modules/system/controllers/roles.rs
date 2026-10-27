#![no_implicit_prelude]

use super::*;
use crate::feluqa;

/// List roles and their exact permission grants.
pub async fn system_roles(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, csrf, access) = match protected_resource_page(
        &state,
        &headers,
        "system.roles",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let roles = match state.core.roles(identity.tenant_id).await {
        Ok(roles) => roles,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let rows = roles
        .iter()
        .map(|role| {
            let mut values = crate::std::collections::BTreeMap::new();
            values.insert(String::from("role_id"), role.id.to_string());
            values.insert(String::from("display_name"), role.display_name.clone());
            values.insert(String::from("slug"), role.slug.clone());
            values.insert(String::from("permissions"), role.permissions.join(", "));
            feluqa::panel::ResourceTableRow { values }
        })
        .collect::<Vec<_>>();
    let table = match crate::modules::system::resource::ROLES.render_table(
        &access,
        "Feluqa Core roles",
        &rows,
    ) {
        Ok(table) => feluqa::web::trusted_panel_html(table),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let (create_form, edit_forms) = match role_forms(&state, identity.user_id, csrf, &roles).await {
        Ok(forms) => forms,
        Err(status) => return status.into_response(),
    };
    let (navigation, brand_name) =
        match registered_panel_navigation(&state, &identity, "system", "/system/roles").await {
            Ok(navigation) => navigation,
            Err(status) => return status.into_response(),
        };
    match views::generated_views::core_roles(
        &identity.display_name,
        &identity.email,
        csrf,
        table,
        create_form,
        edit_forms,
        navigation,
        &brand_name,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Create a role from exact namespaced permissions.
pub async fn create_system_role(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<CreateRoleForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.roles.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    let grants = form
        .permissions
        .split(',')
        .map(str::trim)
        .filter(|grant| !grant.is_empty())
        .map(ToString::to_string)
        .collect::<Vec<_>>();
    match state
        .core
        .create_role(&form.slug, &form.display_name, &grants, identity.user_id)
        .await
    {
        Ok(_) => Redirect::to("/system/roles").into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidRole) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Replace a role's grants after session, CSRF and delegation checks.
pub async fn update_system_role(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<UpdateRoleForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.roles.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    let grants = form
        .permissions
        .split(',')
        .map(str::trim)
        .filter(|grant| !grant.is_empty())
        .map(ToString::to_string)
        .collect::<Vec<_>>();
    match state
        .core
        .update_role_grants(form.id, &grants, identity.user_id)
        .await
    {
        Ok(_) => Redirect::to("/system/roles").into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidRole) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
