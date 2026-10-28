#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::result::Result;
use crate::std::string::String;
use crate::std::vec;
use feluqa::auth::Permission;
use feluqa::panel::{Dashboard, PanelError, PanelPage};
use feluqa::ui::{SCHEMA_VERSION, UiDocument, UiNode};

/// The business workspace's dashboard page.
pub struct Overview;

impl Dashboard for Overview {
    const ROUTE_PATH: &'static str = "/";
    const TITLE: &'static str = "Business overview";
    const NAVIGATION_SORT: i32 = 3;

    fn page() -> Result<PanelPage, PanelError> {
        let permission = Permission::new(String::from("business.erp.manage")).map_err(|_| {
            PanelError::WrongPermissionNamespace {
                panel: String::from("business"),
                expected: String::from("business"),
            }
        })?;
        Ok(PanelPage {
            path: String::from(Self::ROUTE_PATH),
            permission,
            document: UiDocument {
                schema_version: SCHEMA_VERSION,
                root: vec![UiNode::Text {
                    value: String::from(Self::TITLE),
                }],
            },
        })
    }
}
