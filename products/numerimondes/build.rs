#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;

use feluqa::view::compiler::Compiler;
use std::boxed::Box;
use std::convert::From;
use std::env;
use std::error::Error;
use std::path::PathBuf;
use std::println;
use std::result::Result::{self, Ok};

fn main() -> Result<(), Box<dyn Error>> {
    let project = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
    let output = PathBuf::from(env::var("OUT_DIR")?);
    let mut compiler = Compiler::new();
    compiler.add_root("app", &project.join("resources/views"))?;
    compiler.add_root("system", &project.join("src/modules/system/views"))?;
    compiler.add_root("business", &project.join("src/modules/business/views"))?;
    compiler.add_root("crm", &project.join("src/modules/crm/views"))?;
    for view in [
        "app::pages.home",
        "app::pages.about",
        "app::layouts.main",
        "app::partials.header",
    ] {
        compiler.parameters(view, "page: &crate::views::Page")?;
    }
    compiler.parameters("system::pages.core_login", "csrf_token: &str, notice: &str")?;
    compiler.parameters("system::pages.core_setup", "csrf_token: &str, notice: &str")?;
    compiler.parameters(
        "system::pages.core_dashboard",
        "display_name: &str, email: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "business::pages.business_dashboard",
        "display_name: &str, email: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "system::pages.core_users",
        "display_name: &str, email: &str, csrf_token: &str, user_table: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, edit_forms: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "system::pages.core_roles",
        "display_name: &str, email: &str, csrf_token: &str, role_table: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, edit_forms: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "crm::pages.crm_customers",
        "display_name: &str, email: &str, csrf_token: &str, panel: &crate::modules::crm::view::CustomerPanel",
    )?;
    compiler.parameters(
        "system::pages.core_resource",
        "display_name: &str, email: &str, title: &str, table: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "system::pages.core_tenants",
        "display_name: &str, email: &str, table: crate::feluqa::view::TrustedHtml, tenant_actions: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "system::pages.core_migrations",
        "display_name: &str, email: &str, migration_table: crate::feluqa::view::TrustedHtml, run_actions: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "app::components.section",
        "id: &str, eyebrow: &str, title: &str",
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
    feluqa::database::build_support::generate_migration_registry(
        &project,
        &output.join("migrations.rs"),
    )?;
    println!("cargo:rerun-if-changed=build.rs");
    Ok(())
}
