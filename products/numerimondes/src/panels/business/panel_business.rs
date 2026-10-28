#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::option::Option::Some;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use crate::std::vec;
use feluqa::auth::Permission;
use feluqa::panel::{
    Dashboard, NavigationGroup, NavigationItem, PanelBuilder, PanelError, PanelKind,
};

#[path = "resources/customers.rs"]
pub mod customers;
#[path = "pages/overview.rs"]
pub mod overview;
#[path = "controllers.rs"]
pub mod controllers;
#[path = "routes.rs"]
pub mod routes;

/// Business-owned CRM domain, customer resource, and lifecycle provider.
pub mod crm {
    #[path = "controllers.rs"]
    pub mod controllers;
    #[path = "model.rs"]
    pub mod model;
    #[path = "policies.rs"]
    pub mod policies;
    #[path = "providers.rs"]
    pub mod providers;
    #[path = "resource.rs"]
    pub mod resource;
    #[path = "routes.rs"]
    pub mod routes;
    #[path = "seeders.rs"]
    pub mod seeders;
    #[path = "services.rs"]
    pub mod services;
    #[path = "validation.rs"]
    mod validation;
    #[path = "view.rs"]
    pub mod view;
}

/// Add this panel's business destinations to its sidebar declaration.
pub fn navigation(panel: PanelBuilder) -> Result<PanelBuilder, PanelError> {
    let overview =
        Permission::new("business.erp.manage").map_err(|_| PanelError::InvalidPermission {
            panel: String::from("business"),
            expected: String::from("business"),
        })?;
    let customers = Permission::new("business.crm.customers.read").map_err(|_| {
        PanelError::InvalidPermission {
            panel: String::from("business"),
            expected: String::from("business"),
        }
    })?;
    Ok(panel.navigation_group(NavigationGroup {
        label: Some(String::from("Workspace")),
        items: vec![
            NavigationItem {
                label: String::from("Overview"),
                path: String::from("/admin"),
                icon: Some(String::from("o-home")),
                permission: Some(overview),
            },
            NavigationItem {
                label: String::from("Customers"),
                path: String::from("/admin/customers"),
                icon: Some(String::from("o-users")),
                permission: Some(customers),
            },
        ],
    }))
}

/// Build the business panel declaration.
pub fn declaration() -> Result<feluqa::panel::Panel, PanelError> {
    let panel = PanelBuilder::for_kind(PanelKind::Business)
        .id("business")
        .title("Business ERP")
        .slug("admin")
        .brand_name("Numerimondes")
        .dark_mode()
        .login()
        .pages([overview::Overview::page()?])
        .resources([customers::CUSTOMERS.slug("customers")]);
    navigation(panel)?.build()
}
