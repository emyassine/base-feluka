#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]

//! Rendering primitives for compiled Feluqa Views.
//! Enable `compiler` only in build dependencies to parse `.view.rs` sources.
extern crate alloc;
extern crate core;
#[cfg(feature = "compiler")]
extern crate quote;
#[cfg(any(feature = "compiler", test))]
extern crate std;
#[cfg(feature = "compiler")]
extern crate syn;

use alloc::string::String;
use core::convert::From;
use core::fmt::{self, Display, Write};
use core::iter::Iterator;
use core::option::Option::Some;
use core::result::Result;
use core::result::Result::{Err, Ok};

#[cfg(feature = "compiler")]
pub mod compiler;

/// Owned rendering output, exposed so generated code needs no implicit prelude.
pub type Output = String;
/// A rendering failure reported by a user-provided `Display` implementation.
pub type RenderResult<T = Output> = Result<T, fmt::Error>;
/// A caller-owned slot. Each yield evaluates the slot once at that location.
pub type Slot<'a> = dyn core::ops::FnMut(&mut Output) -> RenderResult<()> + 'a;

/// A URL validated for use in an HTML navigation or resource attribute.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SafeUrl(String);

/// A rejected URL value.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum UrlError {
    /// The URL contains whitespace, control characters, or a backslash.
    InvalidCharacters,
    /// The URL uses a scheme outside the explicit web URL allowlist.
    UnsupportedScheme,
    /// The URL is missing the authority required by an HTTP URL.
    InvalidAuthority,
}

impl SafeUrl {
    /// Validate a local path/reference or an HTTP, HTTPS, mailto, or tel URL.
    pub fn new(value: impl core::convert::AsRef<str>) -> Result<Self, UrlError> {
        let value = value.as_ref();
        if value.is_empty()
            || value
                .bytes()
                .any(|byte| byte.is_ascii_whitespace() || byte.is_ascii_control() || byte == b'\\')
        {
            return Err(UrlError::InvalidCharacters);
        }

        if value.starts_with("//") {
            return Err(UrlError::InvalidAuthority);
        }
        if value.starts_with('/') || value.starts_with('#') || value.starts_with('?') {
            return Ok(Self(String::from(value)));
        }

        let Some((scheme, remainder)) = value.split_once(':') else {
            return Ok(Self(String::from(value)));
        };
        match scheme.to_ascii_lowercase().as_str() {
            "http" | "https" => {
                let Some(authority) = remainder.strip_prefix("//") else {
                    return Err(UrlError::InvalidAuthority);
                };
                let authority = authority.split(['/', '?', '#']).next().unwrap_or("");
                if authority.is_empty() || authority.contains('@') {
                    return Err(UrlError::InvalidAuthority);
                }
            }
            "mailto" | "tel" => {
                if remainder.is_empty() || remainder.starts_with("//") {
                    return Err(UrlError::InvalidAuthority);
                }
            }
            _ => return Err(UrlError::UnsupportedScheme),
        }
        Ok(Self(String::from(value)))
    }

    /// Return the validated URL as text.
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

/// HTML explicitly vouched for by trusted application code.
///
/// This is not a sanitizer. Never construct this from untrusted input without
/// applying an application-approved HTML sanitizer first.
pub struct TrustedHtml(String);

impl TrustedHtml {
    /// Mark already-reviewed or sanitized HTML as trusted.
    pub fn from_trusted(value: String) -> Self {
        Self(value)
    }
}

struct EscapedWriter<'a>(&'a mut String);

impl Write for EscapedWriter<'_> {
    fn write_str(&mut self, value: &str) -> fmt::Result {
        for character in value.chars() {
            match character {
                '&' => self.0.push_str("&amp;"),
                '<' => self.0.push_str("&lt;"),
                '>' => self.0.push_str("&gt;"),
                '"' => self.0.push_str("&quot;"),
                '\'' => self.0.push_str("&#39;"),
                other => self.0.push(other),
            }
        }
        Result::Ok(())
    }
}

/// Stream a displayable value into HTML text or a quoted, non-executable attribute.
pub fn write_escaped(
    output: &mut Output,
    value: &(impl Display + ?core::marker::Sized),
) -> RenderResult<()> {
    core::write!(EscapedWriter(output), "{value}")
}

/// Stream a validated URL into a quoted HTML attribute with HTML escaping.
pub fn write_url(output: &mut Output, value: &SafeUrl) -> RenderResult<()> {
    write_escaped(output, &value.0)
}

/// Append HTML without escaping; ordinary strings do not satisfy this API.
pub fn write_trusted(output: &mut Output, value: &TrustedHtml) {
    output.push_str(&value.0);
}
