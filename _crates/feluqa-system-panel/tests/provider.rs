#![no_implicit_prelude]

extern crate feluqa_auth;
extern crate feluqa_panel;
extern crate feluqa_system_panel;
extern crate std;

use feluqa_auth::{Permission, PermissionSetAuthorizer, Principal};
use feluqa_panel::PanelCatalog;
use feluqa_system_panel::SystemPanelProvider;
use std::assert;
use std::assert_eq;
use std::convert::From;
use std::default::Default;
use std::iter::Iterator;
use std::option::Option::None;
use std::option::Option::Some;
use std::string::String;

#[test]
fn core_provider_registers_framework_panel_and_resources() {
    let mut catalog = PanelCatalog::default();
    catalog
        .register_provider(&SystemPanelProvider)
        .expect("Core panel declarations are valid");

    let system = catalog
        .panels()
        .find(|panel| panel.prefix == "/system")
        .expect("registered Core panel");
    assert_eq!(
        system.options.appearance.brand_name.as_deref(),
        Some("Feluqa Core")
    );
    assert!(system.options.authentication.login);
    assert!(system.options.appearance.sidebar_collapsible);
    assert_eq!(system.options.navigation[0].items.len(), 8);
    let mut principal = Principal::new("reader", None).expect("valid principal");
    principal.grant(Permission::new(String::from("system.users.read")).expect("users grant"));
    let navigation = catalog
        .render_navigation(
            "system",
            &principal,
            &PermissionSetAuthorizer,
            "/system/users",
        )
        .expect("permission-filtered Core navigation");
    assert!(
        navigation
            .as_str()
            .contains("href=\"/system/users\" aria-current=\"page\"")
    );
    assert!(!navigation.as_str().contains("href=\"/system/roles\""));
    assert!(catalog.resource("system.users").is_some());
    assert!(catalog.resource("system.roles").is_some());
    assert!(catalog.resource("system.audit").is_some());
}
