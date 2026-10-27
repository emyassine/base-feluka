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
    for view in [
        "app::pages.home",
        "app::pages.about",
        "app::layouts.main",
        "app::partials.header",
    ] {
        compiler.parameters(view, "page: &crate::views::Page")?;
    }
    compiler.parameters("app::pages.core_login", "csrf_token: &str, notice: &str")?;
    compiler.parameters("app::pages.core_setup", "csrf_token: &str, notice: &str")?;
    compiler.parameters(
        "app::pages.core_dashboard",
        "display_name: &str, email: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "app::pages.business_dashboard",
        "display_name: &str, email: &str, csrf_token: &str",
    )?;
    compiler.parameters(
        "app::pages.core_users",
        "display_name: &str, email: &str, csrf_token: &str, user_table: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, edit_forms: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "app::pages.core_roles",
        "display_name: &str, email: &str, csrf_token: &str, role_table: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml, edit_forms: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "app::pages.crm_customers",
        "display_name: &str, email: &str, csrf_token: &str, panel: &crate::modules::crm::view::CustomerPanel",
    )?;
    compiler.parameters(
        "app::pages.core_resource",
        "display_name: &str, email: &str, title: &str, table: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "app::pages.core_tenants",
        "display_name: &str, email: &str, table: crate::feluqa::view::TrustedHtml, tenant_actions: crate::feluqa::view::TrustedHtml, create_form: crate::feluqa::view::TrustedHtml",
    )?;
    compiler.parameters(
        "app::pages.core_migrations",
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
    compiler.entry("core_login", "app::pages.core_login")?;
    compiler.entry("core_setup", "app::pages.core_setup")?;
    compiler.entry("core_dashboard", "app::pages.core_dashboard")?;
    compiler.entry("business_dashboard", "app::pages.business_dashboard")?;
    compiler.entry("core_users", "app::pages.core_users")?;
    compiler.entry("core_roles", "app::pages.core_roles")?;
    compiler.entry("crm_customers", "app::pages.crm_customers")?;
    compiler.entry("core_resource", "app::pages.core_resource")?;
    compiler.entry("core_tenants", "app::pages.core_tenants")?;
    compiler.entry("core_migrations", "app::pages.core_migrations")?;
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
