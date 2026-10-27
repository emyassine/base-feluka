#![no_implicit_prelude]

extern crate feluqa_panel;
extern crate feluqa_system_panel;
extern crate std;

use feluqa_panel::PanelCatalog;
use feluqa_system_panel::SystemPanelProvider;
use std::assert;
use std::default::Default;
use std::iter::Iterator;

#[test]
fn core_provider_registers_framework_panel_and_resources() {
    let mut catalog = PanelCatalog::default();
    catalog
        .register_provider(&SystemPanelProvider)
        .expect("Core panel declarations are valid");

    assert!(catalog.panels().any(|panel| panel.prefix == "/system"));
    assert!(catalog.resource("system.users").is_some());
    assert!(catalog.resource("system.roles").is_some());
    assert!(catalog.resource("system.audit").is_some());
}
