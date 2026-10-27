#![no_implicit_prelude]

use crate::app::controllers::panels;
use crate::app::controllers::site;
use crate::app::services::panel::PanelState;
use crate::axum::Router;
use crate::axum::extract::DefaultBodyLimit;
use crate::axum::extract::Request;
use crate::axum::http::{HeaderName, HeaderValue};
use crate::axum::middleware::{Next, from_fn};
use crate::axum::response::Response;
use crate::feluqa;
use crate::std::clone::Clone;
use crate::std::convert::From;
use crate::std::eprintln;
use crate::std::format;
use crate::std::path::PathBuf;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use crate::std::time::Instant;
use crate::tower_http::services::ServeDir;
use feluqa::web::{Route, on_get};

pub fn routes(state: PanelState) -> Router {
    let public_routes = Route::<PanelState>::new()
        .get("/", site::home)
        .get("/about", site::about)
        .on(
            "/system/setup",
            on_get(panels::setup_form).post(panels::setup),
        )
        .on(
            "/system/login",
            on_get(panels::login_form).post(panels::login),
        )
        .post("/system/logout", panels::logout)
        .get("/system", panels::system_dashboard)
        .on(
            "/system/users",
            on_get(panels::system_users).post(panels::create_system_user),
        )
        .post("/system/users/active", panels::set_system_user_active)
        .post("/system/users/role", panels::set_system_user_role)
        .post("/system/users/update", panels::update_system_user_role)
        .on(
            "/system/roles",
            on_get(panels::system_roles).post(panels::create_system_role),
        )
        .post("/system/roles/update", panels::update_system_role)
        .get("/system/modules", panels::system_modules)
        .get("/system/connections", panels::system_connections)
        .get("/system/migrations", panels::system_migrations)
        .post("/system/migrations/run", panels::run_system_migrations)
        .get("/system/audit", panels::system_audit)
        .on(
            "/system/tenants",
            on_get(panels::system_tenants).post(panels::create_system_tenant),
        )
        .post("/system/tenants/status", panels::set_system_tenant_active)
        .get("/admin", panels::business_dashboard)
        .on(
            "/admin/customers",
            on_get(panels::crm_customers).post(panels::create_customer),
        )
        .post("/admin/customers/update", panels::update_customer)
        .post("/admin/customers/delete", panels::delete_customer)
        .get("/system/{*path}", panels::registered_panel_page)
        .get("/admin/{*path}", panels::registered_panel_page)
        .finish();
    let live_routes = Route::<PanelState>::new()
        .get("/live/snapshots/{action}", panels::live_snapshot)
        .post("/live/actions", panels::live_action)
        .authenticated(state.core.clone())
        .finish();
    public_routes
        .merge(live_routes)
        .nest_service(
            "/assets",
            ServeDir::new(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("public/assets")),
        )
        .with_state(state)
        .layer(DefaultBodyLimit::max(16 * 1024))
        .layer(from_fn(binary_timing))
}

async fn binary_timing(request: Request, next: Next) -> Response {
    let method = String::from(request.method().as_str());
    let path = String::from(request.uri().path());
    let started_at = Instant::now();
    let mut response = next.run(request).await;
    let duration_ms = started_at.elapsed().as_secs_f64() * 1_000.0;
    eprintln!("[feluqa] {method} {path} binary response: {duration_ms:.3} ms");

    if let Ok(header) = HeaderValue::from_str(&format!("feluqa_binary;dur={duration_ms:.3}")) {
        response
            .headers_mut()
            .insert(HeaderName::from_static("server-timing"), header);
    }

    response
}
