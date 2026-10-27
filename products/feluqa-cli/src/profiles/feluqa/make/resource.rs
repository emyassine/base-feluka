#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "make resource", description = "Generate a permission-aware CRUD resource", usage = "feluqa make resource <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let application = crate::__feluqa_profile_feluqa::context::application(host)?;
    let result = generate(&arguments, application);
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}

use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::fs;
use crate::std::iter::Iterator;
use crate::std::matches;
use crate::std::option::Option::Some;
use crate::std::path::PathBuf;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let Some(name_argument) = arguments.first() else {
        return Err(String::from(
            "usage: feluqa make resource <model> [--connection <name>]",
        ));
    };
    let raw_name = name_argument
        .to_str()
        .ok_or_else(|| String::from("model name must be valid UTF-8"))?;
    let slug = crate::__feluqa_profile_feluqa::generator::slugify(raw_name)?;
    let model_name = crate::__feluqa_profile_feluqa::generator::pascal_case(&slug);
    let mut connection_name = String::from("default");
    if arguments.len() > 1 {
        if arguments.len() != 3 || arguments[1].to_str() != Some("--connection") {
            return Err(String::from(
                "usage: feluqa make resource <model> [--connection <name>]",
            ));
        }
        connection_name = String::from(
            arguments[2]
                .to_str()
                .ok_or_else(|| String::from("connection name must be valid UTF-8"))?,
        );
        if !valid_connection_name(&connection_name) {
            return Err(String::from("invalid database connection name"));
        }
    }
    let model_path = application
        .directory
        .join("src/app/models")
        .join(format!("{slug}.rs"));
    let model_source = fs::read_to_string(&model_path).map_err(|_| {
        format!("model `{model_name}` does not exist; run `feluqa make model {model_name}` first")
    })?;
    if !model_source.contains("#[tenant_key]") || !model_source.contains("#[owner_key]") {
        return Err(format!(
            "model `{model_name}` needs tenant and owner keys; mark its fields with `#[tenant_key]` and `#[owner_key]` before generating a resource"
        ));
    }
    let name = format!("{model_name}Resource");
    let file_slug = format!("{slug}_resource");
    let resource_path = format!("/admin/{}", plural_slug(&slug));
    let registry_path = application
        .directory
        .join("src/app/controllers/resources.rs");
    let registry = fs::read_to_string(&registry_path).map_err(|_| {
        String::from(
            "resource routing registry is missing; regenerate the app with the current `feluqa new --profile web` scaffold",
        )
    })?;
    if !registry.contains("// FELUQA_GENERATED_RESOURCE_ROUTES") {
        return Err(String::from(
            "resource routing registry has no FELUQA_GENERATED_RESOURCE_ROUTES insertion point",
        ));
    }
    let registration = format!(
        "routes = routes.merge(crate::app::controllers::{file_slug}::{name}Controller::routes(core_store.clone()));"
    );
    if registry.contains(&registration) {
        return Err(format!("routes for `{model_name}` are already registered"));
    }
    let source = model_controller_source(
        &slug,
        &name,
        &slug,
        &model_name,
        &connection_name,
        &resource_path,
    );
    crate::__feluqa_profile_feluqa::generator::write_file(
        application,
        PathBuf::from("src/app/controllers").join(format!("{file_slug}.rs")),
        &source,
    )?;
    crate::__feluqa_profile_feluqa::generator::register_module(
        application,
        PathBuf::from("src/app/controllers"),
        &file_slug,
    )?;
    let registry = registry.replace(
        "// FELUQA_GENERATED_RESOURCE_ROUTES",
        &format!("// FELUQA_GENERATED_RESOURCE_ROUTES\n    {registration}"),
    );
    fs::write(&registry_path, registry).map_err(|error| {
        format!(
            "could not register resource routes in `{}`: {error}",
            registry_path.display()
        )
    })?;
    Ok(ExitCode::SUCCESS)
}

fn plural_slug(slug: &str) -> String {
    if let Some(stem) = slug.strip_suffix('y') {
        let preceding = stem.as_bytes().last().copied().unwrap_or(b'a');
        if !matches!(preceding, b'a' | b'e' | b'i' | b'o' | b'u') {
            return format!("{stem}ies");
        }
    }
    if slug.ends_with('s')
        || slug.ends_with('x')
        || slug.ends_with('z')
        || slug.ends_with("ch")
        || slug.ends_with("sh")
    {
        format!("{slug}es")
    } else {
        format!("{slug}s")
    }
}

fn valid_connection_name(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 96
        && !value.starts_with('.')
        && !value.ends_with('.')
        && !value.contains("..")
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase()
                || byte.is_ascii_digit()
                || byte == b'_'
                || byte == b'-'
                || byte == b'.'
        })
}

fn model_controller_source(
    slug: &str,
    name: &str,
    model_slug: &str,
    model_name: &str,
    connection_name: &str,
    resource_path: &str,
) -> String {
    format!(
        r##"#![no_implicit_prelude]

use crate::feluqa;
use feluqa::prelude::*;
use feluqa::auth::Principal;
use feluqa::core::service::{{CoreStore, SessionIdentity}};
use feluqa::database::{{
    DatabasePools,
    orm::{{DatabaseConnection, TransactionTrait}},
}};
use feluqa::web::{{authorize, verify_csrf, Route}};
use crate::axum::Router;
use crate::serde_json::{{self, Value}};
use crate::app::models::{model_slug}::{{{model_name}, {model_name}Attributes}};

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct PageQuery {{
    page: Option<u64>,
}}

#[allow(dead_code)]
pub struct {name}Controller;

#[allow(dead_code)]
impl {name}Controller {{
    pub(crate) fn routes(core_store: CoreStore) -> Router<DatabasePools> {{
        Route::<DatabasePools>::new()
            .get("{resource_path}", Self::index)
            .get("{resource_path}/{{id}}", Self::show)
            .post("{resource_path}", Self::store)
            .put("{resource_path}/{{id}}", Self::update)
            .delete("{resource_path}/{{id}}", Self::destroy)
            .authenticated(core_store)
            .finish()
    }}

    pub async fn index(
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        State(databases): State<DatabasePools>,
        Query(query): Query<PageQuery>,
    ) -> Result<JsonResponse<Value>, StatusCode> {{
        authorize(&principal, "business.{slug}.read")?;
        let page = {model_name}::page_in_tenant(connection(&databases)?, identity.tenant_id, identity.user_id, query.page.unwrap_or(1))
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let mut page = serde_json::to_value(page).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let items = page.get_mut("items").and_then(Value::as_array_mut).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
        for item in items {{
            *item = readable_fields(item.clone(), &principal, "{slug}");
        }}
        Ok(response::json(page))
    }}

    pub async fn show(
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
    ) -> Result<JsonResponse<Value>, StatusCode> {{
        authorize(&principal, "business.{slug}.read")?;
        let model = {model_name}::find_or_fail_in_tenant(connection(&databases)?, id, identity.tenant_id, identity.user_id)
            .await
            .map_err(feluqa::web::database_error)?;
        let value = serde_json::to_value(model).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(response::json(readable_fields(value, &principal, "{slug}")))
    }}

    pub async fn store(
        Extension(core): Extension<CoreStore>,
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        headers: HeaderMap,
        State(databases): State<DatabasePools>,
        Json(values): Json<{model_name}Attributes>,
    ) -> Result<(StatusCode, JsonResponse<Value>), StatusCode> {{
        verify_csrf(&core, &headers).await?;
        authorize(&principal, "business.{slug}.create")?;
        writable_fields(&principal, &values, "{slug}")?;
        let transaction = connection(&databases)?
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let model = {model_name}::create_from_in_tenant(
            &transaction,
            &values,
            identity.tenant_id,
            identity.user_id,
        )
        .await
        .map_err(feluqa::web::database_error)?;
        CoreStore::record_audit_in(
            &transaction,
            identity.tenant_id,
            identity.user_id,
            "create",
            "{slug}",
            Some(&model.id.to_string()),
        )
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        transaction
            .commit()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let value = serde_json::to_value(model).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok((StatusCode::CREATED, response::json(readable_fields(value, &principal, "{slug}"))))
    }}

    pub async fn update(
        Extension(core): Extension<CoreStore>,
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        headers: HeaderMap,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
        Json(values): Json<{model_name}Attributes>,
    ) -> Result<JsonResponse<Value>, StatusCode> {{
        verify_csrf(&core, &headers).await?;
        authorize(&principal, "business.{slug}.update")?;
        writable_fields(&principal, &values, "{slug}")?;
        let transaction = connection(&databases)?
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let Some(model) = {model_name}::update_from_in_tenant(
            &transaction,
            id,
            identity.tenant_id,
            identity.user_id,
            &values,
        )
        .await
        .map_err(feluqa::web::database_error)? else {{
            return Err(StatusCode::NOT_FOUND);
        }};
        CoreStore::record_audit_in(
            &transaction,
            identity.tenant_id,
            identity.user_id,
            "update",
            "{slug}",
            Some(&id.to_string()),
        )
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        transaction
            .commit()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let value = serde_json::to_value(model).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(response::json(readable_fields(value, &principal, "{slug}")))
    }}

    pub async fn destroy(
        Extension(core): Extension<CoreStore>,
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        headers: HeaderMap,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
    ) -> Result<StatusCode, StatusCode> {{
        verify_csrf(&core, &headers).await?;
        authorize(&principal, "business.{slug}.delete")?;
        let transaction = connection(&databases)?
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        match {model_name}::delete_in_tenant(&transaction, id, identity.tenant_id, identity.user_id)
            .await
            .map_err(feluqa::web::database_error)?
        {{
            true => {{
                CoreStore::record_audit_in(
                    &transaction,
                    identity.tenant_id,
                    identity.user_id,
                    "delete",
                    "{slug}",
                    Some(&id.to_string()),
                )
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                transaction
                    .commit()
                    .await
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                Ok(StatusCode::NO_CONTENT)
            }},
            false => Err(StatusCode::NOT_FOUND),
        }}
    }}
}}

#[allow(dead_code)]
fn connection(databases: &DatabasePools) -> Result<&DatabaseConnection, StatusCode> {{
    databases
        .get("{connection_name}")
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)
}}

fn readable_fields(mut value: Value, principal: &Principal, resource: &str) -> Value {{
    let Some(fields) = value.as_object_mut() else {{
        return value;
    }};
    fields.retain(|name, _| {{
        name == "id"
            || authorize(
                principal,
                &format!("business.{{resource}}.fields.{{name}}.read"),
            )
            .is_ok()
    }});
    value
}}

fn writable_fields<T: Serialize>(
    principal: &Principal,
    values: &T,
    resource: &str,
) -> Result<(), StatusCode> {{
    let value = serde_json::to_value(values).map_err(|_| StatusCode::BAD_REQUEST)?;
    let fields = value.as_object().ok_or(StatusCode::BAD_REQUEST)?;
    for name in fields.keys() {{
        authorize(
            principal,
            &format!("business.{{resource}}.fields.{{name}}.write"),
        )?;
    }}
    Ok(())
}}

#[cfg(test)]
mod generated_resource_tests {{
    use crate::axum::body::Body;
    use crate::axum::body::to_bytes;
    use crate::axum::http::header::{{COOKIE, HOST}};
    use crate::axum::http::Request;
    use crate::feluqa::core::service::CoreStore;
    use crate::feluqa::core::MIGRATIONS;
    use crate::feluqa::database::{{DatabasePools, DatabaseSettings, MigrationRunner, orm::{{ConnectionTrait, DatabaseConnection}}}};
    use crate::feluqa::http::StatusCode;
    use crate::std::assert_eq;
    use crate::std::clone::Clone;
    use crate::std::convert::From;
    use crate::std::option::Option::{{None, Some}};
    use crate::std::string::String;
    use crate::tokio;
    use crate::tower::ServiceExt;

    #[tokio::test]
    async fn registered_resource_requires_a_core_session() {{
        let (databases, schema) = test_database("unauthenticated").await;
        MigrationRunner::run_module(&databases, "default", &MIGRATIONS)
            .await
            .expect("apply Core migrations");
        let core = CoreStore::new(
            databases
                .default_connection()
                .expect("default connection")
                .clone(),
        )
        .expect("create Core service");
        let app = crate::routes::web::routes(
            core,
            crate::modules::panel_catalog().expect("panel catalogue"),
            false,
            None,
        )
        .expect("build complete application router")
        .with_state(databases);
        let response = app
            .oneshot(
                Request::builder()
                    .uri("{resource_path}")
                    .header(HOST, "127.0.0.1:3000")
                    .body(Body::empty())
                    .expect("build resource request"),
            )
            .await
            .expect("dispatch resource request");

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
        drop_test_schema(schema).await;
    }}

    #[tokio::test]
    async fn registered_resource_checks_permission_and_owner_scope() {{
        let (databases, schema) = test_database("owner_scope").await;
        MigrationRunner::run_module(&databases, "default", &MIGRATIONS)
            .await
            .expect("apply Core migrations");
        let core = CoreStore::new(
            databases
                .default_connection()
                .expect("default connection")
                .clone(),
        )
        .expect("create Core service");
        core.bootstrap_first_admin(
            "owner@example.test",
            "Test Owner",
            "owner-password-strong",
        )
        .await
        .expect("create administrator");
        let administrator = core
            .login("owner@example.test", "owner-password-strong")
            .await
            .expect("authenticate administrator");
        let role = core
            .create_role(
                "invoice-reader",
                "Invoice Reader",
                &[
                    String::from("business.{slug}.read"),
                    String::from("business.{slug}.create"),
                ],
                administrator.user_id,
            )
            .await
            .expect("create exact-permission role");
        let user = core
            .create_user(
                "reader@example.test",
                "Invoice Reader",
                "reader-password-strong",
                role.id,
                administrator.user_id,
            )
            .await
            .expect("create scoped reader");
        let database = databases
            .default_connection()
            .expect("default connection");
        let table = if schema.is_some() {{
            "CREATE TABLE {slug} (id BIGSERIAL PRIMARY KEY, tenant_id BIGINT NOT NULL, owner_user_id BIGINT NOT NULL, name TEXT NOT NULL)"
        }} else {{
            "CREATE TABLE {slug} (id INTEGER PRIMARY KEY, tenant_id INTEGER NOT NULL, owner_user_id INTEGER NOT NULL, name TEXT NOT NULL)"
        }};
        database
            .execute_unprepared(table)
            .await
            .expect("create resource table");
        database
            .execute_unprepared(&crate::std::format!(
                "INSERT INTO {slug} (id, tenant_id, owner_user_id, name) VALUES (1, 1, {{}}, 'reader record'), (2, 1, {{}}, 'other owner record')",
                user.id,
                administrator.user_id,
            ))
            .await
            .expect("insert records for two owners");
        let session = core
            .login("reader@example.test", "reader-password-strong")
            .await
            .expect("authenticate scoped reader");
        let cookies = crate::std::format!(
            "feluqa_session={{}}; feluqa_csrf={{}}",
            session.session_token,
            session.csrf_token,
        );
        let app = crate::routes::web::routes(
            core,
            crate::modules::panel_catalog().expect("panel catalogue"),
            false,
            None,
        )
        .expect("build complete application router")
        .with_state(databases);
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("{resource_path}")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .body(Body::empty())
                    .expect("build scoped resource request"),
            )
            .await
            .expect("dispatch scoped resource request");

        assert_eq!(response.status(), StatusCode::OK);
        let body = to_bytes(response.into_body(), 64 * 1024)
            .await
            .expect("read resource response");
        let body = String::from_utf8(body.to_vec()).expect("decode resource JSON");
        assert!(body.contains("\"id\":1"));
        assert!(!body.contains("\"id\":2"));
        assert!(!body.contains("reader record"));
        assert!(!body.contains("other owner record"));

        let denied_write = app
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::POST)
                    .uri("{resource_path}")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies)
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{{"name":"field write denied"}}"#))
                    .expect("build field-permission request"),
            )
            .await
            .expect("deny a write without the field grant");
        assert_eq!(denied_write.status(), StatusCode::FORBIDDEN);
        drop_test_schema(schema).await;
    }}

    #[tokio::test]
    async fn registered_resource_mutations_require_csrf_and_complete_crud() {{
        let (databases, schema) = test_database("crud").await;
        MigrationRunner::run_module(&databases, "default", &MIGRATIONS)
            .await
            .expect("apply Core migrations");
        let core = CoreStore::new(
            databases
                .default_connection()
                .expect("default connection")
                .clone(),
        )
        .expect("create Core service");
        core.bootstrap_first_admin(
            "owner@example.test",
            "Test Owner",
            "owner-password-strong",
        )
        .await
        .expect("create administrator");
        let administrator = core
            .login("owner@example.test", "owner-password-strong")
            .await
            .expect("authenticate administrator");
        let role = core
            .create_role(
                "invoice-editor",
                "Invoice Editor",
                &[
                    String::from("business.{slug}.read"),
                    String::from("business.{slug}.create"),
                    String::from("business.{slug}.update"),
                    String::from("business.{slug}.delete"),
                    String::from("business.{slug}.fields.name.read"),
                    String::from("business.{slug}.fields.name.write"),
                ],
                administrator.user_id,
            )
            .await
            .expect("create exact-permission role");
        let user = core
            .create_user(
                "editor@example.test",
                "Invoice Editor",
                "editor-password-strong",
                role.id,
                administrator.user_id,
            )
            .await
            .expect("create scoped editor");
        let database = databases
            .default_connection()
            .expect("default connection");
        let table = if schema.is_some() {{
            "CREATE TABLE {slug} (id BIGSERIAL PRIMARY KEY, tenant_id BIGINT NOT NULL, owner_user_id BIGINT NOT NULL, name TEXT NOT NULL)"
        }} else {{
            "CREATE TABLE {slug} (id INTEGER PRIMARY KEY, tenant_id INTEGER NOT NULL, owner_user_id INTEGER NOT NULL, name TEXT NOT NULL)"
        }};
        database
            .execute_unprepared(table)
            .await
            .expect("create resource table");
        database
            .execute_unprepared(&crate::std::format!(
                "INSERT INTO {slug} (id, tenant_id, owner_user_id, name) VALUES (2, 1, {{}}, 'other owner record')",
                administrator.user_id,
            ))
            .await
            .expect("insert a record owned by another user");
        let owned_path = crate::std::format!(
            "{resource_path}/{{}}",
            if schema.is_some() {{ 1 }} else {{ 3 }},
        );
        let session = core
            .login("editor@example.test", "editor-password-strong")
            .await
            .expect("authenticate scoped editor");
        let cookies = crate::std::format!(
            "feluqa_session={{}}; feluqa_csrf={{}}",
            session.session_token,
            session.csrf_token,
        );
        let app = crate::routes::web::routes(
            core,
            crate::modules::panel_catalog().expect("panel catalogue"),
            false,
            None,
        )
        .expect("build complete application router")
        .with_state(databases);
        let missing_csrf = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::POST)
                    .uri("{resource_path}")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{{"name":"missing CSRF"}}"#))
                    .expect("build missing-CSRF request"),
            )
            .await
            .expect("reject request without session-bound CSRF");
        assert_eq!(missing_csrf.status(), StatusCode::FORBIDDEN);

        let created = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::POST)
                    .uri("{resource_path}")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{{"name":"First invoice"}}"#))
                    .expect("build resource create request"),
            )
            .await
            .expect("create scoped resource");
        assert_eq!(created.status(), StatusCode::CREATED);
        let created_body = to_bytes(created.into_body(), 64 * 1024)
            .await
            .expect("read created resource");
        assert!(String::from_utf8(created_body.to_vec())
            .expect("decode created resource")
            .contains("First invoice"));

        let updated = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::PUT)
                    .uri(owned_path.as_str())
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{{"name":"Updated invoice"}}"#))
                    .expect("build resource update request"),
            )
            .await
            .expect("update scoped resource");
        assert_eq!(updated.status(), StatusCode::OK);
        let updated_body = to_bytes(updated.into_body(), 64 * 1024)
            .await
            .expect("read updated resource");
        assert!(String::from_utf8(updated_body.to_vec())
            .expect("decode updated resource")
            .contains("Updated invoice"));

        let cross_owner_update = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::PUT)
                    .uri("{resource_path}/2")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{{"name":"stolen update"}}"#))
                    .expect("build cross-owner update request"),
            )
            .await
            .expect("reject cross-owner update");
        assert_eq!(cross_owner_update.status(), StatusCode::NOT_FOUND);

        let cross_owner_delete = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::DELETE)
                    .uri("{resource_path}/2")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .body(Body::empty())
                    .expect("build cross-owner delete request"),
            )
            .await
            .expect("reject cross-owner delete");
        assert_eq!(cross_owner_delete.status(), StatusCode::NOT_FOUND);

        let deleted = app
            .oneshot(
                Request::builder()
                    .method(crate::axum::http::Method::DELETE)
                    .uri(owned_path.as_str())
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies)
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .body(Body::empty())
                    .expect("build resource delete request"),
            )
            .await
            .expect("delete scoped resource");
        assert_eq!(deleted.status(), StatusCode::NO_CONTENT);
        assert!(user.id > 0);
        drop_test_schema(schema).await;
    }}

    async fn test_database(
        schema_suffix: &str,
    ) -> (DatabasePools, crate::std::option::Option<(String, DatabaseConnection)>) {{
        let postgres = crate::std::env::var_os("FELUQA_TEST_POSTGRES_URL").is_some();
        let settings_source = if postgres {{
            "[connections.default]\nurl_env = \"FELUQA_TEST_POSTGRES_URL\"\nmax_connections = 1\n"
        }} else {{
            "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n"
        }};
        let settings = DatabaseSettings::from_toml(settings_source)
            .expect("valid database settings");
        let databases = DatabasePools::connect(&settings)
            .await
            .expect("connect test database");
        let schema = if postgres {{
            let name = crate::std::format!(
                "feluqa_test_{{}}_{{}}",
                crate::std::process::id(),
                schema_suffix,
            );
            let connection = databases
                .default_connection()
                .expect("default connection")
                .clone();
            connection
                .execute_unprepared(&crate::std::format!("CREATE SCHEMA {{}}", name))
                .await
                .expect("create isolated PostgreSQL test schema");
            connection
                .execute_unprepared(&crate::std::format!("SET search_path TO {{}}", name))
                .await
                .expect("select isolated PostgreSQL test schema");
            Some((name, connection))
        }} else {{
            None
        }};
        (databases, schema)
    }}

    async fn drop_test_schema(
        schema: crate::std::option::Option<(String, DatabaseConnection)>,
    ) {{
        if let Some((name, connection)) = schema {{
            connection
                .execute_unprepared(&crate::std::format!("DROP SCHEMA {{}} CASCADE", name))
                .await
                .expect("drop isolated PostgreSQL test schema");
        }}
    }}
}}

"##,
    )
}
