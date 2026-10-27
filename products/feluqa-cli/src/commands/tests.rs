#![no_implicit_prelude]

use super::{global, make, run};
use crate::context::{self, Application};
use crate::std::assert;
use crate::std::assert_eq;
use crate::std::clone::Clone;
use crate::std::convert::From;
use crate::std::env;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::fs;
use crate::std::iter::Iterator;
use crate::std::matches;
use crate::std::option::Option::{None, Some};
use crate::std::panic;
use crate::std::path::PathBuf;
use crate::std::result::Result::Err;
use crate::std::string::String;
use crate::std::vec;

#[test]
fn make_requires_a_natural_language_target() {
    let directory = env::temp_dir().join(format!("feluqa-cli-make-{}", crate::std::process::id()));
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };
    let result = make::run(
        &[OsString::from("model"), OsString::from("Customer")],
        &application,
    );
    assert!(result.is_ok());
    assert!(directory.join("src/app/models/customer.rs").is_file());
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn app_context_is_detected_before_the_parent_workspace() {
    let app = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../products/numerimondes");
    match context::detect(&app).expect("Numerimondes app is valid") {
        context::Context::App(application) => {
            assert_eq!(application.package_name, "numerimondes");
            assert_eq!(application.profile, "web");
        }
        _ => panic!("application context must win over its parent workspace"),
    }
}

#[test]
fn app_commands_are_rejected_outside_an_application() {
    let directory =
        env::temp_dir().join(format!("feluqa-cli-context-{}", crate::std::process::id()));
    fs::create_dir_all(&directory).expect("create isolated directory");
    let result = run(vec![OsString::from("migrate")], &directory);
    assert!(matches!(result, Err(message) if message.contains("restricted")));
    fs::remove_dir_all(directory).expect("remove isolated directory");
}

#[test]
fn web_scaffold_creates_a_strict_standalone_application_without_overwrite() {
    let directory = env::temp_dir().join(format!("feluqa-cli-new-{}", crate::std::process::id()));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated destination");
    let arguments = [
        OsString::from("Customer Portal"),
        OsString::from("--profile"),
        OsString::from("web"),
    ];
    assert!(global::new::run(&arguments, &directory, Some(&directory)).is_ok());

    let application = directory.join("products/customer-portal");
    assert!(context::read_application(&application).is_ok());
    assert!(application.join("src/service_provider.rs").is_file());
    assert!(
        fs::read_to_string(application.join("feluqa.toml"))
            .expect("Feluqa manifest")
            .contains("service_provider = \"src/service_provider.rs\"")
    );
    assert!(application.join("src/routes/web.rs").is_file());
    assert!(application.join("src/modules/mod.rs").is_file());
    assert!(application.join("src/modules/live.rs").is_file());
    assert!(application.join("src/app/controllers/live.rs").is_file());
    assert!(application.join("src/modules/seeders/mod.rs").is_file());
    assert!(application.join("src/app/controllers/site.rs").is_file());
    assert!(application.join("src/app/controllers/panels.rs").is_file());
    assert!(application.join("src/app/controllers/system.rs").is_file());
    assert!(
        application
            .join("src/app/controllers/system/administration.rs")
            .is_file()
    );
    assert!(
        application
            .join("src/app/controllers/system/operations.rs")
            .is_file()
    );
    let modules = fs::read_to_string(application.join("src/modules/mod.rs"))
        .expect("system and ERP panel catalogue");
    assert!(modules.contains("catalog.register_provider(&system::CorePanelProvider)?;"));
    assert!(modules.contains("business.erp.manage"));
    let system_provider = fs::read_to_string(application.join("src/modules/system/mod.rs"))
        .expect("built-in Feluqa Core panel provider");
    assert!(system_provider.contains("feluqa::system_panel::SystemPanelProvider"));
    let system_views = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../_crates/feluqa-system-panel/resources/views/pages");
    let roles_view = fs::read_to_string(system_views.join("system_roles.view.rs"))
        .expect("framework-owned resource driven Core role view");
    assert!(roles_view.contains("{!! role_table !!}"));
    assert!(roles_view.contains("{!! create_form !!}"));
    assert!(roles_view.contains("{!! edit_forms !!}"));
    assert!(!roles_view.contains("<pre>"));
    let users_view = fs::read_to_string(system_views.join("system_users.view.rs"))
        .expect("framework-owned resource driven Core user view");
    assert!(users_view.contains("{!! user_table !!}"));
    assert!(users_view.contains("{!! create_form !!}"));
    assert!(users_view.contains("{!! edit_forms !!}"));
    assert!(!users_view.contains("<pre>"));
    let dashboard_view = fs::read_to_string(system_views.join("system_dashboard.view.rs"))
        .expect("framework-owned Live-enabled Core dashboard");
    assert!(dashboard_view.contains("data-feluqa-live"));
    assert!(dashboard_view.contains("<x-feluqa-panel::document"));
    assert!(!dashboard_view.contains("<!doctype"));
    assert!(
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../_crates/feluqa-panel/resources/views/components/shell.view.rs")
            .is_file()
    );
    let routes = fs::read_to_string(application.join("src/routes/web.rs"))
        .expect("authenticated panel routes");
    assert!(routes.contains(".authenticated(core_store.clone())"));
    assert!(routes.contains("/{*path}"));
    assert!(routes.contains("/system/setup"));
    assert!(routes.contains("/system/login"));
    assert!(routes.contains("system::logout"));
    assert!(routes.contains("system::administration::users"));
    assert!(routes.contains("system::administration::create_role"));
    assert!(routes.contains("system::administration::update_user_role"));
    assert!(routes.contains("system::operations::run_migrations"));
    assert!(routes.contains("system::operations::audit"));
    assert!(routes.contains("system::operations::dashboard"));
    assert!(routes.contains("/live/snapshots/{action}"));
    assert!(routes.contains("/live/actions"));
    assert!(!application.join("src/modules/system/views").exists());
    assert!(
        !application
            .join("resources/views/components/panel_shell.view.rs")
            .exists()
    );
    let system = fs::read_to_string(application.join("src/app/controllers/system.rs"))
        .expect("setup, login, logout and CSRF handlers");
    assert!(system.contains("anonymous_csrf_valid"));
    assert!(system.contains("core.verify_csrf"));
    assert!(system.contains("core.logout"));
    assert!(
        application
            .join("resources/views/pages/home.view.rs")
            .is_file()
    );
    assert!(
        application
            .join("src/modules/app/migrations/sqlite")
            .is_dir()
    );
    assert!(
        application
            .join("src/modules/app/migrations/postgresql")
            .is_dir()
    );
    let main = fs::read_to_string(application.join("src/main.rs")).expect("strict entrypoint");
    assert!(main.starts_with("#![no_implicit_prelude]"));
    assert!(!main.contains("@@NAME@@"));
    let manifest =
        fs::read_to_string(application.join("Cargo.toml")).expect("generated Cargo manifest");
    assert!(manifest.contains("path = \"../../_crates/feluqa\""));
    assert!(global::new::run(&arguments, &directory, Some(&directory)).is_err());

    let external_arguments = [OsString::from("Remote Site")];
    assert!(global::new::run(&external_arguments, &directory, None).is_ok());
    let external = directory.join("remote-site");
    let external_manifest =
        fs::read_to_string(external.join("Cargo.toml")).expect("registry-based manifest");
    assert!(external_manifest.contains(&format!(
        "version = \"{}\", registry = \"feluqa\"",
        crate::feluqa::VERSION
    )));
    let registry = fs::read_to_string(external.join(".cargo/config.toml"))
        .expect("private registry configuration");
    assert!(registry.contains("/api/v1/crates/"));
    fs::remove_dir_all(directory).expect("remove generated app");
}

#[test]
fn model_generator_writes_the_compiled_model_convention_without_overwrite() {
    let directory = env::temp_dir().join(format!("feluqa-cli-model-{}", crate::std::process::id()));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };
    let args = [OsString::from("model"), OsString::from("Customer")];
    assert!(make::run(&args, &application).is_ok());
    let output = fs::read_to_string(directory.join("src/app/models/customer.rs"))
        .expect("generated model source");
    assert!(output.starts_with("#![no_implicit_prelude]"));
    assert!(output.contains("use feluqa::prelude::*;"));
    assert!(!output.contains("extern crate feluqa;"));
    assert!(output.contains("#[tenant_key]"));
    assert!(output.contains("pub tenant_id: i64"));
    assert!(output.contains("#[owner_key]"));
    assert!(output.contains("pub owner_user_id: i64"));
    assert!(output.contains("#[derive(Model, Debug, Clone, Deserialize, Serialize)]"));
    assert!(output.contains("#[table_name = \"customer\"]"));
    assert!(make::model::run(&args, &application).is_err());
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn controller_generator_emits_a_rust_handler_function_for_routes() {
    let directory = env::temp_dir().join(format!(
        "feluqa-cli-controller-{}",
        crate::std::process::id()
    ));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };
    let args = [OsString::from("User")];
    assert!(make::controller::run(&args, &application).is_ok());
    let output = fs::read_to_string(directory.join("src/app/controllers/user.rs"))
        .expect("generated controller source");
    assert!(output.starts_with("#![no_implicit_prelude]"));
    assert!(output.contains("pub async fn index() -> Html<String>"));
    assert!(!output.contains("Path(id)"));
    assert!(make::controller::run(&args, &application).is_err());
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn model_controller_is_a_small_authorized_show_action() {
    let directory = env::temp_dir().join(format!(
        "feluqa-cli-model-controller-{}",
        crate::std::process::id()
    ));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };
    assert!(make::model::run(&[OsString::from("Customer")], &application).is_ok());
    let arguments = [
        OsString::from("Customer"),
        OsString::from("--model"),
        OsString::from("Customer"),
        OsString::from("--connection"),
        OsString::from("analytics"),
    ];
    assert!(make::controller::run(&arguments, &application).is_ok());
    let output = fs::read_to_string(directory.join("src/app/controllers/customer.rs"))
        .expect("model-backed controller source");
    assert!(output.contains("State(databases): State<DatabasePools>"));
    assert!(output.contains("Extension(principal): Extension<Principal>"));
    assert!(output.contains("Result<JsonResponse<Customer>, StatusCode>"));
    assert!(output.contains("pub async fn show("));
    assert!(output.contains("use feluqa::prelude::*;"));
    assert!(!output.contains("crate::feluqa as feluqa"));
    assert!(!output.contains("pub async fn store("));
    assert!(output.contains("authorize(&principal, \"business.customer.read\")?"));
    assert!(!output.contains("fn map_database_error"));
    assert!(output.contains("SessionIdentity"));
    assert!(output.contains(
        "Customer::find_or_fail_in_tenant(database, id, identity.tenant_id, identity.user_id)"
    ));
    assert!(output.contains(".await\n            .map(response::json)"));
    assert!(output.contains(".get(\"analytics\")"));
    assert!(output.contains(".map(response::json)"));

    let resource_args = [OsString::from("resource"), OsString::from("Customer")];
    fs::create_dir_all(directory.join("src/app/controllers"))
        .expect("create generated controller registry");
    fs::write(
        directory.join("src/app/controllers/resources.rs"),
        "#![no_implicit_prelude]\n// FELUQA_GENERATED_RESOURCE_ROUTES\n",
    )
    .expect("create generated resource routes");
    assert!(make::run(&resource_args, &application).is_ok());
    let resource = fs::read_to_string(directory.join("src/app/controllers/customer_resource.rs"))
        .expect("generated full CRUD resource");
    assert!(resource.contains("pub async fn index("));
    assert!(resource.contains("pub async fn store("));
    assert!(resource.contains("pub async fn update("));
    assert!(resource.contains("pub async fn destroy("));
    assert!(resource.contains("verify_csrf(&core, &headers).await?"));
    assert!(resource.contains("business.customer.delete"));
    assert!(resource.contains("authorize(&principal, \"business.customer.read\")?"));
    assert!(resource.contains("page_in_tenant"));
    assert!(resource.contains("create_from_in_tenant"));
    assert!(resource.contains("update_from_in_tenant"));
    assert!(resource.contains("delete_in_tenant"));
    assert!(resource.contains("record_audit_in"));
    assert!(resource.contains(".begin()"));
    assert!(resource.contains(".commit()"));
    assert!(resource.contains("identity.user_id"));
    assert!(!resource.contains("Customer::find_or_fail(connection"));
    assert!(resource.contains("pub(crate) fn routes(core_store: CoreStore)"));
    assert!(resource.contains("/admin/customers/{id}"));
    assert!(resource.contains("registered_resource_requires_a_core_session"));
    assert!(resource.contains("crate::routes::web::routes("));
    let registry = fs::read_to_string(directory.join("src/app/controllers/resources.rs"))
        .expect("resource route registry");
    assert!(
        registry
            .contains("customer_resource::CustomerResourceController::routes(core_store.clone())")
    );
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn resource_generator_refuses_models_without_tenant_and_owner_keys() {
    let directory = env::temp_dir().join(format!(
        "feluqa-cli-resource-unscoped-{}",
        crate::std::process::id()
    ));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(directory.join("src/app/models")).expect("create app model directory");
    fs::write(
        directory.join("src/app/models/customer.rs"),
        "pub struct Customer;\n",
    )
    .expect("write unscoped model");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };
    let result = make::run(
        &[OsString::from("resource"), OsString::from("Customer")],
        &application,
    );
    assert!(matches!(result, Err(message) if message.contains("needs tenant and owner keys")));
    assert!(
        !directory
            .join("src/app/controllers/customer_resource.rs")
            .exists()
    );
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn panel_generator_creates_a_compiled_panel_and_registers_it() {
    let directory = env::temp_dir().join(format!("feluqa-cli-panel-{}", crate::std::process::id()));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };

    assert!(make::panel::run(&[OsString::from("Reports")], &application).is_ok());
    let panel = fs::read_to_string(directory.join("src/modules/reports/panel.rs"))
        .expect("compiled panel module");
    assert!(panel.starts_with("#![no_implicit_prelude]"));
    assert!(panel.contains("business.reports.manage"));
    assert!(panel.contains("PanelKind::Business"));
    let registry = fs::read_to_string(directory.join("src/modules/mod.rs"))
        .expect("compiled module panel registry");
    assert!(registry.contains("pub mod reports;"));
    assert!(
        registry.contains("catalog.register_provider(&reports::panel::ReportsPanelProvider)?;")
    );

    assert!(make::panel::run(&[OsString::from("Billing")], &application).is_ok());
    let registry = fs::read_to_string(directory.join("src/modules/mod.rs"))
        .expect("updated compiled module panel registry");
    assert!(registry.contains("pub mod billing;"));
    assert!(
        registry.contains("catalog.register_provider(&billing::panel::BillingPanelProvider)?;")
    );
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn seeder_generator_registers_a_stable_id_and_keeps_seeders_out_of_migrations() {
    let directory =
        env::temp_dir().join(format!("feluqa-cli-seeder-{}", crate::std::process::id()));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };

    let make_arguments = [OsString::from("seeder"), OsString::from("demo data")];
    assert!(make::run(&make_arguments, &application).is_ok());
    let source = fs::read_to_string(directory.join("src/modules/seeders/demo_data.rs"))
        .expect("generated seeder module");
    assert!(source.contains("pub const ID: &str = \"demo.demo_data\";"));
    let registry = fs::read_to_string(directory.join("src/modules/seeders/mod.rs"))
        .expect("generated seeder registry");
    assert!(registry.contains("pub mod demo_data;"));
    assert!(registry.contains("demo_data::ID =>"));
    assert!(registry.contains("seeder `{id}` is not registered"));
    assert!(!directory.join("src/modules/app/migrations").exists());
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn migration_generator_creates_manifest_and_every_declared_sql_variant() {
    let directory = env::temp_dir().join(format!(
        "feluqa-cli-migration-{}",
        crate::std::process::id()
    ));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let application = Application {
        display_name: String::from("Demo"),
        package_name: String::from("demo"),
        profile: String::from("web"),
        manifest: directory.join("Cargo.toml"),
        directory: directory.clone(),
    };
    let args = [OsString::from("create_orders")];
    assert!(make::migration::run(&args, &application).is_ok());
    let module_root = directory.join("src/modules/app");
    let manifest =
        fs::read_to_string(module_root.join("module.toml")).expect("generated module manifest");
    assert!(manifest.contains("id = \"demo.app\""));
    assert!(manifest.contains("database_connections = [\"default\"]"));
    for dialect in ["sqlite", "postgresql"] {
        let migrations = fs::read_dir(module_root.join("migrations").join(dialect))
            .expect("generated dialect variants")
            .count();
        assert_eq!(migrations, 1);
    }

    fs::create_dir_all(directory.join("src/modules/sqlite_only"))
        .expect("create single-dialect module");
    fs::write(
        directory.join("src/modules/sqlite_only/module.toml"),
        "id = \"demo.sqlite_only\"\nsupported_databases = [\"sqlite\"]\n",
    )
    .expect("write module support declaration");
    let args = [
        OsString::from("create_categories"),
        OsString::from("--module"),
        OsString::from("sqlite_only"),
    ];
    assert!(make::migration::run(&args, &application).is_ok());
    assert!(
        directory
            .join("src/modules/sqlite_only/migrations/sqlite")
            .is_dir()
    );
    assert!(
        !directory
            .join("src/modules/sqlite_only/migrations/postgresql")
            .exists()
    );
    fs::remove_dir_all(directory).expect("remove isolated app root");
}

#[test]
fn migration_filename_collision_uses_an_ordered_unique_suffix() {
    let directory = env::temp_dir().join(format!(
        "feluqa-cli-collision-{}",
        crate::std::process::id()
    ));
    let _ = fs::remove_dir_all(&directory);
    fs::create_dir_all(&directory).expect("create isolated app root");
    let first = make::migration::create_pair(&directory, "crm", "create_customers", 42)
        .expect("first migration reservation");
    let second = make::migration::create_pair(&directory, "crm", "create_customers", 42)
        .expect("second collision reservation");
    assert!(first < second);
    fs::remove_dir_all(directory).expect("remove isolated app root");
}
