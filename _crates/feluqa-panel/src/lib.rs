#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Startup-validated registries for system and business panels.

extern crate alloc;
extern crate core;
extern crate feluqa_auth;
extern crate feluqa_ui;
#[cfg(test)]
extern crate std;

use alloc::collections::BTreeMap;
use alloc::string::String;
use alloc::vec::Vec;
use core::clone::Clone;
use core::convert::From;
use core::fmt;
use core::iter::{IntoIterator, Iterator};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::write;
use feluqa_auth::{Authorizer, Denial, Permission, Principal};
use feluqa_ui::{RenderError, RenderedHtml, SchemaError, UiDocument, UiNode};

/// Distinguishes application control surfaces from business-facing administration.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PanelKind {
    /// Application-level controls such as roles, settings and maintenance.
    System,
    /// Tenant or site business administration.
    Business,
}

/// A permission-checked, server-renderable view in a panel.
#[derive(Clone, Debug, PartialEq)]
pub struct PanelPage {
    /// Relative route below the owning panel prefix.
    pub path: String,
    /// Exact permission needed to view this page.
    pub permission: Permission,
    /// Versioned UI schema rendered by the shared component catalogue.
    pub document: UiDocument,
}

impl PanelPage {
    /// Render a validated page through the shared, fixed-tag UI component catalogue.
    pub fn render(&self) -> Result<RenderedHtml, RenderError> {
        feluqa_ui::render(&self.document)
    }
}

/// Declarative panel registration; validation occurs before routes are served.
#[derive(Clone, Debug)]
pub struct Panel {
    /// Stable lowercase panel identifier.
    pub id: String,
    /// Human-readable title.
    pub title: String,
    /// Absolute route prefix reserved for this panel.
    pub prefix: String,
    /// System or business authority boundary.
    pub kind: PanelKind,
    /// Registered pages owned by this panel.
    pub pages: Vec<PanelPage>,
}

/// Validated, deterministic registry of application-local panels and page routes.
#[derive(Default)]
pub struct PanelRegistry {
    panels: BTreeMap<String, Panel>,
    routes: BTreeMap<String, (String, usize)>,
}

impl PanelRegistry {
    /// Register a panel, validating its documents, permission namespaces and route ownership.
    pub fn register(&mut self, panel: Panel) -> Result<(), PanelError> {
        validate_panel(&panel)?;
        if self.panels.contains_key(&panel.id) {
            return Err(PanelError::DuplicatePanel(panel.id));
        }
        let routes: Vec<String> = panel
            .pages
            .iter()
            .map(|page| join_path(&panel.prefix, &page.path))
            .collect();
        for route in &routes {
            if self.routes.contains_key(route) {
                return Err(PanelError::DuplicateRoute(route.clone()));
            }
        }
        for (index, route) in routes.into_iter().enumerate() {
            self.routes.insert(route, (panel.id.clone(), index));
        }
        self.panels.insert(panel.id.clone(), panel);
        Ok(())
    }

    /// Resolve a registered page and enforce its permission for this request.
    pub fn resolve<'a>(
        &'a self,
        path: &str,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> Result<&'a PanelPage, PanelError> {
        let normalized = normalize_path(path)?;
        let (panel_id, page_index) = self
            .routes
            .get(&normalized)
            .ok_or_else(|| PanelError::NotFound(normalized.clone()))?;
        let panel = self
            .panels
            .get(panel_id)
            .ok_or(PanelError::RegistryCorrupt)?;
        let page = panel
            .pages
            .get(*page_index)
            .ok_or(PanelError::RegistryCorrupt)?;
        authorizer
            .authorize(principal, &page.permission)
            .map_err(|Denial| PanelError::Forbidden)?;
        Ok(page)
    }

    /// Return panels in stable ID order for menus, diagnostics and introspection.
    pub fn panels(&self) -> impl Iterator<Item = &Panel> {
        self.panels.values()
    }

    /// Return registered page paths in stable route order.
    pub fn routes(&self) -> impl Iterator<Item = &str> {
        self.routes.keys().map(String::as_str)
    }
}

fn validate_panel(panel: &Panel) -> Result<(), PanelError> {
    if !valid_identifier(&panel.id) || panel.title.trim().is_empty() {
        return Err(PanelError::InvalidPanel);
    }
    let prefix = normalize_path(&panel.prefix)?;
    if prefix == "/" {
        return Err(PanelError::InvalidPrefix);
    }
    if panel.pages.is_empty() {
        return Err(PanelError::EmptyPanel);
    }
    let expected_namespace = match panel.kind {
        PanelKind::System => "system",
        PanelKind::Business => "business",
    };
    let mut local_routes = BTreeMap::new();
    for page in &panel.pages {
        let path = normalize_path(&page.path)?;
        if path == "/" || local_routes.insert(path.clone(), ()).is_some() {
            return Err(PanelError::DuplicateRoute(join_path(&prefix, &path)));
        }
        if page.permission.namespace() != expected_namespace {
            return Err(PanelError::WrongPermissionNamespace {
                panel: panel.id.clone(),
                expected: String::from(expected_namespace),
            });
        }
        page.document
            .validate()
            .map_err(PanelError::InvalidSchema)?;
        validate_action_namespaces(&page.document.root, expected_namespace, &panel.id)?;
    }
    Ok(())
}

fn validate_action_namespaces(
    nodes: &[UiNode],
    expected: &str,
    panel: &str,
) -> Result<(), PanelError> {
    for node in nodes {
        match node {
            UiNode::Component { children, .. } => {
                validate_action_namespaces(children, expected, panel)?
            }
            UiNode::Action { permission, .. } => {
                let namespace = permission.split('.').next().unwrap_or("");
                if namespace != expected {
                    return Err(PanelError::WrongActionNamespace {
                        panel: String::from(panel),
                        expected: String::from(expected),
                    });
                }
            }
            UiNode::Text { .. } => {}
        }
    }
    Ok(())
}

fn valid_identifier(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'-' || byte == b'_'
        })
}

fn normalize_path(path: &str) -> Result<String, PanelError> {
    if !path.starts_with('/')
        || path.contains('?')
        || path.contains('#')
        || path.contains('%')
        || path.contains('\\')
    {
        return Err(PanelError::InvalidPath(String::from(path)));
    }
    let mut parts = Vec::new();
    for segment in path.split('/') {
        if segment.is_empty() {
            continue;
        }
        if segment == "."
            || segment == ".."
            || !segment
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || b"-_.".contains(&byte))
        {
            return Err(PanelError::InvalidPath(String::from(path)));
        }
        parts.push(segment);
    }
    let mut normalized = String::from("/");
    normalized.push_str(&parts.join("/"));
    Ok(normalized)
}

fn join_path(prefix: &str, route: &str) -> String {
    if route == "/" {
        String::from(prefix)
    } else {
        let mut joined = String::from(prefix);
        joined.push_str(route);
        joined
    }
}

/// Panel registry and access failure. Safe to map `Forbidden` to 403 and `NotFound` to 404.
#[derive(Debug, PartialEq, Eq)]
pub enum PanelError {
    /// The ID or title is invalid.
    InvalidPanel,
    /// The panel prefix is invalid or reserves the site root.
    InvalidPrefix,
    /// A route contains invalid path syntax.
    InvalidPath(String),
    /// A panel has no pages.
    EmptyPanel,
    /// The panel ID is already registered.
    DuplicatePanel(String),
    /// A route conflicts with a registered route.
    DuplicateRoute(String),
    /// A page permission uses a namespace outside its panel boundary.
    WrongPermissionNamespace {
        /// Panel whose permission failed validation.
        panel: String,
        /// Required permission namespace.
        expected: String,
    },
    /// An action in the schema uses a permission outside the panel boundary.
    WrongActionNamespace {
        /// Panel whose action failed validation.
        panel: String,
        /// Required permission namespace.
        expected: String,
    },
    /// The page UI schema failed validation.
    InvalidSchema(SchemaError),
    /// No page is registered for the requested route.
    NotFound(String),
    /// The principal lacks the page's exact permission.
    Forbidden,
    /// An internal route-to-page index invariant failed.
    RegistryCorrupt,
}
impl fmt::Display for PanelError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidPanel => formatter.write_str("panel ID or title is invalid"),
            Self::InvalidPrefix => formatter.write_str("panel prefix cannot be the site root"),
            Self::InvalidPath(path) => write!(formatter, "invalid panel path `{path}`"),
            Self::EmptyPanel => formatter.write_str("panel must register at least one page"),
            Self::DuplicatePanel(id) => write!(formatter, "panel `{id}` is already registered"),
            Self::DuplicateRoute(path) => {
                write!(formatter, "panel route `{path}` is already registered")
            }
            Self::WrongPermissionNamespace { panel, expected } => write!(
                formatter,
                "panel `{panel}` requires permissions in the `{expected}` namespace"
            ),
            Self::WrongActionNamespace { panel, expected } => write!(
                formatter,
                "actions in panel `{panel}` require permissions in the `{expected}` namespace"
            ),
            Self::InvalidSchema(error) => write!(formatter, "panel UI schema is invalid: {error}"),
            Self::NotFound(path) => write!(formatter, "panel route `{path}` was not found"),
            Self::Forbidden => formatter.write_str("access denied"),
            Self::RegistryCorrupt => formatter.write_str("panel registry invariant failed"),
        }
    }
}
impl core::error::Error for PanelError {}

#[cfg(test)]
mod tests {
    use super::{Panel, PanelError, PanelKind, PanelPage, PanelRegistry};
    use crate::core::clone::Clone;
    use crate::core::convert::From;
    use crate::core::default::Default;
    use crate::core::option::Option::None;
    use crate::core::result::Result::Err;
    use crate::feluqa_auth::{Authorizer, Permission, PermissionSetAuthorizer, Principal};
    use crate::feluqa_ui::{SCHEMA_VERSION, UiDocument, UiNode};
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::matches;
    use crate::std::string::String;
    use crate::std::vec;

    fn panel(kind: PanelKind, id: &str, prefix: &str, permission: &str) -> Panel {
        Panel {
            id: String::from(id),
            title: String::from("Panel"),
            prefix: String::from(prefix),
            kind,
            pages: vec![PanelPage {
                path: String::from("/overview"),
                permission: Permission::new(permission).expect("permission"),
                document: UiDocument {
                    schema_version: SCHEMA_VERSION,
                    root: vec![UiNode::Text {
                        value: String::from("overview"),
                    }],
                },
            }],
        }
    }

    #[test]
    fn route_registry_enforces_access_and_separates_panel_domains() {
        let mut registry = PanelRegistry::default();
        registry
            .register(panel(
                PanelKind::System,
                "core",
                "/system",
                "system.dashboard.read",
            ))
            .expect("register");
        registry
            .register(panel(
                PanelKind::Business,
                "content",
                "/admin",
                "business.content.read",
            ))
            .expect("register");
        let mut principal = Principal::new("operator", None).expect("principal");
        let system = Permission::new("system.dashboard.read").expect("permission");
        principal.grant(system.clone());
        let auth = PermissionSetAuthorizer;
        assert!(
            registry
                .resolve("/system/overview", &principal, &auth)
                .is_ok()
        );
        assert_eq!(
            registry.resolve("/admin/overview", &principal, &auth),
            Err(PanelError::Forbidden)
        );
        assert!(auth.authorize(&principal, &system).is_ok());
    }

    #[test]
    fn system_panel_rejects_business_actions_in_its_ui_schema() {
        let mut system = panel(
            PanelKind::System,
            "core",
            "/system",
            "system.dashboard.read",
        );
        system.pages[0].document.root = vec![UiNode::Action {
            key: String::from("delete-content"),
            label: String::from("Delete content"),
            action: String::from("content::delete"),
            permission: String::from("business.content.delete"),
        }];
        let mut registry = PanelRegistry::default();
        assert!(matches!(
            registry.register(system),
            Err(PanelError::WrongActionNamespace { .. })
        ));
    }

    #[test]
    fn duplicate_routes_and_cross_domain_grants_are_rejected() {
        let mut registry = PanelRegistry::default();
        registry
            .register(panel(
                PanelKind::System,
                "core",
                "/system",
                "system.dashboard.read",
            ))
            .expect("register");
        assert!(matches!(
            registry.register(panel(
                PanelKind::Business,
                "other",
                "/system",
                "business.content.read"
            )),
            Err(PanelError::DuplicateRoute(_))
        ));
        assert!(matches!(
            registry.register(panel(
                PanelKind::System,
                "bad",
                "/tools",
                "business.content.read"
            )),
            Err(PanelError::WrongPermissionNamespace { .. })
        ));
    }
}
