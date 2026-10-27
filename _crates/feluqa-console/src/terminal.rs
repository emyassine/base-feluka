#![no_implicit_prelude]

use crate::std::cmp::Ord;
use crate::std::convert::From;
use crate::std::io::{self, IsTerminal, Write};
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};
use crate::std::vec::Vec;
use crate::std::{eprintln, print, println};

/// Whether stdin and stdout are interactive terminals.
pub fn interactive() -> bool {
    io::stdin().is_terminal() && io::stdout().is_terminal()
}
/// Write a success line.
pub fn success(message: &str) {
    println!("✓ {message}");
}
/// Write an informational line.
pub fn info(message: &str) {
    println!("{message}");
}
/// Write a warning line to stderr.
pub fn warning(message: &str) {
    eprintln!("Warning: {message}");
}
/// Write an error line to stderr.
pub fn error(message: &str) {
    eprintln!("Error: {message}");
}
/// Display a titled callout using portable plain-text formatting.
pub fn callout(label: &str, content: &str) {
    println!(
        "\n{label}\n{}\n{content}\n",
        "─".repeat(label.len().max(content.len()))
    );
}

/// Ask for a required or optional text value with a default.
pub fn text(
    label: &str,
    placeholder: Option<&str>,
    default: Option<&str>,
    required: bool,
) -> Result<String, String> {
    let hint = placeholder.unwrap_or("");
    let fallback = default.unwrap_or("");
    print!(
        "{label}{}{}: ",
        if hint.is_empty() { "" } else { " (" },
        if hint.is_empty() { "" } else { hint }
    );
    if !fallback.is_empty() {
        print!("[{fallback}] ");
    }
    io::stdout().flush().map_err(|error| error.to_string())?;
    let mut value = String::new();
    io::stdin()
        .read_line(&mut value)
        .map_err(|error| error.to_string())?;
    let value = value.trim().to_string();
    let resolved = if value.is_empty() {
        fallback.to_string()
    } else {
        value
    };
    if required && resolved.is_empty() {
        return Err(String::from("a value is required"));
    }
    Ok(resolved)
}

/// Ask a yes/no question.
pub fn confirm(label: &str, default: bool) -> Result<bool, String> {
    let marker = if default { "Y/n" } else { "y/N" };
    let answer = text(
        &crate::std::format!("{label} [{marker}]"),
        None,
        None,
        false,
    )?;
    match answer.to_lowercase().as_str() {
        "y" | "yes" => Ok(true),
        "n" | "no" => Ok(false),
        "" => Ok(default),
        _ => Err(String::from("answer with yes or no")),
    }
}

/// Choose one option by its displayed number.
pub fn select(label: &str, options: &[&str], default: usize) -> Result<usize, String> {
    if options.is_empty() {
        return Err(String::from("select requires at least one option"));
    }
    println!("{label}");
    for (index, option) in options.iter().enumerate() {
        println!(
            "  {}. {}{}",
            index + 1,
            option,
            if index == default { " (default)" } else { "" }
        );
    }
    let answer = text(
        "Choice",
        None,
        Some(&crate::std::format!("{}", default + 1)),
        true,
    )?;
    let selected = answer.parse::<usize>().map_err(|error| error.to_string())?;
    if selected == 0 || selected > options.len() {
        return Err(String::from("choice is outside the available range"));
    }
    Ok(selected - 1)
}

/// Display a simple aligned table.
pub fn table(headers: &[&str], rows: &[Vec<String>]) {
    println!("{}", headers.join("  |  "));
    println!("{}", "─".repeat(headers.join("  |  ").len()));
    for row in rows {
        println!("{}", row.join("  |  "));
    }
}
