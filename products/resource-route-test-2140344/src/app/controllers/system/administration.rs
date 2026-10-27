#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;

use crate::app::controllers::system::{constant_time_equal, cookie, origin_valid};
use feluqa::auth::{Authorizer, Permission, PermissionSetAuthorizer, Principal};
use feluqa::core::service::{CoreStore, CoreStoreError, SessionIdentity};
use feluqa::panel::{PanelCatalog, ResourceAccess, ResourceAuthorizationError, ResourceOperation, ResourceTableRow};
use feluqa::prelude::*;
use crate::std::format;
use crate::std::string::ToString;
use crate::std::vec::Vec;

const SESSION_COOKIE: &str = "feluqa_session";
const CSRF_COOKIE: &str = "feluqa_csrf";

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CreateUserForm {
    csrf_token: String,
    display_name: String,
    email: String,
    password: String,
    role_id: i64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetUserActiveForm {
    csrf_token: String,
    user_id: i64,
    active: bool,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetUserRoleForm {
    csrf_token: String,
    user_id: i64,
    role_id: i64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct UpdateUserRoleForm {
    csrf_token: String,
    id: i64,
    role_id: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CreateRoleForm {
    csrf_token: String,
    slug: String,
    display_name: String,
    permissions: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct UpdateRoleForm {
    csrf_token: String,
    id: i64,
    permissions: String,
}

pub(crate) async fn users(
    Extension(core): Extension<CoreStore>,
    Extension(catalog): Extension<PanelCatalog>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    headers: HeaderMap,
) -> Response {
    let access = match catalog.authorize_resource(
        "system.users",
        ResourceOperation::List,
        &principal,
        identity.user_id,
        &PermissionSetAuthorizer,
    ) {
        Ok(access) => access,
        Err(ResourceAuthorizationError::Denied) => return StatusCode::FORBIDDEN.into_response(),
        Err(ResourceAuthorizationError::UnknownResource) => {
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let Some(csrf) = cookie(&headers, CSRF_COOKIE) else {
        return StatusCode::UNAUTHORIZED.into_response();
    };
    let (Ok(users), Ok(roles)) = (core.users(identity.tenant_id).await, core.delegable_roles(identity.user_id).await) else {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
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
                String::from(if user.is_active { "active" } else { "disabled" }),
            );
            ResourceTableRow { values }
        })
        .collect::<Vec<_>>();
    let user_table = match crate::modules::system::resource::USERS
        .render_table(&access, "Feluqa Core users", &rows)
    {
        Ok(table) => feluqa::web::trusted_panel_html(table),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let role_options = roles
        .iter()
        .map(|role| feluqa::panel::ResourceOption {
            value: role.id.to_string(),
            label: format!("{} ({})", role.display_name, role.slug),
        })
        .collect::<Vec<_>>();
    let mut options = crate::std::collections::BTreeMap::new();
    options.insert(String::from("role_id"), role_options);
    let (create_form, edit_forms) = if options["role_id"].is_empty() {
        (
            feluqa::view::TrustedHtml::from_trusted(String::new()),
            feluqa::view::TrustedHtml::from_trusted(String::new()),
        )
    } else {
        match user_forms(&catalog, &principal, identity.user_id, csrf, &users, &options) {
            Ok(forms) => forms,
            Err(status) => return status.into_response(),
        }
    };
    let navigation = match panel_navigation(&catalog, &principal, "/system/users") {
        Ok(navigation) => navigation,
        Err(status) => return status.into_response(),
    };
    match crate::views::system_users(
        &identity.display_name,
        &identity.email,
        csrf,
        user_table,
        create_form,
        edit_forms,
        navigation,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

fn user_forms(
    catalog: &PanelCatalog,
    principal: &Principal,
    actor_user_id: i64,
    csrf: &str,
    users: &[feluqa::core::service::UserSummary],
    options: &crate::std::collections::BTreeMap<String, Vec<feluqa::panel::ResourceOption>>,
) -> Result<(feluqa::view::TrustedHtml, feluqa::view::TrustedHtml), StatusCode> {
    let resource = crate::modules::system::resource::USERS;
    let create_form = match optional_resource_access(
        catalog,
        principal,
        actor_user_id,
        resource.id,
        ResourceOperation::Create,
    )? {
        Some(access) => resource
            .render_form_with_options(
                &access,
                csrf,
                None,
                "Create account",
                &crate::std::collections::BTreeMap::new(),
                options,
            )
            .map(feluqa::web::trusted_panel_html)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
        None => feluqa::view::TrustedHtml::from_trusted(String::new()),
    };
    let update_access = optional_resource_access(
        catalog,
        principal,
        actor_user_id,
        resource.id,
        ResourceOperation::Update,
    )?;
    let mut forms = String::new();
    if let Some(access) = update_access {
        for user in users {
            let mut values = crate::std::collections::BTreeMap::new();
            if let Some(role_id) = user.role_id {
                values.insert(String::from("role_id"), role_id.to_string());
            }
            let form = resource
                .render_form_with_options(
                    &access,
                    csrf,
                    Some(user.id),
                    "Change role and revoke sessions",
                    &values,
                    options,
                )
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
            forms.push_str("<section class=\"user-role-editor\"><h3>User #");
            forms.push_str(&user.id.to_string());
            forms.push_str("</h3>");
            forms.push_str(form.as_str());
            forms.push_str("</section>");
        }
    }
    Ok((
        create_form,
        feluqa::view::TrustedHtml::from_trusted(forms),
    ))
}

fn optional_resource_access(
    catalog: &PanelCatalog,
    principal: &Principal,
    actor_user_id: i64,
    resource_id: &str,
    operation: ResourceOperation,
) -> Result<Option<ResourceAccess>, StatusCode> {
    match catalog.authorize_resource(
        resource_id,
        operation,
        principal,
        actor_user_id,
        &PermissionSetAuthorizer,
    ) {
        Ok(access) => Ok(Some(access)),
        Err(ResourceAuthorizationError::Denied) => Ok(None),
        Err(ResourceAuthorizationError::UnknownResource) => {
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub(crate) async fn create_user(
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<CreateUserForm>,
) -> Response {
    if !authorized(&principal, "system.users.write") {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !csrf_valid(&core, &headers, &form.csrf_token, secure).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match core
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
        Err(CoreStoreError::GrantEscalation) => StatusCode::FORBIDDEN.into_response(),
        Err(CoreStoreError::InvalidBootstrap | CoreStoreError::InvalidRole) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) async fn set_user_active(
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<SetUserActiveForm>,
) -> Response {
    if !authorized(&principal, "system.users.write") {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !csrf_valid(&core, &headers, &form.csrf_token, secure).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    if identity.user_id == form.user_id && !form.active {
        return StatusCode::BAD_REQUEST.into_response();
    }
    match core
        .set_user_active(form.user_id, form.active, identity.user_id)
        .await
    {
        Ok(true) => Redirect::to("/system/users").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(CoreStoreError::GrantEscalation) => StatusCode::FORBIDDEN.into_response(),
        Err(CoreStoreError::UserLifecycleDenied) => StatusCode::BAD_REQUEST.into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) async fn set_user_role(
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<SetUserRoleForm>,
) -> Response {
    if !authorized(&principal, "system.users.write") {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !csrf_valid(&core, &headers, &form.csrf_token, secure).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match core
        .set_user_role(form.user_id, form.role_id, identity.user_id)
        .await
    {
        Ok(true) => Redirect::to("/system/users").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(CoreStoreError::GrantEscalation) => StatusCode::FORBIDDEN.into_response(),
        Err(CoreStoreError::InvalidRole) => StatusCode::BAD_REQUEST.into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) async fn update_user_role(
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<UpdateUserRoleForm>,
) -> Response {
    if !authorized(&principal, "system.users.write") {
        return StatusCode::FORBIDDEN.into_response();
    }
    if form.id <= 0 || !csrf_valid(&core, &headers, &form.csrf_token, secure).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    let role_id = match form.role_id.parse::<i64>() {
        Ok(role_id) if role_id > 0 => role_id,
        _ => return StatusCode::BAD_REQUEST.into_response(),
    };
    match core
        .set_user_role(form.id, role_id, identity.user_id)
        .await
    {
        Ok(true) => Redirect::to("/system/users").into_response(),
        Ok(false) => StatusCode::NOT_FOUND.into_response(),
        Err(CoreStoreError::GrantEscalation) => StatusCode::FORBIDDEN.into_response(),
        Err(CoreStoreError::InvalidRole) => StatusCode::BAD_REQUEST.into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) async fn roles(
    Extension(core): Extension<CoreStore>,
    Extension(catalog): Extension<PanelCatalog>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    headers: HeaderMap,
) -> Response {
    let access = match catalog.authorize_resource(
        "system.roles",
        ResourceOperation::List,
        &principal,
        identity.user_id,
        &PermissionSetAuthorizer,
    ) {
        Ok(access) => access,
        Err(ResourceAuthorizationError::Denied) => return StatusCode::FORBIDDEN.into_response(),
        Err(ResourceAuthorizationError::UnknownResource) => {
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let Some(csrf) = cookie(&headers, CSRF_COOKIE) else {
        return StatusCode::UNAUTHORIZED.into_response();
    };
    let roles = match core.roles(identity.tenant_id).await {
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
            ResourceTableRow { values }
        })
        .collect::<Vec<_>>();
    let role_table = match crate::modules::system::resource::ROLES
        .render_table(&access, "Feluqa Core roles", &rows)
    {
        Ok(table) => feluqa::web::trusted_panel_html(table),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let create_form = match optional_role_access(
        &catalog,
        &principal,
        identity.user_id,
        ResourceOperation::Create,
    ) {
        Ok(Some(access)) => crate::modules::system::resource::ROLES
            .render_form(
                &access,
                csrf,
                None,
                "Create role",
                &crate::std::collections::BTreeMap::new(),
            )
            .map(feluqa::web::trusted_panel_html)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR),
        Ok(None) => Ok(feluqa::view::TrustedHtml::from_trusted(String::new())),
        Err(status) => Err(status),
    };
    let create_form = match create_form {
        Ok(form) => form,
        Err(status) => return status.into_response(),
    };
    let update_access = match optional_role_access(
        &catalog,
        &principal,
        identity.user_id,
        ResourceOperation::Update,
    ) {
        Ok(access) => access,
        Err(status) => return status.into_response(),
    };
    let mut edit_forms = String::new();
    if let Some(access) = update_access {
        for role in roles.iter().filter(|role| !role.is_system) {
            let mut values = crate::std::collections::BTreeMap::new();
            values.insert(String::from("permissions"), role.permissions.join(",\n"));
            let form = match crate::modules::system::resource::ROLES.render_form(
                &access,
                csrf,
                Some(role.id),
                "Update role grants",
                &values,
            ) {
                Ok(form) => form,
                Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
            };
            edit_forms.push_str("<section class=\"role-editor\"><h3>Role #");
            edit_forms.push_str(&role.id.to_string());
            edit_forms.push_str("</h3>");
            edit_forms.push_str(form.as_str());
            edit_forms.push_str("</section>");
        }
    }
    let edit_forms = feluqa::view::TrustedHtml::from_trusted(edit_forms);
    let navigation = match panel_navigation(&catalog, &principal, "/system/roles") {
        Ok(navigation) => navigation,
        Err(status) => return status.into_response(),
    };
    match crate::views::system_roles(
        &identity.display_name,
        &identity.email,
        csrf,
        role_table,
        create_form,
        edit_forms,
        navigation,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

fn optional_role_access(
    catalog: &PanelCatalog,
    principal: &Principal,
    actor_user_id: i64,
    operation: ResourceOperation,
) -> Result<Option<ResourceAccess>, StatusCode> {
    match catalog.authorize_resource(
        "system.roles",
        operation,
        principal,
        actor_user_id,
        &PermissionSetAuthorizer,
    ) {
        Ok(access) => Ok(Some(access)),
        Err(ResourceAuthorizationError::Denied) => Ok(None),
        Err(ResourceAuthorizationError::UnknownResource) => {
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub(crate) async fn create_role(
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<CreateRoleForm>,
) -> Response {
    if !authorized(&principal, "system.roles.write") {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !csrf_valid(&core, &headers, &form.csrf_token, secure).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    let grants = permissions(&form.permissions);
    match core
        .create_role(&form.slug, &form.display_name, &grants, identity.user_id)
        .await
    {
        Ok(_) => Redirect::to("/system/roles").into_response(),
        Err(CoreStoreError::GrantEscalation) => StatusCode::FORBIDDEN.into_response(),
        Err(CoreStoreError::InvalidRole) => StatusCode::BAD_REQUEST.into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) async fn update_role(
    Extension(core): Extension<CoreStore>,
    Extension(principal): Extension<Principal>,
    Extension(identity): Extension<SessionIdentity>,
    Extension(secure): Extension<bool>,
    headers: HeaderMap,
    Form(form): Form<UpdateRoleForm>,
) -> Response {
    if !authorized(&principal, "system.roles.write") {
        return StatusCode::FORBIDDEN.into_response();
    }
    if !csrf_valid(&core, &headers, &form.csrf_token, secure).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match core
        .update_role_grants(form.id, &permissions(&form.permissions), identity.user_id)
        .await
    {
        Ok(_) => Redirect::to("/system/roles").into_response(),
        Err(CoreStoreError::GrantEscalation) => StatusCode::FORBIDDEN.into_response(),
        Err(CoreStoreError::InvalidRole) => StatusCode::BAD_REQUEST.into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(crate) fn authorized(principal: &Principal, permission: &str) -> bool {
    Permission::new(String::from(permission))
        .is_ok_and(|permission| PermissionSetAuthorizer.authorize(principal, &permission).is_ok())
}

pub(crate) fn panel_navigation(
    catalog: &PanelCatalog,
    principal: &Principal,
    active_path: &str,
) -> Result<feluqa::view::TrustedHtml, StatusCode> {
    catalog
        .render_navigation("system", principal, &PermissionSetAuthorizer, active_path)
        .map(feluqa::web::trusted_navigation_html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

fn permissions(source: &str) -> Vec<String> {
    source
        .split(',')
        .map(str::trim)
        .filter(|permission| !permission.is_empty())
        .map(ToString::to_string)
        .collect()
}

pub(crate) async fn csrf_valid(
    core: &CoreStore,
    headers: &HeaderMap,
    submitted: &str,
    secure: bool,
) -> bool {
    if !origin_valid(headers, secure) {
        return false;
    }
    let (Some(session), Some(cookie_token)) = (
        cookie(headers, SESSION_COOKIE),
        cookie(headers, CSRF_COOKIE),
    ) else {
        return false;
    };
    constant_time_equal(cookie_token, submitted)
        && matches!(core.verify_csrf(session, submitted).await, Ok(true))
}
