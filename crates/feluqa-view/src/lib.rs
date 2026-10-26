#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate alloc;
extern crate core;

use alloc::borrow::ToOwned;
use alloc::format;
use alloc::string::String;
use alloc::vec::Vec;
use core::clone::Clone;
use core::fmt;
use core::ops::FnMut;
use core::option::Option;
use core::option::Option::Some;
use core::result::Result::{self, Err, Ok};
use core::write;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ViewError {
    UnclosedExpression { offset: usize },
    EmptyExpression { offset: usize },
    MissingValue { name: String },
}

impl fmt::Display for ViewError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::UnclosedExpression { offset } => {
                write!(formatter, "unclosed view expression at byte {offset}")
            }
            Self::EmptyExpression { offset } => {
                write!(formatter, "empty view expression at byte {offset}")
            }
            Self::MissingValue { name } => write!(formatter, "missing view value `{name}`"),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Node {
    Text(String),
    EscapedValue(String),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Template {
    nodes: Vec<Node>,
}

impl Template {
    pub fn compile(source: &str) -> Result<Self, ViewError> {
        let mut nodes = Vec::new();
        let mut cursor = 0;

        while let Some(relative_start) = source[cursor..].find("{{") {
            let start = cursor + relative_start;
            if start > cursor {
                nodes.push(Node::Text(source[cursor..start].to_owned()));
            }

            let expression_start = start + 2;
            let relative_end = source[expression_start..]
                .find("}}")
                .ok_or(ViewError::UnclosedExpression { offset: start })?;
            let end = expression_start + relative_end;
            let name = source[expression_start..end].trim();
            if name.is_empty() {
                return Err(ViewError::EmptyExpression { offset: start });
            }
            nodes.push(Node::EscapedValue(name.to_owned()));
            cursor = end + 2;
        }

        if cursor < source.len() {
            nodes.push(Node::Text(source[cursor..].to_owned()));
        }

        Ok(Self { nodes })
    }

    pub fn render<F>(&self, mut value: F) -> Result<String, ViewError>
    where
        F: FnMut(&str) -> Option<String>,
    {
        let mut output = String::new();
        for node in &self.nodes {
            match node {
                Node::Text(text) => output.push_str(text),
                Node::EscapedValue(name) => {
                    let raw = value(name)
                        .ok_or_else(|| ViewError::MissingValue { name: name.clone() })?;
                    output.push_str(&escape_html(&raw));
                }
            }
        }
        Ok(output)
    }
}

pub fn generate_rust(source: &str, function_name: &str) -> Result<String, ViewError> {
    let template = Template::compile(source)?;
    let mut generated = format!(
        "pub fn {function_name}<F>(mut value: F) -> crate::std::result::Result<crate::std::string::String, crate::feluqa::view::ViewError> where F: crate::std::ops::FnMut(&str) -> crate::std::option::Option<crate::std::string::String> {{\nlet mut output = crate::std::string::String::new();\n"
    );

    for node in &template.nodes {
        match node {
            Node::Text(text) => {
                generated.push_str(&format!("output.push_str({text:?});\n"));
            }
            Node::EscapedValue(name) => {
                generated.push_str(&format!(
                    "let rendered_value = value({name:?}).ok_or_else(|| crate::feluqa::view::ViewError::MissingValue {{ name: {{ let mut name = crate::std::string::String::new(); name.push_str({name:?}); name }} }})?;\ncrate::feluqa::view::append_escaped(&mut output, &rendered_value);\n"
                ));
            }
        }
    }

    generated.push_str("crate::std::result::Result::Ok(output)\n}\n");
    Ok(generated)
}

pub fn append_escaped(output: &mut String, value: &str) {
    output.push_str(&escape_html(value));
}

fn escape_html(value: &str) -> String {
    let mut escaped = String::with_capacity(value.len());
    for character in value.chars() {
        match character {
            '&' => escaped.push_str("&amp;"),
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            '"' => escaped.push_str("&quot;"),
            '\'' => escaped.push_str("&#39;"),
            other => escaped.push(other),
        }
    }
    escaped
}

pub fn render<F>(source: &str, value: F) -> Result<String, ViewError>
where
    F: FnMut(&str) -> Option<String>,
{
    Template::compile(source)?.render(value)
}

pub fn error_message(error: &ViewError) -> String {
    format!("{error}")
}
