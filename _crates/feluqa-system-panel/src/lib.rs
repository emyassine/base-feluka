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
use core::result::Result;
use core::result::Result::Ok;
use feluqa_auth::Permission;
use feluqa_ui::{SCHEMA_VERSION, UiDocument, UiNode};
use panel::{Panel, PanelCatalog, PanelCatalogError, PanelKind, PanelPage, PanelProvider};

/// Root directory containing the compiled Feluqa Core panel pages.
pub const VIEW_ROOT: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/resources/views");

/// Built-in Feluqa Core resource declarations for users, roles and operations.
pub mod resource;

/// Registers the standard `/system` panel and Feluqa Core resources.
pub struct SystemPanelProvider;

impl PanelProvider for SystemPanelProvider {
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {
        catalog.register_panel(Panel::single_page(
            "system",
            "Feluqa Core",
            "/system",
            PanelKind::System,
            "system.dashboard.read",
            "Feluqa Core system dashboard",
        )?)?;
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
    }
}
