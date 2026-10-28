#![no_implicit_prelude]

use super::controllers;
use crate::panels::runtime::state::PanelState;
use crate::axum::Router;
use crate::feluqa::web::{Route, on_get};

/// Routes and CRUD actions owned by the CRM module.
pub fn routes() -> Router<PanelState> {
    Route::<PanelState>::new()
        .on(
            "/admin/customers",
            on_get(controllers::crm_customers).post(controllers::create_customer),
        )
        .post("/admin/customers/update", controllers::update_customer)
        .post("/admin/customers/delete", controllers::delete_customer)
        .finish()
}
