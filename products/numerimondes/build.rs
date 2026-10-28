#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

extern crate feluqa;
extern crate std;
extern crate toml;

use feluqa::view::compiler::Compiler;
use std::boxed::Box;
use std::convert::{From, Into};
use std::env;
use std::error::Error;
use std::format;
use std::io::{Error as IoError, ErrorKind};
use std::iter::Iterator;
use std::matches;
use std::option::Option::Some;
use std::path::{Component, Path, PathBuf};
use std::println;
use std::result::Result::{self, Err, Ok};

fn main() -> Result<(), Box<dyn Error>> {
    let project = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
    configure_service_provider(&project)?;
    let output = PathBuf::from(env::var("OUT_DIR")?);
    let mut compiler = Compiler::new();
    compiler.add_root("app", &project.join("resources/views"))?;
    compiler.add_root("system", Path::new(feluqa::system_panel::VIEW_ROOT))?;
    compiler.add_root("feluqa-panel", Path::new(feluqa::panel::VIEW_ROOT))?;
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
        "display_name: &str, email: &str, csrf_token: &str, panel: &crate::modules::crm::view::CustomerPanel, navigation: crate::feluqa::view::TrustedHtml, brand_name: &str",
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
    feluqa::database::build_support::generate_migration_registry(
        &project,
        &output.join("migrations.rs"),
    )?;
    println!("cargo:rerun-if-changed=build.rs");
    Ok(())
}

fn configure_service_provider(project: &Path) -> Result<(), Box<dyn Error>> {
    let manifest_path = project.join("feluqa.toml");
    println!("cargo:rerun-if-changed={}", manifest_path.display());
    let manifest: toml::Value = toml::from_str(&std::fs::read_to_string(&manifest_path)?)?;
    let provider = manifest
        .get("app")
        .and_then(|app| app.get("service_provider"))
        .and_then(toml::Value::as_str)
        .ok_or_else(|| {
            IoError::new(
                ErrorKind::InvalidData,
                "feluqa.toml must set app.service_provider to a Rust source path",
            )
        })?;
    let provider_path = Path::new(provider);
    if provider_path.is_absolute()
        || provider_path.components().any(|component| {
            matches!(
                component,
                Component::ParentDir | Component::RootDir | Component::Prefix(_)
            )
        })
        || provider_path
            .extension()
            .and_then(|extension| extension.to_str())
            != Some("rs")
    {
        return Err(IoError::new(
            ErrorKind::InvalidInput,
            "app.service_provider must be a relative .rs path inside the application",
        )
        .into());
    }
    let source = project.join(provider_path);
    if !source.is_file() {
        return Err(format!(
            "service provider source does not exist: {}",
            source.display()
        )
        .into());
    }
    println!("cargo:rerun-if-changed={}", source.display());
    println!("cargo:rustc-env=FELUQA_SERVICE_PROVIDER={provider}");
    Ok(())
}
