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
use core::fmt::{self, Display, Write};
use core::result::Result;

#[cfg(feature = "compiler")]
pub mod compiler;

/// Owned rendering output, exposed so generated code needs no implicit prelude.
pub type Output = String;
/// A rendering failure reported by a user-provided `Display` implementation.
pub type RenderResult<T = Output> = Result<T, fmt::Error>;
/// A caller-owned slot. Each yield evaluates the slot once at that location.
pub type Slot<'a> = dyn core::ops::FnMut(&mut Output) -> RenderResult<()> + 'a;

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

/// Append HTML without escaping; ordinary strings do not satisfy this API.
pub fn write_trusted(output: &mut Output, value: &TrustedHtml) {
    output.push_str(&value.0);
}
