#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::vec;
use feluqa::auth::Permission;
use feluqa::panel::{NavigationGroup, NavigationItem, PanelBuilder, PanelError, PanelKind};

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
                icon: Some(String::from("home")),
                permission: Some(overview),
            },
            NavigationItem {
                label: String::from("Customers"),
                path: String::from("/admin/customers"),
                icon: Some(String::from("users")),
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
        .page(crate::panels::pages::business::overview()?)
        .resource(crate::panels::resources::customers::CUSTOMERS.slug("customers"));
    navigation(panel)?.build()
}
