use super::scan;
use crate::quote;
use crate::std;
use crate::syn;
use quote::ToTokens;
use std::clone::Clone;
use std::convert::{AsRef, From};
use std::format;
use std::iter::Iterator;
use std::option::Option::{None, Some};
use std::result::Result::{self, Err, Ok};
use std::string::{String, ToString};
use std::vec;
use std::vec::Vec;
use syn::parse::Parser as SynParser;

#[derive(Clone, Debug)]
pub(super) struct Node {
    pub offset: usize,
    pub kind: Kind,
}
#[derive(Clone, Debug)]
pub(super) enum Kind {
    Text(String),
    Echo {
        expression: String,
        raw: bool,
        url: bool,
    },
    Rust(String),
    If {
        branches: Vec<(String, Vec<Node>)>,
        otherwise: Vec<Node>,
    },
    For {
        header: String,
        body: Vec<Node>,
    },
    Include {
        name: String,
        arguments: Vec<(String, String)>,
    },
    Extends(String),
    Section {
        name: String,
        body: Vec<Node>,
    },
    Yield(String),
    Component {
        name: String,
        arguments: Vec<(String, String)>,
        children: Vec<Node>,
    },
}
#[derive(Debug)]
pub(super) struct ParseError {
    pub offset: usize,
    pub message: String,
}
struct Parser<'a> {
    source: &'a str,
    cursor: usize,
    depth: usize,
    html: String,
    quote: std::option::Option<char>,
    quote_start: usize,
}

pub(super) fn parse(source: &str) -> Result<Vec<Node>, ParseError> {
    Parser {
        source,
        cursor: 0,
        depth: 0,
        html: String::new(),
        quote: None,
        quote_start: 0,
    }
    .sequence(&[])
}

impl Parser<'_> {
    fn error(&self, message: impl std::convert::Into<String>) -> ParseError {
        ParseError {
            offset: self.cursor,
            message: message.into(),
        }
    }
    fn at(&self, directive: &str) -> bool {
        let tail = &self.source[self.cursor..];
        tail.starts_with(directive)
            && !(tail[directive.len()..].starts_with('.')
                && self.source[..self.cursor].ends_with(|ch: char| ch.is_ascii_alphanumeric()))
            && !tail[directive.len()..].starts_with(|ch: char| ch.is_alphanumeric() || ch == '_')
    }
    fn whitespace(&mut self) {
        while let Some(ch) = self.source[self.cursor..].chars().next() {
            if !ch.is_whitespace() {
                break;
            }
            self.cursor += ch.len_utf8();
        }
    }
    fn call(&mut self) -> Result<String, ParseError> {
        self.whitespace();
        if !self.source[self.cursor..].starts_with('(') {
            return Err(self.error("expected `(`"));
        }
        self.cursor += 1;
        let end =
            scan::end(self.source, self.cursor, ")").map_err(|message| self.error(message))?;
        let content = String::from(&self.source[self.cursor..end]);
        self.cursor = end + 1;
        Ok(content)
    }
    fn name_call(&mut self) -> Result<String, ParseError> {
        let call = self.call()?;
        syn::parse_str::<syn::LitStr>(&call)
            .map(|literal| literal.value())
            .map_err(|error| self.error(format!("expected a static quoted name: {error}")))
    }
    fn expression(&self, source: &str) -> Result<(), ParseError> {
        syn::parse_str::<syn::Expr>(source)
            .map(|_| ())
            .map_err(|error| self.error(format!("invalid Rust expression: {error}")))
    }
    fn stop(&mut self, directive: &str) -> Result<(), ParseError> {
        if !self.at(directive) {
            return Err(self.error(format!("missing `{directive}`")));
        }
        self.cursor += directive.len();
        Ok(())
    }
    fn sequence(&mut self, stops: &[&str]) -> Result<Vec<Node>, ParseError> {
        if self.depth >= 128 {
            return Err(self.error("template nesting exceeds 128 levels"));
        }
        self.depth += 1;
        let mut nodes = Vec::new();
        let mut text = String::new();
        let mut text_start = self.cursor;
        while self.cursor < self.source.len() {
            if stops.iter().any(|stop| {
                if stop.starts_with('<') {
                    self.source[self.cursor..].starts_with(stop)
                } else {
                    self.at(stop)
                }
            }) {
                break;
            }
            let offset = self.cursor;
            let tail = &self.source[self.cursor..];
            let mut special = None;
            if tail.starts_with("@@") {
                self.html_char('@');
                text.push('@');
                self.cursor += 2;
                continue;
            }
            if tail.starts_with("{{--") {
                let end = tail
                    .find("--}}")
                    .ok_or_else(|| self.error("unclosed template comment"))?;
                self.cursor += end + 4;
                continue;
            }
            if tail.starts_with("{{") || tail.starts_with("{!!") {
                let raw = tail.starts_with("{!!");
                let url = self.check_html_context(raw)?;
                self.cursor += if raw { 3 } else { 2 };
                let terminator = if raw { "!!}" } else { "}}" };
                let end = scan::end(self.source, self.cursor, terminator)
                    .map_err(|message| self.error(message))?;
                let expression = self.source[self.cursor..end].trim().to_string();
                self.expression(&expression)?;
                self.cursor = end + terminator.len();
                special = Some(Kind::Echo {
                    expression,
                    raw,
                    url,
                });
            } else if tail.starts_with("<x-") {
                if !self.html.is_empty() {
                    return Err(
                        self.error("components cannot be placed inside HTML tags or attributes")
                    );
                }
                special = Some(self.component()?);
            } else if tail.starts_with("</x-") {
                return Err(self.error("unexpected component closing tag"));
            } else if self.at("@rs") {
                self.cursor += 3;
                let end = scan::end(self.source, self.cursor, "@endrs")
                    .map_err(|message| self.error(message))?;
                let rust = String::from(&self.source[self.cursor..end]);
                syn::parse_str::<syn::Block>(&format!("{{{rust}}}"))
                    .map_err(|error| self.error(format!("invalid @rs block: {error}")))?;
                self.cursor = end + 6;
                special = Some(Kind::Rust(rust));
            } else if self.at("@if") {
                self.cursor += 3;
                let condition = self.call()?;
                self.expression(&condition)?;
                let body = self.sequence(&["@elseif", "@else", "@endif"])?;
                let mut branches = vec![(condition, body)];
                while self.at("@elseif") {
                    self.cursor += 7;
                    let condition = self.call()?;
                    self.expression(&condition)?;
                    branches.push((condition, self.sequence(&["@elseif", "@else", "@endif"])?));
                }
                let otherwise = if self.at("@else") {
                    self.cursor += 5;
                    self.sequence(&["@endif"])?
                } else {
                    Vec::new()
                };
                self.stop("@endif")?;
                special = Some(Kind::If {
                    branches,
                    otherwise,
                });
            } else if self.at("@foreach") {
                self.cursor += 8;
                let header = self.call()?;
                syn::parse_str::<syn::ExprForLoop>(&format!("for {header} {{}}"))
                    .map_err(|error| self.error(format!("invalid loop: {error}")))?;
                let body = self.sequence(&["@endforeach"])?;
                self.stop("@endforeach")?;
                special = Some(Kind::For { header, body });
            } else if self.at("@include") {
                self.cursor += 8;
                let call = self.call()?;
                let list =
                    syn::punctuated::Punctuated::<syn::Expr, syn::Token![,]>::parse_terminated
                        .parse_str(&call)
                        .map_err(|error| self.error(format!("invalid include: {error}")))?;
                let mut items = list.iter();
                let name = match items.next() {
                    Some(syn::Expr::Lit(syn::ExprLit {
                        lit: syn::Lit::Str(value),
                        ..
                    })) => value.value(),
                    _ => return Err(self.error("include requires a static quoted view name")),
                };
                let mut arguments = Vec::new();
                for item in items {
                    match item {
                        syn::Expr::Assign(value) => {
                            let name = match value.left.as_ref() {
                                syn::Expr::Path(path) => {
                                    path.path.get_ident().map(ToString::to_string)
                                }
                                _ => None,
                            }
                            .ok_or_else(|| {
                                self.error("include argument must be `name = expression`")
                            })?;
                            arguments.push((name, value.right.to_token_stream().to_string()));
                        }
                        _ => return Err(self.error("include argument must be `name = expression`")),
                    }
                }
                special = Some(Kind::Include { name, arguments });
            } else if self.at("@extends") {
                self.cursor += 8;
                special = Some(Kind::Extends(self.name_call()?));
            } else if self.at("@section") {
                self.cursor += 8;
                let name = self.name_call()?;
                let body = self.sequence(&["@endsection"])?;
                self.stop("@endsection")?;
                special = Some(Kind::Section { name, body });
            } else if self.at("@yield") {
                self.cursor += 6;
                special = Some(Kind::Yield(self.name_call()?));
            } else if [
                "@endif",
                "@else",
                "@elseif",
                "@endforeach",
                "@endsection",
                "@endrs",
            ]
            .iter()
            .any(|word| self.at(word))
            {
                return Err(self.error("unexpected closing or branch directive"));
            } else if [
                "@php",
                "@endphp",
                "@forelse",
                "@empty",
                "@endforelse",
                "@push",
                "@stack",
                "@once",
                "@auth",
                "@guest",
                "@can",
            ]
            .iter()
            .any(|word| self.at(word))
            {
                return Err(self.error("directive is not supported by this language version"));
            } else {
                let raw_element = ["script", "style"].iter().find(|name| {
                    let opening = format!("<{name}");
                    tail.get(..opening.len())
                        .is_some_and(|prefix| prefix.eq_ignore_ascii_case(&opening))
                        && tail[opening.len()..]
                            .starts_with(|ch: char| ch == '>' || ch.is_ascii_whitespace())
                });
                if let Some(name) = raw_element {
                    let closing = format!("</{name}>");
                    let lower_tail = tail.to_ascii_lowercase();
                    let end = lower_tail
                        .find(&closing)
                        .ok_or_else(|| self.error("unclosed script/style element"))?
                        + closing.len();
                    let chunk = &tail[..end];
                    if chunk.contains("{{") || chunk.contains("{!!") || chunk.contains("@rs") {
                        return Err(self.error("interpolation in script/style requires a dedicated encoder and is not permitted"));
                    }
                    text.push_str(chunk);
                    self.cursor += end;
                    continue;
                }
            }
            if let Some(kind) = special {
                if !text.is_empty() {
                    nodes.push(Node {
                        offset: text_start,
                        kind: Kind::Text(std::mem::take(&mut text)),
                    });
                }
                nodes.push(Node { offset, kind });
                text_start = self.cursor;
            } else if let Some(character) = self.source[self.cursor..].chars().next() {
                self.html_char(character);
                text.push(character);
                self.cursor += character.len_utf8();
            }
        }
        if !text.is_empty() {
            nodes.push(Node {
                offset: text_start,
                kind: Kind::Text(text),
            });
        }
        self.depth -= 1;
        Ok(nodes)
    }
    fn html_char(&mut self, character: char) {
        if self.html.is_empty() {
            if character == '<' {
                self.html.push(character);
            }
            return;
        }
        self.html.push(character);
        if self.html.starts_with("<!--") {
            if self.html.ends_with("-->") {
                self.html.clear();
            }
            return;
        }
        if let Some(quote) = self.quote {
            if character == quote {
                self.quote = None;
            }
        } else if character == '\'' || character == '"' {
            self.quote = Some(character);
            self.quote_start = self.html.len() - 1;
        } else if character == '>' {
            self.html.clear();
        }
    }
    fn check_html_context(&self, raw: bool) -> Result<bool, ParseError> {
        if self.html.is_empty() {
            return Ok(false);
        }
        if raw || self.quote.is_none() || self.html.starts_with("<!--") {
            return Err(self.error("HTML attribute interpolation must be quoted and escaped; tag names and comments cannot be interpolated"));
        }
        let before = self.html[..self.quote_start].trim_end();
        let attribute = before
            .strip_suffix('=')
            .unwrap_or("")
            .split_whitespace()
            .last()
            .unwrap_or("")
            .to_ascii_lowercase();
        if ["href", "src", "action", "formaction", "cite", "poster"].contains(&attribute.as_str()) {
            return Ok(true);
        }
        if ![
            "id",
            "class",
            "title",
            "alt",
            "role",
            "name",
            "value",
            "placeholder",
        ]
        .contains(&attribute.as_str())
            && !attribute.starts_with("aria-")
            && !attribute.starts_with("data-")
        {
            return Err(self.error("this attribute needs a dedicated URL/script/style policy; generic interpolation is forbidden"));
        }
        Ok(false)
    }
    fn component(&mut self) -> Result<Kind, ParseError> {
        self.cursor += 3;
        let start = self.cursor;
        while self.source[self.cursor..]
            .starts_with(|ch: char| ch.is_ascii_alphanumeric() || "_:.-".contains(ch))
        {
            self.cursor += 1;
        }
        let name = String::from(&self.source[start..self.cursor]);
        if name.is_empty() {
            return Err(self.error("empty component name"));
        }
        let mut arguments = Vec::new();
        loop {
            self.whitespace();
            if self.source[self.cursor..].starts_with("/>") {
                self.cursor += 2;
                return Ok(Kind::Component {
                    name,
                    arguments,
                    children: Vec::new(),
                });
            }
            if self.source[self.cursor..].starts_with('>') {
                self.cursor += 1;
                break;
            }
            let start = self.cursor;
            while self.source[self.cursor..]
                .starts_with(|ch: char| ch.is_ascii_alphanumeric() || "_:.-".contains(ch))
            {
                self.cursor += 1;
            }
            if start == self.cursor {
                return Err(self.error("expected component attribute or closing bracket"));
            }
            let attribute = String::from(&self.source[start..self.cursor]);
            self.whitespace();
            let value = if self.source[self.cursor..].starts_with('=') {
                self.cursor += 1;
                self.whitespace();
                let quote = self.source[self.cursor..]
                    .chars()
                    .next()
                    .ok_or_else(|| self.error("missing attribute value"))?;
                if quote != '"' && quote != '\'' {
                    return Err(self.error("component attribute values must be quoted"));
                }
                self.cursor += 1;
                let end = self.source[self.cursor..]
                    .find(quote)
                    .ok_or_else(|| self.error("unclosed component attribute"))?
                    + self.cursor;
                let value = self.source[self.cursor..end]
                    .replace("&quot;", "\"")
                    .replace("&#39;", "'")
                    .replace("&lt;", "<")
                    .replace("&gt;", ">")
                    .replace("&amp;", "&");
                self.cursor = end + 1;
                if attribute.starts_with(':') {
                    self.expression(&value)?;
                    value
                } else {
                    format!("{value:?}")
                }
            } else {
                if attribute.starts_with(':') {
                    return Err(self.error("bound attribute requires a value"));
                }
                String::from("true")
            };
            arguments.push((attribute.trim_start_matches(':').to_string(), value));
        }
        let closing = format!("</x-{name}");
        let children = self.sequence(&[&closing])?;
        if !self.source[self.cursor..].starts_with(&closing) {
            return Err(self.error(format!("missing `{closing}>`")));
        }
        self.cursor += closing.len();
        self.whitespace();
        if !self.source[self.cursor..].starts_with('>') {
            return Err(self.error("mismatched component closing tag"));
        }
        self.cursor += 1;
        Ok(Kind::Component {
            name,
            arguments,
            children,
        })
    }
}
