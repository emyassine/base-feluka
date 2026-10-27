#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Versioned SDUI validation, safe JSON serialization, and fixed-tag HTML rendering.

extern crate alloc;
extern crate core;
extern crate serde;
extern crate serde_json;
#[cfg(test)]
extern crate std;

use alloc::collections::BTreeSet;
use alloc::format;
use alloc::string::String;
use alloc::vec::Vec;
use core::convert::From;
use core::fmt::{self, Write};
use core::iter::Iterator;
use core::matches;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::write;
use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Current JSON schema version understood by Feluqa renderers.
pub const SCHEMA_VERSION: u16 = 1;
const MAX_DEPTH: usize = 64;
const MAX_NODES: usize = 10_000;
const MAX_PROPS: usize = 256;
const MAX_DOCUMENT_BYTES: usize = 1_048_576;

/// A versioned presentation tree. It contains component names and data, never Rust code.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UiDocument {
    /// Version of the serialized node contract.
    pub schema_version: u16,
    /// Ordered nodes rendered at the document root.
    pub root: Vec<UiNode>,
}

/// Closed set of client-visible UI nodes.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case", deny_unknown_fields)]
pub enum UiNode {
    /// Plain text, always escaped by the server renderer.
    Text {
        /// Text content.
        value: String,
    },
    /// A named, fixed-catalogue component with JSON properties and child nodes.
    Component {
        /// Stable key unique within this document.
        key: String,
        /// Namespaced component identifier.
        name: String,
        /// Data-only component properties.
        props: serde_json::Map<String, Value>,
        /// Ordered child nodes.
        children: Vec<UiNode>,
    },
    /// A named server action reference; rendering requires a signed Live snapshot.
    Action {
        /// Stable key unique within this document.
        key: String,
        /// Human-readable label rendered as text.
        label: String,
        /// Namespaced action ID registered by trusted server code.
        action: String,
        /// Exact permission required by the server action.
        permission: String,
    },
}

impl UiDocument {
    /// Validate versions, component/action identifiers, stable keys and resource bounds.
    pub fn validate(&self) -> Result<(), SchemaError> {
        if self.schema_version != SCHEMA_VERSION {
            return Err(SchemaError::UnsupportedVersion(self.schema_version));
        }
        let mut keys = BTreeSet::new();
        let mut count = 0;
        for node in &self.root {
            validate_node(node, 1, &mut count, &mut keys)?;
        }
        Ok(())
    }

    /// Serialize a validated document for a client or a versioned cache.
    pub fn to_json(&self) -> Result<String, SchemaError> {
        self.validate()?;
        let json = serde_json::to_string(self).map_err(|_| SchemaError::Serialization)?;
        if json.len() > MAX_DOCUMENT_BYTES {
            return Err(SchemaError::DocumentTooLarge);
        }
        Ok(json)
    }

    /// Parse client or stored JSON, rejecting unknown fields and invalid schemas.
    pub fn from_json(json: &str) -> Result<Self, SchemaError> {
        if json.len() > MAX_DOCUMENT_BYTES {
            return Err(SchemaError::DocumentTooLarge);
        }
        let document: Self = serde_json::from_str(json).map_err(|_| SchemaError::MalformedJson)?;
        document.validate()?;
        Ok(document)
    }
}

fn validate_node(
    node: &UiNode,
    depth: usize,
    count: &mut usize,
    keys: &mut BTreeSet<String>,
) -> Result<(), SchemaError> {
    if depth > MAX_DEPTH {
        return Err(SchemaError::DepthLimit);
    }
    *count += 1;
    if *count > MAX_NODES {
        return Err(SchemaError::NodeLimit);
    }
    match node {
        UiNode::Text { value } => {
            if value.len() > 16_384 {
                return Err(SchemaError::ValueLimit);
            }
        }
        UiNode::Component {
            key,
            name,
            props,
            children,
        } => {
            validate_key(key, keys)?;
            validate_name(name)?;
            if props.len() > MAX_PROPS {
                return Err(SchemaError::PropertyLimit);
            }
            for (property, value) in props {
                validate_property(property)?;
                validate_json_value(value, 0)?;
            }
            for child in children {
                validate_node(child, depth + 1, count, keys)?;
            }
        }
        UiNode::Action {
            key,
            label,
            action,
            permission,
        } => {
            validate_key(key, keys)?;
            validate_name(action)?;
            validate_permission(permission)?;
            if label.trim().is_empty() || label.len() > 512 {
                return Err(SchemaError::InvalidLabel);
            }
        }
    }
    Ok(())
}

fn validate_key(key: &str, keys: &mut BTreeSet<String>) -> Result<(), SchemaError> {
    if key.is_empty()
        || key.len() > 128
        || !key
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || b"_-.:".contains(&byte))
        || !keys.insert(String::from(key))
    {
        return Err(SchemaError::InvalidOrDuplicateKey);
    }
    Ok(())
}

fn validate_name(name: &str) -> Result<(), SchemaError> {
    if name.is_empty()
        || name.len() > 128
        || !name.split("::").all(|part| {
            !part.is_empty()
                && part
                    .bytes()
                    .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        })
    {
        return Err(SchemaError::InvalidIdentifier);
    }
    Ok(())
}

fn validate_permission(permission: &str) -> Result<(), SchemaError> {
    if permission.is_empty()
        || !permission.split('.').all(|part| {
            !part.is_empty()
                && part
                    .bytes()
                    .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        })
    {
        return Err(SchemaError::InvalidPermission);
    }
    Ok(())
}

fn validate_property(property: &str) -> Result<(), SchemaError> {
    let lower = property.to_ascii_lowercase();
    if property.is_empty()
        || property.len() > 128
        || lower.starts_with("on")
        || matches!(
            lower.as_str(),
            "innerhtml" | "outerhtml" | "dangerouslysetinnerhtml"
        )
        || !property
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || b"_-.:".contains(&byte))
    {
        return Err(SchemaError::UnsafeProperty);
    }
    Ok(())
}

fn validate_json_value(value: &Value, depth: usize) -> Result<(), SchemaError> {
    if depth > 16 {
        return Err(SchemaError::ValueLimit);
    }
    match value {
        Value::String(text) if text.len() > 16_384 => Err(SchemaError::ValueLimit),
        Value::Array(items) if items.len() > 1_024 => Err(SchemaError::ValueLimit),
        Value::Object(map) if map.len() > MAX_PROPS => Err(SchemaError::ValueLimit),
        Value::Array(items) => {
            for item in items {
                validate_json_value(item, depth + 1)?;
            }
            Ok(())
        }
        Value::Object(map) => {
            for (key, item) in map {
                validate_property(key)?;
                validate_json_value(item, depth + 1)?;
            }
            Ok(())
        }
        _ => Ok(()),
    }
}

/// Schema validation failure suitable for startup diagnostics and safe HTTP errors.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum SchemaError {
    /// The schema version is not supported by this runtime.
    UnsupportedVersion(u16),
    /// JSON could not be parsed as a closed UI schema.
    MalformedJson,
    /// A validated schema could not be serialized.
    Serialization,
    /// The JSON document exceeds the 1 MiB limit.
    DocumentTooLarge,
    /// The node tree exceeds the maximum nesting depth.
    DepthLimit,
    /// The node tree exceeds the maximum node count.
    NodeLimit,
    /// A component contains too many properties.
    PropertyLimit,
    /// A property value exceeds size or nesting limits.
    ValueLimit,
    /// A node key is malformed or duplicated.
    InvalidOrDuplicateKey,
    /// A component or action identifier is malformed.
    InvalidIdentifier,
    /// An action permission identifier is malformed.
    InvalidPermission,
    /// An action label is empty or too long.
    InvalidLabel,
    /// A property name is malformed or executable.
    UnsafeProperty,
}
impl fmt::Display for SchemaError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let message = match self {
            Self::UnsupportedVersion(version) => {
                return write!(formatter, "unsupported UI schema version {version}");
            }
            Self::MalformedJson => "malformed UI schema JSON",
            Self::Serialization => "could not serialize UI schema",
            Self::DocumentTooLarge => "UI schema exceeds the 1 MiB document limit",
            Self::DepthLimit => "UI schema nesting exceeds 64 levels",
            Self::NodeLimit => "UI schema exceeds 10000 nodes",
            Self::PropertyLimit => "UI component exceeds 256 properties",
            Self::ValueLimit => "UI property value exceeds its size or nesting limit",
            Self::InvalidOrDuplicateKey => "UI node key is invalid or duplicated",
            Self::InvalidIdentifier => "UI component or action identifier is invalid",
            Self::InvalidPermission => "UI action permission is invalid",
            Self::InvalidLabel => "UI action label is empty or too long",
            Self::UnsafeProperty => "UI property name is invalid or executable",
        };
        formatter.write_str(message)
    }
}
impl core::error::Error for SchemaError {}

#[cfg(test)]
mod tests {
    use super::{SCHEMA_VERSION, SchemaError, UiDocument, UiNode};
    use crate::core::clone::Clone;
    use crate::core::convert::From;
    use crate::core::result::Result::Err;
    use crate::serde_json::Map;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::string::String;
    use crate::std::vec;

    fn valid_document() -> UiDocument {
        UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Component {
                key: String::from("page-main"),
                name: String::from("feluqa::section"),
                props: Map::new(),
                children: vec![UiNode::Text {
                    value: String::from("Hello"),
                }],
            }],
        }
    }

    #[test]
    fn versioned_schema_round_trips_through_serde_json() {
        let document = valid_document();
        let json = document.to_json().expect("valid UI document");
        assert_eq!(
            UiDocument::from_json(&json).expect("valid schema"),
            document
        );
    }

    #[test]
    fn duplicate_keys_and_executable_properties_are_rejected() {
        let mut document = valid_document();
        if let UiNode::Component { props, .. } = &mut document.root[0] {
            props.insert(
                String::from("onClick"),
                crate::serde_json::Value::String(String::from("x")),
            );
        }
        assert_eq!(document.validate(), Err(SchemaError::UnsafeProperty));
        if let UiNode::Component { props, .. } = &mut document.root[0] {
            props.clear();
        }
        document.root.push(document.root[0].clone());
        assert_eq!(document.validate(), Err(SchemaError::InvalidOrDuplicateKey));
    }

    #[test]
    fn unsupported_versions_and_unknown_json_fields_are_rejected() {
        let mut document = valid_document();
        document.schema_version = 7;
        assert_eq!(document.validate(), Err(SchemaError::UnsupportedVersion(7)));
        assert!(UiDocument::from_json(r#"{"schema_version":1,"root":[],"script":"x"}"#).is_err());
    }
}

/// HTML produced exclusively by Feluqa's built-in component renderer.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RenderedHtml(String);

impl RenderedHtml {
    /// Borrow the generated HTML. All dynamic text and attributes were escaped by the renderer.
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

/// Validate a schema and render its built-in, non-interactive component subset to safe HTML.
pub fn render(document: &UiDocument) -> Result<RenderedHtml, RenderError> {
    document.validate().map_err(RenderError::InvalidSchema)?;
    let mut output = String::new();
    for node in &document.root {
        render_node(node, &mut output)?;
    }
    Ok(RenderedHtml(output))
}

fn render_node(node: &UiNode, output: &mut String) -> Result<(), RenderError> {
    match node {
        UiNode::Text { value } => push_escaped(output, value),
        UiNode::Action { .. } => return Err(RenderError::ActionNeedsLiveSnapshot),
        UiNode::Component {
            name,
            props,
            children,
            ..
        } => match name.as_str() {
            "feluqa::page" => {
                require_props(props, &[])?;
                output.push_str("<main>");
                render_children(children, output)?;
                output.push_str("</main>");
            }
            "feluqa::stack" => {
                require_props(props, &[])?;
                output.push_str("<div class=\"feluqa-stack\">");
                render_children(children, output)?;
                output.push_str("</div>");
            }
            "feluqa::section" => {
                require_props(props, &["id", "eyebrow", "title"])?;
                output.push_str("<section");
                if let Some(id) = optional_string(props, "id")? {
                    output.push_str(" id=\"");
                    push_escaped(output, id);
                    output.push('\"');
                }
                output.push('>');
                if let Some(eyebrow) = optional_string(props, "eyebrow")? {
                    output.push_str("<p class=\"feluqa-eyebrow\">");
                    push_escaped(output, eyebrow);
                    output.push_str("</p>");
                }
                output.push_str("<h2>");
                push_escaped(output, required_string(props, "title")?);
                output.push_str("</h2>");
                render_children(children, output)?;
                output.push_str("</section>");
            }
            "feluqa::heading" => {
                require_props(props, &["level", "value"])?;
                let level = props
                    .get("level")
                    .and_then(Value::as_u64)
                    .filter(|value| (1..=6).contains(value))
                    .ok_or(RenderError::InvalidPropertyType("level"))?;
                let value = required_string(props, "value")?;
                output.push_str("<h");
                output.push(char::from(b'0' + level as u8));
                output.push('>');
                push_escaped(output, value);
                output.push_str("</h");
                output.push(char::from(b'0' + level as u8));
                output.push('>');
                require_no_children(children)?;
            }
            "feluqa::text" => {
                require_props(props, &["value"])?;
                require_no_children(children)?;
                output.push_str("<p>");
                push_escaped(output, required_string(props, "value")?);
                output.push_str("</p>");
            }
            "feluqa::badge" => {
                require_props(props, &["label", "tone"])?;
                require_no_children(children)?;
                let tone = enum_prop(
                    props,
                    "tone",
                    &["neutral", "info", "success", "warning", "danger"],
                )?;
                output.push_str("<span class=\"feluqa-badge feluqa-badge--");
                output.push_str(tone);
                output.push_str("\">");
                push_escaped(output, required_string(props, "label")?);
                output.push_str("</span>");
            }
            "feluqa::alert" => {
                require_props(props, &["title", "tone"])?;
                let tone = enum_prop(props, "tone", &["info", "success", "warning", "danger"])?;
                output.push_str("<section role=\"status\" class=\"feluqa-alert feluqa-alert--");
                output.push_str(tone);
                output.push_str("\"><h2>");
                push_escaped(output, required_string(props, "title")?);
                output.push_str("</h2>");
                render_children(children, output)?;
                output.push_str("</section>");
            }
            "feluqa::button" => {
                require_props(props, &["label", "disabled"])?;
                require_no_children(children)?;
                output.push_str("<button type=\"button\"");
                if optional_bool(props, "disabled")? == Some(true) {
                    output.push_str(" disabled");
                }
                output.push('>');
                push_escaped(output, required_string(props, "label")?);
                output.push_str("</button>");
            }
            "feluqa::form" => render_form(props, children, output)?,
            "feluqa::input" => {
                require_no_children(children)?;
                render_input(props, output)?;
            }
            "feluqa::select" => {
                require_no_children(children)?;
                render_select(props, output)?;
            }
            "feluqa::link" => {
                require_props(props, &["href", "label"])?;
                require_no_children(children)?;
                let href = required_string(props, "href")?;
                if !safe_href(href) {
                    return Err(RenderError::UnsafeUrl);
                }
                output.push_str("<a href=\"");
                push_escaped(output, href);
                output.push_str("\">");
                push_escaped(output, required_string(props, "label")?);
                output.push_str("</a>");
            }
            "feluqa::table" => render_table(props, children, output)?,
            _ => return Err(RenderError::UnknownComponent),
        },
    }
    Ok(())
}

fn render_form(
    props: &serde_json::Map<String, Value>,
    children: &[UiNode],
    output: &mut String,
) -> Result<(), RenderError> {
    require_props(props, &["action", "csrf_token", "submit", "record_id"])?;
    let action = required_string(props, "action")?;
    if !action.starts_with('/') || !safe_href(action) {
        return Err(RenderError::UnsafeUrl);
    }
    let csrf = required_string(props, "csrf_token")?;
    if csrf.len() != 64 || !csrf.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err(RenderError::InvalidPropertyValue("csrf_token"));
    }
    let submit = required_string(props, "submit")?;
    if submit.trim().is_empty() || submit.len() > 128 {
        return Err(RenderError::InvalidPropertyValue("submit"));
    }
    let record_id = match props.get("record_id") {
        None => None,
        Some(value) => Some(
            value
                .as_i64()
                .filter(|id| *id > 0)
                .ok_or(RenderError::InvalidPropertyValue("record_id"))?,
        ),
    };

    output.push_str("<form method=\"post\" action=\"");
    push_escaped(output, action);
    output.push_str("\"><input type=\"hidden\" name=\"csrf_token\" value=\"");
    push_escaped(output, csrf);
    output.push_str("\">");
    if let Some(record_id) = record_id {
        output.push_str("<input type=\"hidden\" name=\"id\" value=\"");
        core::write!(output, "{record_id}")
            .map_err(|_| RenderError::InvalidPropertyValue("record_id"))?;
        output.push_str("\">");
    }

    let mut names = BTreeSet::new();
    for child in children {
        let UiNode::Component { name, props, .. } = child else {
            return Err(RenderError::UnexpectedChildren);
        };
        if name != "feluqa::input" && name != "feluqa::select" {
            return Err(RenderError::UnknownComponent);
        }
        let field_name = required_string(props, "name")?;
        if !valid_field_name(field_name) || !names.insert(String::from(field_name)) {
            return Err(RenderError::InvalidPropertyValue("name"));
        }
        if name == "feluqa::select" {
            render_select(props, output)?;
        } else {
            render_input(props, output)?;
        }
    }
    output.push_str("<button type=\"submit\">");
    push_escaped(output, submit);
    output.push_str("</button></form>");
    Ok(())
}

fn render_input(
    props: &serde_json::Map<String, Value>,
    output: &mut String,
) -> Result<(), RenderError> {
    require_props(
        props,
        &[
            "id",
            "name",
            "label",
            "type",
            "value",
            "required",
            "maxlength",
        ],
    )?;
    let name = required_string(props, "name")?;
    if !valid_field_name(name) {
        return Err(RenderError::InvalidPropertyValue("name"));
    }
    let label = required_string(props, "label")?;
    if label.trim().is_empty() || label.len() > 512 {
        return Err(RenderError::InvalidPropertyValue("label"));
    }
    let input_type = enum_prop(
        props,
        "type",
        &["text", "email", "number", "password", "textarea"],
    )?;
    let value = optional_string(props, "value")?.unwrap_or("");
    let required = optional_bool(props, "required")? == Some(true);
    let maxlength = match props.get("maxlength") {
        None => None,
        Some(value) => Some(
            value
                .as_u64()
                .filter(|length| (1..=16_384).contains(length))
                .ok_or(RenderError::InvalidPropertyValue("maxlength"))?,
        ),
    };
    let id = optional_string(props, "id")?
        .map(String::from)
        .unwrap_or_else(|| format!("feluqa-field-{name}"));
    if !valid_html_id(&id) {
        return Err(RenderError::InvalidPropertyValue("id"));
    }
    output.push_str("<label for=\"");
    push_escaped(output, &id);
    output.push_str("\">");
    push_escaped(output, label);
    output.push_str("</label>");
    if input_type == "textarea" {
        output.push_str("<textarea id=\"");
        push_escaped(output, &id);
        output.push_str("\" name=\"");
        push_escaped(output, name);
        output.push('"');
        if required {
            output.push_str(" required");
        }
        if let Some(maxlength) = maxlength {
            output.push_str(" maxlength=\"");
            core::write!(output, "{maxlength}")
                .map_err(|_| RenderError::InvalidPropertyValue("maxlength"))?;
            output.push('"');
        }
        output.push('>');
        push_escaped(output, value);
        output.push_str("</textarea>");
    } else {
        output.push_str("<input id=\"");
        push_escaped(output, &id);
        output.push_str("\" name=\"");
        push_escaped(output, name);
        output.push_str("\" type=\"");
        output.push_str(input_type);
        output.push_str("\" value=\"");
        push_escaped(output, value);
        output.push('"');
        if required {
            output.push_str(" required");
        }
        if let Some(maxlength) = maxlength {
            output.push_str(" maxlength=\"");
            core::write!(output, "{maxlength}")
                .map_err(|_| RenderError::InvalidPropertyValue("maxlength"))?;
            output.push('"');
        }
        output.push('>');
    }
    Ok(())
}

fn render_select(
    props: &serde_json::Map<String, Value>,
    output: &mut String,
) -> Result<(), RenderError> {
    require_props(
        props,
        &[
            "id",
            "name",
            "label",
            "value",
            "required",
            "options",
            "placeholder",
        ],
    )?;
    let id = required_string(props, "id")?;
    let name = required_string(props, "name")?;
    let label = required_string(props, "label")?;
    if !valid_html_id(id) || !valid_field_name(name) || label.trim().is_empty() || label.len() > 512
    {
        return Err(RenderError::InvalidPropertyValue("select"));
    }
    let selected = optional_string(props, "value")?;
    let placeholder = optional_string(props, "placeholder")?;
    let required = optional_bool(props, "required")? == Some(true);
    let options = props
        .get("options")
        .and_then(Value::as_array)
        .filter(|options| !options.is_empty() && options.len() <= 256)
        .ok_or(RenderError::InvalidPropertyValue("options"))?;
    let mut option_values = BTreeSet::new();
    if let Some(selected) = selected {
        if !options
            .iter()
            .any(|option| option.get("value").and_then(Value::as_str) == Some(selected))
        {
            return Err(RenderError::InvalidPropertyValue("value"));
        }
    }

    output.push_str("<label for=\"");
    push_escaped(output, id);
    output.push_str("\">");
    push_escaped(output, label);
    output.push_str("</label><select id=\"");
    push_escaped(output, id);
    output.push_str("\" name=\"");
    push_escaped(output, name);
    output.push('"');
    if required {
        output.push_str(" required");
    }
    output.push('>');
    if selected.is_none()
        && let Some(placeholder) = placeholder
    {
        if placeholder.trim().is_empty() || placeholder.len() > 128 {
            return Err(RenderError::InvalidPropertyValue("placeholder"));
        }
        output.push_str("<option value=\"\" selected disabled>");
        push_escaped(output, placeholder);
        output.push_str("</option>");
    }
    for option in options {
        let option = option
            .as_object()
            .filter(|option| option.len() == 2)
            .ok_or(RenderError::InvalidPropertyValue("options"))?;
        let value = option
            .get("value")
            .and_then(Value::as_str)
            .filter(|value| !value.is_empty() && value.len() <= 256)
            .ok_or(RenderError::InvalidPropertyValue("options"))?;
        let label = option
            .get("label")
            .and_then(Value::as_str)
            .filter(|label| !label.trim().is_empty() && label.len() <= 512)
            .ok_or(RenderError::InvalidPropertyValue("options"))?;
        if !option_values.insert(String::from(value)) {
            return Err(RenderError::InvalidPropertyValue("options"));
        }
        output.push_str("<option value=\"");
        push_escaped(output, value);
        output.push('"');
        if selected == Some(value) {
            output.push_str(" selected");
        }
        output.push('>');
        push_escaped(output, label);
        output.push_str("</option>");
    }
    output.push_str("</select>");
    Ok(())
}

fn valid_field_name(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.as_bytes()[0].is_ascii_lowercase()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
}

fn valid_html_id(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 128
        && value.as_bytes()[0].is_ascii_alphabetic()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'-')
}

fn render_table(
    props: &serde_json::Map<String, Value>,
    rows: &[UiNode],
    output: &mut String,
) -> Result<(), RenderError> {
    require_props(props, &["caption", "headers"])?;
    let caption = required_string(props, "caption")?;
    if caption.trim().is_empty() || caption.len() > 512 {
        return Err(RenderError::InvalidPropertyValue("caption"));
    }
    let headers = props
        .get("headers")
        .and_then(Value::as_array)
        .filter(|headers| !headers.is_empty() && headers.len() <= 32)
        .ok_or(RenderError::InvalidPropertyType("headers"))?;
    output.push_str("<table class=\"feluqa-table\"><caption>");
    push_escaped(output, caption);
    output.push_str("</caption><thead><tr>");
    for header in headers {
        let header = header
            .as_str()
            .filter(|header| !header.trim().is_empty() && header.len() <= 512)
            .ok_or(RenderError::InvalidPropertyValue("headers"))?;
        output.push_str("<th scope=\"col\">");
        push_escaped(output, header);
        output.push_str("</th>");
    }
    output.push_str("</tr></thead><tbody>");
    for row in rows {
        let UiNode::Component {
            name,
            props,
            children: cells,
            ..
        } = row
        else {
            return Err(RenderError::UnexpectedChildren);
        };
        if name != "feluqa::row" {
            return Err(RenderError::UnknownComponent);
        }
        require_props(props, &[])?;
        if cells.len() != headers.len() {
            return Err(RenderError::InvalidPropertyValue("headers"));
        }
        output.push_str("<tr>");
        for cell in cells {
            let UiNode::Component {
                name,
                props,
                children,
                ..
            } = cell
            else {
                return Err(RenderError::UnexpectedChildren);
            };
            if name != "feluqa::cell" {
                return Err(RenderError::UnknownComponent);
            }
            require_props(props, &["value"])?;
            require_no_children(children)?;
            output.push_str("<td>");
            push_escaped(output, required_string(props, "value")?);
            output.push_str("</td>");
        }
        output.push_str("</tr>");
    }
    output.push_str("</tbody></table>");
    Ok(())
}

fn render_children(children: &[UiNode], output: &mut String) -> Result<(), RenderError> {
    for child in children {
        render_node(child, output)?;
    }
    Ok(())
}

fn require_props(
    props: &serde_json::Map<String, Value>,
    allowed: &[&str],
) -> Result<(), RenderError> {
    if props.keys().any(|key| !allowed.contains(&key.as_str())) {
        return Err(RenderError::UnknownProperty);
    }
    Ok(())
}

fn require_no_children(children: &[UiNode]) -> Result<(), RenderError> {
    if children.is_empty() {
        Ok(())
    } else {
        Err(RenderError::UnexpectedChildren)
    }
}

fn required_string<'a>(
    props: &'a serde_json::Map<String, Value>,
    key: &'static str,
) -> Result<&'a str, RenderError> {
    props
        .get(key)
        .and_then(Value::as_str)
        .ok_or(RenderError::InvalidPropertyType(key))
}

fn optional_string<'a>(
    props: &'a serde_json::Map<String, Value>,
    key: &'static str,
) -> Result<Option<&'a str>, RenderError> {
    match props.get(key) {
        None => Ok(None),
        Some(value) => value
            .as_str()
            .map(Some)
            .ok_or(RenderError::InvalidPropertyType(key)),
    }
}

fn optional_bool(
    props: &serde_json::Map<String, Value>,
    key: &'static str,
) -> Result<Option<bool>, RenderError> {
    match props.get(key) {
        None => Ok(None),
        Some(value) => value
            .as_bool()
            .map(Some)
            .ok_or(RenderError::InvalidPropertyType(key)),
    }
}

fn enum_prop<'a>(
    props: &'a serde_json::Map<String, Value>,
    key: &'static str,
    allowed: &[&str],
) -> Result<&'a str, RenderError> {
    let value = required_string(props, key)?;
    if allowed.contains(&value) {
        Ok(value)
    } else {
        Err(RenderError::InvalidPropertyValue(key))
    }
}

fn safe_href(value: &str) -> bool {
    if value.starts_with('/') {
        return !value.starts_with("//")
            && !value.contains('\\')
            && !value.bytes().any(|byte| byte.is_ascii_control());
    }
    value.starts_with("https://")
        && value.len() > 8
        && !value[8..].starts_with('/')
        && !value.contains('\\')
        && !value.bytes().any(|byte| byte.is_ascii_control())
}

fn push_escaped(output: &mut String, value: &str) {
    for character in value.chars() {
        match character {
            '&' => output.push_str("&amp;"),
            '<' => output.push_str("&lt;"),
            '>' => output.push_str("&gt;"),
            '"' => output.push_str("&quot;"),
            '\'' => output.push_str("&#39;"),
            other => output.push(other),
        }
    }
}

/// Failure to render Feluqa's fixed SDUI component set.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RenderError {
    /// The input document failed schema validation.
    InvalidSchema(SchemaError),
    /// No safe HTML renderer is registered for the component name.
    UnknownComponent,
    /// The component received a property outside its fixed contract.
    UnknownProperty,
    /// A property did not have the required JSON type; carries the property name.
    InvalidPropertyType(&'static str),
    /// A property value was outside the component's allowed values.
    InvalidPropertyValue(&'static str),
    /// A link did not use an allowed local or HTTPS URL.
    UnsafeUrl,
    /// A leaf component received child nodes.
    UnexpectedChildren,
    /// An interactive action lacks its session-bound signed snapshot.
    ActionNeedsLiveSnapshot,
}
impl fmt::Display for RenderError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidSchema(error) => write!(formatter, "UI schema is invalid: {error}"),
            Self::UnknownComponent => {
                formatter.write_str("UI component has no registered renderer")
            }
            Self::UnknownProperty => {
                formatter.write_str("UI component has an unsupported property")
            }
            Self::InvalidPropertyType(name) => {
                write!(formatter, "UI property `{name}` has the wrong type")
            }
            Self::InvalidPropertyValue(name) => {
                write!(formatter, "UI property `{name}` has an unsupported value")
            }
            Self::UnsafeUrl => formatter.write_str("link URL must be a local path or HTTPS URL"),
            Self::UnexpectedChildren => {
                formatter.write_str("UI component does not accept child nodes")
            }
            Self::ActionNeedsLiveSnapshot => {
                formatter.write_str("interactive UI actions require a session-bound Live snapshot")
            }
        }
    }
}
impl core::error::Error for RenderError {}

#[cfg(test)]
mod render_tests {
    use super::{RenderError, SCHEMA_VERSION, SchemaError, UiDocument, UiNode, render};
    use crate::core::clone::Clone;
    use crate::core::convert::From;
    use crate::core::convert::Into;
    use crate::core::iter::FromIterator;
    use crate::core::result::Result::Err;
    use crate::serde_json::{Map, Value};
    use crate::std::assert_eq;
    use crate::std::string::String;
    use crate::std::vec;
    use crate::std::vec::Vec;

    fn component(name: &str, props: &[(&str, Value)], children: Vec<UiNode>) -> UiNode {
        component_with_key("root", name, props, children)
    }

    fn component_with_key(
        key: &str,
        name: &str,
        props: &[(&str, Value)],
        children: Vec<UiNode>,
    ) -> UiNode {
        let mut map = Map::new();
        for (key, value) in props {
            map.insert(String::from(*key), value.clone());
        }
        UiNode::Component {
            key: String::from(key),
            name: String::from(name),
            props: map,
            children,
        }
    }

    #[test]
    fn table_component_renders_accessible_cells_and_escapes_record_values() {
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::table",
                &[
                    ("caption", Value::String(String::from("Customers"))),
                    (
                        "headers",
                        Value::Array(vec![Value::String(String::from("Name"))]),
                    ),
                ],
                vec![component_with_key(
                    "row-1",
                    "feluqa::row",
                    &[],
                    vec![component_with_key(
                        "cell-1-1",
                        "feluqa::cell",
                        &[("value", Value::String(String::from("<Acme>")))],
                        vec![],
                    )],
                )],
            )],
        };
        assert_eq!(
            render(&document).expect("render safe table").as_str(),
            "<table class=\"feluqa-table\"><caption>Customers</caption><thead><tr><th scope=\"col\">Name</th></tr></thead><tbody><tr><td>&lt;Acme&gt;</td></tr></tbody></table>"
        );
    }

    #[test]
    fn table_component_rejects_rows_with_a_different_cell_count() {
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::table",
                &[
                    ("caption", Value::String(String::from("Customers"))),
                    (
                        "headers",
                        Value::Array(vec![Value::String(String::from("Name"))]),
                    ),
                ],
                vec![component_with_key("row-1", "feluqa::row", &[], vec![])],
            )],
        };
        assert_eq!(
            render(&document),
            Err(RenderError::InvalidPropertyValue("headers"))
        );
    }

    #[test]
    fn select_component_escapes_options_and_requires_a_known_selection() {
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::select",
                &[
                    ("id", Value::String(String::from("role-id"))),
                    ("name", Value::String(String::from("role_id"))),
                    ("label", Value::String(String::from("Role"))),
                    ("required", Value::Bool(true)),
                    (
                        "options",
                        Value::Array(vec![Value::Object(Map::from_iter([
                            (String::from("value"), Value::String(String::from("1"))),
                            (
                                String::from("label"),
                                Value::String(String::from("Editor <restricted>")),
                            ),
                        ]))]),
                    ),
                ],
                vec![],
            )],
        };
        let output = render(&document).expect("render valid select");
        assert_eq!(
            output.as_str(),
            "<label for=\"role-id\">Role</label><select id=\"role-id\" name=\"role_id\" required><option value=\"1\">Editor &lt;restricted&gt;</option></select>"
        );

        let mut invalid = document.clone();
        if let UiNode::Component { props, .. } = &mut invalid.root[0] {
            props.insert(
                String::from("value"),
                Value::String(String::from("missing")),
            );
        }
        assert_eq!(
            render(&invalid),
            Err(RenderError::InvalidPropertyValue("value"))
        );
    }

    #[test]
    fn form_component_uses_post_and_escapes_csrf_fields_and_values() {
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::form",
                &[
                    ("action", Value::String(String::from("/admin/customers"))),
                    ("csrf_token", Value::String("a".repeat(64))),
                    ("submit", Value::String(String::from("Create customer"))),
                ],
                vec![component_with_key(
                    "customer-name",
                    "feluqa::input",
                    &[
                        ("name", Value::String(String::from("name"))),
                        ("label", Value::String(String::from("Customer <name>"))),
                        ("type", Value::String(String::from("text"))),
                        (
                            "value",
                            Value::String(String::from("<script>alert(1)</script>")),
                        ),
                        ("required", Value::Bool(true)),
                        ("maxlength", Value::Number(160_u64.into())),
                    ],
                    vec![],
                )],
            )],
        };
        assert_eq!(
            render(&document).expect("render safe form").as_str(),
            "<form method=\"post\" action=\"/admin/customers\"><input type=\"hidden\" name=\"csrf_token\" value=\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"><label for=\"feluqa-field-name\">Customer &lt;name&gt;</label><input id=\"feluqa-field-name\" name=\"name\" type=\"text\" value=\"&lt;script&gt;alert(1)&lt;/script&gt;\" required maxlength=\"160\"><button type=\"submit\">Create customer</button></form>"
        );
    }

    #[test]
    fn textarea_component_escapes_body_and_preserves_a_unique_field_id() {
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::form",
                &[
                    (
                        "action",
                        Value::String(String::from("/system/roles/update")),
                    ),
                    ("csrf_token", Value::String("a".repeat(64))),
                    ("record_id", Value::Number(27_i64.into())),
                    ("submit", Value::String(String::from("Update grants"))),
                ],
                vec![component_with_key(
                    "role-permissions",
                    "feluqa::input",
                    &[
                        (
                            "id",
                            Value::String(String::from("feluqa-field-27-permissions")),
                        ),
                        ("name", Value::String(String::from("permissions"))),
                        ("label", Value::String(String::from("Permissions"))),
                        ("type", Value::String(String::from("textarea"))),
                        ("value", Value::String(String::from("<script>bad</script>"))),
                        ("required", Value::Bool(true)),
                        ("maxlength", Value::Number(8_192_u64.into())),
                    ],
                    vec![],
                )],
            )],
        };
        let html = render(&document).expect("render safe textarea form");
        assert_eq!(
            html.as_str(),
            "<form method=\"post\" action=\"/system/roles/update\"><input type=\"hidden\" name=\"csrf_token\" value=\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"><input type=\"hidden\" name=\"id\" value=\"27\"><label for=\"feluqa-field-27-permissions\">Permissions</label><textarea id=\"feluqa-field-27-permissions\" name=\"permissions\" required maxlength=\"8192\">&lt;script&gt;bad&lt;/script&gt;</textarea><button type=\"submit\">Update grants</button></form>"
        );
    }

    #[test]
    fn form_component_rejects_external_actions_invalid_csrf_and_duplicate_names() {
        let input = component_with_key(
            "first-input",
            "feluqa::input",
            &[
                ("name", Value::String(String::from("name"))),
                ("label", Value::String(String::from("Name"))),
                ("type", Value::String(String::from("text"))),
            ],
            vec![],
        );
        let make_form = |action: &str, token: &str, children: Vec<UiNode>| UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::form",
                &[
                    ("action", Value::String(String::from(action))),
                    ("csrf_token", Value::String(String::from(token))),
                    ("submit", Value::String(String::from("Save"))),
                ],
                children,
            )],
        };
        assert_eq!(
            render(&make_form(
                "https://evil.example/post",
                &"a".repeat(64),
                vec![]
            )),
            Err(RenderError::UnsafeUrl)
        );
        assert_eq!(
            render(&make_form("/save", "short", vec![])),
            Err(RenderError::InvalidPropertyValue("csrf_token"))
        );
        assert_eq!(
            render(&make_form(
                "/save",
                &"a".repeat(64),
                vec![
                    input,
                    component_with_key(
                        "second-input",
                        "feluqa::input",
                        &[
                            ("name", Value::String(String::from("name"))),
                            ("label", Value::String(String::from("Name again"))),
                            ("type", Value::String(String::from("text"))),
                        ],
                        vec![],
                    ),
                ],
            )),
            Err(RenderError::InvalidPropertyValue("name"))
        );
    }

    #[test]
    fn renderer_emits_only_fixed_tags_and_escapes_dynamic_values() {
        let document = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::section",
                &[
                    ("title", Value::String(String::from("<script>&\""))),
                    ("id", Value::String(String::from("main"))),
                ],
                vec![UiNode::Text {
                    value: String::from("A < B & C"),
                }],
            )],
        };
        assert_eq!(
            render(&document).expect("render").as_str(),
            "<section id=\"main\"><h2>&lt;script&gt;&amp;&quot;</h2>A &lt; B &amp; C</section>"
        );
    }

    #[test]
    fn renderer_rejects_script_urls_unknown_props_and_unbound_actions() {
        let unsafe_link = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::link",
                &[
                    ("href", Value::String(String::from("javascript:alert(1)"))),
                    ("label", Value::String(String::from("open"))),
                ],
                vec![],
            )],
        };
        assert_eq!(render(&unsafe_link), Err(RenderError::UnsafeUrl));
        let unknown = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![component(
                "feluqa::button",
                &[
                    ("label", Value::String(String::from("Run"))),
                    ("onClick", Value::String(String::from("do anything"))),
                ],
                vec![],
            )],
        };
        assert_eq!(
            render(&unknown),
            Err(RenderError::InvalidSchema(SchemaError::UnsafeProperty))
        );
        let action = UiDocument {
            schema_version: SCHEMA_VERSION,
            root: vec![UiNode::Action {
                key: String::from("save"),
                label: String::from("Save"),
                action: String::from("content::save"),
                permission: String::from("business.content.write"),
            }],
        };
        assert_eq!(render(&action), Err(RenderError::ActionNeedsLiveSnapshot));
    }
}
