#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Self-hosted Feluqa SVG imagery with strict icon-set and icon-name validation.

extern crate std;

use std::convert::{AsRef, From, Into};
use std::default::Default;
use std::error::Error;
use std::fmt;
use std::format;
use std::fs;
use std::io;
use std::iter::Iterator;
use std::option::Option;
use std::option::Option::{None, Some};
use std::path::{Path, PathBuf};
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::String;
use std::write;

/// Supported bundled SVG collections.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IconSet {
    /// Lucide outline icons (ISC).
    Lucide,
    /// Simple Icons brand marks (check per-icon rights; trademarks remain owned by their holders).
    SimpleIcons,
    /// Heroicons (MIT).
    Heroicons,
}

impl IconSet {
    /// Stable directory name used in the asset tree.
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Lucide => "lucide",
            Self::SimpleIcons => "simple-icons",
            Self::Heroicons => "heroicons",
        }
    }
}

/// Access to Feluqa's package-owned and attributed icon files.
#[derive(Clone, Debug)]
pub struct IconCatalog {
    root: PathBuf,
}

impl Default for IconCatalog {
    fn default() -> Self {
        Self::bundled()
    }
}

impl IconCatalog {
    /// Locate the icon files bundled with the Feluqa imagery crate.
    pub fn bundled() -> Self {
        Self {
            root: PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("assets/icons"),
        }
    }

    /// Create a catalog rooted at a caller-managed icon directory.
    pub fn from_root(root: impl Into<PathBuf>) -> Self {
        Self { root: root.into() }
    }

    /// Resolve an icon's file path after rejecting path separators and traversal.
    pub fn path(&self, set: IconSet, name: &str) -> Result<PathBuf, IconError> {
        if !valid_name(name) {
            return Err(IconError::InvalidName);
        }
        Ok(self.root.join(set.as_str()).join(format!("{name}.svg")))
    }

    /// Read one SVG from the selected collection.
    pub fn read_svg(&self, set: IconSet, name: &str) -> Result<String, IconError> {
        let path = self.path(set, name)?;
        fs::read_to_string(path).map_err(IconError::Io)
    }

    /// Install a validated icon below an application's public asset directory.
    pub fn install(
        &self,
        set: IconSet,
        name: &str,
        public_root: impl AsRef<Path>,
    ) -> Result<PathBuf, IconError> {
        let source = self.path(set, name)?;
        let relative = PathBuf::from("assets/feluqa/icons")
            .join(set.as_str())
            .join(format!("{name}.svg"));
        let destination = public_root.as_ref().join(&relative);
        let parent = destination.parent().ok_or(IconError::InvalidName)?;
        fs::create_dir_all(parent).map_err(IconError::Io)?;
        fs::copy(source, destination).map_err(IconError::Io)?;
        Ok(relative)
    }
}

/// Failure while validating or loading a bundled icon.
#[derive(Debug)]
pub enum IconError {
    /// The icon name contained path syntax or unsupported characters.
    InvalidName,
    /// The requested file was not present or could not be read/copied.
    Io(io::Error),
}

impl fmt::Display for IconError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidName => {
                formatter.write_str("icon name must use letters, numbers, underscore or hyphen")
            }
            Self::Io(error) => write!(formatter, "icon asset operation failed: {error}"),
        }
    }
}

impl Error for IconError {}

/// Resolve and read one icon from the Feluqa imagery bundle.
pub fn icon_svg(set: IconSet, name: &str) -> Result<String, IconError> {
    IconCatalog::bundled().read_svg(set, name)
}

/// Return a compile-time embedded Heroicon used by Feluqa's built-in panel shell.
///
/// These common interface icons are embedded in the application binary, so panel
/// requests do not read package assets from the build host at runtime.
pub fn panel_heroicon(name: &str) -> Option<&'static str> {
    match name {
        "o-home" => Some(include_str!("../assets/icons/heroicons/o-home.svg")),
        "o-users" => Some(include_str!("../assets/icons/heroicons/o-users.svg")),
        "o-shield-check" => Some(include_str!("../assets/icons/heroicons/o-shield-check.svg")),
        "o-building-office-2" => Some(include_str!(
            "../assets/icons/heroicons/o-building-office-2.svg"
        )),
        "o-cube" => Some(include_str!("../assets/icons/heroicons/o-cube.svg")),
        "o-circle-stack" => Some(include_str!("../assets/icons/heroicons/o-circle-stack.svg")),
        "o-clipboard-document-list" => Some(include_str!(
            "../assets/icons/heroicons/o-clipboard-document-list.svg"
        )),
        "o-clipboard-document-check" => Some(include_str!(
            "../assets/icons/heroicons/o-clipboard-document-check.svg"
        )),
        "o-squares-2x2" => Some(include_str!("../assets/icons/heroicons/o-squares-2x2.svg")),
        "o-bars-3" => Some(include_str!("../assets/icons/heroicons/o-bars-3.svg")),
        "o-x-mark" => Some(include_str!("../assets/icons/heroicons/o-x-mark.svg")),
        _ => None,
    }
}

fn valid_name(name: &str) -> bool {
    !name.is_empty()
        && name
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'-')
}
