#![no_implicit_prelude]

use super::*;
use crate::feluqa;

/// List Core users and create accounts for identities holding the user grant.
pub async fn system_users(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, csrf, access) = match protected_resource_page(
        &state,
        &headers,
        "system.users",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let users = match state.core.users(identity.tenant_id).await {
        Ok(users) => users,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let roles = match state.core.delegable_roles(identity.user_id).await {
        Ok(roles) => roles,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let rows = users
        .iter()
        .map(|user| {
            let mut values = crate::std::collections::BTreeMap::new();
            values.insert(String::from("user_id"), user.id.to_string());
            values.insert(String::from("display_name"), user.display_name.clone());
            values.insert(String::from("email"), user.email.clone());
            values.insert(
                String::from("status"),
                String::from(if user.is_active { "Active" } else { "Disabled" }),
            );
            feluqa::panel::ResourceTableRow { values }
        })
        .collect::<Vec<_>>();
    let table = match crate::panels::system::resource::USERS.render_table(
        &access,
        "Feluqa Core users",
        &rows,
    ) {
        Ok(table) => feluqa::web::trusted_panel_html(table),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let (create_form, edit_forms) =
        match render_user_forms(&state, identity.user_id, csrf, &roles, &users).await {
            Ok(forms) => forms,
            Err(status) => return status.into_response(),
        };
    let (navigation, brand_name) =
        match registered_panel_navigation(&state, &identity, "system", "/system/users").await {
            Ok(navigation) => navigation,
            Err(status) => return status.into_response(),
        };
    match views::core_users(
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

/// Create an account through a CSRF-protected, permission-checked transaction.
pub async fn create_system_user(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<CreateUserForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.users.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state
        .core
        .create_user(
            &form.email,
            &form.display_name,
            &form.password,
            form.role_id,
            identity.user_id,
        )
        .await
    {
        Ok(_) => Redirect::to("/system/users").into_response(),
        Err(feluqa::core::service::CoreStoreError::InvalidBootstrap) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Change account state, revoke its sessions, and prevent self-deactivation.
pub async fn set_system_user_active(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<SetUserActiveForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.users.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    if identity.user_id == form.user_id && !form.active {
        return StatusCode::BAD_REQUEST.into_response();
    }
    match state
        .core
        .set_user_active(form.user_id, form.active, identity.user_id)
        .await
    {
        Ok(true) => Redirect::to("/system/users").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::UserLifecycleDenied) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Replace a user's role, enforcing delegation and revoking existing sessions.
pub async fn set_system_user_role(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<SetUserRoleForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.users.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state
        .core
        .set_user_role(form.user_id, form.role_id, identity.user_id)
        .await
    {
        Ok(true) => Redirect::to("/system/users").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidRole) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Replace a user's role from the resource-generated editor.
pub async fn update_system_user_role(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<UpdateUserRoleForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.users.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if form.id <= 0 || !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    let role_id = match form.role_id.parse::<i64>() {
        Ok(role_id) if role_id > 0 => role_id,
        _ => return StatusCode::BAD_REQUEST.into_response(),
    };
    match state
        .core
        .set_user_role(form.id, role_id, identity.user_id)
        .await
    {
        Ok(true) => Redirect::to("/system/users").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidRole) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
