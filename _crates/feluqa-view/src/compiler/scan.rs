//! Rust-aware delimiter scanning. Offsets always refer to UTF-8 byte boundaries.
use crate::std;
use std::format;
use std::iter::Iterator;
use std::option::Option::{self, None, Some};
use std::result::Result::{self, Err, Ok};
use std::string::String;
use std::vec::Vec;

fn quoted(source: &str, start: usize, quote: u8) -> Result<usize, String> {
    let bytes = source.as_bytes();
    let mut cursor = start + 1;
    while cursor < bytes.len() {
        if bytes[cursor] == b'\\' {
            cursor += 2;
        } else if bytes[cursor] == quote {
            return Ok(cursor + 1);
        } else {
            cursor += 1;
        }
    }
    Err(format!("unterminated Rust string at byte {start}"))
}

fn opaque(source: &str, start: usize) -> Result<Option<usize>, String> {
    let tail = &source[start..];
    let bytes = source.as_bytes();
    if tail.starts_with("//") {
        return Ok(Some(
            tail.find('\n').map_or(source.len(), |end| start + end + 1),
        ));
    }
    if tail.starts_with("/*") {
        let mut cursor = start + 2;
        let mut depth = 1;
        while cursor < source.len() {
            if bytes[cursor..].starts_with(b"/*") {
                depth += 1;
                cursor += 2;
            } else if bytes[cursor..].starts_with(b"*/") {
                depth -= 1;
                cursor += 2;
                if depth == 0 {
                    return Ok(Some(cursor));
                }
            } else {
                cursor += 1;
            }
        }
        return Err(format!("unterminated Rust comment at byte {start}"));
    }
    // r"...", r#"..."#, br#"..."#, cr#"..."#.
    let raw_start = if tail.starts_with("br") || tail.starts_with("cr") {
        start + 1
    } else {
        start
    };
    if bytes.get(raw_start) == Some(&b'r') {
        let mut cursor = raw_start + 1;
        while bytes.get(cursor) == Some(&b'#') {
            cursor += 1;
        }
        if bytes.get(cursor) == Some(&b'"') {
            let hashes = cursor - raw_start - 1;
            cursor += 1;
            while cursor < bytes.len() {
                if bytes[cursor] == b'"'
                    && bytes
                        .get(cursor + 1..cursor + 1 + hashes)
                        .is_some_and(|slice| slice.iter().all(|byte| *byte == b'#'))
                {
                    return Ok(Some(cursor + 1 + hashes));
                }
                cursor += 1;
            }
            return Err(format!("unterminated Rust raw string at byte {start}"));
        }
    }
    if bytes[start] == b'"' {
        return quoted(source, start, b'"').map(Some);
    }
    if tail.starts_with("b\"") || tail.starts_with("c\"") {
        return quoted(source, start + 1, b'"').map(Some);
    }
    let char_start = if tail.starts_with("b'") {
        start + 1
    } else {
        start
    };
    if bytes.get(char_start) == Some(&b'\'') {
        let after = char_start + 1;
        if bytes.get(after) == Some(&b'\\') {
            return quoted(source, char_start, b'\'').map(Some);
        }
        // A single Unicode scalar followed by a quote is a char; otherwise a lifetime.
        if let Some(character) = source.get(after..).and_then(|text| text.chars().next()) {
            if bytes.get(after + character.len_utf8()) == Some(&b'\'') {
                return Ok(Some(after + character.len_utf8() + 1));
            }
        }
    }
    Ok(None)
}

/// Find a terminator outside nested Rust groups, strings and comments.
pub(super) fn end(source: &str, start: usize, terminator: &str) -> Result<usize, String> {
    let mut cursor = start;
    let mut groups = Vec::new();
    while cursor < source.len() {
        let tail = &source[cursor..];
        if groups.is_empty()
            && tail.starts_with(terminator)
            && (terminator != "@endrs"
                || !tail[terminator.len()..]
                    .starts_with(|character: char| character.is_alphanumeric() || character == '_'))
        {
            return Ok(cursor);
        }
        if let Some(next) = opaque(source, cursor)? {
            cursor = next;
            continue;
        }
        let character = match tail.chars().next() {
            Some(value) => value,
            None => break,
        };
        match character {
            '(' => groups.push(')'),
            '[' => groups.push(']'),
            '{' => groups.push('}'),
            ')' | ']' | '}' if groups.pop() != Some(character) => {
                return Err(format!(
                    "unbalanced Rust delimiter `{character}` at byte {cursor}"
                ));
            }
            _ => {}
        }
        cursor += character.len_utf8();
    }
    Err(format!("missing `{terminator}`"))
}
