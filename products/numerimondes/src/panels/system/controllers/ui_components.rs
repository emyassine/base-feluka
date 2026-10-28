#![no_implicit_prelude]

use super::*;
use crate::feluqa::view::TrustedHtml;
use crate::feluqa::ui::{SCHEMA_VERSION, UiDocument, UiNode};
use crate::serde_json::{Map, Value};
use crate::std::format;
use crate::std::string::String;
use crate::std::convert::From;
use crate::std::vec;

pub(crate) fn with_modules_component_card(
    table: TrustedHtml,
    total_modules: usize,
    active_modules: usize,
) -> TrustedHtml {
    let mut props = Map::new();
    props.insert(
        String::from("title"),
        Value::String(String::from("Compiled modules")),
    );
    let summary = UiDocument {
        schema_version: SCHEMA_VERSION,
        root: vec![UiNode::Component {
            key: String::from("compiled-modules"),
            name: String::from("feluqa::section"),
            props,
            children: vec![UiNode::Text {
                value: String::from(format!(
                    "{total_modules} modules are compiled into this product; {active_modules} are currently active. Module installation is determined by the product build."
                )),
            }],
        }],
    };
    let summary = match crate::feluqa::ui::render(&summary) {
        Ok(rendered) => String::from(rendered.as_str()),
        Err(_) => String::new(),
    };
    let mut html = String::with_capacity(summary.len() + table.as_str().len());
    html.push_str(&summary);
    html.push_str(table.as_str());
    TrustedHtml::from_trusted(html)
}
