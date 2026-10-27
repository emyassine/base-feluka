use super::parse::{Kind, Node};
use super::{Compiler, Diagnostic, Generated, SourceMapping, View, io_error};
use crate::std;
use crate::syn;
use std::clone::Clone;
use std::collections::{BTreeMap, BTreeSet};
use std::convert::From;
use std::format;
use std::iter::Iterator;
use std::matches;
use std::option::Option::{self, None, Some};
use std::path::Path;
use std::result::Result::{self, Err, Ok};
use std::string::String;
use std::vec::Vec;

type Sections<'a> = BTreeMap<String, (&'a View, &'a [Node])>;
fn symbol(name: &str) -> String {
    let mut result = String::from("__feluqa_view_");
    for byte in name.bytes() {
        result.push_str(&format!("{byte:02x}"));
    }
    result
}
fn signature(view: &View) -> String {
    view.parameters
        .iter()
        .map(|parameter| format!("{}: {}", parameter.name, parameter.ty))
        .collect::<Vec<_>>()
        .join(", ")
}
fn references<'a>(
    nodes: &'a [Node],
    compiler: &'a Compiler,
    view: &View,
    result: &mut Vec<(&'a str, usize)>,
) -> Result<(), Diagnostic> {
    for node in nodes {
        match &node.kind {
            Kind::Include { name, .. } | Kind::Extends(name) => result.push((name, node.offset)),
            Kind::Component { name, children, .. } => {
                if name != "slot" {
                    let component = compiler.components.get(name).ok_or_else(|| {
                        view.error(node.offset, format!("unregistered component `{name}`"))
                    })?;
                    result.push((&component.view, node.offset));
                }
                references(children, compiler, view, result)?;
            }
            Kind::If {
                branches,
                otherwise,
            } => {
                for (_, body) in branches {
                    references(body, compiler, view, result)?;
                }
                references(otherwise, compiler, view, result)?;
            }
            Kind::For { body, .. } | Kind::Section { body, .. } => {
                references(body, compiler, view, result)?
            }
            _ => {}
        }
    }
    Ok(())
}
fn graph(
    name: &str,
    compiler: &Compiler,
    visiting: &mut Vec<String>,
    visited: &mut BTreeSet<String>,
) -> Result<(), Diagnostic> {
    if visited.contains(name) {
        return Ok(());
    }
    let view = compiler
        .views
        .get(name)
        .ok_or_else(|| io_error(Path::new(name), "unknown view"))?;
    if visiting.iter().any(|item| item == name) {
        return Err(view.error(
            0,
            format!("view dependency cycle: {} -> {name}", visiting.join(" -> ")),
        ));
    }
    if visiting.len() >= 128 {
        return Err(view.error(0, "view dependency depth exceeds 128"));
    }
    visiting.push(String::from(name));
    let mut refs = Vec::new();
    references(&view.nodes, compiler, view, &mut refs)?;
    for (target, offset) in refs {
        if !compiler.views.contains_key(target) {
            return Err(view.error(offset, format!("unresolved view `{target}`")));
        }
        graph(target, compiler, visiting, visited)?;
    }
    visiting.pop();
    visited.insert(String::from(name));
    Ok(())
}

pub(super) fn generate(compiler: &Compiler) -> Result<Generated, Diagnostic> {
    let mut checked = BTreeSet::new();
    for name in compiler.views.keys() {
        graph(name, compiler, &mut Vec::new(), &mut checked)?;
    }
    let mut emitter = Emitter {
        compiler,
        code: String::new(),
        line: 1,
        maps: Vec::new(),
        next: 0,
        pending: compiler.entries.values().cloned().collect(),
        completed: BTreeSet::new(),
        depth: 0,
    };
    for (function, name) in &compiler.entries {
        let view = compiler
            .views
            .get(name)
            .ok_or_else(|| io_error(Path::new(name), "unresolved entry"))?;
        if compiler.components.values().any(|item| item.view == *name) {
            return Err(view.error(0, "a component cannot be exported without its slots"));
        }
        let arguments = view
            .parameters
            .iter()
            .map(|param| param.name.as_str())
            .collect::<Vec<_>>()
            .join(", ");
        let runtime = &compiler.runtime_path;
        emitter.push(&format!(
            "pub fn {function}({}) -> {runtime}::RenderResult {{\nlet mut __feluqa_output = {runtime}::Output::new();\n{}(&mut __feluqa_output, {arguments})?;\n{runtime}::RenderResult::Ok(__feluqa_output)\n}}\n",
            signature(view), symbol(name)
        ));
    }
    while let Some(name) = emitter.pending.pop_first() {
        if !emitter.completed.insert(name.clone()) {
            continue;
        }
        let view = compiler
            .views
            .get(&name)
            .ok_or_else(|| io_error(Path::new(&name), "unknown view"))?;
        let component = compiler
            .components
            .values()
            .find(|component| component.view == name);
        let mut params = signature(view);
        if component.is_some() {
            if !params.is_empty() {
                params.push_str(", ");
            }
            params.push_str(&format!(
                "__feluqa_slots: &mut [&mut {}::Slot<'_>]",
                compiler.runtime_path
            ));
        }
        emitter.push(&format!(
            "fn {}(__feluqa_output: &mut {}::Output, {params}) -> {}::RenderResult<()> {{\n",
            symbol(&name),
            compiler.runtime_path,
            compiler.runtime_path
        ));
        let mut sections = Sections::new();
        let effective = emitter.layout(&name, &mut sections)?;
        emitter.nodes(
            effective,
            &effective.nodes,
            "__feluqa_output",
            &sections,
            component.map(|item| item.slots.as_slice()),
        )?;
        emitter.push(&format!(
            "{}::RenderResult::Ok(())\n}}\n",
            compiler.runtime_path
        ));
    }
    // Syntax-check the full generated module before handing it to rustc.
    syn::parse_file(&emitter.code).map_err(|error| {
        io_error(
            Path::new("<generated-views>"),
            format!("invalid generated Rust: {error}"),
        )
    })?;
    Ok(Generated {
        rust: emitter.code,
        source_map: emitter.maps,
        dependencies: compiler.dependencies.iter().cloned().collect(),
    })
}
struct Emitter<'a> {
    compiler: &'a Compiler,
    code: String,
    line: usize,
    maps: Vec<SourceMapping>,
    next: usize,
    pending: BTreeSet<String>,
    completed: BTreeSet<String>,
    depth: usize,
}
impl<'a> Emitter<'a> {
    fn push(&mut self, code: &str) {
        self.line += code.bytes().filter(|byte| *byte == b'\n').count();
        self.code.push_str(code);
    }
    fn mark(&mut self, view: &View, offset: usize) {
        let location = view.error(offset, "");
        self.push(&format!(
            "// view {:?}:{}:{}\n",
            location.path, location.line, location.column
        ));
        self.maps.push(SourceMapping {
            generated_line: self.line,
            path: location.path,
            line: location.line,
            column: location.column,
        });
    }
    fn layout(&self, name: &str, sections: &mut Sections<'a>) -> Result<&'a View, Diagnostic> {
        let view = self
            .compiler
            .views
            .get(name)
            .ok_or_else(|| io_error(Path::new(name), "unknown view"))?;
        let parents = view
            .nodes
            .iter()
            .filter_map(|node| match &node.kind {
                Kind::Extends(name) => Some((name, node.offset)),
                _ => None,
            })
            .collect::<Vec<_>>();
        if parents.len() > 1 {
            return Err(view.error(parents[1].1, "a view may extend only one layout"));
        }
        if let Some((parent, offset)) = parents.first() {
            let mut local = BTreeSet::new();
            for node in &view.nodes {
                match &node.kind {
                    Kind::Extends(_) => {}
                    Kind::Text(text) if text.trim().is_empty() => {}
                    Kind::Section { name, body } => {
                        if !local.insert(name) {
                            return Err(
                                view.error(node.offset, format!("duplicate section `{name}`"))
                            );
                        }
                        sections.entry(name.clone()).or_insert((view, body));
                    }
                    _ => {
                        return Err(view.error(
                            node.offset,
                            "an extending view may contain only sections and whitespace",
                        ));
                    }
                }
            }
            let parent_view = self
                .compiler
                .views
                .get(*parent)
                .ok_or_else(|| view.error(*offset, "unknown layout"))?;
            if view
                .parameters
                .iter()
                .map(|item| (&item.name, &item.ty))
                .collect::<Vec<_>>()
                != parent_view
                    .parameters
                    .iter()
                    .map(|item| (&item.name, &item.ty))
                    .collect::<Vec<_>>()
            {
                return Err(view.error(
                    *offset,
                    "layout and child must declare identical typed parameters",
                ));
            }
            return self.layout(parent, sections);
        }
        Ok(view)
    }
    fn arguments(
        &self,
        caller: &View,
        node: &Node,
        target: &View,
        arguments: &[(String, String)],
    ) -> Result<String, Diagnostic> {
        let mut names = BTreeSet::new();
        for (name, _) in arguments {
            if !names.insert(name) {
                return Err(caller.error(node.offset, format!("duplicate prop `{name}`")));
            }
            if !target
                .parameters
                .iter()
                .any(|parameter| parameter.name == *name)
            {
                return Err(caller.error(node.offset, format!("unknown prop `{name}`")));
            }
        }
        let mut values = Vec::new();
        for parameter in &target.parameters {
            let value = arguments
                .iter()
                .find(|(name, _)| *name == parameter.name)
                .map(|(_, value)| value)
                .or(parameter.default.as_ref())
                .ok_or_else(|| {
                    caller.error(
                        node.offset,
                        format!("missing required prop `{}`", parameter.name),
                    )
                })?;
            values.push(value.clone());
        }
        Ok(values.join(", "))
    }
    fn nodes(
        &mut self,
        view: &'a View,
        nodes: &'a [Node],
        output: &str,
        sections: &Sections<'a>,
        slots: Option<&[String]>,
    ) -> Result<(), Diagnostic> {
        self.depth += 1;
        if self.depth > 128 {
            return Err(view.error(0, "view/section expansion exceeds 128 levels"));
        }
        let runtime = &self.compiler.runtime_path;
        for node in nodes {
            self.mark(view, node.offset);
            match &node.kind {
                Kind::Text(text) => {
                    let mut characters = text.chars();
                    match (characters.next(), characters.next()) {
                        (Some(character), None) => {
                            self.push(&format!("({output}).push({character:?});\n"));
                        }
                        _ => self.push(&format!("({output}).push_str({text:?});\n")),
                    }
                }
                Kind::Echo { expression, raw } => {
                    if *raw {
                        self.push(&format!(
                            "{runtime}::write_trusted({output}, &({expression}));\n"
                        ));
                    } else {
                        self.push(&format!(
                            "{runtime}::write_escaped({output}, &({expression}))?;\n"
                        ));
                    }
                }
                Kind::Rust(code) => {
                    self.push(code);
                    self.push("\n");
                }
                Kind::If {
                    branches,
                    otherwise,
                } => {
                    for (index, (condition, body)) in branches.iter().enumerate() {
                        self.push(&format!(
                            "{}if {condition} {{\n",
                            if index == 0 { "" } else { "else " }
                        ));
                        self.nodes(view, body, output, sections, slots)?;
                        self.push("}\n");
                    }
                    if !otherwise.is_empty() {
                        self.push("else {\n");
                        self.nodes(view, otherwise, output, sections, slots)?;
                        self.push("}\n");
                    }
                }
                Kind::For { header, body } => {
                    self.push(&format!("for {header} {{\n"));
                    self.nodes(view, body, output, sections, slots)?;
                    self.push("}\n");
                }
                Kind::Include { name, arguments } => {
                    let target = self
                        .compiler
                        .views
                        .get(name)
                        .ok_or_else(|| view.error(node.offset, "unknown include"))?;
                    if self
                        .compiler
                        .components
                        .values()
                        .any(|item| item.view == *name)
                    {
                        return Err(view.error(node.offset, "use component syntax to supply slots"));
                    }
                    let arguments = self.arguments(view, node, target, arguments)?;
                    self.pending.insert(name.clone());
                    self.push(&format!("{}({output}, {arguments})?;\n", symbol(name)));
                }
                Kind::Yield(name) => {
                    if let Some(slots) = slots {
                        let index =
                            slots.iter().position(|slot| slot == name).ok_or_else(|| {
                                view.error(node.offset, format!("undeclared slot `{name}`"))
                            })?;
                        self.push(&format!("(__feluqa_slots[{index}])({output})?;\n"));
                    } else if let Some((owner, content)) = sections.get(name) {
                        self.push("{\n");
                        self.nodes(owner, content, output, sections, None)?;
                        self.push("}\n");
                    }
                }
                Kind::Extends(_) | Kind::Section { .. } => {
                    return Err(view.error(
                        node.offset,
                        "layout directives are only valid at the root of an extending view",
                    ));
                }
                Kind::Component {
                    name,
                    arguments,
                    children,
                } => {
                    if name == "slot" {
                        return Err(view.error(
                            node.offset,
                            "named slots must be direct children of a component",
                        ));
                    }
                    let component = self
                        .compiler
                        .components
                        .get(name)
                        .ok_or_else(|| view.error(node.offset, "unknown component"))?;
                    let target = self
                        .compiler
                        .views
                        .get(&component.view)
                        .ok_or_else(|| view.error(node.offset, "unknown component view"))?;
                    let arguments = self.arguments(view, node, target, arguments)?;
                    let mut content: BTreeMap<String, Vec<&Node>> = BTreeMap::new();
                    let mut explicit = BTreeSet::new();
                    for child in children {
                        if let Kind::Component {
                            name,
                            arguments,
                            children,
                        } = &child.kind
                        {
                            if name == "slot" {
                                if arguments.len() != 1 || arguments[0].0 != "name" {
                                    return Err(view.error(
                                        child.offset,
                                        "a named slot requires only a static name attribute",
                                    ));
                                }
                                let slot = syn::parse_str::<syn::LitStr>(&arguments[0].1)
                                    .map_err(|error| {
                                        view.error(
                                            child.offset,
                                            format!("slot name must be static: {error}"),
                                        )
                                    })?
                                    .value();
                                if !component.slots.contains(&slot)
                                    || !explicit.insert(slot.clone())
                                {
                                    return Err(view.error(
                                        child.offset,
                                        format!("unknown or duplicate slot `{slot}`"),
                                    ));
                                }
                                if slot == "default" && content.get("default").is_some_and(|nodes| nodes.iter().any(|node| !matches!(&node.kind, Kind::Text(text) if text.trim().is_empty()))) {
                                    return Err(view.error(child.offset, "default slot cannot mix named and unnamed content"));
                                }
                                content.insert(slot, children.iter().collect());
                                continue;
                            }
                        }
                        if !component.slots.iter().any(|name| name == "default") {
                            if let Kind::Text(text) = &child.kind {
                                if text.trim().is_empty() {
                                    continue;
                                }
                            }
                            return Err(view
                                .error(child.offset, "component does not declare a default slot"));
                        }
                        if explicit.contains("default")
                            && !matches!(&child.kind, Kind::Text(text) if text.trim().is_empty())
                        {
                            return Err(view.error(
                                child.offset,
                                "default slot cannot mix named and unnamed content",
                            ));
                        }
                        content
                            .entry(String::from("default"))
                            .or_default()
                            .push(child);
                    }
                    let id = self.next;
                    self.next += 1;
                    self.push("{\n");
                    for (index, slot) in component.slots.iter().enumerate() {
                        self.push(&format!("let mut __feluqa_slot_{id}_{index} = |__feluqa_slot_output: &mut {runtime}::Output| -> {runtime}::RenderResult<()> {{\n"));
                        if let Some(nodes) = content.get(slot) {
                            for node in nodes {
                                self.nodes(
                                    view,
                                    std::slice::from_ref(*node),
                                    "__feluqa_slot_output",
                                    sections,
                                    slots,
                                )?;
                            }
                        }
                        self.push(&format!("{runtime}::RenderResult::Ok(())\n}};\n"));
                    }
                    let closures = component
                        .slots
                        .iter()
                        .enumerate()
                        .map(|(index, _)| {
                            format!("&mut __feluqa_slot_{id}_{index} as &mut {runtime}::Slot<'_>")
                        })
                        .collect::<Vec<_>>()
                        .join(", ");
                    self.push(&format!(
                        "{}({output}, {arguments}{}&mut [{closures}])?;\n}}\n",
                        symbol(&component.view),
                        if arguments.is_empty() { "" } else { ", " }
                    ));
                    self.pending.insert(component.view.clone());
                }
            }
        }
        self.depth -= 1;
        Ok(())
    }
}
