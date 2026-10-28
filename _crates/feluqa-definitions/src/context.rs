#![no_implicit_prelude]

use crate::PortablePath;
use crate::PortablePathError;
use crate::std::convert::AsRef;
use crate::std::env;
use crate::std::fmt;
use crate::std::iter::Iterator;
use crate::std::ops::Fn;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::{Path, PathBuf};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::write;

/// The nearest active Feluqa ownership context.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ContextScope {
    /// An explicitly configured runtime module.
    Module,
    /// A Feluqa application or product source.
    Product,
    /// An installed Feluqa platform root.
    Platform,
    /// A Feluqa development workspace.
    Workspace,
    /// A Rust crate without a more specific Feluqa owner.
    Crate,
    /// A directory outside known Feluqa roots.
    Global,
}

/// A filesystem root that can own or locate Feluqa data.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PathScope {
    /// The installed platform root.
    Platform,
    /// The development workspace root.
    Workspace,
    /// The current Feluqa product root.
    Product,
    /// The current Feluqa module source root.
    Module,
    /// The current Rust crate root.
    Crate,
    /// Mutable storage owned by the active runtime context.
    Storage,
}

/// Resolved filesystem and runtime ownership context for a process location.
#[derive(Clone, Debug)]
pub struct FeluqaContext {
    current_directory: PathBuf,
    platform_root: Option<PathBuf>,
    workspace_root: Option<PathBuf>,
    product_root: Option<PathBuf>,
    module_root: Option<PathBuf>,
    crate_root: Option<PathBuf>,
    module_id: Option<String>,
}

impl FeluqaContext {
    /// Discover Feluqa roots from a current directory and its ancestors.
    ///
    /// Products have `feluqa.toml`, `Cargo.toml` and `src/main.rs`. A workspace
    /// has `_crates/Cargo.toml` or `.feluqa/workspace.toml`; a platform install
    /// has `.feluqa/platform.toml`. A module source has `feluqa-module.toml`
    /// or `module.toml`. The nearest `Cargo.toml` identifies the Rust crate.
    pub fn discover(current_directory: impl AsRef<Path>) -> Result<Self, crate::std::io::Error> {
        let current_directory = current_directory.as_ref();
        let current_directory = if current_directory.is_absolute() {
            current_directory.to_path_buf()
        } else {
            env::current_dir()?.join(current_directory)
        };
        let product_root = nearest_ancestor(&current_directory, |directory| {
            directory.join("feluqa.toml").is_file()
                && directory.join("Cargo.toml").is_file()
                && directory.join("src/main.rs").is_file()
        });
        let workspace_root = nearest_ancestor(&current_directory, |directory| {
            directory.join("_crates/Cargo.toml").is_file()
                || directory.join(".feluqa/workspace.toml").is_file()
        });
        let platform_root = nearest_ancestor(&current_directory, |directory| {
            directory.join(".feluqa/platform.toml").is_file()
        });
        let module_root = nearest_ancestor(&current_directory, |directory| {
            directory.join("feluqa-module.toml").is_file()
                || directory.join("module.toml").is_file()
        });
        let crate_root = nearest_ancestor(&current_directory, |directory| {
            directory.join("Cargo.toml").is_file()
        });

        Ok(Self {
            current_directory,
            platform_root,
            workspace_root,
            product_root,
            module_root,
            crate_root,
            module_id: None,
        })
    }

    /// Bind this context to an active module identity supplied by its loader.
    pub fn with_module_id(mut self, module_id: &str) -> Result<Self, ContextError> {
        let identity = PortablePath::parse(module_id).map_err(ContextError::PortablePath)?;
        if identity.components().count() != 1 {
            return Err(ContextError::InvalidModuleId);
        }
        self.module_id = Some(identity.as_slash_path());
        Ok(self)
    }

    /// Return the most specific active context represented by these roots.
    pub fn scope(&self) -> ContextScope {
        if self.module_id.is_some() || self.module_root.is_some() {
            ContextScope::Module
        } else if self.product_root.is_some() {
            ContextScope::Product
        } else if self.platform_root.is_some() {
            ContextScope::Platform
        } else if self.workspace_root.is_some() {
            ContextScope::Workspace
        } else if self.crate_root.is_some() {
            ContextScope::Crate
        } else {
            ContextScope::Global
        }
    }

    /// Return the directory from which this context was discovered.
    pub fn current_directory(&self) -> &Path {
        &self.current_directory
    }

    /// Return the discovered installed platform root, if present.
    pub fn platform_root(&self) -> Option<&Path> {
        self.platform_root.as_deref()
    }

    /// Return the discovered development workspace root, if present.
    pub fn workspace_root(&self) -> Option<&Path> {
        self.workspace_root.as_deref()
    }

    /// Return the discovered Feluqa product root, if present.
    pub fn product_root(&self) -> Option<&Path> {
        self.product_root.as_deref()
    }

    /// Return the discovered module source root, if present.
    pub fn module_root(&self) -> Option<&Path> {
        self.module_root.as_deref()
    }

    /// Return the nearest Rust crate root, if present.
    pub fn crate_root(&self) -> Option<&Path> {
        self.crate_root.as_deref()
    }

    /// Return the conventional `products/` directory in a Feluqa workspace.
    pub fn workspace_products_root(&self) -> Result<PathBuf, ContextError> {
        let workspace = self
            .workspace_root
            .as_deref()
            .ok_or(ContextError::MissingRoot(PathScope::Workspace))?;
        let relative = PortablePath::parse("products").map_err(ContextError::PortablePath)?;
        Ok(relative.resolve_under(workspace))
    }

    /// Return the native root for the requested logical scope.
    pub fn root(&self, scope: PathScope) -> Result<PathBuf, ContextError> {
        match scope {
            PathScope::Platform => self.required_root(PathScope::Platform),
            PathScope::Workspace => self.required_root(PathScope::Workspace),
            PathScope::Product => self.required_root(PathScope::Product),
            PathScope::Module => self.required_root(PathScope::Module),
            PathScope::Crate => self.required_root(PathScope::Crate),
            PathScope::Storage => self.storage_root(),
        }
    }

    /// Resolve a portable relative path under an owned Feluqa root.
    pub fn resolve(
        &self,
        scope: PathScope,
        relative: &PortablePath,
    ) -> Result<PathBuf, ContextError> {
        Ok(relative.resolve_under(&self.root(scope)?))
    }

    /// Return the mutable storage path owned by this runtime context.
    pub fn storage_path(&self) -> Result<PathBuf, ContextError> {
        self.storage_root()
    }

    /// Return the mutable storage root for the active runtime owner.
    ///
    /// Products own `storage/`; modules receive a per-module directory under
    /// their product or platform owner's storage. A Rust crate alone does not
    /// own runtime data and returns an error until called from a runtime owner.
    pub fn storage_root(&self) -> Result<PathBuf, ContextError> {
        if let Some(module_id) = self.module_id.as_deref() {
            let owner = self
                .product_root
                .as_deref()
                .or(self.platform_root.as_deref())
                .ok_or(ContextError::NoRuntimeOwner)?;
            let relative =
                PortablePath::parse("storage/modules").map_err(ContextError::PortablePath)?;
            let mut root = relative.resolve_under(owner);
            root.push(module_id);
            return Ok(root);
        }
        if self.module_root.is_some() {
            return Err(ContextError::ModuleIdentityRequired);
        }
        if let Some(product) = self.product_root.as_deref() {
            return join_standard(product, "storage");
        }
        if let Some(platform) = self.platform_root.as_deref() {
            return join_standard(platform, "storage");
        }
        if let Some(workspace) = self.workspace_root.as_deref() {
            return join_standard(workspace, ".feluqa/storage");
        }
        if self.crate_root.is_some() {
            return Err(ContextError::CrateHasNoRuntimeStorage);
        }
        Err(ContextError::NoRuntimeOwner)
    }

    fn required_root(&self, scope: PathScope) -> Result<PathBuf, ContextError> {
        let root = match scope {
            PathScope::Platform => self.platform_root.as_deref(),
            PathScope::Workspace => self.workspace_root.as_deref(),
            PathScope::Product => self.product_root.as_deref(),
            PathScope::Module => self.module_root.as_deref(),
            PathScope::Crate => self.crate_root.as_deref(),
            PathScope::Storage => return self.storage_root(),
        };
        root.map(Path::to_path_buf)
            .ok_or(ContextError::MissingRoot(scope))
    }
}

fn nearest_ancestor(
    current_directory: &Path,
    predicate: impl Fn(&Path) -> bool,
) -> Option<PathBuf> {
    current_directory
        .ancestors()
        .find(|directory| predicate(directory))
        .map(Path::to_path_buf)
}

fn join_standard(root: &Path, relative: &str) -> Result<PathBuf, ContextError> {
    let relative = PortablePath::parse(relative).map_err(ContextError::PortablePath)?;
    Ok(relative.resolve_under(root))
}

/// Why a context root or runtime-owned path could not be resolved.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ContextError {
    /// No root exists for the requested scope.
    MissingRoot(PathScope),
    /// A module source was found, but its active runtime identity was not bound.
    ModuleIdentityRequired,
    /// A module identity must be exactly one portable path segment.
    InvalidModuleId,
    /// A portable path failed validation.
    PortablePath(PortablePathError),
    /// The context has no product or platform owner for module storage.
    NoRuntimeOwner,
    /// A Rust crate has no runtime storage owner by itself.
    CrateHasNoRuntimeStorage,
}

impl fmt::Display for ContextError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::MissingRoot(scope) => write!(formatter, "missing Feluqa {scope:?} root"),
            Self::ModuleIdentityRequired => {
                formatter.write_str("active module identity is required to resolve module storage")
            }
            Self::InvalidModuleId => {
                formatter.write_str("module identity must be one portable path segment")
            }
            Self::PortablePath(error) => write!(formatter, "{error}"),
            Self::NoRuntimeOwner => {
                formatter.write_str("no platform, product or module owns runtime storage here")
            }
            Self::CrateHasNoRuntimeStorage => formatter.write_str(
                "a Rust crate has no runtime storage of its own; resolve storage from its product or module owner",
            ),
        }
    }
}
