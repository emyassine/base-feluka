#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::vec;
use feluqa::auth::Permission;
use feluqa::panel::{PanelError, PanelPage};
use feluqa::ui::{SCHEMA_VERSION, UiDocument, UiNode};

/// The business workspace's landing page.
pub fn overview() -> Result<PanelPage, PanelError> {
    page("business.erp.manage", "Business overview")
}

/// Declare a page relative to its owning panel.
pub fn page(permission: &str, content: &str) -> Result<PanelPage, PanelError> {
    let permission = Permission::new(String::from(permission)).map_err(|_| {
        PanelError::WrongPermissionNamespace {
            panel: String::from("business"),
            expected: String::from("business"),
        }
    })?;
    Ok(PanelPage {
        path: String::from("/"),
        permission,
        document: UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Text {
                value: String::from(content),
            }],
        },
    }
    .slug("/"))
}
