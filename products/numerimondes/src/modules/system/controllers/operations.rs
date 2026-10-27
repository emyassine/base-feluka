#![no_implicit_prelude]

use super::*;
use crate::feluqa;

/// Show registered statically linked modules and their current enabled status.
pub async fn system_modules(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, _, access) = match protected_resource_page(
        &state,
        &headers,
        "system.modules",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let rows = ["feluqa.core"]
        .into_iter()
        .chain(
            crate::generated_migrations::ALL
                .iter()
                .map(|module| module.module),
        )
        .map(|module_id| {
            core_resource_row(&[
                ("module_id", String::from(module_id)),
                (
                    "state",
                    String::from(
                        if state
                            .active_modules
                            .iter()
                            .any(|active| active == module_id)
                        {
                            "started"
                        } else {
                            "disabled"
                        },
                    ),
                ),
                ("source", String::from("statically linked in this binary")),
            ])
        })
        .collect::<Vec<_>>();
    let table = match core_resource_table(
        &crate::modules::system::resource::MODULES,
        &access,
        "Feluqa Core modules",
        &rows,
    ) {
        Ok(table) => table,
        Err(status) => return status.into_response(),
    };
    render_core_resource(&state, &identity, "Modules", "/system/modules", table).await
}

/// List connection names and dialects without displaying connection URLs or secrets.
pub async fn system_connections(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, _, access) = match protected_resource_page(
        &state,
        &headers,
        "system.connections",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let rows = state
        .pools
        .names()
        .map(|name| {
            let dialect = match state.pools.dialect(name) {
                Some(feluqa::database::Dialect::Sqlite) => "SQLite",
                Some(feluqa::database::Dialect::Postgresql) => "PostgreSQL",
                None => "unknown",
            };
            core_resource_row(&[
                ("connection", String::from(name)),
                ("dialect", String::from(dialect)),
            ])
        })
        .collect::<Vec<_>>();
    let table = match core_resource_table(
        &crate::modules::system::resource::CONNECTIONS,
        &access,
        "Configured database connections",
        &rows,
    ) {
        Ok(table) => table,
        Err(status) => return status.into_response(),
    };
    render_core_resource(
        &state,
        &identity,
        "Database connections",
        "/system/connections",
        table,
    )
    .await
}

/// Inspect migration status for each registered module and named database.
pub async fn system_migrations(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, csrf, access) = match protected_resource_page(
        &state,
        &headers,
        "system.migrations",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let rows = match migration_status_rows(&state).await {
        Ok(rows) => rows,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let table = match core_resource_table(
        &crate::modules::system::resource::MIGRATIONS,
        &access,
        "Registered module migrations",
        &rows,
    ) {
        Ok(table) => table,
        Err(status) => return status.into_response(),
    };
    let run_access = match optional_resource_access(
        &state,
        identity.user_id,
        "system.migrations",
        feluqa::panel::ResourceOperation::Create,
    )
    .await
    {
        Ok(access) => access,
        Err(status) => return status.into_response(),
    };
    let mut actions = String::new();
    if run_access.is_some() {
        for module in migration_modules() {
            for connection in module.connections {
                if state
                    .pools
                    .dialect(connection)
                    .is_none_or(|dialect| module.for_dialect(dialect).is_none())
                {
                    continue;
                }
                actions.push_str(&format!(
                    "<form method=\"post\" action=\"/system/migrations/run\"><input type=\"hidden\" name=\"csrf_token\" value=\"{csrf}\"><input type=\"hidden\" name=\"module_id\" value=\"{}\"><input type=\"hidden\" name=\"connection\" value=\"{}\"><button class=\"btn\" type=\"submit\">Apply pending migrations · {} · {}</button></form>",
                    module.module, connection, module.module, connection
                ));
            }
        }
    }
    let run_actions = feluqa::view::TrustedHtml::from_trusted(actions);
    let navigation = match registered_panel_navigation(
        &state,
        &identity,
        "system",
        "/system/migrations",
    )
    .await
    {
        Ok(navigation) => navigation,
        Err(status) => return status.into_response(),
    };
    match views::generated_views::core_migrations(
        &identity.display_name,
        &identity.email,
        table,
        run_actions,
        navigation,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Apply one registered module's compiled migrations to one declared connection.
pub async fn run_system_migrations(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<RunMigrationForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.migrations.run").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    let Some(module) = migration_modules().find(|module| module.module == form.module_id) else {
        return StatusCode::BAD_REQUEST.into_response();
    };
    if !module.connections.contains(&form.connection.as_str())
        || state.pools.dialect(&form.connection).is_none()
    {
        return StatusCode::BAD_REQUEST.into_response();
    }
    if MigrationRunner::run_module(&state.pools, &form.connection, module)
        .await
        .is_err()
    {
        let _ = state
            .core
            .record_audit(
                Some(identity.user_id),
                "system.migrations.run",
                module.module,
                Some(&form.connection),
                "failed",
            )
            .await;
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    if state
        .core
        .record_audit(
            Some(identity.user_id),
            "system.migrations.run",
            module.module,
            Some(&form.connection),
            "allowed",
        )
        .await
        .is_err()
    {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    Redirect::to("/system/migrations").into_response()
}

fn migration_modules() -> impl Iterator<Item = &'static feluqa::database::ModuleMigrations> {
    [&feluqa::core::MIGRATIONS]
        .into_iter()
        .chain(crate::generated_migrations::ALL.iter().copied())
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct RunMigrationForm {
    csrf_token: String,
    module_id: String,
    connection: String,
}

/// Browse the latest persisted Core audit events.
pub async fn system_audit(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, _, access) = match protected_resource_page(
        &state,
        &headers,
        "system.audit",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let events = match audit_event::Entity::find()
        .filter(audit_event::Column::TenantId.eq(identity.tenant_id))
        .order_by_desc(audit_event::Column::OccurredAtEpoch)
        .order_by_desc(audit_event::Column::Id)
        .limit(100)
        .all(&state.database)
        .await
    {
        Ok(events) => events,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let rows = events
        .iter()
        .map(|event| {
            core_resource_row(&[
                ("time", event.occurred_at_epoch.to_string()),
                (
                    "actor",
                    event
                        .actor_user_id
                        .map(|id| id.to_string())
                        .unwrap_or_else(|| String::from("system")),
                ),
                ("action", event.action.clone()),
                ("resource", event.resource.clone()),
                (
                    "record",
                    event
                        .record_key
                        .clone()
                        .unwrap_or_else(|| String::from("—")),
                ),
                ("outcome", event.outcome.clone()),
            ])
        })
        .collect::<Vec<_>>();
    let table = match core_resource_table(
        &crate::modules::system::resource::AUDIT,
        &access,
        "Latest 100 audit events",
        &rows,
    ) {
        Ok(table) => table,
        Err(status) => return status.into_response(),
    };
    render_core_resource(
        &state,
        &identity,
        "Audit log · latest 100 events",
        "/system/audit",
        table,
    )
    .await
}

/// List tenants and render the platform-only tenant creation form.
pub async fn system_tenants(State(state): State<PanelState>, headers: HeaderMap) -> Response {
    let (identity, csrf, access) = match protected_resource_page(
        &state,
        &headers,
        "system.tenants",
        feluqa::panel::ResourceOperation::List,
    )
    .await
    {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    let tenants = match state.core.tenants(identity.user_id).await {
        Ok(tenants) => tenants,
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            return StatusCode::FORBIDDEN.into_response();
        }
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let rows = tenants
        .iter()
        .map(|tenant| {
            core_resource_row(&[
                ("tenant_id", tenant.id.to_string()),
                ("slug", tenant.slug.clone()),
                ("display_name", tenant.display_name.clone()),
                (
                    "status",
                    String::from(if tenant.is_active {
                        "active"
                    } else {
                        "suspended"
                    }),
                ),
                ("created_at", tenant.created_at_epoch.to_string()),
            ])
        })
        .collect::<Vec<_>>();
    let table = match core_resource_table(
        &crate::modules::system::resource::TENANTS,
        &access,
        "Application tenants",
        &rows,
    ) {
        Ok(table) => table,
        Err(status) => return status.into_response(),
    };
    let update_access = match optional_resource_access(
        &state,
        identity.user_id,
        "system.tenants",
        feluqa::panel::ResourceOperation::Update,
    )
    .await
    {
        Ok(access) => access,
        Err(status) => return status.into_response(),
    };
    let mut action_forms = String::new();
    if update_access.is_some() {
        for tenant in tenants
            .iter()
            .filter(|tenant| tenant.id != 1 && tenant.id != identity.tenant_id)
        {
            action_forms.push_str("<form method=\"post\" action=\"/system/tenants/status\"><input type=\"hidden\" name=\"csrf_token\" value=\"");
            action_forms.push_str(csrf);
            action_forms.push_str("\"><input type=\"hidden\" name=\"tenant_id\" value=\"");
            action_forms.push_str(&tenant.id.to_string());
            action_forms.push_str("\"><button name=\"active\" value=\"");
            action_forms.push_str(if tenant.is_active { "false" } else { "true" });
            action_forms.push_str("\">");
            action_forms.push_str(if tenant.is_active {
                "Suspend tenant"
            } else {
                "Reactivate tenant"
            });
            action_forms.push_str(" #");
            action_forms.push_str(&tenant.id.to_string());
            action_forms.push_str("</button></form>");
        }
    }
    let tenant_actions = feluqa::view::TrustedHtml::from_trusted(action_forms);
    let create_form = match optional_resource_access(
        &state,
        identity.user_id,
        "system.tenants",
        feluqa::panel::ResourceOperation::Create,
    )
    .await
    {
        Ok(Some(create_access)) => match crate::modules::system::resource::TENANTS
            .render_form(
                &create_access,
                csrf,
                None,
                "Create tenant and initial administrator",
                &crate::std::collections::BTreeMap::new(),
            )
            .map(feluqa::web::trusted_panel_html)
        {
            Ok(form) => form,
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        },
        Ok(None) => feluqa::view::TrustedHtml::from_trusted(String::new()),
        Err(status) => return status.into_response(),
    };
    let navigation =
        match registered_panel_navigation(&state, &identity, "system", "/system/tenants").await {
            Ok(navigation) => navigation,
            Err(status) => return status.into_response(),
        };
    match views::generated_views::core_tenants(
        &identity.display_name,
        &identity.email,
        table,
        tenant_actions,
        create_form,
        navigation,
    ) {
        Ok(html) => Html(html).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Change a tenant's active state after Core authorization and CSRF validation.
pub async fn set_system_tenant_active(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<SetTenantActiveForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.tenants.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state
        .core
        .set_tenant_active(form.tenant_id, form.active, identity.user_id)
        .await
    {
        Ok(_) => Redirect::to("/system/tenants").into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation)
        | Err(feluqa::core::service::CoreStoreError::TenantLifecycleDenied) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidTenant) => {
            StatusCode::NOT_FOUND.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}

/// Create a tenant and its isolated first administrator after CSRF and permission checks.
pub async fn create_system_tenant(
    State(state): State<PanelState>,
    headers: HeaderMap,
    Form(form): Form<CreateTenantForm>,
) -> Response {
    let (identity, _) = match protected_page(&state, &headers, "system.tenants.write").await {
        Ok(Some(value)) => value,
        Ok(None) => return Redirect::to("/system/login").into_response(),
        Err(status) => return status.into_response(),
    };
    if !session_csrf_valid(&state, &headers, &form.csrf_token).await {
        return StatusCode::FORBIDDEN.into_response();
    }
    match state
        .core
        .create_tenant(
            &form.slug,
            &form.display_name,
            &form.owner_name,
            &form.owner_email,
            &form.owner_password,
            identity.user_id,
        )
        .await
    {
        Ok(_) => Redirect::to("/system/tenants").into_response(),
        Err(feluqa::core::service::CoreStoreError::GrantEscalation) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(feluqa::core::service::CoreStoreError::InvalidTenant) => {
            StatusCode::BAD_REQUEST.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
