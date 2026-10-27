#![no_implicit_prelude]

use crate::feluqa;
use feluqa::prelude::*;
use feluqa::auth::Principal;
use feluqa::core::service::{CoreStore, SessionIdentity};
use feluqa::database::{
    DatabasePools,
    orm::{DatabaseConnection, TransactionTrait},
};
use feluqa::web::{authorize, verify_csrf, Route};
use crate::axum::Router;
use crate::serde_json::{self, Value};
use crate::app::models::invoice::{Invoice, InvoiceAttributes};

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct PageQuery {
    page: Option<u64>,
}

#[allow(dead_code)]
pub struct InvoiceResourceController;

#[allow(dead_code)]
impl InvoiceResourceController {
    pub(crate) fn routes(core_store: CoreStore) -> Router<DatabasePools> {
        Route::<DatabasePools>::new()
            .get("/admin/invoices", Self::index)
            .get("/admin/invoices/{id}", Self::show)
            .post("/admin/invoices", Self::store)
            .put("/admin/invoices/{id}", Self::update)
            .delete("/admin/invoices/{id}", Self::destroy)
            .authenticated(core_store)
            .finish()
    }

    pub async fn index(
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        State(databases): State<DatabasePools>,
        Query(query): Query<PageQuery>,
    ) -> Result<JsonResponse<Value>, StatusCode> {
        authorize(&principal, "business.invoice.read")?;
        let page = Invoice::page_in_tenant(connection(&databases)?, identity.tenant_id, identity.user_id, query.page.unwrap_or(1))
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let mut page = serde_json::to_value(page).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let items = page.get_mut("items").and_then(Value::as_array_mut).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
        for item in items {
            *item = readable_fields(item.clone(), &principal, "invoice");
        }
        Ok(response::json(page))
    }

    pub async fn show(
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
    ) -> Result<JsonResponse<Value>, StatusCode> {
        authorize(&principal, "business.invoice.read")?;
        let model = Invoice::find_or_fail_in_tenant(connection(&databases)?, id, identity.tenant_id, identity.user_id)
            .await
            .map_err(feluqa::web::database_error)?;
        let value = serde_json::to_value(model).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(response::json(readable_fields(value, &principal, "invoice")))
    }

    pub async fn store(
        Extension(core): Extension<CoreStore>,
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        headers: HeaderMap,
        State(databases): State<DatabasePools>,
        Json(values): Json<InvoiceAttributes>,
    ) -> Result<(StatusCode, JsonResponse<Value>), StatusCode> {
        verify_csrf(&core, &headers).await?;
        authorize(&principal, "business.invoice.create")?;
        writable_fields(&principal, &values, "invoice")?;
        let transaction = connection(&databases)?
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let model = Invoice::create_from_in_tenant(
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
            "invoice",
            Some(&model.id.to_string()),
        )
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        transaction
            .commit()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let value = serde_json::to_value(model).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok((StatusCode::CREATED, response::json(readable_fields(value, &principal, "invoice"))))
    }

    pub async fn update(
        Extension(core): Extension<CoreStore>,
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        headers: HeaderMap,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
        Json(values): Json<InvoiceAttributes>,
    ) -> Result<JsonResponse<Value>, StatusCode> {
        verify_csrf(&core, &headers).await?;
        authorize(&principal, "business.invoice.update")?;
        writable_fields(&principal, &values, "invoice")?;
        let transaction = connection(&databases)?
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let Some(model) = Invoice::update_from_in_tenant(
            &transaction,
            id,
            identity.tenant_id,
            identity.user_id,
            &values,
        )
        .await
        .map_err(feluqa::web::database_error)? else {
            return Err(StatusCode::NOT_FOUND);
        };
        CoreStore::record_audit_in(
            &transaction,
            identity.tenant_id,
            identity.user_id,
            "update",
            "invoice",
            Some(&id.to_string()),
        )
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        transaction
            .commit()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let value = serde_json::to_value(model).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(response::json(readable_fields(value, &principal, "invoice")))
    }

    pub async fn destroy(
        Extension(core): Extension<CoreStore>,
        Extension(principal): Extension<Principal>,
        Extension(identity): Extension<SessionIdentity>,
        headers: HeaderMap,
        State(databases): State<DatabasePools>,
        Path(id): Path<i64>,
    ) -> Result<StatusCode, StatusCode> {
        verify_csrf(&core, &headers).await?;
        authorize(&principal, "business.invoice.delete")?;
        let transaction = connection(&databases)?
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        match Invoice::delete_in_tenant(&transaction, id, identity.tenant_id, identity.user_id)
            .await
            .map_err(feluqa::web::database_error)?
        {
            true => {
                CoreStore::record_audit_in(
                    &transaction,
                    identity.tenant_id,
                    identity.user_id,
                    "delete",
                    "invoice",
                    Some(&id.to_string()),
                )
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                transaction
                    .commit()
                    .await
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                Ok(StatusCode::NO_CONTENT)
            },
            false => Err(StatusCode::NOT_FOUND),
        }
    }
}

#[allow(dead_code)]
fn connection(databases: &DatabasePools) -> Result<&DatabaseConnection, StatusCode> {
    databases
        .get("default")
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)
}

fn readable_fields(mut value: Value, principal: &Principal, resource: &str) -> Value {
    let Some(fields) = value.as_object_mut() else {
        return value;
    };
    fields.retain(|name, _| {
        name == "id"
            || authorize(
                principal,
                &format!("business.{resource}.fields.{name}.read"),
            )
            .is_ok()
    });
    value
}

fn writable_fields<T: Serialize>(
    principal: &Principal,
    values: &T,
    resource: &str,
) -> Result<(), StatusCode> {
    let value = serde_json::to_value(values).map_err(|_| StatusCode::BAD_REQUEST)?;
    let fields = value.as_object().ok_or(StatusCode::BAD_REQUEST)?;
    for name in fields.keys() {
        authorize(
            principal,
            &format!("business.{resource}.fields.{name}.write"),
        )?;
    }
    Ok(())
}

#[cfg(test)]
mod generated_resource_tests {
    use crate::axum::body::Body;
    use crate::axum::body::to_bytes;
    use crate::axum::http::header::{COOKIE, HOST};
    use crate::axum::http::Request;
    use crate::feluqa::core::service::CoreStore;
    use crate::feluqa::core::MIGRATIONS;
    use crate::feluqa::database::{DatabasePools, DatabaseSettings, MigrationRunner, orm::{ConnectionTrait, DatabaseConnection}};
    use crate::feluqa::http::StatusCode;
    use crate::std::assert_eq;
    use crate::std::clone::Clone;
    use crate::std::convert::From;
    use crate::std::option::Option::{None, Some};
    use crate::std::string::String;
    use crate::tokio;
    use crate::tower::ServiceExt;

    #[tokio::test]
    async fn registered_resource_requires_a_core_session() {
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
                    .uri("/admin/invoices")
                    .header(HOST, "127.0.0.1:3000")
                    .body(Body::empty())
                    .expect("build resource request"),
            )
            .await
            .expect("dispatch resource request");

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
        drop_test_schema(schema).await;
    }

    #[tokio::test]
    async fn registered_resource_checks_permission_and_owner_scope() {
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
                    String::from("business.invoice.read"),
                    String::from("business.invoice.create"),
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
        let table = if schema.is_some() {
            "CREATE TABLE invoice (id BIGSERIAL PRIMARY KEY, tenant_id BIGINT NOT NULL, owner_user_id BIGINT NOT NULL, name TEXT NOT NULL)"
        } else {
            "CREATE TABLE invoice (id INTEGER PRIMARY KEY, tenant_id INTEGER NOT NULL, owner_user_id INTEGER NOT NULL, name TEXT NOT NULL)"
        };
        database
            .execute_unprepared(table)
            .await
            .expect("create resource table");
        database
            .execute_unprepared(&crate::std::format!(
                "INSERT INTO invoice (id, tenant_id, owner_user_id, name) VALUES (1, 1, {}, 'reader record'), (2, 1, {}, 'other owner record')",
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
            "feluqa_session={}; feluqa_csrf={}",
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
                    .uri("/admin/invoices")
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
                    .uri("/admin/invoices")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies)
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"name":"field write denied"}"#))
                    .expect("build field-permission request"),
            )
            .await
            .expect("deny a write without the field grant");
        assert_eq!(denied_write.status(), StatusCode::FORBIDDEN);
        drop_test_schema(schema).await;
    }

    #[tokio::test]
    async fn registered_resource_mutations_require_csrf_and_complete_crud() {
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
                    String::from("business.invoice.read"),
                    String::from("business.invoice.create"),
                    String::from("business.invoice.update"),
                    String::from("business.invoice.delete"),
                    String::from("business.invoice.fields.name.read"),
                    String::from("business.invoice.fields.name.write"),
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
        let table = if schema.is_some() {
            "CREATE TABLE invoice (id BIGSERIAL PRIMARY KEY, tenant_id BIGINT NOT NULL, owner_user_id BIGINT NOT NULL, name TEXT NOT NULL)"
        } else {
            "CREATE TABLE invoice (id INTEGER PRIMARY KEY, tenant_id INTEGER NOT NULL, owner_user_id INTEGER NOT NULL, name TEXT NOT NULL)"
        };
        database
            .execute_unprepared(table)
            .await
            .expect("create resource table");
        database
            .execute_unprepared(&crate::std::format!(
                "INSERT INTO invoice (id, tenant_id, owner_user_id, name) VALUES (2, 1, {}, 'other owner record')",
                administrator.user_id,
            ))
            .await
            .expect("insert a record owned by another user");
        let owned_path = crate::std::format!(
            "/admin/invoices/{}",
            if schema.is_some() { 1 } else { 3 },
        );
        let session = core
            .login("editor@example.test", "editor-password-strong")
            .await
            .expect("authenticate scoped editor");
        let cookies = crate::std::format!(
            "feluqa_session={}; feluqa_csrf={}",
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
                    .uri("/admin/invoices")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"name":"missing CSRF"}"#))
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
                    .uri("/admin/invoices")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"name":"First invoice"}"#))
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
                    .body(Body::from(r#"{"name":"Updated invoice"}"#))
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
                    .uri("/admin/invoices/2")
                    .header(HOST, "127.0.0.1:3000")
                    .header(COOKIE, cookies.as_str())
                    .header("x-csrf-token", session.csrf_token.as_str())
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"name":"stolen update"}"#))
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
                    .uri("/admin/invoices/2")
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
    }

    async fn test_database(
        schema_suffix: &str,
    ) -> (DatabasePools, crate::std::option::Option<(String, DatabaseConnection)>) {
        let postgres = crate::std::env::var_os("FELUQA_TEST_POSTGRES_URL").is_some();
        let settings_source = if postgres {
            "[connections.default]\nurl_env = \"FELUQA_TEST_POSTGRES_URL\"\nmax_connections = 1\n"
        } else {
            "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n"
        };
        let settings = DatabaseSettings::from_toml(settings_source)
            .expect("valid database settings");
        let databases = DatabasePools::connect(&settings)
            .await
            .expect("connect test database");
        let schema = if postgres {
            let name = crate::std::format!(
                "feluqa_test_{}_{}",
                crate::std::process::id(),
                schema_suffix,
            );
            let connection = databases
                .default_connection()
                .expect("default connection")
                .clone();
            connection
                .execute_unprepared(&crate::std::format!("CREATE SCHEMA {}", name))
                .await
                .expect("create isolated PostgreSQL test schema");
            connection
                .execute_unprepared(&crate::std::format!("SET search_path TO {}", name))
                .await
                .expect("select isolated PostgreSQL test schema");
            Some((name, connection))
        } else {
            None
        };
        (databases, schema)
    }

    async fn drop_test_schema(
        schema: crate::std::option::Option<(String, DatabaseConnection)>,
    ) {
        if let Some((name, connection)) = schema {
            connection
                .execute_unprepared(&crate::std::format!("DROP SCHEMA {} CASCADE", name))
                .await
                .expect("drop isolated PostgreSQL test schema");
        }
    }
}

