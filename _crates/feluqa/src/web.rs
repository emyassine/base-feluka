#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate alloc;

use crate::auth::{Authorizer, Permission, PermissionSetAuthorizer, Principal};
use crate::axum;
use crate::core::service::CoreStore;
use crate::rust_core as core;
use crate::rust_core::clone::Clone;
use crate::rust_core::convert::From;
use crate::rust_core::default::Default;
use crate::rust_core::iter::Iterator;
use crate::rust_core::marker::{Send, Sync};
use crate::rust_core::ops::FnOnce;
use crate::rust_core::option::Option;
use crate::rust_core::option::Option::{None, Some};
use crate::rust_core::result::Result;
use crate::rust_core::result::Result::{Err, Ok};
use crate::subtle::ConstantTimeEq;
use alloc::collections::BTreeMap;
use alloc::format;
use alloc::string::{String, ToString};
use axum::Router;
use axum::extract::{Path, Request, State};
use axum::handler::Handler;
use axum::http::header::COOKIE;
use axum::http::{HeaderMap, StatusCode};
use axum::middleware::Next;
use axum::response::{Html, IntoResponse, Redirect, Response};
use axum::routing::{MethodRouter, delete, get, post, put};
use core::fmt;

/// Start a multi-method route definition, for example `get(handler).post(create)`.
pub use axum::routing::get as on_get;

/// Cookie name used by Feluqa Core browser sessions.
pub const SESSION_COOKIE_NAME: &str = "feluqa_session";
/// Cookie name used by Feluqa Core's readable double-submit CSRF token.
pub const CSRF_COOKIE_NAME: &str = "feluqa_csrf";

/// Require one exact permission granted to the authenticated request principal.
pub fn authorize(principal: &Principal, name: &str) -> Result<(), StatusCode> {
    let permission = Permission::new(name).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    PermissionSetAuthorizer
        .authorize(principal, &permission)
        .map_err(|_| StatusCode::FORBIDDEN)
}

/// Map common model lookup errors to an HTTP status code.
pub fn database_error(error: crate::database::orm::DbErr) -> StatusCode {
    match error {
        crate::database::orm::DbErr::RecordNotFound(_) => StatusCode::NOT_FOUND,
        _ => StatusCode::INTERNAL_SERVER_ERROR,
    }
}

/// Mark output from Feluqa's fixed panel renderer as safe for a compiled view's raw slot.
pub fn trusted_panel_html(rendered: crate::panel::RenderedHtml) -> crate::view::TrustedHtml {
    crate::view::TrustedHtml::from_trusted(rendered.as_str().to_string())
}

/// Serve the shared Feluqa Live browser client to all panel types.
pub fn live_client() -> Response {
    asset_response(
        crate::panel::LIVE_CLIENT_JS,
        "text/javascript; charset=utf-8",
    )
}

/// Serve the shared Filament-derived panel stylesheet.
pub fn panel_stylesheet() -> Response {
    asset_response(crate::panel::FILAMENT_THEME_CSS, "text/css; charset=utf-8")
}

/// Serve Feluqa's small layout rules for the shared Filament panel structure.
pub fn panel_adapter_stylesheet() -> Response {
    asset_response(
        crate::panel::FILAMENT_ADAPTER_CSS,
        "text/css; charset=utf-8",
    )
}

/// Serve the shared Filament-derived panel browser runtime.
pub fn panel_client() -> Response {
    asset_response(
        crate::panel::FILAMENT_CLIENT_JS,
        "text/javascript; charset=utf-8",
    )
}

/// Serve the optional Filament Echo browser integration.
pub fn panel_echo_client() -> Response {
    asset_response(
        crate::panel::FILAMENT_ECHO_JS,
        "text/javascript; charset=utf-8",
    )
}

/// Serve one framework-owned Filament panel asset by its stable public filename.
pub async fn serve_panel_asset(Path(asset): Path<String>) -> Result<Response, StatusCode> {
    match asset.as_str() {
        "theme.css" => Ok(panel_stylesheet()),
        "panel.css" => Ok(panel_adapter_stylesheet()),
        "panel.js" => Ok(panel_client()),
        "echo.js" => Ok(panel_echo_client()),
        _ => Err(StatusCode::NOT_FOUND),
    }
}

/// HTTP handler for the framework-owned Feluqa Live browser client.
pub async fn serve_live_client() -> Response {
    live_client()
}

fn asset_response(asset: &'static str, content_type: &'static str) -> Response {
    let mut response = Response::new(axum::body::Body::from(asset));
    response.headers_mut().insert(
        axum::http::header::CONTENT_TYPE,
        axum::http::HeaderValue::from_static(content_type),
    );
    response
}

/// Validate a mutation's `x-csrf-token` header against the readable CSRF cookie
/// and the persisted token bound to the current session.
pub async fn verify_csrf(core_store: &CoreStore, headers: &HeaderMap) -> Result<(), StatusCode> {
    let session = session_cookie(headers)
        .map_err(|_| StatusCode::FORBIDDEN)?
        .ok_or(StatusCode::FORBIDDEN)?;
    let cookie_token = named_cookie(headers, CSRF_COOKIE_NAME)
        .map_err(|_| StatusCode::FORBIDDEN)?
        .ok_or(StatusCode::FORBIDDEN)?;
    let header_token = headers
        .get("x-csrf-token")
        .and_then(|value| value.to_str().ok())
        .ok_or(StatusCode::FORBIDDEN)?;
    if cookie_token.len() != 64
        || cookie_token
            .as_bytes()
            .ct_eq(header_token.as_bytes())
            .unwrap_u8()
            != 1
    {
        return Err(StatusCode::FORBIDDEN);
    }
    match core_store.verify_csrf(session, header_token).await {
        Ok(true) => Ok(()),
        Ok(false) => Err(StatusCode::FORBIDDEN),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

/// Validate the Core session cookie and insert trusted identity and permission claims.
///
/// Apply this middleware only to protected route groups with Axum's
/// `middleware::from_fn_with_state`. It returns 401 when the cookie is absent or
/// invalid, and 500 when the session store or its permission data cannot be read.
pub async fn require_session(
    State(core_store): State<CoreStore>,
    mut request: Request,
    next: Next,
) -> Response {
    let token = match session_cookie(request.headers()) {
        Ok(Some(token)) => token,
        Ok(None) | Err(()) => return StatusCode::UNAUTHORIZED.into_response(),
    };
    let identity = match core_store.authenticate(token).await {
        Ok(Some(identity)) => identity,
        Ok(None) => return StatusCode::UNAUTHORIZED.into_response(),
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let grants = match core_store.permissions_for(identity.user_id).await {
        Ok(grants) => grants,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    let mut principal = match Principal::new(
        identity.user_id.to_string(),
        Some(identity.tenant_id.to_string()),
    ) {
        Ok(principal) => principal,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };
    for grant in grants {
        let permission = match Permission::new(grant) {
            Ok(permission) => permission,
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        };
        principal.grant(permission);
    }
    request.extensions_mut().insert(identity);
    request.extensions_mut().insert(principal);
    next.run(request).await
}

fn session_cookie(headers: &HeaderMap) -> Result<Option<&str>, ()> {
    named_cookie(headers, SESSION_COOKIE_NAME)
}

fn named_cookie<'a>(headers: &'a HeaderMap, wanted: &str) -> Result<Option<&'a str>, ()> {
    let mut token = None;
    for value in headers.get_all(COOKIE).iter() {
        let value = value.to_str().map_err(|_| ())?;
        for pair in value.split(';') {
            let Some((name, value)) = pair.trim().split_once('=') else {
                continue;
            };
            if name.trim() == wanted {
                if token.is_some() {
                    return Err(());
                }
                token = Some(value.trim());
            }
        }
    }
    match token {
        Some(value) if value.len() == 64 => Ok(Some(value)),
        Some(_) => Err(()),
        None => Ok(None),
    }
}

/// Short route builder for a Feluqa web application.
pub type Route<S = ()> = Routes<S>;

/// Application router with readable route registration and named-path lookup.
pub struct Routes<S = ()> {
    router: Router<S>,
    prefix: String,
    names: BTreeMap<String, String>,
    last_path: Option<String>,
}

/// Error returned for invalid or duplicate route names.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum RouteError {
    /// A named route needs a previously added route.
    NoCurrentRoute,
    /// Route names must use lower-case dot-separated ASCII words.
    InvalidName,
    /// A route name may only be registered once.
    DuplicateName,
}

impl fmt::Display for RouteError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NoCurrentRoute => formatter.write_str("name() requires a preceding route"),
            Self::InvalidName => formatter.write_str("route name is invalid"),
            Self::DuplicateName => formatter.write_str("route name is already registered"),
        }
    }
}

impl core::error::Error for RouteError {}

impl<S> Routes<S>
where
    S: Clone + Send + Sync + 'static,
{
    /// Start an empty application route table.
    pub fn new() -> Self {
        Self {
            router: Router::new(),
            prefix: String::new(),
            names: BTreeMap::new(),
            last_path: None,
        }
    }

    /// Add a GET route.
    pub fn get<H, T>(mut self, path: &str, handler: H) -> Self
    where
        H: Handler<T, S>,
        T: 'static,
    {
        let path = self.resolve(path);
        self.router = self.router.route(&path, get(handler));
        self.last_path = Some(path);
        self
    }

    /// Add a POST route.
    pub fn post<H, T>(mut self, path: &str, handler: H) -> Self
    where
        H: Handler<T, S>,
        T: 'static,
    {
        let path = self.resolve(path);
        self.router = self.router.route(&path, post(handler));
        self.last_path = Some(path);
        self
    }

    /// Add a PUT route.
    pub fn put<H, T>(mut self, path: &str, handler: H) -> Self
    where
        H: Handler<T, S>,
        T: 'static,
    {
        let path = self.resolve(path);
        self.router = self.router.route(&path, put(handler));
        self.last_path = Some(path);
        self
    }

    /// Add a DELETE route.
    pub fn delete<H, T>(mut self, path: &str, handler: H) -> Self
    where
        H: Handler<T, S>,
        T: 'static,
    {
        let path = self.resolve(path);
        self.router = self.router.route(&path, delete(handler));
        self.last_path = Some(path);
        self
    }

    /// Add a route with multiple HTTP methods.
    pub fn on(mut self, path: &str, methods: MethodRouter<S>) -> Self {
        let path = self.resolve(path);
        self.router = self.router.route(&path, methods);
        self.last_path = Some(path);
        self
    }

    /// Register a redirect route with the requested 3xx response status.
    pub fn redirect(mut self, path: &str, destination: &str, status: StatusCode) -> Self
    where
        S: Clone + Send + Sync + 'static,
    {
        let destination = destination.to_string();
        let handler = move || {
            let destination = destination.clone();
            async move {
                let mut response = Redirect::to(&destination).into_response();
                *response.status_mut() = status;
                response
            }
        };
        let path = self.resolve(path);
        self.router = self.router.route(&path, get(handler));
        self.last_path = Some(path);
        self
    }

    /// Add a static compiled-view response.
    pub fn view(mut self, path: &str, html: String) -> Self
    where
        S: Clone + Send + Sync + 'static,
    {
        let handler = move || {
            let html = html.clone();
            async move { Html(html) }
        };
        let path = self.resolve(path);
        self.router = self.router.route(&path, get(handler));
        self.last_path = Some(path);
        self
    }

    /// Require a valid Feluqa Core session for the routes currently in this builder.
    ///
    /// Use this on a route group before merging it into the public route table.
    /// The middleware inserts validated [`Principal`] and [`SessionIdentity`]
    /// request extensions for handlers to authorize against.
    pub fn authenticated(mut self, core_store: CoreStore) -> Self {
        self.router = self
            .router
            .route_layer(axum::middleware::from_fn_with_state(
                core_store,
                require_session,
            ));
        self
    }

    /// Name the most recently registered route.
    pub fn name(mut self, name: &str) -> Result<Self, RouteError> {
        if !valid_name(name) {
            return Err(RouteError::InvalidName);
        }
        let path = self.last_path.as_ref().ok_or(RouteError::NoCurrentRoute)?;
        if self.names.contains_key(name) {
            return Err(RouteError::DuplicateName);
        }
        self.names.insert(name.to_string(), path.clone());
        Ok(self)
    }

    /// Return the registered path for a named route.
    pub fn named_path(&self, name: &str) -> Option<&str> {
        self.names.get(name).map(String::as_str)
    }

    /// Register a route group under a prefix.
    pub fn group<F>(mut self, prefix: &str, register: F) -> Result<Self, RouteError>
    where
        F: FnOnce(Self) -> Result<Self, RouteError>,
        S: Send + Sync + 'static,
    {
        let full_prefix = self.resolve(prefix);
        let group = Self {
            router: Router::new(),
            prefix: full_prefix,
            names: BTreeMap::new(),
            last_path: None,
        };
        let group = register(group)?;
        self.router = self.router.merge(group.router);
        for (name, path) in group.names {
            if self.names.contains_key(&name) {
                return Err(RouteError::DuplicateName);
            }
            self.names.insert(name, path);
        }
        self.last_path = group.last_path;
        Ok(self)
    }

    /// Finish registration and return the Axum router for serving.
    pub fn finish(self) -> Router<S> {
        self.router
    }

    fn resolve(&self, path: &str) -> String {
        if self.prefix.is_empty() {
            path.to_string()
        } else if path == "/" {
            self.prefix.clone()
        } else {
            format!("{}{}", self.prefix.trim_end_matches('/'), path)
        }
    }
}

impl<S> Default for Routes<S>
where
    S: Clone + Send + Sync + 'static,
{
    fn default() -> Self {
        Self::new()
    }
}

fn valid_name(name: &str) -> bool {
    !name.is_empty()
        && name.split('.').all(|part| {
            !part.is_empty()
                && part
                    .bytes()
                    .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        })
}

#[cfg(test)]
mod tests {
    use super::{
        CSRF_COOKIE_NAME, RouteError, Routes, SESSION_COOKIE_NAME, authorize, require_session,
        session_cookie, verify_csrf,
    };
    use crate::auth::{Authorizer, Permission, PermissionSetAuthorizer, Principal};
    use crate::axum::body::Body;
    use crate::axum::http::header::COOKIE;
    use crate::axum::http::{HeaderMap, HeaderValue, Request, StatusCode};
    use crate::axum::routing::get;
    use crate::axum::{Extension, Router};
    use crate::core::service::CoreStore;
    use crate::database::{DatabasePools, DatabaseSettings, MigrationRunner};
    use crate::rust_core::assert;
    use crate::rust_core::assert_eq;
    use crate::rust_core::clone::Clone;
    use crate::rust_core::matches;
    use crate::rust_core::option::Option::{None, Some};
    use crate::rust_core::result::Result::{Err, Ok};
    use crate::std::format;
    use crate::tower::ServiceExt;

    #[test]
    fn redirect_uses_the_requested_status_and_location() {
        let app = Routes::<()>::new()
            .redirect("/old-path", "/new-path", StatusCode::MOVED_PERMANENTLY)
            .finish();
        let runtime = crate::tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("test runtime");
        runtime.block_on(async {
            let response = app
                .oneshot(
                    Request::builder()
                        .uri("/old-path")
                        .body(Body::empty())
                        .expect("redirect request"),
                )
                .await
                .expect("redirect response");
            assert_eq!(response.status(), StatusCode::MOVED_PERMANENTLY);
            assert_eq!(
                response.headers().get(crate::axum::http::header::LOCATION),
                Some(&HeaderValue::from_static("/new-path"))
            );
        });
    }

    async fn endpoint() -> &'static str {
        "ok"
    }

    #[test]
    fn controller_authorization_checks_an_exact_grant() {
        let mut principal = Principal::new("42", None).expect("valid test principal");
        assert_eq!(
            authorize(&principal, "business.users.read"),
            Err(StatusCode::FORBIDDEN)
        );
        principal.grant(Permission::new("business.users.read").expect("valid test permission"));
        assert_eq!(authorize(&principal, "business.users.read"), Ok(()));
        assert_eq!(
            authorize(&principal, "business.users.delete"),
            Err(StatusCode::FORBIDDEN)
        );
    }

    async fn protected_endpoint(Extension(principal): Extension<Principal>) -> StatusCode {
        let permission = Permission::new("system.dashboard.read").expect("valid grant");
        if PermissionSetAuthorizer
            .authorize(&principal, &permission)
            .is_ok()
        {
            StatusCode::OK
        } else {
            StatusCode::FORBIDDEN
        }
    }

    async fn denied_endpoint(Extension(principal): Extension<Principal>) -> StatusCode {
        let permission = Permission::new("business.crm.customers.delete").expect("valid grant");
        if PermissionSetAuthorizer
            .authorize(&principal, &permission)
            .is_ok()
        {
            StatusCode::OK
        } else {
            StatusCode::FORBIDDEN
        }
    }

    #[test]
    fn session_cookie_requires_one_well_formed_token() {
        let mut headers = HeaderMap::new();
        assert!(matches!(session_cookie(&headers), Ok(None)));

        headers.insert(
            COOKIE,
            HeaderValue::from_static("theme=dark; feluqa_session=0123456789012345678901234567890123456789012345678901234567890123"),
        );
        assert_eq!(
            session_cookie(&headers),
            Ok(Some(
                "0123456789012345678901234567890123456789012345678901234567890123"
            ))
        );

        headers.append(
            COOKIE,
            HeaderValue::from_static(
                "feluqa_session=0123456789012345678901234567890123456789012345678901234567890123",
            ),
        );
        assert!(session_cookie(&headers).is_err());
        assert_eq!(SESSION_COOKIE_NAME, "feluqa_session");
    }

    #[test]
    fn authenticated_route_rejects_missing_and_revoked_sessions() {
        let runtime = crate::tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("test runtime");
        runtime.block_on(async {
            let settings = DatabaseSettings::from_toml(
                "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
            )
            .expect("valid test database settings");
            let pools = DatabasePools::connect(&settings)
                .await
                .expect("connected test database");
            MigrationRunner::run_module(&pools, "default", &crate::core::MIGRATIONS)
                .await
                .expect("migrated Core tables");
            let core = CoreStore::new(pools.default_connection().expect("default pool").clone())
                .expect("Core store");
            core.bootstrap_first_admin("owner@example.test", "Owner", "a long test password")
                .await
                .expect("bootstrapped first administrator");
            let session = core
                .login("owner@example.test", "a long test password")
                .await
                .expect("created browser session");
            let app = Router::new()
                .route("/private", get(protected_endpoint))
                .route("/denied", get(denied_endpoint))
                .route_layer(crate::axum::middleware::from_fn_with_state(
                    core.clone(),
                    require_session,
                ));

            let anonymous = app
                .clone()
                .oneshot(
                    Request::builder()
                        .uri("/private")
                        .body(Body::empty())
                        .expect("anonymous request"),
                )
                .await
                .expect("anonymous response");
            assert_eq!(anonymous.status(), StatusCode::UNAUTHORIZED);

            let cookie = format!("{SESSION_COOKIE_NAME}={}", session.session_token);
            let authenticated = app
                .clone()
                .oneshot(
                    Request::builder()
                        .uri("/private")
                        .header(COOKIE, cookie)
                        .body(Body::empty())
                        .expect("authenticated request"),
                )
                .await
                .expect("authenticated response");
            assert_eq!(authenticated.status(), StatusCode::OK);

            let denied = app
                .clone()
                .oneshot(
                    Request::builder()
                        .uri("/denied")
                        .header(
                            COOKIE,
                            format!("{SESSION_COOKIE_NAME}={}", session.session_token),
                        )
                        .body(Body::empty())
                        .expect("permission-denied request"),
                )
                .await
                .expect("permission-denied response");
            assert_eq!(denied.status(), StatusCode::FORBIDDEN);

            core.logout(&session.session_token)
                .await
                .expect("revoked session");
            let revoked = app
                .oneshot(
                    Request::builder()
                        .uri("/private")
                        .header(
                            COOKIE,
                            format!("{SESSION_COOKIE_NAME}={}", session.session_token),
                        )
                        .body(Body::empty())
                        .expect("revoked request"),
                )
                .await
                .expect("revoked response");
            assert_eq!(revoked.status(), StatusCode::UNAUTHORIZED);
        });
    }

    #[test]
    fn csrf_validation_binds_header_cookie_and_persisted_session_token() {
        let runtime = crate::tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .expect("test runtime");
        runtime.block_on(async {
            let settings = DatabaseSettings::from_toml(
                "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
            )
            .expect("valid test database settings");
            let pools = DatabasePools::connect(&settings)
                .await
                .expect("connected test database");
            MigrationRunner::run_module(&pools, "default", &crate::core::MIGRATIONS)
                .await
                .expect("migrated Core tables");
            let core = CoreStore::new(pools.default_connection().expect("default pool").clone())
                .expect("Core store");
            core.bootstrap_first_admin("owner@example.test", "Owner", "a long test password")
                .await
                .expect("bootstrapped first administrator");
            let session = core
                .login("owner@example.test", "a long test password")
                .await
                .expect("created browser session");
            let mut headers = HeaderMap::new();
            headers.insert(
                COOKIE,
                HeaderValue::from_str(&format!(
                    "{SESSION_COOKIE_NAME}={}; {CSRF_COOKIE_NAME}={}",
                    session.session_token, session.csrf_token
                ))
                .expect("valid cookie header"),
            );
            headers.insert(
                "x-csrf-token",
                HeaderValue::from_str(&session.csrf_token).expect("valid csrf header"),
            );
            assert_eq!(verify_csrf(&core, &headers).await, Ok(()));

            headers.insert(
                "x-csrf-token",
                HeaderValue::from_static(
                    "0000000000000000000000000000000000000000000000000000000000000000",
                ),
            );
            assert_eq!(
                verify_csrf(&core, &headers).await,
                Err(StatusCode::FORBIDDEN)
            );
            assert_eq!(CSRF_COOKIE_NAME, "feluqa_csrf");
        });
    }

    #[test]
    fn route_names_and_groups_are_explicit_and_resolvable() {
        let routes = Routes::<()>::new()
            .get("/", endpoint)
            .name("site.home")
            .expect("valid public route name")
            .group("/admin", |group| {
                group.get("/dashboard", endpoint).name("admin.dashboard")
            })
            .expect("valid grouped routes");
        assert_eq!(routes.named_path("site.home"), Some("/"));
        assert_eq!(
            routes.named_path("admin.dashboard"),
            Some("/admin/dashboard")
        );
        let _router = routes.finish();
    }

    #[test]
    fn route_name_errors_are_reported_instead_of_silently_overwriting() {
        assert!(matches!(
            Routes::<()>::new().name("orphan"),
            Err(RouteError::NoCurrentRoute)
        ));
        let routes = Routes::<()>::new()
            .get("/one", endpoint)
            .name("site.index")
            .expect("name route");
        assert!(matches!(
            routes.get("/two", endpoint).name("site.index"),
            Err(RouteError::DuplicateName)
        ));
        assert!(matches!(
            Routes::<()>::new().get("/bad", endpoint).name("Uppercase"),
            Err(RouteError::InvalidName)
        ));
    }
}
