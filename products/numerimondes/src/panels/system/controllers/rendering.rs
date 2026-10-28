#![no_implicit_prelude]

use super::*;

pub(super) async fn render_user_forms(
    state: &PanelState,
    actor_user_id: i64,
    csrf: &str,
    roles: &[feluqa::core::service::RoleSummary],
    users: &[feluqa::core::service::UserSummary],
) -> Result<(feluqa::view::TrustedHtml, feluqa::view::TrustedHtml), StatusCode> {
    if roles.is_empty() {
        return Ok((
            feluqa::view::TrustedHtml::from_trusted(String::new()),
            feluqa::view::TrustedHtml::from_trusted(String::new()),
        ));
    }
    let resource = crate::panels::system::resource::USERS;
    let options = roles
        .iter()
        .map(|role| feluqa::panel::ResourceOption {
            value: role.id.to_string(),
            label: format!("{} ({})", role.display_name, role.slug),
        })
        .collect::<Vec<_>>();
    let mut option_map = crate::std::collections::BTreeMap::new();
    option_map.insert(String::from("role_id"), options);

    let create_access = optional_resource_access(
        state,
        actor_user_id,
        resource.id,
        feluqa::panel::ResourceOperation::Create,
    )
    .await?;
    let create_form = match create_access {
        Some(access) => resource
            .render_form_with_options(
                &access,
                csrf,
                None,
                "Create account",
                &crate::std::collections::BTreeMap::new(),
                &option_map,
            )
            .map(feluqa::web::trusted_panel_html)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
        None => feluqa::view::TrustedHtml::from_trusted(String::new()),
    };

    let update_access = optional_resource_access(
        state,
        actor_user_id,
        resource.id,
        feluqa::panel::ResourceOperation::Update,
    )
    .await?;
    let mut edit_html = String::new();
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
                    &option_map,
                )
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
            edit_html.push_str("<section class=\"user-role-editor\"><h3>User #");
            edit_html.push_str(&user.id.to_string());
            edit_html.push_str("</h3>");
            edit_html.push_str(form.as_str());
            edit_html.push_str("</section>");
        }
    }
    Ok((
        create_form,
        feluqa::view::TrustedHtml::from_trusted(edit_html),
    ))
}

pub(super) async fn role_forms(
    state: &PanelState,
    actor_user_id: i64,
    csrf: &str,
    roles: &[feluqa::core::service::RoleSummary],
) -> Result<(feluqa::view::TrustedHtml, feluqa::view::TrustedHtml), StatusCode> {
    let create_access = optional_resource_access(
        state,
        actor_user_id,
        "system.roles",
        feluqa::panel::ResourceOperation::Create,
    )
    .await?;
    let create_form = match create_access {
        Some(access) => crate::panels::system::resource::ROLES
            .render_form(
                &access,
                csrf,
                None,
                "Create role",
                &crate::std::collections::BTreeMap::new(),
            )
            .map(feluqa::web::trusted_panel_html)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
        None => feluqa::view::TrustedHtml::from_trusted(String::new()),
    };

    let update_access = optional_resource_access(
        state,
        actor_user_id,
        "system.roles",
        feluqa::panel::ResourceOperation::Update,
    )
    .await?;
    let mut edit_html = String::new();
    if let Some(access) = update_access {
        for role in roles.iter().filter(|role| !role.is_system) {
            let mut values = crate::std::collections::BTreeMap::new();
            values.insert(String::from("permissions"), role.permissions.join(",\n"));
            let form = crate::panels::system::resource::ROLES
                .render_form(&access, csrf, Some(role.id), "Update role grants", &values)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
            edit_html.push_str("<section class=\"role-editor\"><h3>Role #");
            edit_html.push_str(&role.id.to_string());
            edit_html.push_str("</h3>");
            edit_html.push_str(form.as_str());
            edit_html.push_str("</section>");
        }
    }
    Ok((
        create_form,
        feluqa::view::TrustedHtml::from_trusted(edit_html),
    ))
}

pub(super) fn render_anonymous_form(state: &PanelState, setup: bool, notice: &str) -> Response {
    let token = match SecretToken::generate() {
        Ok(token) => token.expose().to_string(),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let html = if setup {
        views::core_setup(&token, notice)
    } else {
        views::core_login(&token, notice)
    };
    let html = match html {
        Ok(html) => html,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let mut response = Html(html).into_response();
    if !set_cookie(
        &mut response,
        &cookie_value(LOGIN_CSRF_COOKIE, &token, true, state.secure_cookies, 600),
    ) {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    response
}

pub(crate) async fn render_dashboard(
    state: &PanelState,
    identity: &SessionIdentity,
    headers: &HeaderMap,
    system: bool,
) -> Response {
    let Some(csrf_token) = cookie(headers, CSRF_COOKIE) else {
        return StatusCode::FORBIDDEN.into_response();
    };
    let panel_id = if system { "system" } else { "business" };
    let active_path = if system { "/system" } else { "/admin" };
    let (navigation, brand_name) =
        match registered_panel_navigation(state, identity, panel_id, active_path).await {
            Ok(navigation) => navigation,
            Err(status) => return status.into_response(),
        };
    let widgets = match registered_panel_widgets(state, identity, panel_id).await {
        Ok(widgets) => widgets,
        Err(status) => return status.into_response(),
    };
    let html = if system {
        views::core_dashboard(
            &identity.display_name,
            &identity.email,
            csrf_token,
            navigation,
            &brand_name,
            widgets,
        )
    } else {
        views::business_dashboard(
            &identity.display_name,
            &identity.email,
            csrf_token,
            navigation,
            &brand_name,
            widgets,
        )
    };
    match html {
        Ok(html) => {
            let mut response = Html(html).into_response();
            response.headers_mut().insert(
                HeaderName::from_static("cache-control"),
                HeaderValue::from_static("no-store"),
            );
            response
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(super) async fn render_core_resource(
    state: &PanelState,
    identity: &SessionIdentity,
    csrf_token: &str,
    title: &str,
    active_path: &str,
    table: feluqa::view::TrustedHtml,
) -> Response {
    let (navigation, brand_name) =
        match registered_panel_navigation(state, identity, "system", active_path).await {
            Ok(navigation) => navigation,
            Err(status) => return status.into_response(),
        };
    match views::core_resource(
        &identity.display_name,
        &identity.email,
        title,
        table,
        active_path,
        navigation,
        &brand_name,
        csrf_token,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

pub(super) fn core_resource_row(values: &[(&str, String)]) -> feluqa::panel::ResourceTableRow {
    let mut row = feluqa::panel::ResourceTableRow::default();
    for (field, value) in values {
        row.values.insert(String::from(*field), value.clone());
    }
    row
}

pub(super) fn core_resource_table(
    resource: &feluqa::panel::Resource,
    access: &feluqa::panel::ResourceAccess,
    caption: &str,
    rows: &[feluqa::panel::ResourceTableRow],
) -> Result<feluqa::view::TrustedHtml, StatusCode> {
    resource
        .render_table(access, caption, rows)
        .map(feluqa::web::trusted_panel_html)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
