#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate feluqa_build;
extern crate std;

use feluqa::view::compiler::Compiler;
use std::boxed::Box;
use std::convert::From;
use std::env;
use std::error::Error;
use std::path::{Path, PathBuf};
use std::println;
use std::result::Result::{self, Ok};

fn main() -> Result<(), Box<dyn Error>> {
    let project = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
    let output = PathBuf::from(env::var("OUT_DIR")?);
    let scan = feluqa_build::scan_application(&project)?;
    let target = env::var_os("CARGO_TARGET_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| project.join("../../target"));
    scan.write_manifest(&project, target, &env::var("CARGO_PKG_NAME")?)?;
    let mut compiler = Compiler::new();
    compiler.add_root("app", &project.join("resources/views"))?;
    compiler.add_root("system", Path::new(feluqa::system_panel::VIEW_ROOT))?;
    compiler.add_root("feluqa-panel", Path::new(feluqa::panel::VIEW_ROOT))?;
    compiler.add_root("business", &project.join("src/panels/business/views"))?;
    compiler.add_root("crm", &project.join("src/panels/business/crm/views"))?;
    for view in [
        "app::pages.home",
        "app::pages.about",
        "app::layouts.main",
        "app::partials.header",
    ] {
        compiler.parameters(view, "page: &crate::panels::site::site_page::SitePage")?;
    }
    compiler.parameters("system::pages.core_login", "csrf_token: &str, notice: &str")?;
    compiler.parameters("system::pages.core_setup", "csrf_token: &str, notice: &str")?;
    compiler.parameters(
        "system::pages.core_dashboard",
        "display_name: &str, email: &str, csrf_token: &str, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str, widgets: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "business::pages.business_dashboard",
        "display_name: &str, email: &str, csrf_token: &str, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str, widgets: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "system::pages.core_users",
        "display_name: &str, email: &str, csrf_token: &str, user_table: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, edit_forms: crate::feluqa::view::TrustedHtml, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str",
    )?;
    compiler.parameters(
        "system::pages.core_roles",
        "display_name: &str, email: &str, csrf_token: &str, role_table: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, edit_forms: crate::feluqa::view::TrustedHtml, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str",
    )?;
    compiler.parameters(
        "crm::pages.crm_customers",
        "display_name: &str, email: &str, csrf_token: &str, panel: &crate::panels::business::crm::view::CustomerPanel, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str",
    )?;
    compiler.parameters(
        "system::pages.core_resource",
        "display_name: &str, email: &str, title: &str, table: crate::feluqa::view::TrustedHtml, active: &str, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "system::pages.core_tenants",
        "display_name: &str, email: &str, table: crate::feluqa::view::TrustedHtml, tenant_actions: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "system::pages.core_migrations",
        "display_name: &str, email: &str, migration_table: crate::feluqa::view::TrustedHtml, run_actions: crate::feluqa::view::TrustedHtml, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "app::components.section",
        "id: &str, eyebrow: &str, title: &str",
    )?;
    compiler.parameters(
        "feluqa-panel::components.document",
        "panel: &str, active: &str, title: &str, navigation: crate::feluqa::view::TrustedHtml, display_name: &str, email: &str, brand_name: &str, csrf_token: &str",
    )?;
    compiler.parameters("feluqa-panel::components.simple-document", "title: &str")?;
    compiler.component(
        "feluqa-panel::document",
        "feluqa-panel::components.document",
        &["default"],
    )?;
    compiler.component(
        "feluqa-panel::simple-document",
        "feluqa-panel::components.simple-document",
        &["default"],
    )?;
    compiler.parameters(
        "feluqa-panel::components.shell",
        "panel: &str, active: &str, navigation: crate::feluqa::view::TrustedHtml, display_name: &str, email: &str, brand_name: &str, csrf_token: &str",
    )?;
    compiler.component(
        "feluqa-panel::shell",
        "feluqa-panel::components.shell",
        &["default"],
    )?;
    compiler.component(
        "feluqa-panel::assets",
        "feluqa-panel::components.assets",
        &[],
    )?;
    compiler.parameters(
        "feluqa-panel::components.input.wrapper",
        "prefix: &str, prefix_icon: &str, suffix: &str",
    )?;
    compiler.component(
        "feluqa-panel::theme-switcher",
        "feluqa-panel::components.theme.switcher",
        &[],
    )?;
    compiler.component(
        "feluqa-panel::input-wrapper",
        "feluqa-panel::components.input.wrapper",
        &["default"],
    )?;
    compiler.parameters(
        "feluqa-panel::components.section",
        "heading: &str, description: &str",
    )?;
    compiler.component(
        "feluqa-panel::section",
        "feluqa-panel::components.section",
        &["default"],
    )?;
    compiler.parameters(
        "feluqa-panel::components.button",
        "color: &str, disabled: bool",
    )?;
    compiler.component(
        "feluqa::button",
        "feluqa-panel::components.button",
        &["default"],
    )?;
    compiler.parameters(
        "feluqa-panel::components.field",
        "id: &str, label: &str, required: bool",
    )?;
    compiler.component(
        "feluqa::field",
        "feluqa-panel::components.field",
        &["default"],
    )?;
    compiler.parameters(
        "feluqa-panel::components.language-selector",
        "csrf_token: &str, active: &str",
    )?;
    compiler.component(
        "feluqa-panel::language-selector",
        "feluqa-panel::components.language-selector",
        &[],
    )?;
    compiler.component(
        "site::section",
        "app::components.section",
        &["default", "actions"],
    )?;
    compiler.entry("home", "app::pages.home")?;
    compiler.entry("about", "app::pages.about")?;
    compiler.entry("core_login", "system::pages.core_login")?;
    compiler.entry("core_setup", "system::pages.core_setup")?;
    compiler.entry("core_dashboard", "system::pages.core_dashboard")?;
    compiler.entry("business_dashboard", "business::pages.business_dashboard")?;
    compiler.entry("core_users", "system::pages.core_users")?;
    compiler.entry("core_roles", "system::pages.core_roles")?;
    compiler.entry("crm_customers", "crm::pages.crm_customers")?;
    compiler.entry("core_resource", "system::pages.core_resource")?;
    compiler.entry("core_tenants", "system::pages.core_tenants")?;
    compiler.entry("core_migrations", "system::pages.core_migrations")?;
    let generated = compiler.generate()?;
    for dependency in &generated.dependencies {
        println!("cargo:rerun-if-changed={}", dependency.display());
    }
    generated.write_to(&output.join("views.rs"))?;
    feluqa::database::build_support::generate_migration_registry_from(
        &project.join("src/panels/business"),
        &output.join("migrations.rs"),
    )?;
    println!("cargo:rerun-if-changed=build.rs");
    Ok(())
}
