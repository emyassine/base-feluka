#![no_implicit_prelude]

use super::*;

pub(super) async fn optional_resource_access(
    state: &PanelState,
    actor_user_id: i64,
    resource_id: &str,
    operation: feluqa::panel::ResourceOperation,
) -> Result<Option<feluqa::panel::ResourceAccess>, StatusCode> {
    let grants = state
        .core
        .permissions_for(actor_user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let principal = principal_for_user(actor_user_id, None, &grants)
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    match state.catalog.authorize_resource(
        resource_id,
        operation,
        &principal,
        actor_user_id,
        &PermissionSetAuthorizer,
    ) {
        Ok(access) => Ok(Some(access)),
        Err(feluqa::panel::ResourceAuthorizationError::Denied) => Ok(None),
        Err(feluqa::panel::ResourceAuthorizationError::UnknownResource) => {
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub(super) async fn authenticated_identity(
    state: &PanelState,
    headers: &HeaderMap,
) -> Result<Option<SessionIdentity>, feluqa::core::service::CoreStoreError> {
    match cookie(headers, SESSION_COOKIE) {
        Some(token) => state.core.authenticate(token).await,
        None => Ok(None),
    }
}

pub(super) async fn migration_status_rows(
    state: &PanelState,
) -> Result<Vec<feluqa::panel::ResourceTableRow>, String> {
    let mut rows = Vec::new();
    for module in [&feluqa::core::MIGRATIONS]
        .into_iter()
        .chain(crate::generated_migrations::ALL.iter().copied())
    {
        for connection in module.connections {
            let dialect = state.pools.dialect(connection).ok_or_else(|| {
                format!(
                    "module {} requires missing connection `{connection}`",
                    module.module
                )
            })?;
            let variant = module.for_dialect(dialect).ok_or_else(|| {
                format!(
                    "module `{}` does not support this connection dialect",
                    module.module
                )
            })?;
            let statuses = MigrationRunner::status(&state.pools, connection, variant)
                .await
                .map_err(|error| error.to_string())?;
            for (migration, status) in statuses {
                rows.push(core_resource_row(&[
                    ("connection", String::from(*connection)),
                    ("module", String::from(module.module)),
                    ("migration", String::from(migration)),
                    ("status", format!("{status:?}")),
                ]));
            }
        }
    }
    Ok(rows)
}

pub(super) async fn protected_page<'a>(
    state: &PanelState,
    headers: &'a HeaderMap,
    permission: &str,
) -> Result<Option<(SessionIdentity, &'a str)>, StatusCode> {
    let identity = match authenticated_identity(state, headers).await {
        Ok(Some(identity)) => identity,
        Ok(None) => return Ok(None),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };
    let permissions = state
        .core
        .permissions_for(identity.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    if !permissions.iter().any(|grant| grant == permission) {
        return Err(StatusCode::FORBIDDEN);
    }
    let csrf = cookie(headers, CSRF_COOKIE).ok_or(StatusCode::FORBIDDEN)?;
    Ok(Some((identity, csrf)))
}

pub(crate) async fn protected_registered_page<'a>(
    state: &PanelState,
    headers: &'a HeaderMap,
    path: &str,
) -> Result<Option<(SessionIdentity, &'a str)>, StatusCode> {
    Ok(registered_page_access(state, headers, path)
        .await?
        .map(|(identity, csrf, _)| (identity, csrf)))
}

pub(crate) async fn registered_panel_navigation(
    state: &PanelState,
    identity: &SessionIdentity,
    panel_id: &str,
    active_path: &str,
) -> Result<feluqa::view::TrustedHtml, StatusCode> {
    let grants = state
        .core
        .permissions_for(identity.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let principal = principal_for_user(identity.user_id, Some(identity.tenant_id), &grants)
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let navigation = state
        .catalog
        .render_navigation(panel_id, &principal, &PermissionSetAuthorizer, active_path)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(feluqa::web::trusted_navigation_html(navigation))
}

pub(super) async fn protected_resource_page<'a>(
    state: &PanelState,
    headers: &'a HeaderMap,
    resource_id: &str,
    operation: feluqa::panel::ResourceOperation,
) -> Result<Option<(SessionIdentity, &'a str, feluqa::panel::ResourceAccess)>, StatusCode> {
    let identity = match authenticated_identity(state, headers).await {
        Ok(Some(identity)) => identity,
        Ok(None) => return Ok(None),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };
    let grants = state
        .core
        .permissions_for(identity.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let principal = principal_for_user(identity.user_id, Some(identity.tenant_id), &grants)
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let access = state
        .catalog
        .authorize_resource(
            resource_id,
            operation,
            &principal,
            identity.user_id,
            &PermissionSetAuthorizer,
        )
        .map_err(resource_access_status)?;
    let csrf = cookie(headers, CSRF_COOKIE).ok_or(StatusCode::FORBIDDEN)?;
    Ok(Some((identity, csrf, access)))
}

pub(super) async fn registered_page_access<'a>(
    state: &PanelState,
    headers: &'a HeaderMap,
    path: &str,
) -> Result<Option<(SessionIdentity, &'a str, feluqa::panel::RenderedHtml)>, StatusCode> {
    let identity = match authenticated_identity(state, headers).await {
        Ok(Some(identity)) => identity,
        Ok(None) => return Ok(None),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };
    let grants = state
        .core
        .permissions_for(identity.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let principal = principal_for_user(identity.user_id, Some(identity.tenant_id), &grants)
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    match state
        .catalog
        .render_page(path, &principal, &PermissionSetAuthorizer)
    {
        Ok(html) => {
            let csrf = cookie(headers, CSRF_COOKIE).ok_or(StatusCode::FORBIDDEN)?;
            Ok(Some((identity, csrf, html)))
        }
        Err(feluqa::panel::PanelRenderError::Access(feluqa::panel::PanelError::Forbidden)) => {
            Err(StatusCode::FORBIDDEN)
        }
        Err(feluqa::panel::PanelRenderError::Access(feluqa::panel::PanelError::NotFound(_))) => {
            Err(StatusCode::NOT_FOUND)
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub(crate) async fn protected_customer_page<'a>(
    state: &PanelState,
    headers: &'a HeaderMap,
    action: crate::modules::crm::policies::CustomerAction,
) -> Result<Option<crate::modules::crm::controllers::CustomerPageAccess<'a>>, StatusCode> {
    let identity = match authenticated_identity(state, headers).await {
        Ok(Some(identity)) => identity,
        Ok(None) => return Ok(None),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };
    if !state
        .active_modules
        .iter()
        .any(|module| module == "numerimondes.crm")
    {
        return Err(StatusCode::NOT_FOUND);
    }
    let grants = state
        .core
        .permissions_for(identity.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let principal = principal_for_user(identity.user_id, Some(identity.tenant_id), &grants)
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let access = state
        .catalog
        .authorize_resource(
            "crm.customers",
            action.resource_operation(),
            &principal,
            identity.user_id,
            &PermissionSetAuthorizer,
        )
        .map_err(resource_access_status)?;
    let scope = match access.records {
        feluqa::panel::ResourceRecordScope::All => {
            crate::modules::crm::policies::CustomerScope::AllInTenant(identity.tenant_id)
        }
        feluqa::panel::ResourceRecordScope::OwnedBy(user_id) => {
            crate::modules::crm::policies::CustomerScope::OwnedBy {
                tenant_id: identity.tenant_id,
                user_id,
            }
        }
    };
    let fields = crate::modules::crm::policies::CustomerFields::from_access(&access.fields);
    let create_resource = state
        .catalog
        .authorize_resource(
            "crm.customers",
            feluqa::panel::ResourceOperation::Create,
            &principal,
            identity.user_id,
            &PermissionSetAuthorizer,
        )
        .ok();
    let can_create = create_resource
        .as_ref()
        .is_some_and(|create| create.fields.can_write("name") && create.fields.can_write("email"));
    let update_resource = state
        .catalog
        .authorize_resource(
            "crm.customers",
            feluqa::panel::ResourceOperation::Update,
            &principal,
            identity.user_id,
            &PermissionSetAuthorizer,
        )
        .ok();
    let can_delete = state
        .catalog
        .authorize_resource(
            "crm.customers",
            feluqa::panel::ResourceOperation::Delete,
            &principal,
            identity.user_id,
            &PermissionSetAuthorizer,
        )
        .is_ok();
    let csrf = cookie(headers, CSRF_COOKIE).ok_or(StatusCode::FORBIDDEN)?;
    Ok(Some(crate::modules::crm::controllers::CustomerPageAccess {
        identity,
        csrf,
        scope,
        fields,
        can_create,
        can_delete,
        resource: access,
        create_resource,
        update_resource,
    }))
}

pub(super) fn resource_access_status(
    error: feluqa::panel::ResourceAuthorizationError,
) -> StatusCode {
    match error {
        feluqa::panel::ResourceAuthorizationError::UnknownResource => {
            StatusCode::INTERNAL_SERVER_ERROR
        }
        feluqa::panel::ResourceAuthorizationError::Denied => StatusCode::FORBIDDEN,
    }
}

pub(super) fn principal_for_user(
    actor_user_id: i64,
    tenant_id: Option<i64>,
    grants: &[String],
) -> Option<Principal> {
    let subject = format!("user:{actor_user_id}");
    let tenant = tenant_id.map(|id| id.to_string());
    let mut principal = Principal::new(&subject, tenant).ok()?;
    for grant in grants {
        principal.grant(Permission::new(grant.clone()).ok()?);
    }
    Some(principal)
}
