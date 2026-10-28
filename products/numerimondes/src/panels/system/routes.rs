#![no_implicit_prelude]

use super::controllers as panels;
use crate::panels::runtime::state::PanelState;
use crate::axum::Router;
use crate::feluqa::web::{Route, on_get};

/// Routes owned by the Feluqa Core system panel adapter.
pub fn routes() -> Router<PanelState> {
    Route::<PanelState>::new()
        .on(
            "/system/setup",
            on_get(panels::setup_form).post(panels::setup),
        )
        .on(
            "/system/login",
            on_get(panels::login_form).post(panels::login),
        )
        .post("/system/logout", panels::logout)
        .post("/system/language", panels::set_language)
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
        .get("/system/{*path}", panels::registered_panel_page)
        .finish()
}
