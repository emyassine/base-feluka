//! Build-time compiler for trusted `.view.rs` templates.
//! Runtime applications only need the rendering primitives in the parent crate.
use crate::quote;
use crate::std;
use crate::syn;
mod emit;
mod parse;
mod scan;

use parse::Node;
use quote::ToTokens;
use std::clone::Clone;
use std::collections::{BTreeMap, BTreeSet};
use std::convert::{AsRef, From};
use std::error::Error;
use std::fmt;
use std::format;
use std::fs;
use std::iter::Iterator;
use std::option::Option::{self, None, Some};
use std::path::{Path, PathBuf};
use std::result::Result::{self, Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;
use std::write;

/// A source-localized compilation or filesystem diagnostic.
#[derive(Debug)]
pub struct Diagnostic {
    pub path: PathBuf,
    pub line: usize,
    pub column: usize,
    pub message: String,
}
impl fmt::Display for Diagnostic {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}:{}:{}: {}",
            self.path.display(),
            self.line,
            self.column,
            self.message
        )
    }
}
impl Error for Diagnostic {}

#[derive(Clone, PartialEq, Eq)]
struct Parameter {
    name: String,
    ty: String,
    default: Option<String>,
}
struct View {
    path: PathBuf,
    source: String,
    nodes: Vec<Node>,
    parameters: Vec<Parameter>,
}
impl View {
    fn error(&self, offset: usize, message: impl std::convert::Into<String>) -> Diagnostic {
        let prefix = &self.source[..offset];
        Diagnostic {
            path: self.path.clone(),
            line: prefix.bytes().filter(|byte| *byte == b'\n').count() + 1,
            column: prefix
                .rsplit('\n')
                .next()
                .map_or(1, |line| line.chars().count() + 1),
            message: message.into(),
        }
    }
}
struct Component {
    view: String,
    slots: Vec<String>,
}

/// Deterministic registry of declared namespaces, typed view parameters and entries.
pub struct Compiler {
    views: BTreeMap<String, View>,
    components: BTreeMap<String, Component>,
    entries: BTreeMap<String, String>,
    dependencies: BTreeSet<PathBuf>,
    runtime_path: String,
}

/// Original source location for a generated Rust line.
pub struct SourceMapping {
    pub generated_line: usize,
    pub path: PathBuf,
    pub line: usize,
    pub column: usize,
}
/// Rust source, dependency graph inputs, and an ordered source map.
pub struct Generated {
    pub rust: String,
    pub dependencies: Vec<PathBuf>,
    pub source_map: Vec<SourceMapping>,
}
impl Generated {
    /// Write the source map first, then atomically replace the generated Rust file.
    pub fn write_to(&self, path: &Path) -> Result<(), Diagnostic> {
        let mut map = String::new();
        for item in &self.source_map {
            map.push_str(&format!(
                "{}\t{:?}\t{}\t{}\n",
                item.generated_line, item.path, item.line, item.column
            ));
        }
        atomic_write(&path.with_extension("rs.map"), &map)?;
        atomic_write(path, &self.rust)
    }
}
fn atomic_write(path: &Path, source: &str) -> Result<(), Diagnostic> {
    use std::io::Write;
    use std::sync::atomic::{AtomicU64, Ordering};
    static NEXT: AtomicU64 = AtomicU64::new(0);
    let suffix = NEXT.fetch_add(1, Ordering::Relaxed);
    let temporary = path.with_extension(format!("tmp.{}.{suffix}", std::process::id()));
    let result = (|| {
        let mut file = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&temporary)?;
        file.write_all(source.as_bytes())?;
        file.sync_all()?;
        fs::rename(&temporary, path)
    })();
    if let Err(error) = result {
        let _cleanup = fs::remove_file(&temporary);
        return Err(io_error(path, error));
    }
    Ok(())
}
fn io_error(path: &Path, error: impl fmt::Display) -> Diagnostic {
    Diagnostic {
        path: path.to_path_buf(),
        line: 1,
        column: 1,
        message: error.to_string(),
    }
}
fn name_valid(name: &str) -> bool {
    let Some((namespace, local)) = name.split_once("::") else {
        return false;
    };
    !namespace.is_empty()
        && namespace
            .chars()
            .all(|ch| ch.is_ascii_alphanumeric() || ch == '_')
        && local.split('.').all(|part| {
            !part.is_empty()
                && part
                    .chars()
                    .all(|ch| ch.is_ascii_alphanumeric() || ch == '_' || ch == '-')
        })
}
fn parameters(source: &str) -> Result<Vec<Parameter>, String> {
    let function = syn::parse_str::<syn::ItemFn>(&format!("fn view({source}) {{}}"))
        .map_err(|error| format!("invalid view parameters: {error}"))?;
    let mut result = Vec::new();
    let mut names = BTreeSet::new();
    for parameter in &function.sig.inputs {
        let syn::FnArg::Typed(parameter) = parameter else {
            return Err(String::from("view parameters cannot contain self"));
        };
        let syn::Pat::Ident(pattern) = parameter.pat.as_ref() else {
            return Err(String::from("view parameters must be named identifiers"));
        };
        let name = pattern.ident.to_string();
        if pattern.subpat.is_some()
            || pattern.by_ref.is_some()
            || pattern.mutability.is_some()
            || name.starts_with("__feluqa_")
            || !names.insert(name.clone())
        {
            return Err(String::from(
                "duplicate, reserved, or destructured view parameter",
            ));
        }
        result.push(Parameter {
            name,
            ty: parameter.ty.to_token_stream().to_string(),
            default: None,
        });
    }
    Ok(result)
}
impl Compiler {
    pub fn new() -> Self {
        Self {
            views: BTreeMap::new(),
            components: BTreeMap::new(),
            entries: BTreeMap::new(),
            dependencies: BTreeSet::new(),
            runtime_path: String::from("::feluqa::view"),
        }
    }
    /// Override the absolute rendering facade path (useful for compiler consumers).
    pub fn runtime_path(&mut self, path: &str) -> Result<(), Diagnostic> {
        syn::parse_str::<syn::Path>(path)
            .map_err(|error| io_error(Path::new("<runtime-path>"), error))?;
        self.runtime_path = String::from(path);
        Ok(())
    }
    /// Register an in-memory source under a static namespaced ID.
    pub fn register(
        &mut self,
        name: &str,
        path: &Path,
        source: &str,
        signature: &str,
    ) -> Result<(), Diagnostic> {
        if !name_valid(name) {
            return Err(io_error(path, "invalid namespaced view ID"));
        }
        if self.views.contains_key(name) {
            return Err(io_error(path, format!("duplicate view `{name}`")));
        }
        let nodes = parse::parse(source).map_err(|error| {
            let view = View {
                path: path.to_path_buf(),
                source: String::from(source),
                nodes: Vec::new(),
                parameters: Vec::new(),
            };
            view.error(error.offset, error.message)
        })?;
        let parameters = parameters(signature).map_err(|message| io_error(path, message))?;
        self.views.insert(
            String::from(name),
            View {
                path: path.to_path_buf(),
                source: String::from(source),
                nodes,
                parameters,
            },
        );
        Ok(())
    }
    /// Recursively load a declared root. Symlinks, ambiguous names and duplicate IDs are rejected.
    /// Directory dependencies are retained so adding/removing an include triggers Cargo rebuilds.
    pub fn add_root(&mut self, namespace: &str, root: &Path) -> Result<(), Diagnostic> {
        if namespace.is_empty()
            || !namespace
                .chars()
                .all(|ch| ch.is_ascii_alphanumeric() || ch == '_')
        {
            return Err(io_error(root, "invalid namespace"));
        }
        let root = fs::canonicalize(root).map_err(|error| io_error(root, error))?;
        self.load_directory(namespace, &root, &root, 0)
    }
    fn load_directory(
        &mut self,
        namespace: &str,
        root: &Path,
        directory: &Path,
        depth: usize,
    ) -> Result<(), Diagnostic> {
        if depth > 128 {
            return Err(io_error(directory, "view directory nesting exceeds 128"));
        }
        self.dependencies.insert(directory.to_path_buf());
        let mut entries = fs::read_dir(directory)
            .map_err(|error| io_error(directory, error))?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|error| io_error(directory, error))?;
        entries.sort_by_key(std::fs::DirEntry::file_name);
        for entry in entries {
            let path = entry.path();
            let kind = entry.file_type().map_err(|error| io_error(&path, error))?;
            if kind.is_symlink() {
                return Err(io_error(
                    &path,
                    "symlinks are not permitted inside a declared view root",
                ));
            }
            if kind.is_dir() {
                self.load_directory(namespace, root, &path, depth + 1)?;
            } else if kind.is_file() && path.to_str().is_some_and(|name| name.ends_with(".view.rs"))
            {
                let relative = path
                    .strip_prefix(root)
                    .map_err(|error| io_error(&path, error))?;
                let relative = relative
                    .to_str()
                    .ok_or_else(|| io_error(&path, "view path must be UTF-8"))?;
                let stem = relative
                    .strip_suffix(".view.rs")
                    .ok_or_else(|| io_error(&path, "invalid view suffix"))?;
                let name = format!(
                    "{namespace}::{}",
                    stem.replace(std::path::MAIN_SEPARATOR, ".")
                );
                let source = fs::read_to_string(&path).map_err(|error| io_error(&path, error))?;
                self.register(&name, &path, &source, "")?;
                self.dependencies.insert(path);
            }
        }
        Ok(())
    }
    /// Declare the typed parameters of a loaded template.
    pub fn parameters(&mut self, name: &str, signature: &str) -> Result<(), Diagnostic> {
        let view = self
            .views
            .get_mut(name)
            .ok_or_else(|| io_error(Path::new(name), "unknown view"))?;
        view.parameters = parameters(signature).map_err(|message| view.error(0, message))?;
        Ok(())
    }
    /// Declare a default expression for an include/component prop.
    pub fn default_prop(
        &mut self,
        name: &str,
        prop: &str,
        expression: &str,
    ) -> Result<(), Diagnostic> {
        syn::parse_str::<syn::Expr>(expression)
            .map_err(|error| io_error(Path::new(name), error))?;
        let view = self
            .views
            .get_mut(name)
            .ok_or_else(|| io_error(Path::new(name), "unknown view"))?;
        let parameter = view
            .parameters
            .iter_mut()
            .find(|parameter| parameter.name == prop)
            .ok_or_else(|| io_error(Path::new(name), "unknown prop"))?;
        parameter.default = Some(String::from(expression));
        Ok(())
    }
    /// Register a component alias with a finite set of permitted slots.
    pub fn component(&mut self, name: &str, view: &str, slots: &[&str]) -> Result<(), Diagnostic> {
        if !name_valid(name) || !self.views.contains_key(view) {
            return Err(io_error(
                Path::new(view),
                "invalid component name or unknown view",
            ));
        }
        if self.components.contains_key(name)
            || self.components.values().any(|item| item.view == view)
        {
            return Err(io_error(
                Path::new(view),
                "duplicate component alias or backing view",
            ));
        }
        let mut names = BTreeSet::new();
        for slot in slots {
            if slot.is_empty() || !names.insert(*slot) {
                return Err(io_error(
                    Path::new(view),
                    "empty or duplicate component slot",
                ));
            }
        }
        self.components.insert(
            String::from(name),
            Component {
                view: String::from(view),
                slots: slots.iter().map(|name| String::from(*name)).collect(),
            },
        );
        Ok(())
    }
    /// Export a named rendering function with the registered entry's typed signature.
    pub fn entry(&mut self, function: &str, view: &str) -> Result<(), Diagnostic> {
        syn::parse_str::<syn::Ident>(function).map_err(|error| io_error(Path::new(view), error))?;
        if function.starts_with("__feluqa_")
            || self.entries.contains_key(function)
            || !self.views.contains_key(view)
        {
            return Err(io_error(
                Path::new(view),
                "invalid, duplicate or unresolved entry",
            ));
        }
        self.entries
            .insert(String::from(function), String::from(view));
        Ok(())
    }
    /// Resolve the graph and generate native Rust. No templates are evaluated here.
    pub fn generate(&self) -> Result<Generated, Diagnostic> {
        emit::generate(self)
    }
}

impl std::default::Default for Compiler {
    fn default() -> Self {
        Self::new()
    }
}
