#![no_implicit_prelude]

extern crate serde;
extern crate std;
extern crate toml;

use crate::serde::Deserialize;
use std::clone::Clone;
use std::convert::From;
use std::fs;
use std::iter::Iterator;
use std::path::{Path, PathBuf};
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;
use std::write;

/// A product described by its Cargo and Feluqa manifests.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct FeluqaProduct {
    /// Human-facing product name.
    pub display_name: String,
    /// Rust package name.
    pub package_name: String,
    /// Product runtime profile.
    pub profile: String,
    /// Path to its Cargo manifest.
    pub manifest: PathBuf,
    /// Product source root.
    pub directory: PathBuf,
}

#[derive(Deserialize)]
struct CargoDocument {
    package: CargoPackage,
}
#[derive(Deserialize)]
struct CargoPackage {
    name: String,
}
#[derive(Deserialize)]
struct FeluqaDocument {
    app: FeluqaApp,
}
#[derive(Deserialize)]
struct FeluqaApp {
    name: String,
    profile: String,
}

/// Read the product manifests at a discovered product root.
pub fn read_product(directory: &Path) -> Result<FeluqaProduct, ProductError> {
    let manifest = directory.join("Cargo.toml");
    let config_path = directory.join("feluqa.toml");
    if !manifest.is_file() || !directory.join("src/main.rs").is_file() || !config_path.is_file() {
        return Err(ProductError::InvalidRoot(directory.to_path_buf()));
    }
    let cargo_source = fs::read_to_string(&manifest)
        .map_err(|error| ProductError::Read(manifest.clone(), error.to_string()))?;
    let cargo: CargoDocument = toml::from_str(&cargo_source)
        .map_err(|error| ProductError::Parse(manifest.clone(), error.to_string()))?;
    let config_source = fs::read_to_string(&config_path)
        .map_err(|error| ProductError::Read(config_path.clone(), error.to_string()))?;
    let config: FeluqaDocument = toml::from_str(&config_source)
        .map_err(|error| ProductError::Parse(config_path.clone(), error.to_string()))?;
    if config.app.name.trim().is_empty() || config.app.profile.trim().is_empty() {
        return Err(ProductError::EmptyIdentity(config_path));
    }
    Ok(FeluqaProduct {
        display_name: config.app.name,
        package_name: cargo.package.name,
        profile: config.app.profile,
        manifest,
        directory: directory.to_path_buf(),
    })
}

/// Find a product by display or package name within a workspace context.
pub fn workspace_product(workspace: &Path, requested: &str) -> Result<FeluqaProduct, ProductError> {
    for product in list_workspace_products(workspace)? {
        if product.display_name == requested || product.package_name == requested {
            return Ok(product);
        }
    }
    Err(ProductError::NotFound(String::from(requested)))
}

/// Read all valid product manifests beneath the workspace's configured product root.
pub fn list_workspace_products(workspace: &Path) -> Result<Vec<FeluqaProduct>, ProductError> {
    let context = crate::FeluqaContext::discover(workspace)
        .map_err(|error| ProductError::Context(error.to_string()))?;
    let root = context
        .workspace_products_root()
        .map_err(|error| ProductError::Context(error.to_string()))?;
    let entries =
        fs::read_dir(&root).map_err(|error| ProductError::Read(root.clone(), error.to_string()))?;
    let mut products = Vec::new();
    for entry in entries {
        let path = entry
            .map_err(|error| ProductError::Read(root.clone(), error.to_string()))?
            .path();
        if path.is_dir() && path.join("feluqa.toml").is_file() {
            products.push(read_product(&path)?);
        }
    }
    Ok(products)
}

/// Build a relative filesystem path between two absolute locations.
pub fn relative_path(from: &Path, to: &Path) -> Result<PathBuf, ProductError> {
    let from = from
        .canonicalize()
        .map_err(|error| ProductError::Read(from.to_path_buf(), error.to_string()))?;
    let to = to
        .canonicalize()
        .map_err(|error| ProductError::Read(to.to_path_buf(), error.to_string()))?;
    let from_components: Vec<_> = from.components().collect();
    let to_components: Vec<_> = to.components().collect();
    let shared = from_components
        .iter()
        .zip(&to_components)
        .take_while(|(left, right)| left == right)
        .count();
    let mut relative = PathBuf::new();
    for _ in shared..from_components.len() {
        relative.push("..");
    }
    for component in &to_components[shared..] {
        relative.push(component.as_os_str());
    }
    Ok(relative)
}

/// Why a product definition could not be loaded.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ProductError {
    /// A directory does not satisfy the product root contract.
    InvalidRoot(PathBuf),
    /// A manifest could not be read.
    Read(PathBuf, String),
    /// A manifest is malformed.
    Parse(PathBuf, String),
    /// Product identity fields are empty.
    EmptyIdentity(PathBuf),
    /// A requested product is absent.
    NotFound(String),
    /// Workspace context could not be resolved.
    Context(String),
}

impl std::fmt::Display for ProductError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidRoot(path) => write!(
                formatter,
                "`{}` is not a valid Feluqa product root",
                path.display()
            ),
            Self::Read(path, error) => {
                write!(formatter, "could not read `{}`: {error}", path.display())
            }
            Self::Parse(path, error) => {
                write!(formatter, "invalid manifest `{}`: {error}", path.display())
            }
            Self::EmptyIdentity(path) => write!(
                formatter,
                "`{}` has an empty product name or profile",
                path.display()
            ),
            Self::NotFound(name) => write!(
                formatter,
                "product `{name}` was not found in this workspace"
            ),
            Self::Context(error) => formatter.write_str(error),
        }
    }
}
