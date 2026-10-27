#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Startup-validated registries for system and business panels.

/// Root directory for Feluqa-owned panel view components.
pub const VIEW_ROOT: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/resources/views");

/// Stable browser path used by all Feluqa web panels for Live interactions.
pub const LIVE_CLIENT_PATH: &str = "/assets/feluqa-live.js";
/// First-party Feluqa Live browser client served by the web adapter.
pub const LIVE_CLIENT_JS: &str = include_str!("../assets/feluqa-live.js");
/// Filament-derived panel theme CSS from the Webkernel Filament adaptation.
pub const FILAMENT_THEME_CSS: &str = include_str!("../assets/filament-theme.css");
/// Filament-derived panel browser runtime from the Webkernel Filament adaptation.
pub const FILAMENT_CLIENT_JS: &str = include_str!("../assets/filament.js");
/// Filament Echo integration bundle from the Webkernel Filament adaptation.
pub const FILAMENT_ECHO_JS: &str = include_str!("../assets/filament-echo.js");
/// Small Feluqa adaptation rules for the shared Filament panel DOM shell.
pub const FILAMENT_ADAPTER_CSS: &str = include_str!("../assets/filament-panel.css");
/// Feluqa's accessible notification timeout, dismissal, and action-event client.
pub const NOTIFICATIONS_CLIENT_JS: &str = include_str!("../assets/feluqa-notifications.js");
/// Feluqa-owned responsive sidebar and keyboard interactions.
pub const PANEL_SHELL_CLIENT_JS: &str = include_str!("../assets/feluqa-shell.js");

extern crate alloc;
extern crate core;
extern crate feluqa_auth;
extern crate feluqa_imagery;
extern crate feluqa_ui;
extern crate serde_json;
#[cfg(test)]
extern crate std;

use alloc::collections::BTreeMap;
use alloc::format;
use alloc::string::String;
use alloc::vec;
use alloc::vec::Vec;
use core::clone::Clone;
use core::convert::{From, Into};
use core::default::Default;
use core::fmt;
use core::fmt::Write as FmtWrite;
use core::iter::{IntoIterator, Iterator};
use core::matches;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::write;
use feluqa_auth::{Authorizer, Denial, Permission, Principal};
pub use feluqa_ui::RenderedHtml;
use feluqa_ui::{RenderError, SCHEMA_VERSION, SchemaError, UiDocument, UiNode};
use serde_json::{Map, Value};

fn escape_html(value: &str) -> String {
    let mut escaped = String::new();
    for character in value.chars() {
        match character {
            '&' => escaped.push_str("&amp;"),
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            '"' => escaped.push_str("&quot;"),
            '\'' => escaped.push_str("&#39;"),
            _ => escaped.push(character),
        }
    }
    escaped
}

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

/// Navigation placement supported by a panel shell.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum NavigationPosition {
    /// Display navigation in the collapsible desktop/mobile sidebar.
    #[default]
    Sidebar,
    /// Display navigation in the horizontal top navigation bar.
    Topbar,
}

/// A permission-filtered destination in one panel's navigation.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct NavigationItem {
    /// Visible label.
    pub label: String,
    /// Absolute route below this panel's prefix.
    pub path: String,
    /// Optional stable Feluqa imagery/icon identifier.
    pub icon: Option<String>,
    /// Optional grant required to reveal the item. The destination still checks its own grant.
    pub permission: Option<Permission>,
}

/// A labeled group of navigation destinations.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct NavigationGroup {
    /// Optional group label.
    pub label: Option<String>,
    /// Ordered destinations in this group.
    pub items: Vec<NavigationItem>,
}

/// Typed width tokens corresponding to Filament's content width options.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum ContentWidth {
    /// 640px maximum width.
    Small,
    /// 768px maximum width.
    Medium,
    /// 1024px maximum width.
    Large,
    /// 1280px maximum width.
    ExtraLarge,
    /// 1536px maximum width.
    TwoExtraLarge,
    /// 1792px maximum width.
    ThreeExtraLarge,
    /// 2048px maximum width.
    SevenExtraLarge,
    /// No maximum width.
    Full,
    /// Use the panel theme default (1536px).
    #[default]
    Default,
}

/// Panel authentication pages and account flows enabled by the provider.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct PanelAuthentication {
    /// Expose the panel's login flow.
    pub login: bool,
    /// Expose user registration.
    pub registration: bool,
    /// Expose password reset.
    pub password_reset: bool,
    /// Require/allow email verification.
    pub email_verification: bool,
}

/// Appearance and shared shell configuration stored with a panel definition.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct PanelAppearance {
    /// Brand text shown in the shell.
    pub brand_name: Option<String>,
    /// Light-mode logo URL, restricted to a local absolute path.
    pub brand_logo: Option<String>,
    /// Dark-mode logo URL, restricted to a local absolute path.
    pub dark_brand_logo: Option<String>,
    /// Browser favicon URL, restricted to a local absolute path.
    pub favicon: Option<String>,
    /// Whether the theme switch is available.
    pub dark_mode: bool,
    /// Whether all clients must use dark mode.
    pub force_dark_mode: bool,
    /// Maximum content width used by the panel page layout.
    pub content_width: ContentWidth,
    /// Sidebar can collapse on desktop.
    pub sidebar_collapsible: bool,
    /// Sidebar can collapse fully on desktop.
    pub sidebar_fully_collapsible: bool,
    /// Sidebar versus horizontal top navigation.
    pub navigation_position: NavigationPosition,
}

/// Complete framework-level settings used by every page in one panel.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct PanelOptions {
    /// Enabled account flows.
    pub authentication: PanelAuthentication,
    /// Brand, theme, width, and shell settings.
    pub appearance: PanelAppearance,
    /// Ordered navigation groups.
    pub navigation: Vec<NavigationGroup>,
}

impl PanelOptions {
    /// Copy only navigation destinations granted to `principal`.
    ///
    /// The destination handler must still authorize the request; hiding a link is not access
    /// control. Groups with no visible entries are omitted.
    pub fn visible_navigation(
        &self,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> Vec<NavigationGroup> {
        self.navigation
            .iter()
            .filter_map(|group| {
                let items = group
                    .items
                    .iter()
                    .filter(|item| {
                        item.permission.as_ref().is_none_or(|permission| {
                            authorizer.authorize(principal, permission).is_ok()
                        })
                    })
                    .cloned()
                    .collect::<Vec<_>>();
                (!items.is_empty()).then(|| NavigationGroup {
                    label: group.label.clone(),
                    items,
                })
            })
            .collect()
    }

    /// Render authorized navigation entries with Filament-compatible DOM classes.
    pub fn render_navigation(
        &self,
        principal: &Principal,
        authorizer: &impl Authorizer,
        active_path: &str,
    ) -> Result<RenderedNavigation, PanelError> {
        let mut html = String::from(
            "<nav class=\"fi-sidebar-nav\" aria-label=\"Panel navigation\"><ul class=\"fi-sidebar-nav-groups\">",
        );
        for (index, group) in self
            .visible_navigation(principal, authorizer)
            .into_iter()
            .enumerate()
        {
            let group_id = format!("fi-sidebar-group-items-{index}");
            html.push_str("<li class=\"fi-sidebar-group fi-collapsible\">");
            if let Some(label) = &group.label {
                write!(
                    html,
                    "<button class=\"fi-sidebar-group-btn\" type=\"button\" data-feluqa-group-toggle aria-expanded=\"true\" aria-controls=\"{group_id}\" data-group-label=\"{}\"><span class=\"fi-sidebar-group-label\">{}</span><span class=\"fi-sidebar-group-collapse-btn\" aria-hidden=\"true\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M14.78 12.53a.75.75 0 0 1-1.06 0L10 8.81l-3.72 3.72a.75.75 0 1 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06Z\" clip-rule=\"evenodd\"/></svg></span></button>",
                    escape_html(label),
                    escape_html(label),
                )
                .map_err(|_| PanelError::InvalidNavigation)?;
            }
            write!(
                html,
                "<ul id=\"{group_id}\" class=\"fi-sidebar-group-items\" data-feluqa-group-items>"
            )
            .map_err(|_| PanelError::InvalidNavigation)?;
            for item in group.items {
                let active = item.path == active_path;
                let active_class = if active { " fi-active" } else { "" };
                write!(
                    html,
                    "<li class=\"fi-sidebar-item fi-sidebar-item-has-url{active_class}\"><a class=\"fi-sidebar-item-btn\" href=\"{}\"{}>",
                    escape_html(&item.path),
                    if active { " aria-current=\"page\"" } else { "" },
                )
                .map_err(|_| PanelError::InvalidNavigation)?;
                if let Some(icon) = &item.icon {
                    let svg = feluqa_imagery::panel_heroicon(icon)
                        .ok_or(PanelError::InvalidNavigation)?;
                    write!(
                        html,
                        "<span class=\"fi-sidebar-item-icon\" aria-hidden=\"true\">{svg}</span>"
                    )
                    .map_err(|_| PanelError::InvalidNavigation)?;
                }
                write!(
                    html,
                    "<span class=\"fi-sidebar-item-label\">{}</span></a></li>",
                    escape_html(&item.label)
                )
                .map_err(|_| PanelError::InvalidNavigation)?;
            }
            html.push_str("</ul></li>");
        }
        html.push_str("</ul></nav>");
        Ok(RenderedNavigation { html })
    }
}

/// Escaped, fixed-structure navigation HTML produced from registered panel declarations.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RenderedNavigation {
    html: String,
}

impl RenderedNavigation {
    /// Borrow the safe navigation markup for a compiled view.
    pub fn as_str(&self) -> &str {
        &self.html
    }
}

/// CRUD operation declared by a module-owned resource.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum ResourceOperation {
    /// List records.
    List,
    /// Read one record.
    Read,
    /// Create a record.
    Create,
    /// Update a record.
    Update,
    /// Delete a record.
    Delete,
}

/// Exact read/write grants for one data field.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ResourceField {
    /// Stable lowercase field identifier.
    pub id: &'static str,
    /// Human-readable field label.
    pub label: &'static str,
    /// Grant required to expose this field in a response.
    pub read_permission: &'static str,
    /// Grant required to accept a field mutation, if the field is editable.
    pub write_permission: Option<&'static str>,
    /// Fixed SDUI input metadata; absent for display-only fields.
    pub input: Option<ResourceInput>,
}

/// Safe input details declared by the resource owner, never by a view schema.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ResourceInput {
    /// Native HTML input type from the closed Feluqa component catalogue.
    pub kind: ResourceInputKind,
    /// Whether this field is required when creating a record.
    pub required_on_create: bool,
    /// Whether this field is required when updating a record.
    pub required_on_update: bool,
    /// Whether this input is available in a create operation.
    pub creatable: bool,
    /// Whether this input is available in an update operation.
    pub updatable: bool,
    /// Optional browser-side length limit; server validation remains mandatory.
    pub max_length: Option<u64>,
}

/// Input types supported by the generic resource form renderer.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ResourceInputKind {
    /// Single-line plain text.
    Text,
    /// Email address.
    Email,
    /// Numeric input.
    Number,
    /// Password input which never accepts a prefilled value.
    Password,
    /// Multi-line plain text.
    Textarea,
    /// A closed choice list whose options are supplied by trusted server code.
    Select,
}

impl ResourceInputKind {
    fn as_str(self) -> &'static str {
        match self {
            Self::Text => "text",
            Self::Email => "email",
            Self::Number => "number",
            Self::Password => "password",
            Self::Textarea => "textarea",
            Self::Select => "select",
        }
    }
}

/// One trusted server-provided option for a resource select input.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResourceOption {
    /// Submitted value, validated again by the write handler.
    pub value: String,
    /// Human-readable label, escaped by the renderer.
    pub label: String,
}

/// Exact action grant for one resource operation.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ResourceAction {
    /// Operation protected by the grant.
    pub operation: ResourceOperation,
    /// Exact permission name required by the server.
    pub permission: &'static str,
}

/// Compile-time resource contract shared by a module's panel, API and policy code.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Resource {
    /// Stable namespaced identifier, such as `crm.customers`.
    pub id: &'static str,
    /// Human-readable resource name.
    pub title: &'static str,
    /// Absolute panel path reserved by the resource.
    pub path: &'static str,
    /// System or business permission boundary.
    pub kind: PanelKind,
    /// Optional manager grant that authorizes every declared action and field.
    pub manage_permission: Option<&'static str>,
    /// Optional grant that widens record scope from actor-owned to all records.
    pub record_access_permission: Option<&'static str>,
    /// Operations explicitly exposed by the resource.
    pub actions: &'static [ResourceAction],
    /// Fields explicitly exposed by the resource.
    pub fields: &'static [ResourceField],
}

/// Resolved record boundary for a resource request.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ResourceRecordScope {
    /// The request is restricted to records owned by this authenticated actor.
    OwnedBy(i64),
    /// The request may access records owned by any actor.
    All,
}

/// Field grants resolved from one trusted server-side principal.
#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct ResourceFieldAccess {
    /// Field IDs that may appear in responses.
    pub readable: Vec<&'static str>,
    /// Field IDs accepted in create or update operations.
    pub writable: Vec<&'static str>,
}

impl ResourceFieldAccess {
    /// Check whether a declared field may be returned to this principal.
    pub fn can_read(&self, field: &str) -> bool {
        self.readable.contains(&field)
    }

    /// Check whether a declared field may be changed by this principal.
    pub fn can_write(&self, field: &str) -> bool {
        self.writable.contains(&field)
    }
}

/// Complete authorization result required by a resource adapter.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResourceAccess {
    /// Stable resource ID whose contract produced this decision.
    pub resource_id: &'static str,
    /// Operation authorized for this request.
    pub operation: ResourceOperation,
    /// Record owner filter; adapters must apply this in their query.
    pub records: ResourceRecordScope,
    /// Independently resolved field-level grants.
    pub fields: ResourceFieldAccess,
}

/// A module-provided row of display values for the generic resource table.
#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct ResourceTableRow {
    /// Values keyed by the stable field IDs from the resource descriptor.
    pub values: BTreeMap<String, String>,
}

/// Failure to build a generic resource table from an access decision.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ResourceTableError {
    /// The access decision belongs to another resource.
    ResourceMismatch,
    /// The access decision is for a write operation, not list/read.
    NotReadableOperation,
    /// No fields are readable by this principal.
    NoReadableFields,
    /// The generated SDUI document could not be rendered.
    Render(RenderError),
}

impl fmt::Display for ResourceTableError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::ResourceMismatch => formatter.write_str("resource access does not match"),
            Self::NotReadableOperation => formatter.write_str("resource operation is not readable"),
            Self::NoReadableFields => formatter.write_str("resource has no readable fields"),
            Self::Render(error) => write!(formatter, "resource table render failed: {error}"),
        }
    }
}

impl core::error::Error for ResourceTableError {}

/// Failure to build a generic resource form from an access decision.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ResourceFormError {
    /// The access decision belongs to another resource.
    ResourceMismatch,
    /// The access decision is not for create or update.
    NotWritableOperation,
    /// Create forms cannot target an existing record; update forms require one.
    InvalidRecordId,
    /// No writable fields have declared input metadata.
    NoWritableFields,
    /// The provided value map contains an undeclared or display-only field.
    UnknownField(String),
    /// Select options are missing, duplicated or exclude the selected value.
    InvalidOptions(String),
    /// The generated SDUI document could not be rendered.
    Render(RenderError),
}

impl fmt::Display for ResourceFormError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::ResourceMismatch => formatter.write_str("resource access does not match"),
            Self::NotWritableOperation => formatter.write_str("resource operation is not writable"),
            Self::InvalidRecordId => formatter.write_str("resource form record ID is invalid"),
            Self::NoWritableFields => formatter.write_str("resource has no writable input fields"),
            Self::UnknownField(field) => {
                write!(formatter, "resource form field is not editable: {field}")
            }
            Self::InvalidOptions(field) => {
                write!(
                    formatter,
                    "resource form options are invalid for field: {field}"
                )
            }
            Self::Render(error) => write!(formatter, "resource form render failed: {error}"),
        }
    }
}

impl core::error::Error for ResourceFormError {}

/// An operation or actor identity did not satisfy the resource contract.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct ResourceAccessDenied;

impl fmt::Display for ResourceAccessDenied {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str("resource access denied")
    }
}

impl core::error::Error for ResourceAccessDenied {}

/// Failure to find or authorize an application-registered resource.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ResourceAuthorizationError {
    /// No resource with that stable identifier is registered.
    UnknownResource,
    /// The actor or requested operation is denied by the resource contract.
    Denied,
}

impl fmt::Display for ResourceAuthorizationError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::UnknownResource => formatter.write_str("resource is not registered"),
            Self::Denied => formatter.write_str("resource access denied"),
        }
    }
}

impl core::error::Error for ResourceAuthorizationError {}

impl Resource {
    /// Validate the resource identity, path, action set, field set and permission namespaces.
    pub fn validate(&self) -> Result<(), ResourceError> {
        if !valid_resource_id(self.id) || self.title.trim().is_empty() {
            return Err(ResourceError::InvalidIdentity);
        }
        if normalize_path(self.path).map_err(|_| ResourceError::InvalidPath)? != self.path {
            return Err(ResourceError::InvalidPath);
        }
        if self.actions.is_empty() {
            return Err(ResourceError::EmptyActions);
        }
        if self.fields.is_empty() {
            return Err(ResourceError::EmptyFields);
        }
        let namespace = permission_namespace(self.kind);
        if let Some(permission) = self.manage_permission {
            validate_resource_permission(permission, namespace)?;
        }
        if let Some(permission) = self.record_access_permission {
            validate_resource_permission(permission, namespace)?;
        }
        let mut actions = BTreeMap::new();
        for action in self.actions {
            validate_resource_permission(action.permission, namespace)?;
            if actions.insert(action.operation, ()).is_some() {
                return Err(ResourceError::DuplicateAction(action.operation));
            }
        }
        let mut fields = BTreeMap::new();
        for field in self.fields {
            if !valid_field_id(field.id) || field.label.trim().is_empty() {
                return Err(ResourceError::InvalidField(field.id));
            }
            if fields.insert(field.id, ()).is_some() {
                return Err(ResourceError::DuplicateField(field.id));
            }
            validate_resource_permission(field.read_permission, namespace)?;
            if let Some(permission) = field.write_permission {
                validate_resource_permission(permission, namespace)?;
            }
            if let Some(input) = field.input {
                if field.write_permission.is_none()
                    || input
                        .max_length
                        .is_some_and(|length| !(1..=16_384).contains(&length))
                {
                    return Err(ResourceError::InvalidField(field.id));
                }
            }
        }
        Ok(())
    }

    /// Return the exact grant declared for an operation.
    pub fn action_permission(&self, operation: ResourceOperation) -> Option<&'static str> {
        self.actions
            .iter()
            .find(|action| action.operation == operation)
            .map(|action| action.permission)
    }

    /// Find a declared field by its stable identifier.
    pub fn field(&self, id: &str) -> Option<&'static ResourceField> {
        self.fields.iter().find(|field| field.id == id)
    }

    /// Check an action against its exact grant, with the declared manager grant as an override.
    pub fn allows_action(
        &self,
        operation: ResourceOperation,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> bool {
        if self.allows_permission(self.manage_permission, principal, authorizer) {
            return true;
        }
        let Some(permission) = self.action_permission(operation) else {
            return false;
        };
        self.allows_permission(Some(permission), principal, authorizer)
    }

    /// Check whether one field may be read, with the declared manager grant as an override.
    pub fn can_read_field(
        &self,
        id: &str,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> bool {
        if self.allows_permission(self.manage_permission, principal, authorizer) {
            return true;
        }
        self.field(id).is_some_and(|field| {
            self.allows_permission(Some(field.read_permission), principal, authorizer)
        })
    }

    /// Check whether one field may be written, with the declared manager grant as an override.
    pub fn can_write_field(
        &self,
        id: &str,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> bool {
        if self.allows_permission(self.manage_permission, principal, authorizer) {
            return true;
        }
        self.field(id).is_some_and(|field| {
            self.allows_permission(field.write_permission, principal, authorizer)
        })
    }

    /// Resolve action, record scope and field grants for a trusted application request.
    ///
    /// Adapters must apply `records` within their database query and expose only the
    /// returned readable fields. A zero or negative actor ID is rejected.
    pub fn resolve_access(
        &self,
        operation: ResourceOperation,
        principal: &Principal,
        actor_user_id: i64,
        authorizer: &impl Authorizer,
    ) -> Result<ResourceAccess, ResourceAccessDenied> {
        if actor_user_id <= 0 || !self.allows_action(operation, principal, authorizer) {
            return Err(ResourceAccessDenied);
        }
        let has_global_scope =
            self.allows_permission(self.manage_permission, principal, authorizer)
                || self.allows_permission(self.record_access_permission, principal, authorizer);
        let records = if has_global_scope {
            ResourceRecordScope::All
        } else {
            ResourceRecordScope::OwnedBy(actor_user_id)
        };
        Ok(ResourceAccess {
            resource_id: self.id,
            operation,
            records,
            fields: self.field_access(principal, authorizer),
        })
    }

    /// Render a safe SDUI data table using only fields readable in this access decision.
    ///
    /// The adapter must query records using `access.records` before passing rows here.
    /// Unknown and unreadable values in a row are never serialized or rendered.
    pub fn render_table(
        &self,
        access: &ResourceAccess,
        caption: &str,
        rows: &[ResourceTableRow],
    ) -> Result<RenderedHtml, ResourceTableError> {
        if access.resource_id != self.id {
            return Err(ResourceTableError::ResourceMismatch);
        }
        if !matches!(
            access.operation,
            ResourceOperation::List | ResourceOperation::Read
        ) {
            return Err(ResourceTableError::NotReadableOperation);
        }
        let fields: Vec<_> = self
            .fields
            .iter()
            .filter(|field| access.fields.can_read(field.id))
            .collect();
        if fields.is_empty() {
            return Err(ResourceTableError::NoReadableFields);
        }

        let mut properties = Map::new();
        properties.insert(
            String::from("caption"),
            Value::String(String::from(caption)),
        );
        let mut headers = Vec::new();
        for field in &fields {
            headers.push(Value::String(String::from(field.label)));
        }
        properties.insert(String::from("headers"), Value::Array(headers));

        let mut table_rows = Vec::new();
        for (row_index, row) in rows.iter().enumerate() {
            let mut cells = Vec::new();
            for (column_index, field) in fields.iter().enumerate() {
                let value = row
                    .values
                    .get(field.id)
                    .cloned()
                    .unwrap_or_else(|| String::from(""));
                let mut cell_properties = Map::new();
                cell_properties.insert(String::from("value"), Value::String(value));
                cells.push(UiNode::Component {
                    key: format!("cell-{row_index}-{column_index}"),
                    name: String::from("feluqa::cell"),
                    props: cell_properties,
                    children: Vec::new(),
                });
            }
            table_rows.push(UiNode::Component {
                key: format!("row-{row_index}"),
                name: String::from("feluqa::row"),
                props: Map::new(),
                children: cells,
            });
        }
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Component {
                key: String::from("resource-table"),
                name: String::from("feluqa::table"),
                props: properties,
                children: table_rows,
            }],
        };
        feluqa_ui::render(&document).map_err(ResourceTableError::Render)
    }

    /// Render a create or update form using only declared, writable fields.
    ///
    /// Values for unreadable fields are omitted, and password inputs are never
    /// prefilled. The application must still validate CSRF, authorization and
    /// submitted field values in the write handler.
    pub fn render_form(
        &self,
        access: &ResourceAccess,
        csrf_token: &str,
        record_id: Option<i64>,
        submit: &str,
        values: &BTreeMap<String, String>,
    ) -> Result<RenderedHtml, ResourceFormError> {
        self.render_form_with_options(
            access,
            csrf_token,
            record_id,
            submit,
            values,
            &BTreeMap::new(),
        )
    }

    /// Render a form with server-provided options for declared select inputs.
    ///
    /// Select choices are presentation data only. The write handler must still
    /// verify that a submitted value is valid and that the actor may delegate it.
    pub fn render_form_with_options(
        &self,
        access: &ResourceAccess,
        csrf_token: &str,
        record_id: Option<i64>,
        submit: &str,
        values: &BTreeMap<String, String>,
        options: &BTreeMap<String, Vec<ResourceOption>>,
    ) -> Result<RenderedHtml, ResourceFormError> {
        if access.resource_id != self.id {
            return Err(ResourceFormError::ResourceMismatch);
        }
        match (access.operation, record_id) {
            (ResourceOperation::Create, core::option::Option::None) => {}
            (ResourceOperation::Update, Some(id)) if id > 0 => {}
            (ResourceOperation::Create | ResourceOperation::Update, _) => {
                return Err(ResourceFormError::InvalidRecordId);
            }
            _ => return Err(ResourceFormError::NotWritableOperation),
        }

        for field in values.keys() {
            let Some(input) = self.field(field).and_then(|descriptor| descriptor.input) else {
                return Err(ResourceFormError::UnknownField(field.clone()));
            };
            if !input.available_for(access.operation) {
                return Err(ResourceFormError::UnknownField(field.clone()));
            }
        }
        for field in options.keys() {
            if self
                .field(field)
                .and_then(|descriptor| descriptor.input)
                .is_none_or(|input| input.kind != ResourceInputKind::Select)
            {
                return Err(ResourceFormError::InvalidOptions(field.clone()));
            }
        }

        let mut properties = Map::new();
        let action = match access.operation {
            ResourceOperation::Create => String::from(self.path),
            ResourceOperation::Update => format!("{}/update", self.path),
            _ => return Err(ResourceFormError::NotWritableOperation),
        };
        properties.insert(String::from("action"), Value::String(action));
        properties.insert(
            String::from("csrf_token"),
            Value::String(String::from(csrf_token)),
        );
        properties.insert(String::from("submit"), Value::String(String::from(submit)));
        if let Some(id) = record_id {
            properties.insert(String::from("record_id"), Value::Number(id.into()));
        }

        let mut children = Vec::new();
        for field in self.fields {
            let Some(input) = field.input else { continue };
            if !input.available_for(access.operation) {
                continue;
            }
            if !access.fields.can_write(field.id) {
                continue;
            }
            let mut props = Map::new();
            props.insert(String::from("name"), Value::String(String::from(field.id)));
            props.insert(
                String::from("label"),
                Value::String(String::from(field.label)),
            );
            let field_id = match record_id {
                Some(id) => format!("feluqa-field-{id}-{}", field.id),
                None => format!("feluqa-field-new-{}", field.id),
            };
            props.insert(String::from("id"), Value::String(field_id));
            if input.kind != ResourceInputKind::Select {
                props.insert(
                    String::from("type"),
                    Value::String(String::from(input.kind.as_str())),
                );
            }
            props.insert(
                String::from("required"),
                Value::Bool(
                    (access.operation == ResourceOperation::Create && input.required_on_create)
                        || (access.operation == ResourceOperation::Update
                            && input.required_on_update),
                ),
            );
            if let Some(max_length) = input.max_length {
                props.insert(String::from("maxlength"), Value::Number(max_length.into()));
            }
            let component_name = if input.kind == ResourceInputKind::Select {
                let Some(field_options) = options.get(field.id) else {
                    return Err(ResourceFormError::InvalidOptions(String::from(field.id)));
                };
                if field_options.is_empty()
                    || field_options.iter().any(|option| {
                        option.value.is_empty()
                            || option.value.len() > 256
                            || option.label.trim().is_empty()
                            || option.label.len() > 512
                    })
                {
                    return Err(ResourceFormError::InvalidOptions(String::from(field.id)));
                }
                let mut option_values = Vec::new();
                for option in field_options {
                    let mut option_props = Map::new();
                    option_props.insert(String::from("value"), Value::String(option.value.clone()));
                    option_props.insert(String::from("label"), Value::String(option.label.clone()));
                    option_values.push(Value::Object(option_props));
                }
                props.insert(String::from("options"), Value::Array(option_values));
                props.insert(
                    String::from("placeholder"),
                    Value::String(String::from("Choose a value")),
                );
                if let Some(selected) = values.get(field.id) {
                    if !field_options.iter().any(|option| &option.value == selected) {
                        return Err(ResourceFormError::InvalidOptions(String::from(field.id)));
                    }
                }
                "feluqa::select"
            } else {
                "feluqa::input"
            };
            if input.kind != ResourceInputKind::Password && access.fields.can_read(field.id) {
                if let Some(value) = values.get(field.id) {
                    props.insert(String::from("value"), Value::String(value.clone()));
                }
            }
            children.push(UiNode::Component {
                key: String::from(field.id),
                name: String::from(component_name),
                props,
                children: Vec::new(),
            });
        }
        if children.is_empty() {
            return Err(ResourceFormError::NoWritableFields);
        }

        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Component {
                key: String::from("resource-form"),
                name: String::from("feluqa::form"),
                props: properties,
                children,
            }],
        };
        feluqa_ui::render(&document).map_err(ResourceFormError::Render)
    }

    /// Resolve readable and writable fields independently from CRUD action grants.
    pub fn field_access(
        &self,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> ResourceFieldAccess {
        ResourceFieldAccess {
            readable: self
                .fields
                .iter()
                .filter(|field| self.can_read_field(field.id, principal, authorizer))
                .map(|field| field.id)
                .collect(),
            writable: self
                .fields
                .iter()
                .filter(|field| self.can_write_field(field.id, principal, authorizer))
                .map(|field| field.id)
                .collect(),
        }
    }

    fn allows_permission(
        &self,
        value: Option<&str>,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> bool {
        let Some(value) = value else {
            return false;
        };
        let Ok(permission) = Permission::new(String::from(value)) else {
            return false;
        };
        authorizer.authorize(principal, &permission).is_ok()
    }
}

impl ResourceInput {
    fn available_for(self, operation: ResourceOperation) -> bool {
        match operation {
            ResourceOperation::Create => self.creatable,
            ResourceOperation::Update => self.updatable,
            _ => false,
        }
    }
}

/// Invalid or incomplete resource declarations fail before routes are served.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ResourceError {
    /// Resource ID or title is malformed.
    InvalidIdentity,
    /// Resource path is malformed or noncanonical.
    InvalidPath,
    /// No operations were declared.
    EmptyActions,
    /// No fields were declared.
    EmptyFields,
    /// An operation appears more than once.
    DuplicateAction(ResourceOperation),
    /// A field identifier or label is invalid.
    InvalidField(&'static str),
    /// A field identifier appears more than once.
    DuplicateField(&'static str),
    /// A permission is malformed or outside the resource namespace.
    InvalidPermission,
}

impl fmt::Display for ResourceError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidIdentity => formatter.write_str("resource ID or title is invalid"),
            Self::InvalidPath => formatter.write_str("resource path is invalid or noncanonical"),
            Self::EmptyActions => formatter.write_str("resource must declare an operation"),
            Self::EmptyFields => formatter.write_str("resource must declare a field"),
            Self::DuplicateAction(action) => {
                write!(formatter, "resource operation {action:?} is duplicated")
            }
            Self::InvalidField(field) => write!(formatter, "resource field `{field}` is invalid"),
            Self::DuplicateField(field) => {
                write!(formatter, "resource field `{field}` is duplicated")
            }
            Self::InvalidPermission => {
                formatter.write_str("resource permission is invalid or outside its namespace")
            }
        }
    }
}

impl core::error::Error for ResourceError {}

/// Startup registry for module-owned resources and their panel routes.
#[derive(Clone, Default)]
pub struct ResourceRegistry {
    resources: BTreeMap<&'static str, Resource>,
    routes: BTreeMap<&'static str, &'static str>,
}

impl ResourceRegistry {
    /// Validate and register one resource, rejecting duplicate identifiers and routes.
    pub fn register(&mut self, resource: Resource) -> Result<(), ResourceRegistryError> {
        resource
            .validate()
            .map_err(ResourceRegistryError::InvalidResource)?;
        if self.resources.contains_key(resource.id) {
            return Err(ResourceRegistryError::DuplicateId(resource.id));
        }
        if self.routes.contains_key(resource.path) {
            return Err(ResourceRegistryError::DuplicateRoute(resource.path));
        }
        self.routes.insert(resource.path, resource.id);
        self.resources.insert(resource.id, resource);
        Ok(())
    }

    /// Look up a registered resource by its stable module identifier.
    pub fn get(&self, id: &str) -> Option<&Resource> {
        self.resources.get(id)
    }

    /// Resolve a registered panel path to its resource contract.
    pub fn at_path(&self, path: &str) -> Option<&Resource> {
        let id = self.routes.get(path)?;
        self.resources.get(id)
    }

    /// Iterate registered resources in stable identifier order.
    pub fn resources(&self) -> impl Iterator<Item = &Resource> {
        self.resources.values()
    }
}

/// Resource registry startup error.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ResourceRegistryError {
    /// A resource contract failed validation.
    InvalidResource(ResourceError),
    /// A resource identifier is already registered.
    DuplicateId(&'static str),
    /// A panel route is already registered to another resource.
    DuplicateRoute(&'static str),
}

impl fmt::Display for ResourceRegistryError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidResource(error) => write!(formatter, "invalid resource: {error}"),
            Self::DuplicateId(id) => write!(formatter, "resource `{id}` is already registered"),
            Self::DuplicateRoute(path) => {
                write!(formatter, "resource route `{path}` is already registered")
            }
        }
    }
}

impl core::error::Error for ResourceRegistryError {}

fn permission_namespace(kind: PanelKind) -> &'static str {
    match kind {
        PanelKind::System => "system",
        PanelKind::Business => "business",
    }
}

fn validate_resource_permission(
    value: &str,
    expected_namespace: &str,
) -> Result<(), ResourceError> {
    let Ok(permission) = Permission::new(String::from(value)) else {
        return Err(ResourceError::InvalidPermission);
    };
    if permission.namespace() != expected_namespace {
        return Err(ResourceError::InvalidPermission);
    }
    Ok(())
}

fn valid_resource_id(value: &str) -> bool {
    !value.is_empty()
        && value.split('.').all(|segment| {
            !segment.is_empty()
                && segment
                    .bytes()
                    .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        })
}

fn valid_field_id(value: &str) -> bool {
    !value.is_empty()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
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
    /// Authentication, appearance, and navigation settings used by the shared shell.
    pub options: PanelOptions,
}

/// Fluent, convention-friendly panel configuration, analogous to Filament's `PanelProvider`.
#[derive(Clone, Debug)]
pub struct PanelBuilder {
    panel: Panel,
}

impl PanelBuilder {
    /// Start a panel declaration when the ID, title and route prefix will be set fluently.
    pub fn for_kind(kind: PanelKind) -> Self {
        Self::new("", "", "", kind)
    }

    /// Start defining a panel. Add at least one page before calling [`Self::build`].
    pub fn new(
        id: impl Into<String>,
        title: impl Into<String>,
        prefix: impl Into<String>,
        kind: PanelKind,
    ) -> Self {
        let mut panel = Panel {
            id: id.into(),
            title: title.into(),
            prefix: prefix.into(),
            kind,
            pages: Vec::new(),
            options: PanelOptions::default(),
        };
        panel.options.appearance.sidebar_collapsible = true;
        panel.options.appearance.sidebar_fully_collapsible = true;
        Self { panel }
    }

    /// Set the stable panel identifier.
    pub fn id(mut self, id: impl Into<String>) -> Self {
        self.panel.id = id.into();
        self
    }

    /// Set the visible panel title.
    pub fn title(mut self, title: impl Into<String>) -> Self {
        self.panel.title = title.into();
        self
    }

    /// Set the route prefix owned by this panel.
    pub fn path(mut self, prefix: impl Into<String>) -> Self {
        self.panel.prefix = prefix.into();
        self
    }

    /// Set the visible brand name, defaulting to the panel title.
    pub fn brand_name(mut self, name: impl Into<String>) -> Self {
        self.panel.options.appearance.brand_name = Some(name.into());
        self
    }

    /// Set the light-mode logo to a local absolute URL.
    pub fn brand_logo(mut self, path: impl Into<String>) -> Self {
        self.panel.options.appearance.brand_logo = Some(path.into());
        self
    }

    /// Set the dark-mode logo to a local absolute URL.
    pub fn dark_brand_logo(mut self, path: impl Into<String>) -> Self {
        self.panel.options.appearance.dark_brand_logo = Some(path.into());
        self
    }

    /// Set the browser favicon to a local absolute URL.
    pub fn favicon(mut self, path: impl Into<String>) -> Self {
        self.panel.options.appearance.favicon = Some(path.into());
        self
    }

    /// Enable a client-selectable light/dark theme.
    pub fn dark_mode(mut self) -> Self {
        self.panel.options.appearance.dark_mode = true;
        self
    }

    /// Force dark theme for every request.
    pub fn force_dark_mode(mut self) -> Self {
        self.panel.options.appearance.dark_mode = true;
        self.panel.options.appearance.force_dark_mode = true;
        self
    }

    /// Set the maximum width of page content.
    pub fn max_content_width(mut self, width: ContentWidth) -> Self {
        self.panel.options.appearance.content_width = width;
        self
    }

    /// Allow the desktop sidebar to collapse.
    pub fn sidebar_collapsible(mut self, enabled: bool) -> Self {
        self.panel.options.appearance.sidebar_collapsible = enabled;
        self
    }

    /// Allow the desktop sidebar to collapse to its icon rail.
    pub fn sidebar_fully_collapsible(mut self, enabled: bool) -> Self {
        self.panel.options.appearance.sidebar_fully_collapsible = enabled;
        self
    }

    /// Put navigation in the horizontal top bar.
    pub fn top_navigation(mut self) -> Self {
        self.panel.options.appearance.navigation_position = NavigationPosition::Topbar;
        self
    }

    /// Enable the panel login page.
    pub fn login(mut self) -> Self {
        self.panel.options.authentication.login = true;
        self
    }

    /// Enable public account registration.
    pub fn registration(mut self) -> Self {
        self.panel.options.authentication.registration = true;
        self
    }

    /// Enable the password reset flow.
    pub fn password_reset(mut self) -> Self {
        self.panel.options.authentication.password_reset = true;
        self
    }

    /// Enable email verification pages and middleware policy.
    pub fn email_verification(mut self) -> Self {
        self.panel.options.authentication.email_verification = true;
        self
    }

    /// Add a page declared by this panel provider.
    pub fn page(mut self, page: PanelPage) -> Self {
        self.panel.pages.push(page);
        self
    }

    /// Add an ordered navigation group. Route authorization remains mandatory on the page.
    pub fn navigation_group(mut self, group: NavigationGroup) -> Self {
        self.panel.options.navigation.push(group);
        self
    }

    /// Validate and return the compiled panel declaration.
    pub fn build(self) -> Result<Panel, PanelError> {
        validate_panel(&self.panel)?;
        Ok(self.panel)
    }
}

impl Panel {
    /// Build a panel with one permission-protected text page at its route prefix.
    pub fn single_page(
        id: impl Into<String>,
        title: impl Into<String>,
        prefix: impl Into<String>,
        kind: PanelKind,
        permission: &str,
        content: impl Into<String>,
    ) -> Result<Self, PanelError> {
        let id = id.into();
        let namespace = permission_namespace(kind);
        let permission = Permission::new(String::from(permission)).map_err(|_| {
            PanelError::InvalidPermission {
                panel: id.clone(),
                expected: String::from(namespace),
            }
        })?;
        let panel = Self {
            id,
            title: title.into(),
            prefix: prefix.into(),
            kind,
            pages: vec![PanelPage {
                path: String::from("/"),
                permission,
                document: UiDocument {
                    schema_version: SCHEMA_VERSION,
                    root: vec![UiNode::Text {
                        value: content.into(),
                    }],
                },
            }],
            options: PanelOptions {
                appearance: PanelAppearance {
                    sidebar_collapsible: true,
                    sidebar_fully_collapsible: true,
                    ..PanelAppearance::default()
                },
                ..PanelOptions::default()
            },
        };
        validate_panel(&panel)?;
        Ok(panel)
    }
}

/// Validated, deterministic registry of application-local panels and page routes.
#[derive(Clone, Default)]
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

/// Shared startup catalogue that reserves panel pages and module resource routes together.
#[derive(Clone, Default)]
pub struct PanelCatalog {
    panels: PanelRegistry,
    resources: ResourceRegistry,
}

impl PanelCatalog {
    /// Register every panel and resource declared by one application or module provider.
    pub fn register_provider(
        &mut self,
        provider: &impl PanelProvider,
    ) -> Result<(), PanelCatalogError> {
        provider.register(self)
    }

    /// Iterate registered panels in stable identifier order.
    pub fn panels(&self) -> impl Iterator<Item = &Panel> {
        self.panels.panels()
    }

    /// Resolve the shell brand from the registered panel provider.
    pub fn brand_name(&self, panel_id: &str) -> Option<&str> {
        self.panels.panels.get(panel_id).map(|panel| {
            panel
                .options
                .appearance
                .brand_name
                .as_deref()
                .unwrap_or(panel.title.as_str())
        })
    }

    /// Render the permission-filtered navigation declared by one registered panel.
    pub fn render_navigation(
        &self,
        panel_id: &str,
        principal: &Principal,
        authorizer: &impl Authorizer,
        active_path: &str,
    ) -> Result<RenderedNavigation, PanelError> {
        let panel = self
            .panels
            .panels
            .get(panel_id)
            .ok_or_else(|| PanelError::NotFound(String::from(panel_id)))?;
        panel
            .options
            .render_navigation(principal, authorizer, active_path)
    }

    /// Register a panel only when none of its pages collide with a module resource route.
    pub fn register_panel(&mut self, panel: Panel) -> Result<(), PanelCatalogError> {
        validate_panel(&panel).map_err(PanelCatalogError::Panel)?;
        for page in &panel.pages {
            let path = join_path(
                &panel.prefix,
                &normalize_path(&page.path).map_err(PanelCatalogError::Panel)?,
            );
            if self.resources.routes.contains_key(path.as_str()) {
                return Err(PanelCatalogError::RouteCollision(path));
            }
        }
        self.panels
            .register(panel)
            .map_err(PanelCatalogError::Panel)
    }

    /// Register a resource only when its route is not owned by a panel page.
    pub fn register_resource(&mut self, resource: Resource) -> Result<(), PanelCatalogError> {
        resource
            .validate()
            .map_err(ResourceRegistryError::InvalidResource)
            .map_err(PanelCatalogError::Resource)?;
        if self.panels.routes().any(|path| path == resource.path) {
            return Err(PanelCatalogError::RouteCollision(String::from(
                resource.path,
            )));
        }
        self.resources
            .register(resource)
            .map_err(PanelCatalogError::Resource)
    }

    /// Resolve an authenticated panel page using the shared authorization contract.
    pub fn resolve_page<'a>(
        &'a self,
        path: &str,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> Result<&'a PanelPage, PanelError> {
        self.panels.resolve(path, principal, authorizer)
    }

    /// Authorize and render one registered page through the safe built-in SDUI renderer.
    pub fn render_page(
        &self,
        path: &str,
        principal: &Principal,
        authorizer: &impl Authorizer,
    ) -> Result<RenderedHtml, PanelRenderError> {
        self.resolve_page(path, principal, authorizer)
            .map_err(PanelRenderError::Access)?
            .render()
            .map_err(PanelRenderError::Render)
    }

    /// Look up a module-owned resource by stable ID.
    pub fn resource(&self, id: &str) -> Option<&Resource> {
        self.resources.get(id)
    }

    /// Resolve one operation against a registered resource contract.
    ///
    /// This is the shared authorization boundary for module resource handlers.
    /// Database adapters must apply the returned record scope in their query and
    /// limit serialized/input fields to the returned field grants.
    pub fn authorize_resource(
        &self,
        id: &str,
        operation: ResourceOperation,
        principal: &Principal,
        actor_user_id: i64,
        authorizer: &impl Authorizer,
    ) -> Result<ResourceAccess, ResourceAuthorizationError> {
        self.resources
            .get(id)
            .ok_or(ResourceAuthorizationError::UnknownResource)?
            .resolve_access(operation, principal, actor_user_id, authorizer)
            .map_err(|_| ResourceAuthorizationError::Denied)
    }

    /// Resolve a module-owned resource by its reserved panel route.
    pub fn resource_at_path(&self, path: &str) -> Option<&Resource> {
        self.resources.at_path(path)
    }

    /// Iterate registered resources in stable identifier order.
    pub fn resources(&self) -> impl Iterator<Item = &Resource> {
        self.resources.resources()
    }
}

/// Declares the panels and resources owned by an application or compiled module.
/// Providers register into the shared catalogue so route collisions fail at startup.
pub trait PanelProvider {
    /// Add this provider's panel pages and resources to the catalogue.
    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError>;
}

/// Startup failure while assembling one panel/resource route namespace.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum PanelCatalogError {
    /// A page declaration is invalid or duplicates another panel page.
    Panel(PanelError),
    /// A resource declaration is invalid or duplicates another resource.
    Resource(ResourceRegistryError),
    /// A route is already owned by a page or resource in the other registry.
    RouteCollision(String),
}

impl From<PanelError> for PanelCatalogError {
    fn from(error: PanelError) -> Self {
        Self::Panel(error)
    }
}

impl From<ResourceRegistryError> for PanelCatalogError {
    fn from(error: ResourceRegistryError) -> Self {
        Self::Resource(error)
    }
}

impl fmt::Display for PanelCatalogError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Panel(error) => write!(formatter, "panel registration failed: {error}"),
            Self::Resource(error) => write!(formatter, "resource registration failed: {error}"),
            Self::RouteCollision(path) => {
                write!(formatter, "panel and resource route `{path}` collide")
            }
        }
    }
}

impl core::error::Error for PanelCatalogError {}

fn validate_panel(panel: &Panel) -> Result<(), PanelError> {
    if !valid_identifier(&panel.id) || panel.title.trim().is_empty() {
        return Err(PanelError::InvalidPanel);
    }
    let prefix = normalize_path(&panel.prefix)?;
    if prefix != panel.prefix {
        return Err(PanelError::InvalidPrefix);
    }
    if prefix == "/" {
        return Err(PanelError::InvalidPrefix);
    }
    for asset in [
        panel.options.appearance.brand_logo.as_deref(),
        panel.options.appearance.dark_brand_logo.as_deref(),
        panel.options.appearance.favicon.as_deref(),
    ]
    .into_iter()
    .flatten()
    {
        if !valid_local_asset_path(asset) {
            return Err(PanelError::InvalidNavigation);
        }
    }
    let expected_namespace = match panel.kind {
        PanelKind::System => "system",
        PanelKind::Business => "business",
    };
    let mut navigation_paths = BTreeMap::new();
    for group in &panel.options.navigation {
        if group.items.is_empty()
            || group
                .label
                .as_ref()
                .is_some_and(|label| label.trim().is_empty())
        {
            return Err(PanelError::InvalidNavigation);
        }
        for item in &group.items {
            let item_path =
                normalize_path(&item.path).map_err(|_| PanelError::InvalidNavigation)?;
            if item.label.trim().is_empty()
                || item_path != item.path
                || !(item_path == prefix
                    || item_path
                        .strip_prefix(&prefix)
                        .is_some_and(|suffix| suffix.starts_with('/')))
                || navigation_paths.insert(item_path, ()).is_some()
                || item
                    .icon
                    .as_ref()
                    .is_some_and(|icon| feluqa_imagery::panel_heroicon(icon).is_none())
            {
                return Err(PanelError::InvalidNavigation);
            }
            if let Some(permission) = &item.permission {
                if permission.namespace() != expected_namespace {
                    return Err(PanelError::WrongPermissionNamespace {
                        panel: panel.id.clone(),
                        expected: String::from(expected_namespace),
                    });
                }
            }
        }
    }
    if panel.pages.is_empty() {
        return Err(PanelError::EmptyPanel);
    }
    let mut local_routes = BTreeMap::new();
    for page in &panel.pages {
        let path = normalize_path(&page.path)?;
        if path != page.path {
            return Err(PanelError::InvalidPath(page.path.clone()));
        }
        if local_routes.insert(path.clone(), ()).is_some() {
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

fn valid_local_asset_path(path: &str) -> bool {
    path.starts_with('/')
        && !path.starts_with("//")
        && path.len() <= 2_048
        && !path
            .chars()
            .any(|character| matches!(character, '?' | '#' | '\\'))
        && !path
            .split('/')
            .any(|segment| segment == ".." || segment == ".")
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
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum PanelError {
    /// The ID or title is invalid.
    InvalidPanel,
    /// The panel prefix is invalid or reserves the site root.
    InvalidPrefix,
    /// A route contains invalid path syntax.
    InvalidPath(String),
    /// A panel has no pages.
    EmptyPanel,
    /// Navigation or branding contains an invalid path, label, icon, or permission.
    InvalidNavigation,
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
    /// A page permission is malformed.
    InvalidPermission {
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
            Self::InvalidNavigation => {
                formatter.write_str("panel navigation or branding configuration is invalid")
            }
            Self::DuplicatePanel(id) => write!(formatter, "panel `{id}` is already registered"),
            Self::DuplicateRoute(path) => {
                write!(formatter, "panel route `{path}` is already registered")
            }
            Self::WrongPermissionNamespace { panel, expected } => write!(
                formatter,
                "panel `{panel}` requires permissions in the `{expected}` namespace"
            ),
            Self::InvalidPermission { panel, expected } => write!(
                formatter,
                "panel `{panel}` requires a valid permission in the `{expected}` namespace"
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

/// Failure to authorize or render a page from a shared panel catalogue.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum PanelRenderError {
    /// Route lookup or permission check failed.
    Access(PanelError),
    /// The page schema is not renderable by the safe HTML renderer.
    Render(RenderError),
}

impl fmt::Display for PanelRenderError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Access(error) => write!(formatter, "panel access failed: {error}"),
            Self::Render(error) => write!(formatter, "panel rendering failed: {error}"),
        }
    }
}

impl core::error::Error for PanelRenderError {}

#[cfg(test)]
mod tests {
    use super::{
        ContentWidth, NavigationGroup, NavigationItem, Panel, PanelBuilder, PanelCatalog,
        PanelCatalogError, PanelError, PanelKind, PanelOptions, PanelPage, PanelRegistry,
        PanelRenderError, Resource, ResourceAction, ResourceAuthorizationError, ResourceField,
        ResourceInput, ResourceInputKind, ResourceOperation, ResourceOption, ResourceRecordScope,
        ResourceRegistry, ResourceRegistryError, ResourceTableError, ResourceTableRow,
    };
    use crate::core::clone::Clone;
    use crate::core::convert::From;
    use crate::core::default::Default;
    use crate::core::option::Option::None;
    use crate::core::option::Option::Some;
    use crate::core::result::Result::Err;
    use crate::feluqa_auth::{Authorizer, Permission, PermissionSetAuthorizer, Principal};
    use crate::feluqa_ui::{SCHEMA_VERSION, UiDocument, UiNode};
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::collections::BTreeMap;
    use crate::std::matches;
    use crate::std::string::String;
    use crate::std::vec;

    static CUSTOMER_RESOURCE: Resource = Resource {
        id: "crm.customers",
        title: "Customers",
        path: "/admin/customers",
        kind: PanelKind::Business,
        manage_permission: Some("business.erp.manage"),
        record_access_permission: Some("business.crm.customers.records.all"),
        actions: &[
            ResourceAction {
                operation: ResourceOperation::List,
                permission: "business.crm.customers.read",
            },
            ResourceAction {
                operation: ResourceOperation::Create,
                permission: "business.crm.customers.create",
            },
            ResourceAction {
                operation: ResourceOperation::Update,
                permission: "business.crm.customers.update",
            },
        ],
        fields: &[
            ResourceField {
                id: "name",
                label: "Name",
                read_permission: "business.crm.customers.fields.name.read",
                write_permission: Some("business.crm.customers.fields.name.write"),
                input: Some(ResourceInput {
                    kind: ResourceInputKind::Text,
                    required_on_create: true,
                    required_on_update: false,
                    creatable: true,
                    updatable: true,
                    max_length: Some(160),
                }),
            },
            ResourceField {
                id: "email",
                label: "Email",
                read_permission: "business.crm.customers.fields.email.read",
                write_permission: Some("business.crm.customers.fields.email.write"),
                input: Some(ResourceInput {
                    kind: ResourceInputKind::Email,
                    required_on_create: true,
                    required_on_update: false,
                    creatable: true,
                    updatable: true,
                    max_length: Some(254),
                }),
            },
        ],
    };

    static ROLE_FORM_RESOURCE: Resource = Resource {
        id: "system.role-fixture",
        title: "Role fixture",
        path: "/system/roles",
        kind: PanelKind::System,
        manage_permission: None,
        record_access_permission: None,
        actions: &[
            ResourceAction {
                operation: ResourceOperation::Create,
                permission: "system.roles.write",
            },
            ResourceAction {
                operation: ResourceOperation::Update,
                permission: "system.roles.write",
            },
        ],
        fields: &[
            ResourceField {
                id: "slug",
                label: "Key",
                read_permission: "system.roles.read",
                write_permission: Some("system.roles.write"),
                input: Some(ResourceInput {
                    kind: ResourceInputKind::Text,
                    required_on_create: true,
                    required_on_update: false,
                    creatable: true,
                    updatable: false,
                    max_length: Some(64),
                }),
            },
            ResourceField {
                id: "permissions",
                label: "Permissions",
                read_permission: "system.roles.read",
                write_permission: Some("system.roles.write"),
                input: Some(ResourceInput {
                    kind: ResourceInputKind::Textarea,
                    required_on_create: true,
                    required_on_update: true,
                    creatable: true,
                    updatable: true,
                    max_length: Some(8_192),
                }),
            },
        ],
    };

    static USER_ROLE_RESOURCE: Resource = Resource {
        id: "system.user-fixture",
        title: "User fixture",
        path: "/system/users",
        kind: PanelKind::System,
        manage_permission: None,
        record_access_permission: None,
        actions: &[
            ResourceAction {
                operation: ResourceOperation::Create,
                permission: "system.users.write",
            },
            ResourceAction {
                operation: ResourceOperation::Update,
                permission: "system.users.write",
            },
        ],
        fields: &[ResourceField {
            id: "role_id",
            label: "Role",
            read_permission: "system.users.write",
            write_permission: Some("system.users.write"),
            input: Some(ResourceInput {
                kind: ResourceInputKind::Select,
                required_on_create: true,
                required_on_update: true,
                creatable: true,
                updatable: true,
                max_length: None,
            }),
        }],
    };

    fn principal(grants: &[&str]) -> Principal {
        let mut principal = Principal::new("resource-test", None).expect("valid subject");
        for grant in grants {
            principal.grant(Permission::new(String::from(*grant)).expect("valid grant"));
        }
        principal
    }

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
            options: PanelOptions::default(),
        }
    }

    #[test]
    fn filament_style_panel_provider_builds_typed_auth_branding_and_navigation() {
        let builder = PanelBuilder::new("crm", "CRM", "/admin", PanelKind::Business)
            .brand_name("Numerimondes")
            .brand_logo("/assets/branding/logo.svg")
            .favicon("/assets/branding/favicon.svg")
            .dark_mode()
            .max_content_width(ContentWidth::SevenExtraLarge)
            .login()
            .registration()
            .password_reset()
            .email_verification()
            .navigation_group(NavigationGroup {
                label: Some(String::from("CRM")),
                items: vec![NavigationItem {
                    label: String::from("Customers"),
                    path: String::from("/admin/customers"),
                    icon: Some(String::from("o-users")),
                    permission: Some(
                        Permission::new(String::from("business.crm.customers.read"))
                            .expect("grant"),
                    ),
                }],
            })
            .page(PanelPage {
                path: String::from("/"),
                permission: Permission::new(String::from("business.erp.manage")).expect("grant"),
                document: UiDocument {
                    schema_version: SCHEMA_VERSION,
                    root: vec![UiNode::Text {
                        value: String::from("CRM"),
                    }],
                },
            });
        let built = builder.build().expect("valid panel provider configuration");
        assert!(built.options.authentication.login);
        assert!(built.options.authentication.registration);
        assert!(built.options.authentication.password_reset);
        assert!(built.options.authentication.email_verification);
        assert_eq!(
            built.options.appearance.brand_name.as_deref(),
            Some("Numerimondes")
        );
        assert_eq!(
            built.options.appearance.content_width,
            ContentWidth::SevenExtraLarge
        );
        assert_eq!(built.options.navigation.len(), 1);

        let auth = PermissionSetAuthorizer;
        let granted_principal = principal(&["business.crm.customers.read"]);
        let visible = built.options.visible_navigation(&granted_principal, &auth);
        assert_eq!(visible.len(), 1);
        assert_eq!(visible[0].items[0].label, "Customers");
        let rendered = built
            .options
            .render_navigation(&granted_principal, &auth, "/admin/customers")
            .expect("registered navigation with embedded icon");
        assert!(rendered.as_str().contains("<svg"));
        assert!(rendered.as_str().contains("aria-current=\"page\""));

        let denied = principal(&[]);
        assert!(built.options.visible_navigation(&denied, &auth).is_empty());
    }

    #[test]
    fn panel_provider_rejects_external_brand_assets_and_out_of_prefix_navigation() {
        let page = PanelPage {
            path: String::from("/"),
            permission: Permission::new(String::from("system.dashboard.read")).expect("grant"),
            document: UiDocument {
                schema_version: SCHEMA_VERSION,
                root: vec![UiNode::Text {
                    value: String::from("System"),
                }],
            },
        };
        assert_eq!(
            PanelBuilder::new("system", "System", "/system", PanelKind::System)
                .brand_logo("https://external.example/logo.svg")
                .page(page.clone())
                .build()
                .unwrap_err(),
            PanelError::InvalidNavigation
        );
        assert_eq!(
            PanelBuilder::new("system", "System", "/system", PanelKind::System)
                .navigation_group(NavigationGroup {
                    label: None,
                    items: vec![NavigationItem {
                        label: String::from("Outside"),
                        path: String::from("/admin"),
                        icon: None,
                        permission: None,
                    }],
                })
                .page(page)
                .build()
                .unwrap_err(),
            PanelError::InvalidNavigation
        );
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

    #[test]
    fn panel_prefixes_and_pages_must_use_canonical_paths() {
        let mut registry = PanelRegistry::default();
        let mut trailing_prefix = panel(
            PanelKind::System,
            "core",
            "/system/",
            "system.dashboard.read",
        );
        assert_eq!(
            registry.register(trailing_prefix.clone()),
            Err(PanelError::InvalidPrefix)
        );

        trailing_prefix.prefix = String::from("/system");
        trailing_prefix.pages[0].path = String::from("//overview");
        assert_eq!(
            registry.register(trailing_prefix),
            Err(PanelError::InvalidPath(String::from("//overview")))
        );
    }

    #[test]
    fn single_page_builder_creates_a_valid_permission_scoped_panel() {
        let panel = Panel::single_page(
            "reports",
            "Reports",
            "/admin/reports",
            PanelKind::Business,
            "business.reports.manage",
            "Reports overview",
        )
        .expect("valid one-page panel");
        assert_eq!(panel.id, "reports");
        assert_eq!(panel.pages[0].path, "/");
        assert_eq!(
            panel.pages[0].render().expect("render page").as_str(),
            "Reports overview"
        );

        assert!(matches!(
            Panel::single_page(
                "reports",
                "Reports",
                "/admin/reports",
                PanelKind::Business,
                "business..manage",
                "Reports overview",
            ),
            Err(PanelError::InvalidPermission { .. })
        ));
    }

    #[test]
    fn panel_catalog_authorizes_before_rendering_and_escapes_page_text() {
        let mut catalog = PanelCatalog::default();
        catalog
            .register_panel(
                Panel::single_page(
                    "reports",
                    "Reports",
                    "/admin/reports",
                    PanelKind::Business,
                    "business.reports.read",
                    "<script>alert(1)</script>",
                )
                .expect("valid panel"),
            )
            .expect("register panel");
        let mut principal = Principal::new("operator", None).expect("principal");
        principal.grant(Permission::new("business.reports.read").expect("permission"));
        let html = catalog
            .render_page("/admin/reports", &principal, &PermissionSetAuthorizer)
            .expect("authorized safe render");
        assert_eq!(html.as_str(), "&lt;script&gt;alert(1)&lt;/script&gt;");

        let denied = Principal::new("visitor", None).expect("principal");
        assert_eq!(
            catalog.render_page("/admin/reports", &denied, &PermissionSetAuthorizer),
            Err(PanelRenderError::Access(PanelError::Forbidden))
        );
    }

    #[test]
    fn resource_contract_enforces_action_and_field_permissions() {
        let resource = Resource {
            id: "crm.customers",
            title: "Customers",
            path: "/admin/customers",
            kind: PanelKind::Business,
            manage_permission: Some("business.erp.manage"),
            record_access_permission: Some("business.crm.customers.records.all"),
            actions: &[
                ResourceAction {
                    operation: ResourceOperation::List,
                    permission: "business.crm.customers.read",
                },
                ResourceAction {
                    operation: ResourceOperation::Update,
                    permission: "business.crm.customers.update",
                },
            ],
            fields: &[
                ResourceField {
                    id: "name",
                    label: "Name",
                    read_permission: "business.crm.customers.fields.name.read",
                    write_permission: Some("business.crm.customers.fields.name.write"),
                    input: None,
                },
                ResourceField {
                    id: "email",
                    label: "Email",
                    read_permission: "business.crm.customers.fields.email.read",
                    write_permission: Some("business.crm.customers.fields.email.write"),
                    input: None,
                },
            ],
        };
        resource.validate().expect("valid CRM resource contract");
        let mut registry = ResourceRegistry::default();
        registry.register(resource).expect("register resource");
        assert_eq!(registry.get("crm.customers"), Some(&resource));
        assert_eq!(registry.at_path("/admin/customers"), Some(&resource));
        assert_eq!(
            registry.register(resource),
            Err(ResourceRegistryError::DuplicateId("crm.customers"))
        );
        let route_collision = Resource {
            id: "crm.contacts",
            ..resource
        };
        assert_eq!(
            registry.register(route_collision),
            Err(ResourceRegistryError::DuplicateRoute("/admin/customers"))
        );
        let authorizer = PermissionSetAuthorizer;
        let mut name_reader = Principal::new("reader", None).expect("principal");
        name_reader.grant(Permission::new("business.crm.customers.read").expect("grant"));
        name_reader.grant(
            Permission::new("business.crm.customers.fields.name.read").expect("field grant"),
        );

        assert!(resource.allows_action(ResourceOperation::List, &name_reader, &authorizer));
        assert!(!resource.allows_action(ResourceOperation::Update, &name_reader, &authorizer));
        assert!(resource.can_read_field("name", &name_reader, &authorizer));
        assert!(!resource.can_read_field("email", &name_reader, &authorizer));
        assert!(!resource.can_write_field("name", &name_reader, &authorizer));
        assert!(!resource.can_read_field("unknown", &name_reader, &authorizer));

        let mut manager = Principal::new("manager", None).expect("principal");
        manager.grant(Permission::new("business.erp.manage").expect("manager grant"));
        assert!(resource.can_write_field("email", &manager, &authorizer));
        assert!(resource.allows_action(ResourceOperation::Update, &manager, &authorizer));
    }

    #[test]
    fn resource_policy_resolves_action_record_and_field_access_together() {
        let reader = principal(&[
            "business.crm.customers.read",
            "business.crm.customers.fields.name.read",
        ]);
        let access = CUSTOMER_RESOURCE
            .resolve_access(
                ResourceOperation::List,
                &reader,
                42,
                &PermissionSetAuthorizer,
            )
            .expect("reader can list owned records");
        assert_eq!(access.records, ResourceRecordScope::OwnedBy(42));
        assert_eq!(access.fields.readable, vec!["name"]);
        assert!(access.fields.writable.is_empty());

        let global_reader = principal(&[
            "business.crm.customers.read",
            "business.crm.customers.records.all",
            "business.crm.customers.fields.email.read",
        ]);
        let global_access = CUSTOMER_RESOURCE
            .resolve_access(
                ResourceOperation::List,
                &global_reader,
                42,
                &PermissionSetAuthorizer,
            )
            .expect("global grant widens record scope");
        assert_eq!(global_access.records, ResourceRecordScope::All);
        assert_eq!(global_access.fields.readable, vec!["email"]);

        let manager = principal(&["business.erp.manage"]);
        let managed = CUSTOMER_RESOURCE
            .resolve_access(
                ResourceOperation::Update,
                &manager,
                42,
                &PermissionSetAuthorizer,
            )
            .expect("manager override authorizes declared actions");
        assert_eq!(managed.records, ResourceRecordScope::All);
        assert_eq!(managed.fields.readable, vec!["name", "email"]);
        assert_eq!(managed.fields.writable, vec!["name", "email"]);

        assert!(
            CUSTOMER_RESOURCE
                .resolve_access(
                    ResourceOperation::Delete,
                    &reader,
                    42,
                    &PermissionSetAuthorizer,
                )
                .is_err()
        );
        assert!(
            CUSTOMER_RESOURCE
                .resolve_access(
                    ResourceOperation::List,
                    &reader,
                    0,
                    &PermissionSetAuthorizer,
                )
                .is_err()
        );
    }

    #[test]
    fn panel_catalog_authorizes_only_registered_resources_and_resolves_scope_once() {
        let mut catalog = PanelCatalog::default();
        catalog
            .register_resource(CUSTOMER_RESOURCE)
            .expect("registered resource");
        let reader = principal(&[
            "business.crm.customers.read",
            "business.crm.customers.fields.name.read",
        ]);
        let access = catalog
            .authorize_resource(
                "crm.customers",
                ResourceOperation::List,
                &reader,
                27,
                &PermissionSetAuthorizer,
            )
            .expect("authorized resource access");
        assert_eq!(access.resource_id, "crm.customers");
        assert_eq!(access.operation, ResourceOperation::List);
        assert_eq!(access.records, ResourceRecordScope::OwnedBy(27));
        assert!(access.fields.can_read("name"));
        assert!(!access.fields.can_read("email"));
        assert!(!access.fields.can_write("name"));
        assert_eq!(
            catalog.authorize_resource(
                "crm.customers",
                ResourceOperation::Update,
                &reader,
                27,
                &PermissionSetAuthorizer,
            ),
            Err(ResourceAuthorizationError::Denied)
        );
        assert_eq!(
            catalog.authorize_resource(
                "crm.missing",
                ResourceOperation::List,
                &reader,
                27,
                &PermissionSetAuthorizer,
            ),
            Err(ResourceAuthorizationError::UnknownResource)
        );

        let manager = principal(&["business.erp.manage"]);
        let manager_access = catalog
            .authorize_resource(
                "crm.customers",
                ResourceOperation::Update,
                &manager,
                27,
                &PermissionSetAuthorizer,
            )
            .expect("manager override");
        assert_eq!(manager_access.records, ResourceRecordScope::All);
        assert!(manager_access.fields.can_read("email"));
        assert!(manager_access.fields.can_write("email"));
    }

    #[test]
    fn resource_table_omits_unreadable_fields_and_escapes_values() {
        let mut catalog = PanelCatalog::default();
        catalog
            .register_resource(CUSTOMER_RESOURCE)
            .expect("registered resource");
        let reader = principal(&[
            "business.crm.customers.read",
            "business.crm.customers.fields.name.read",
        ]);
        let access = catalog
            .authorize_resource(
                "crm.customers",
                ResourceOperation::List,
                &reader,
                27,
                &PermissionSetAuthorizer,
            )
            .expect("authorized resource access");
        let mut row = ResourceTableRow::default();
        row.values
            .insert(String::from("name"), String::from("<Acme>"));
        row.values
            .insert(String::from("email"), String::from("secret@example.test"));
        let html = CUSTOMER_RESOURCE
            .render_table(&access, "Customers", &[row])
            .expect("render authorized columns");
        assert!(html.as_str().contains("&lt;Acme&gt;"));
        assert!(html.as_str().contains("<th scope=\"col\">Name</th>"));
        assert!(!html.as_str().contains("Email"));
        assert!(!html.as_str().contains("secret@example.test"));

        let manager = principal(&["business.erp.manage"]);
        let write_access = catalog
            .authorize_resource(
                "crm.customers",
                ResourceOperation::Update,
                &manager,
                27,
                &PermissionSetAuthorizer,
            )
            .expect("authorized write access");
        assert_eq!(
            CUSTOMER_RESOURCE.render_table(&write_access, "Customers", &[]),
            Err(ResourceTableError::NotReadableOperation)
        );
    }

    #[test]
    fn resource_form_filters_fields_and_prefills_only_readable_values() {
        let creator = principal(&[
            "business.crm.customers.create",
            "business.crm.customers.fields.name.read",
            "business.crm.customers.fields.name.write",
            "business.crm.customers.fields.email.write",
        ]);
        let create_access = CUSTOMER_RESOURCE
            .resolve_access(
                ResourceOperation::Create,
                &creator,
                42,
                &PermissionSetAuthorizer,
            )
            .expect("creator may create");
        let mut values = crate::std::collections::BTreeMap::new();
        values.insert(String::from("name"), String::from("<Acme>"));
        values.insert(String::from("email"), String::from("secret@example.test"));
        let create_html = CUSTOMER_RESOURCE
            .render_form(&create_access, &"a".repeat(64), None, "Create", &values)
            .expect("create form should render");
        assert!(create_html.as_str().contains("action=\"/admin/customers\""));
        assert!(
            create_html
                .as_str()
                .contains("name=\"name\" type=\"text\" value=\"&lt;Acme&gt;\" required")
        );
        assert!(
            create_html
                .as_str()
                .contains("name=\"email\" type=\"email\" value=\"\" required")
        );
        assert!(!create_html.as_str().contains("secret@example.test"));
        assert!(create_html.as_str().contains("name=\"csrf_token\""));

        let updater = principal(&[
            "business.crm.customers.update",
            "business.crm.customers.fields.name.read",
            "business.crm.customers.fields.name.write",
        ]);
        let update_access = CUSTOMER_RESOURCE
            .resolve_access(
                ResourceOperation::Update,
                &updater,
                42,
                &PermissionSetAuthorizer,
            )
            .expect("updater may update");
        let update_html = CUSTOMER_RESOURCE
            .render_form(&update_access, &"b".repeat(64), Some(9), "Save", &values)
            .expect("update form should render");
        assert!(
            update_html
                .as_str()
                .contains("action=\"/admin/customers/update\"")
        );
        assert!(update_html.as_str().contains("name=\"id\" value=\"9\""));
        assert!(update_html.as_str().contains("name=\"name\""));
        assert!(!update_html.as_str().contains("name=\"email\""));
        assert!(!update_html.as_str().contains("secret@example.test"));
        assert!(!update_html.as_str().contains(" required"));
    }

    #[test]
    fn resource_form_applies_create_and_update_field_lifecycle() {
        let actor = principal(&["system.roles.read", "system.roles.write"]);
        let create_access = ROLE_FORM_RESOURCE
            .resolve_access(
                ResourceOperation::Create,
                &actor,
                12,
                &PermissionSetAuthorizer,
            )
            .expect("role writer may create");
        let create = ROLE_FORM_RESOURCE
            .render_form(
                &create_access,
                &"a".repeat(64),
                None,
                "Create role",
                &BTreeMap::new(),
            )
            .expect("create role form");
        assert!(create.as_str().contains("name=\"slug\""));
        assert!(create.as_str().contains("name=\"permissions\""));

        let update_access = ROLE_FORM_RESOURCE
            .resolve_access(
                ResourceOperation::Update,
                &actor,
                12,
                &PermissionSetAuthorizer,
            )
            .expect("role writer may update");
        let mut values = BTreeMap::new();
        values.insert(
            String::from("permissions"),
            String::from("system.roles.read"),
        );
        let update = ROLE_FORM_RESOURCE
            .render_form(
                &update_access,
                &"b".repeat(64),
                Some(27),
                "Update grants",
                &values,
            )
            .expect("update role form");
        assert!(!update.as_str().contains("name=\"slug\""));
        assert!(update.as_str().contains("name=\"id\" value=\"27\""));
        assert!(update.as_str().contains("feluqa-field-27-permissions"));
        assert!(update.as_str().contains("name=\"permissions\" required"));
        assert!(update.as_str().contains("system.roles.read</textarea>"));
    }

    #[test]
    fn resource_select_options_are_escaped_and_selected_values_must_exist() {
        let actor = principal(&["system.users.write"]);
        let create_access = USER_ROLE_RESOURCE
            .resolve_access(
                ResourceOperation::Create,
                &actor,
                12,
                &PermissionSetAuthorizer,
            )
            .expect("user manager may create");
        let mut options = BTreeMap::new();
        options.insert(
            String::from("role_id"),
            vec![
                ResourceOption {
                    value: String::from("4"),
                    label: String::from("Editor <limited>"),
                },
                ResourceOption {
                    value: String::from("8"),
                    label: String::from("Manager"),
                },
            ],
        );
        let form = USER_ROLE_RESOURCE
            .render_form_with_options(
                &create_access,
                &"a".repeat(64),
                None,
                "Create user",
                &BTreeMap::new(),
                &options,
            )
            .expect("select form renders");
        assert!(
            form.as_str()
                .contains("<select id=\"feluqa-field-new-role_id\"")
        );
        assert!(
            form.as_str()
                .contains("<option value=\"\" selected disabled>Choose a value</option>")
        );
        assert!(form.as_str().contains("Editor &lt;limited&gt;"));

        let mut values = BTreeMap::new();
        values.insert(String::from("role_id"), String::from("8"));
        let selected = USER_ROLE_RESOURCE
            .render_form_with_options(
                &create_access,
                &"a".repeat(64),
                None,
                "Create user",
                &values,
                &options,
            )
            .expect("existing option may be selected");
        assert!(selected.as_str().contains("value=\"8\" selected"));
        values.insert(String::from("role_id"), String::from("999"));
        assert!(
            USER_ROLE_RESOURCE
                .render_form_with_options(
                    &create_access,
                    &"a".repeat(64),
                    None,
                    "Create user",
                    &values,
                    &options,
                )
                .is_err()
        );
    }

    #[test]
    fn resource_contract_rejects_cross_panel_permissions_and_duplicates() {
        let invalid = Resource {
            id: "system.roles",
            title: "Roles",
            path: "/system/roles",
            kind: PanelKind::System,
            manage_permission: None,
            record_access_permission: None,
            actions: &[ResourceAction {
                operation: ResourceOperation::List,
                permission: "business.crm.customers.read",
            }],
            fields: &[ResourceField {
                id: "name",
                label: "Name",
                read_permission: "system.roles.read",
                write_permission: None,
                input: None,
            }],
        };
        assert!(invalid.validate().is_err());

        let duplicate = Resource {
            id: "crm.customers",
            title: "Customers",
            path: "/admin/customers",
            kind: PanelKind::Business,
            manage_permission: None,
            record_access_permission: None,
            actions: &[
                ResourceAction {
                    operation: ResourceOperation::List,
                    permission: "business.crm.customers.read",
                },
                ResourceAction {
                    operation: ResourceOperation::List,
                    permission: "business.crm.customers.read",
                },
            ],
            fields: &[ResourceField {
                id: "name",
                label: "Name",
                read_permission: "business.crm.customers.fields.name.read",
                write_permission: None,
                input: None,
            }],
        };
        assert!(duplicate.validate().is_err());
    }

    #[test]
    fn shared_catalog_rejects_resource_page_route_collisions_in_either_order() {
        let resource = Resource {
            id: "crm.customers",
            title: "Customers",
            path: "/admin/customers",
            kind: PanelKind::Business,
            manage_permission: None,
            record_access_permission: None,
            actions: &[ResourceAction {
                operation: ResourceOperation::List,
                permission: "business.crm.customers.read",
            }],
            fields: &[ResourceField {
                id: "name",
                label: "Name",
                read_permission: "business.crm.customers.fields.name.read",
                write_permission: None,
                input: None,
            }],
        };
        let mut customers = panel(
            PanelKind::Business,
            "crm",
            "/admin",
            "business.crm.customers.read",
        );
        customers.pages[0].path = String::from("/customers");

        let mut resource_first = PanelCatalog::default();
        resource_first
            .register_resource(resource)
            .expect("resource route registers");
        assert_eq!(
            resource_first.register_panel(customers.clone()),
            Err(PanelCatalogError::RouteCollision(String::from(
                "/admin/customers",
            )))
        );

        let mut panel_first = PanelCatalog::default();
        panel_first
            .register_panel(customers)
            .expect("panel route registers");
        assert_eq!(
            panel_first.register_resource(resource),
            Err(PanelCatalogError::RouteCollision(String::from(
                "/admin/customers",
            )))
        );
    }
}
