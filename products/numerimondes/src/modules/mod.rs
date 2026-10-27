#![no_implicit_prelude]

use crate::feluqa;
use crate::std::clone::Clone;
use crate::std::convert::From;
use crate::std::default::Default;
use crate::std::format;
use crate::std::iter::Iterator;
use crate::std::option::Option::Some;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::vec;
use crate::std::vec::Vec;
use feluqa::auth::Permission;
use feluqa::panel::{
    ContentWidth, NavigationGroup, NavigationItem, Panel, PanelBuilder, PanelCatalog,
    PanelCatalogError, PanelError, PanelKind, PanelPage, PanelProvider,
};
use feluqa::ui::{SCHEMA_VERSION, UiDocument, UiNode};

pub mod business;
pub mod crm;
pub mod live;
pub mod system;

/// Provider for Numerimondes ERP panels and CRM resources.
pub struct AppPanelProvider;
impl PanelProvider for AppPanelProvider {
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {
        catalog.register_panel(dashboard_panel(
            "business",
            "Business ERP",
            "/admin",
            PanelKind::Business,
            "business.erp.manage",
        )?)?;
        Ok(())
    }
}

/// Create the deterministic lifecycle registry for compiled application modules.
pub fn lifecycle_runtime(
    enabled_modules: &[String],
) -> Result<feluqa::module::ModuleRuntime, feluqa::module::LifecycleError> {
    let mut runtime = feluqa::module::ModuleRuntime::default();
    feluqa::module::ServiceProvider::register(&system::CoreServiceProvider, &mut runtime)?;
    for module in enabled_modules {
        match module.as_str() {
            "numerimondes.crm" => {
                feluqa::module::ServiceProvider::register(&crm::CrmServiceProvider, &mut runtime)?
            }
            _ => {
                return Err(feluqa::module::LifecycleError::UnknownModule(
                    module.clone(),
                ));
            }
        }
    }
    Ok(runtime)
}

/// Select only migration bundles belonging to enabled application modules.
pub fn enabled_migrations<'a>(
    enabled_modules: &'a [String],
) -> impl crate::std::iter::Iterator<Item = &'static feluqa::database::ModuleMigrations> + 'a {
    crate::generated_migrations::ALL
        .iter()
        .copied()
        .filter(move |module| {
            enabled_modules
                .iter()
                .any(|enabled| enabled == module.module)
        })
}

pub(crate) struct CompiledModule {
    id: String,
    dependencies: Vec<String>,
    migrations: &'static feluqa::database::ModuleMigrations,
    started: bool,
}

impl CompiledModule {
    pub(crate) fn new(
        id: &str,
        dependencies: Vec<String>,
        migrations: &'static feluqa::database::ModuleMigrations,
    ) -> Self {
        Self {
            id: String::from(id),
            dependencies,
            migrations,
            started: false,
        }
    }
}

impl feluqa::module::Module for CompiledModule {
    fn id(&self) -> &str {
        &self.id
    }

    fn dependencies(&self) -> &[String] {
        &self.dependencies
    }

    fn start(&mut self) -> Result<(), String> {
        self.migrations
            .validate()
            .map_err(|error| format!("module migration contract is invalid: {error}"))?;
        self.started = true;
        Ok(())
    }

    fn stop(&mut self) -> Result<(), String> {
        self.started = false;
        Ok(())
    }
}

/// Register module resources in the shared panel/page route catalogue before serving routes.
pub fn panel_catalog() -> Result<PanelCatalog, PanelCatalogError> {
    let mut catalog = PanelCatalog::default();
    catalog.register_provider(&system::CorePanelProvider)?;
    catalog.register_provider(&AppPanelProvider)?;
    catalog.register_provider(&crm::CrmPanelProvider)?;
    Ok(catalog)
}

fn dashboard_panel(
    id: &str,
    title: &str,
    prefix: &str,
    kind: PanelKind,
    permission: &str,
) -> Result<Panel, PanelError> {
    let page = panel_page(
        "/",
        title,
        permission,
        id,
        match kind {
            PanelKind::System => "system",
            PanelKind::Business => "business",
        },
    )?;
    let mut builder = PanelBuilder::new(id, title, prefix, kind)
        .brand_name("Numerimondes")
        .max_content_width(ContentWidth::SevenExtraLarge)
        .sidebar_collapsible(true)
        .sidebar_fully_collapsible(true)
        .login()
        .page(page);
    if id == "business" {
        builder = builder.navigation_group(NavigationGroup {
            label: Some(String::from("Workspace")),
            items: vec![
                NavigationItem {
                    label: String::from("Overview"),
                    path: String::from("/admin"),
                    icon: Some(String::from("home")),
                    permission: Some(
                        Permission::new(String::from("business.erp.manage")).map_err(|_| {
                            PanelError::InvalidPermission {
                                panel: String::from(id),
                                expected: String::from("business"),
                            }
                        })?,
                    ),
                },
                NavigationItem {
                    label: String::from("Customers"),
                    path: String::from("/admin/customers"),
                    icon: Some(String::from("users")),
                    permission: Some(
                        Permission::new(String::from("business.crm.customers.read")).map_err(
                            |_| PanelError::InvalidPermission {
                                panel: String::from(id),
                                expected: String::from("business"),
                            },
                        )?,
                    ),
                },
            ],
        });
    }
    builder.build()
}

fn panel_page(
    path: &str,
    title: &str,
    permission: &str,
    panel_id: &str,
    namespace: &str,
) -> Result<PanelPage, PanelError> {
    let permission = Permission::new(String::from(permission)).map_err(|_| {
        PanelError::WrongPermissionNamespace {
            panel: String::from(panel_id),
            expected: String::from(namespace),
        }
    })?;
    Ok(PanelPage {
        path: String::from(path),
        permission,
        document: UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Text {
                value: String::from(title),
            }],
        },
    })
}

#[cfg(test)]
mod tests {
    use super::{enabled_migrations, lifecycle_runtime, panel_catalog};
    use crate::feluqa;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::convert::From;
    use crate::std::iter::Iterator;
    use crate::std::matches;
    use crate::std::option::Option::{None, Some};
    use crate::std::result::Result::Err;
    use crate::std::string::String;
    use feluqa::auth::{Permission, PermissionSetAuthorizer, Principal};
    use feluqa::panel::PanelError;

    #[test]
    fn compiled_modules_start_in_dependency_order_and_shutdown_cleanly() {
        let mut runtime = lifecycle_runtime(&[String::from("numerimondes.crm")])
            .expect("valid compiled module registry");
        runtime.start().expect("module startup succeeds");
        assert_eq!(
            runtime.started_modules(),
            ["feluqa.core", "numerimondes.crm"]
        );
        runtime.shutdown().expect("module shutdown succeeds");
        assert!(runtime.started_modules().is_empty());
    }

    #[test]
    fn disabled_modules_are_not_registered_and_unknown_modules_fail_startup() {
        let mut runtime = lifecycle_runtime(&[]).expect("Core-only runtime");
        runtime.start().expect("Core module starts");
        assert_eq!(runtime.started_modules(), ["feluqa.core"]);
        runtime.shutdown().expect("Core shuts down");
        assert!(matches!(
            lifecycle_runtime(&[String::from("crm.typo")]),
            Err(feluqa::module::LifecycleError::UnknownModule(_))
        ));
    }

    #[test]
    fn migration_selection_follows_the_enabled_module_list() {
        assert_eq!(enabled_migrations(&[]).count(), 0);
        let enabled = [String::from("numerimondes.crm")];
        let mut selected = enabled_migrations(&enabled);
        assert_eq!(
            selected.next().map(|module| module.module),
            Some("numerimondes.crm")
        );
        assert!(selected.next().is_none());
    }

    #[test]
    fn dashboard_routes_use_the_shared_panel_permission_registry() {
        let catalog = panel_catalog().expect("valid application panel catalogue");
        let mut core = Principal::new("core-operator", None).expect("principal");
        core.grant(Permission::new("system.dashboard.read").expect("system permission"));
        assert!(
            catalog
                .resolve_page("/system", &core, &PermissionSetAuthorizer)
                .is_ok()
        );
        assert_eq!(
            catalog.resolve_page("/admin", &core, &PermissionSetAuthorizer),
            Err(PanelError::Forbidden)
        );
        assert_eq!(
            catalog.authorize_resource(
                "system.users",
                feluqa::panel::ResourceOperation::List,
                &core,
                1,
                &PermissionSetAuthorizer,
            ),
            Err(feluqa::panel::ResourceAuthorizationError::Denied)
        );

        let mut user_reader = Principal::new("user-reader", None).expect("principal");
        user_reader.grant(Permission::new("system.users.read").expect("users permission"));
        assert!(
            catalog
                .authorize_resource(
                    "system.users",
                    feluqa::panel::ResourceOperation::List,
                    &user_reader,
                    41,
                    &PermissionSetAuthorizer,
                )
                .is_ok()
        );
        assert_eq!(
            catalog.authorize_resource(
                "system.roles",
                feluqa::panel::ResourceOperation::List,
                &user_reader,
                41,
                &PermissionSetAuthorizer,
            ),
            Err(feluqa::panel::ResourceAuthorizationError::Denied)
        );

        let mut role_reader = Principal::new("role-reader", None).expect("principal");
        role_reader.grant(Permission::new("system.roles.read").expect("roles permission"));
        assert!(
            catalog
                .authorize_resource(
                    "system.roles",
                    feluqa::panel::ResourceOperation::List,
                    &role_reader,
                    42,
                    &PermissionSetAuthorizer,
                )
                .is_ok()
        );
        assert_eq!(
            catalog.authorize_resource(
                "system.users",
                feluqa::panel::ResourceOperation::List,
                &role_reader,
                42,
                &PermissionSetAuthorizer,
            ),
            Err(feluqa::panel::ResourceAuthorizationError::Denied)
        );

        let mut business = Principal::new("business-operator", None).expect("principal");
        business.grant(Permission::new("business.erp.manage").expect("business permission"));
        assert!(
            catalog
                .resolve_page("/admin", &business, &PermissionSetAuthorizer)
                .is_ok()
        );
        assert_eq!(
            catalog
                .resource_at_path("/admin/customers")
                .map(|resource| resource.id),
            Some("crm.customers")
        );
        assert_eq!(
            catalog
                .resource_at_path("/system/users")
                .map(|resource| resource.id),
            Some("system.users")
        );
        assert_eq!(
            catalog
                .resource_at_path("/system/roles")
                .map(|resource| resource.id),
            Some("system.roles")
        );
    }
}
