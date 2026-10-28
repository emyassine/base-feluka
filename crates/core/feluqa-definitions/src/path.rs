#![no_implicit_prelude]

use crate::std::convert::From;
use crate::std::fmt;
use crate::std::iter::Iterator;
use crate::std::matches;
use crate::std::option::Option::Some;
use crate::std::path::{Path, PathBuf};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::vec::Vec;

/// A validated relative path using `/` as its stable serialized separator.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PortablePath {
    components: Vec<String>,
}

impl PortablePath {
    /// Parse a relative path that is valid on POSIX and Windows filesystems.
    ///
    /// Absolute paths, empty segments, `.` and `..`, Windows separators,
    /// reserved device names and characters invalid on Windows are rejected.
    pub fn parse(value: &str) -> Result<Self, PortablePathError> {
        if value.is_empty() {
            return Err(PortablePathError::Empty);
        }
        let bytes = value.as_bytes();
        if value.starts_with('/') || value.starts_with('\\') || bytes.get(1) == Some(&b':') {
            return Err(PortablePathError::Absolute);
        }

        let mut components = Vec::new();
        for component in value.split('/') {
            if component.is_empty() {
                return Err(PortablePathError::EmptyComponent);
            }
            if component == "." || component == ".." {
                return Err(PortablePathError::Traversal);
            }
            if component.ends_with('.') || component.ends_with(' ') {
                return Err(PortablePathError::TrailingDotOrSpace);
            }
            if component.chars().any(|character| {
                character.is_control()
                    || matches!(character, '<' | '>' | ':' | '"' | '|' | '?' | '*' | '\\')
            }) {
                return Err(PortablePathError::InvalidCharacter);
            }
            if is_windows_device_name(component) {
                return Err(PortablePathError::ReservedName);
            }
            components.push(String::from(component));
        }
        Ok(Self { components })
    }

    /// Return the validated path components.
    pub fn components(&self) -> impl crate::std::iter::Iterator<Item = &str> {
        self.components.iter().map(String::as_str)
    }

    /// Serialize this path with `/` separators on every host platform.
    pub fn as_slash_path(&self) -> String {
        self.components.join("/")
    }

    /// Resolve this relative path beneath a native filesystem root.
    ///
    /// This rejects lexical traversal, but callers that write through
    /// untrusted directories must still enforce symlink containment.
    pub fn resolve_under(&self, root: &Path) -> PathBuf {
        let mut resolved = root.to_path_buf();
        for component in &self.components {
            resolved.push(component);
        }
        resolved
    }
}

fn is_windows_device_name(component: &str) -> bool {
    let base = component.split('.').next().unwrap_or("");
    let uppercase = base.to_ascii_uppercase();
    if matches!(uppercase.as_str(), "CON" | "PRN" | "AUX" | "NUL") {
        return true;
    }
    ["COM", "LPT"].iter().any(|prefix| {
        uppercase.strip_prefix(prefix).is_some_and(|suffix| {
            matches!(suffix, "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9")
        })
    })
}

/// Why a logical relative path could not be represented portably.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PortablePathError {
    /// The path has no components.
    Empty,
    /// The path is absolute or includes a drive prefix.
    Absolute,
    /// The path contains an empty segment, such as `a//b`.
    EmptyComponent,
    /// The path contains a current or parent directory segment.
    Traversal,
    /// A component contains a character invalid on Windows.
    InvalidCharacter,
    /// A component ends in a dot or space, which Windows normalizes away.
    TrailingDotOrSpace,
    /// A component uses a reserved Windows device name.
    ReservedName,
}

impl fmt::Display for PortablePathError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let message = match self {
            Self::Empty => "portable path cannot be empty",
            Self::Absolute => "portable path must be relative",
            Self::EmptyComponent => "portable path cannot contain empty components",
            Self::Traversal => "portable path cannot contain `.` or `..` components",
            Self::InvalidCharacter => "path component contains a character invalid on Windows",
            Self::TrailingDotOrSpace => "path components cannot end in a dot or space",
            Self::ReservedName => "path component uses a reserved Windows device name",
        };
        formatter.write_str(message)
    }
}
