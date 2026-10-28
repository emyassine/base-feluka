#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Deterministic source discovery and validation for Feluqa build scripts.

extern crate core;
extern crate std;
extern crate syn;

use crate::core::fmt;
use crate::std::clone::Clone;
use crate::std::cmp::Ord;
use crate::std::collections::BTreeSet;
use crate::std::convert::{AsRef, From};
use crate::std::default::Default;
use crate::std::fs;
use crate::std::io;
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::{Path, PathBuf};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};
use crate::std::vec::Vec;
use crate::std::write;
use crate::syn::punctuated::Punctuated;
use crate::syn::{Attribute, Expr, Item, Lit, Meta, Token};

/// One declaration discovered below `src/panels` or `src/modules`.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Declaration {
    /// Kind of declaration, such as `panel`, `resource`, `gate` or `config`.
    pub kind: String,
    /// Source path relative to the application root.
    pub source: String,
    /// Enclosing module ID derived from its directory, when inside `src/modules`.
    pub module: Option<String>,
    /// Rust item name carrying the declaration.
    pub item: String,
    /// Explicit stable identifier from the attribute, if present.
    pub id: Option<String>,
    /// Explicit panel or resource slug from the attribute, if present.
    pub slug: Option<String>,
    /// Declared panel reference, if present.
    pub panel: Option<String>,
}

/// Validated declarations found in one application source tree.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct ApplicationScan {
    /// Deterministically sorted declarations.
    pub declarations: Vec<Declaration>,
}

/// Compile-time source discovery and validation error.
#[derive(Debug)]
pub enum ScanError {
    /// Filesystem access failed.
    Io(io::Error),
    /// Rust source could not be parsed.
    Syntax {
        /// Source file that contains invalid Rust syntax.
        path: PathBuf,
        /// Parser diagnostic.
        message: String,
    },
    /// A declaration is ambiguous or invalid.
    Invalid {
        /// Source file containing the invalid declaration.
        path: PathBuf,
        /// Scanner validation diagnostic.
        message: String,
    },
}

impl fmt::Display for ScanError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Io(error) => write!(formatter, "source scan failed: {error}"),
            Self::Syntax { path, message } => {
                write!(formatter, "cannot parse {}: {message}", path.display())
            }
            Self::Invalid { path, message } => {
                write!(
                    formatter,
                    "invalid declaration in {}: {message}",
                    path.display()
                )
            }
        }
    }
}

impl core::error::Error for ScanError {}

impl From<io::Error> for ScanError {
    fn from(error: io::Error) -> Self {
        Self::Io(error)
    }
}

/// Scan conventional panel and module source roots and validate declarations.
pub fn scan_application(root: impl AsRef<Path>) -> Result<ApplicationScan, ScanError> {
    let root = root.as_ref();
    let source_root = root.join("src");
    let mut files = Vec::new();
    for directory in [source_root.join("panels"), source_root.join("modules")] {
        if directory.is_dir() {
            collect_rust_files(&directory, &mut files)?;
        }
    }
    files.sort();

    let mut scan = ApplicationScan::default();
    for path in files {
        let source = fs::read_to_string(&path)?;
        let syntax = syn::parse_file(&source).map_err(|error| ScanError::Syntax {
            path: path.clone(),
            message: error.to_string(),
        })?;
        let relative = path
            .strip_prefix(root)
            .unwrap_or(path.as_path())
            .to_string_lossy()
            .replace('\\', "/");
        let module = module_id(&source_root, &path);
        collect_items(
            &syntax.items,
            &path,
            &relative,
            module.as_deref(),
            &mut scan,
        )?;
    }
    scan.validate(root)?;
    scan.declarations.sort_by(|left, right| {
        (&left.source, &left.kind, &left.item).cmp(&(&right.source, &right.kind, &right.item))
    });
    Ok(scan)
}

impl ApplicationScan {
    /// Validate duplicate identities, panel references, permission docs and write gates.
    pub fn validate(&self, root: impl AsRef<Path>) -> Result<(), ScanError> {
        let root = root.as_ref();
        let mut panels = BTreeSet::new();
        let mut resources = BTreeSet::new();
        let mut slugs = BTreeSet::new();

        for declaration in &self.declarations {
            let path = root.join(&declaration.source);
            match declaration.kind.as_str() {
                "panel" => {
                    let id = declaration.id.as_deref().unwrap_or(&declaration.item);
                    if !panels.insert(String::from(id)) {
                        return Err(invalid(
                            &path,
                            crate::std::format!("duplicate panel ID `{id}`"),
                        ));
                    }
                }
                "resource" => {
                    let module = declaration.module.as_deref().unwrap_or("application");
                    let id = crate::std::format!("{module}::{}", declaration.item);
                    if !resources.insert(id.clone()) {
                        return Err(invalid(
                            &path,
                            crate::std::format!("duplicate resource `{id}`"),
                        ));
                    }
                    if let Some(slug) = &declaration.slug {
                        let panel = declaration.panel.as_deref().unwrap_or("default");
                        let key = crate::std::format!("{panel}/{slug}");
                        if !slugs.insert(key.clone()) {
                            return Err(invalid(
                                &path,
                                crate::std::format!("duplicate panel slug `{key}`"),
                            ));
                        }
                    }
                }
                _ => {}
            }
        }

        for declaration in &self.declarations {
            if declaration.kind == "resource" {
                if let Some(panel) = &declaration.panel {
                    if !panels.contains(panel) {
                        return Err(invalid(
                            &root.join(&declaration.source),
                            crate::std::format!("resource refers to undeclared panel `{panel}`"),
                        ));
                    }
                }
            }
        }
        Ok(())
    }

    /// Render a stable TOML summary for build tooling and generated documentation.
    pub fn to_toml(&self) -> String {
        let mut output = String::from("schema_version = 1\n\n");
        for declaration in &self.declarations {
            output.push_str("[[declaration]]\n");
            append_toml(&mut output, "kind", &declaration.kind);
            append_toml(&mut output, "source", &declaration.source);
            append_toml(&mut output, "item", &declaration.item);
            if let Some(module) = &declaration.module {
                append_toml(&mut output, "module", module);
            }
            if let Some(id) = &declaration.id {
                append_toml(&mut output, "id", id);
            }
            if let Some(slug) = &declaration.slug {
                append_toml(&mut output, "slug", slug);
            }
            if let Some(panel) = &declaration.panel {
                append_toml(&mut output, "panel", panel);
            }
            output.push('\n');
        }
        output
    }

    /// Write the generated declaration manifest beneath `target/feluqa/<package>`.
    pub fn write_manifest(
        &self,
        manifest_dir: impl AsRef<Path>,
        target_dir: impl AsRef<Path>,
        package: &str,
    ) -> Result<PathBuf, ScanError> {
        let directory = target_dir.as_ref().join("feluqa").join(package);
        fs::create_dir_all(&directory)?;
        let output = directory.join("declarations.toml");
        fs::write(&output, self.to_toml())?;
        crate::std::println!(
            "cargo:rerun-if-changed={}",
            manifest_dir.as_ref().join("src/panels").display()
        );
        crate::std::println!(
            "cargo:rerun-if-changed={}",
            manifest_dir.as_ref().join("src/modules").display()
        );
        Ok(output)
    }
}

fn collect_rust_files(directory: &Path, output: &mut Vec<PathBuf>) -> Result<(), ScanError> {
    for entry in fs::read_dir(directory)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            collect_rust_files(&path, output)?;
        } else if path.extension().is_some_and(|extension| extension == "rs")
            && !path
                .file_name()
                .is_some_and(|name| name.to_string_lossy().ends_with(".view.rs"))
        {
            output.push(path);
        }
    }
    Ok(())
}

fn module_id(source_root: &Path, path: &Path) -> Option<String> {
    let relative = path.strip_prefix(source_root).ok()?;
    if relative.components().next()?.as_os_str() != "modules" {
        return None;
    }
    relative
        .components()
        .nth(1)?
        .as_os_str()
        .to_str()
        .map(String::from)
}

fn collect_items(
    items: &[Item],
    path: &Path,
    relative: &str,
    module: Option<&str>,
    scan: &mut ApplicationScan,
) -> Result<(), ScanError> {
    for item in items {
        let (attributes, name) = match item {
            Item::Fn(function) => (&function.attrs, function.sig.ident.to_string()),
            Item::Struct(structure) => (&structure.attrs, structure.ident.to_string()),
            Item::Enum(enumeration) => (&enumeration.attrs, enumeration.ident.to_string()),
            Item::Impl(implementation) => {
                for method in &implementation.items {
                    if let syn::ImplItem::Fn(function) = method {
                        collect_attributes(
                            &function.attrs,
                            function.sig.ident.to_string(),
                            path,
                            relative,
                            module,
                            scan,
                        )?;
                    }
                }
                continue;
            }
            _ => continue,
        };
        collect_attributes(attributes, name, path, relative, module, scan)?;
        if let Item::Enum(enumeration) = item {
            if has_attribute(&enumeration.attrs, "permissions")
                || has_attribute(&enumeration.attrs, "roles")
            {
                for variant in &enumeration.variants {
                    if !variant
                        .attrs
                        .iter()
                        .any(|attribute| attribute.path().is_ident("doc"))
                    {
                        return Err(invalid(
                            path,
                            crate::std::format!(
                                "{}::{} needs a documentation comment",
                                enumeration.ident,
                                variant.ident
                            ),
                        ));
                    }
                }
            }
        }
    }
    Ok(())
}

fn collect_attributes(
    attributes: &[Attribute],
    item: String,
    path: &Path,
    relative: &str,
    module: Option<&str>,
    scan: &mut ApplicationScan,
) -> Result<(), ScanError> {
    let mut has_gate = false;
    for attribute in attributes {
        let Some(kind) = attribute
            .path()
            .segments
            .last()
            .map(|segment| segment.ident.to_string())
        else {
            continue;
        };
        if kind == "gate" {
            has_gate = true;
        }
        if ![
            "panel",
            "resource",
            "page",
            "permissions",
            "roles",
            "config",
            "gate",
            "get",
            "post",
            "action",
        ]
        .contains(&kind.as_str())
        {
            continue;
        }
        let mut declaration = Declaration {
            kind: if kind == "get" || kind == "post" || kind == "action" {
                String::from("handler")
            } else {
                kind
            },
            source: String::from(relative),
            module: module.map(String::from),
            item: item.clone(),
            id: None,
            slug: None,
            panel: None,
        };
        if let Ok(arguments) =
            attribute.parse_args_with(Punctuated::<Meta, Token![,]>::parse_terminated)
        {
            for argument in arguments {
                let Meta::NameValue(value) = argument else {
                    continue;
                };
                let Some(key) = value.path.get_ident().map(ToString::to_string) else {
                    continue;
                };
                let Expr::Lit(expression) = value.value else {
                    continue;
                };
                let Lit::Str(literal) = expression.lit else {
                    continue;
                };
                match key.as_str() {
                    "id" => declaration.id = Some(literal.value()),
                    "slug" | "path" => declaration.slug = Some(literal.value()),
                    "panel" => declaration.panel = Some(literal.value()),
                    _ => {}
                }
            }
        }
        scan.declarations.push(declaration);
    }
    if attributes.iter().any(|attribute| {
        attribute
            .path()
            .segments
            .last()
            .is_some_and(|segment| segment.ident == "post" || segment.ident == "action")
    }) && !has_gate
    {
        return Err(invalid(
            path,
            crate::std::format!("write handler `{item}` requires #[gate(...)]"),
        ));
    }
    Ok(())
}

fn has_attribute(attributes: &[Attribute], name: &str) -> bool {
    attributes.iter().any(|attribute| {
        attribute
            .path()
            .segments
            .last()
            .is_some_and(|segment| segment.ident == name)
    })
}

fn append_toml(output: &mut String, key: &str, value: &str) {
    output.push_str(key);
    output.push_str(" = ");
    output.push_str(&crate::std::format!("{:?}\n", value));
}

fn invalid(path: &Path, message: String) -> ScanError {
    ScanError::Invalid {
        path: path.to_path_buf(),
        message,
    }
}
