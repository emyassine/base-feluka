#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Framework-owned Feluqa Core panel contracts and default resource declarations.

extern crate alloc;
extern crate core;
extern crate feluqa_auth;
extern crate feluqa_panel as panel;
extern crate feluqa_ui;

use alloc::string::String;
use alloc::vec;
use alloc::vec::Vec;
use core::convert::From;
use core::default::Default;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::Ok;
use feluqa_auth::Permission;
use feluqa_ui::{SCHEMA_VERSION, UiDocument, UiNode};
use panel::{
    ContentWidth, NavigationGroup, NavigationItem, Panel, PanelBuilder, PanelCatalog,
    PanelCatalogError, PanelKind, PanelOptions, PanelPage, PanelProvider,
};

/// Root directory containing the compiled Feluqa Core panel pages.
pub const VIEW_ROOT: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/resources/views");

/// Built-in Feluqa Core resource declarations for users, roles and operations.
pub mod resource;

/// Registers the standard `/system` panel and Feluqa Core resources.
pub struct SystemPanelProvider;

impl PanelProvider for SystemPanelProvider {
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {
        let panel = PanelBuilder::new("system", "Feluqa Core", "/system", PanelKind::System)
            .brand_name("Feluqa Core")
            .max_content_width(ContentWidth::SevenExtraLarge)
            .sidebar_collapsible(true)
            .dark_mode()
            .login()
            .navigation_group(NavigationGroup {
                label: Some(String::from("Platform")),
                items: vec![
                    navigation_item("Overview", "/system", "o-home", None)?,
                    navigation_item(
                        "Users",
                        "/system/users",
                        "o-users",
                        Some("system.users.read"),
                    )?,
                    navigation_item(
                        "Roles",
                        "/system/roles",
                        "o-shield-check",
                        Some("system.roles.read"),
                    )?,
                    navigation_item(
                        "Tenants",
                        "/system/tenants",
                        "o-building-office-2",
                        Some("system.tenants.read"),
                    )?,
                    navigation_item(
                        "Modules",
                        "/system/modules",
                        "o-cube",
                        Some("system.modules.read"),
                    )?,
                    navigation_item(
                        "Connections",
                        "/system/connections",
                        "o-circle-stack",
                        Some("system.connections.read"),
                    )?,
                    navigation_item(
                        "Migrations",
                        "/system/migrations",
                        "o-clipboard-document-list",
                        Some("system.migrations.read"),
                    )?,
                    navigation_item(
                        "Audit log",
                        "/system/audit",
                        "o-clipboard-document-check",
                        Some("system.audit.read"),
                    )?,
                ],
            })
            .page(page(
                "/",
                "Feluqa Core system dashboard",
                "system.dashboard.read",
            )?)
            .build()?;
        catalog.register_panel(panel)?;
        catalog.register_resource(resource::USERS)?;
        catalog.register_resource(resource::ROLES)?;
        catalog.register_resource(resource::MODULES)?;
        catalog.register_resource(resource::CONNECTIONS)?;
        catalog.register_resource(resource::MIGRATIONS)?;
        catalog.register_resource(resource::AUDIT)?;
        catalog.register_resource(resource::TENANTS)?;
        Ok(())
    }
}

fn navigation_item(
    label: &str,
    path: &str,
    icon: &str,
    permission: Option<&str>,
) -> Result<NavigationItem, panel::PanelError> {
    Ok(NavigationItem {
        label: String::from(label),
        path: String::from(path),
        icon: Some(String::from(icon)),
        permission: match permission {
            Some(name) => Some(Permission::new(String::from(name)).map_err(|_| {
                panel::PanelError::InvalidPermission {
                    panel: String::from("system"),
                    expected: String::from("system"),
                }
            })?),
            None => None,
        },
    })
}

/// Construct a page owned by Feluqa Core for downstream panel extensions.
pub fn page(path: &str, title: &str, permission: &str) -> Result<PanelPage, panel::PanelError> {
    Ok(PanelPage {
        path: String::from(path),
        permission: Permission::new(String::from(permission)).map_err(|_| {
            panel::PanelError::InvalidPermission {
                panel: String::from("system"),
                expected: String::from("system"),
            }
        })?,
        document: UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Text {
                value: String::from(title),
            }],
        },
    })
}

/// Create a Core panel instance with additional provider-registered pages.
pub fn panel_with_pages(pages: Vec<PanelPage>) -> Panel {
    Panel {
        id: String::from("system"),
        title: String::from("Feluqa Core"),
        prefix: String::from("/system"),
        kind: PanelKind::System,
        pages,
        widgets: Vec::new(),
        widget_columns: 2,
        resources: Vec::new(),
        options: PanelOptions::default(),
    }
}
