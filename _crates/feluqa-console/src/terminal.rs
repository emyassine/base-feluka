#![no_implicit_prelude]

use crate::std::cmp::Ord;
use crate::std::convert::From;
use crate::std::io::{self, IsTerminal, Write};
use crate::std::iter::{Extend, IntoIterator, Iterator};
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};
use crate::std::vec::Vec;
use crate::std::{eprintln, print, println};

/// ANSI style used by Feluqa Console output.
#[derive(Clone, Copy)]
pub enum Color {
    /// Bright blue title or primary command.
    Accent,
    /// Cyan command or informational label.
    Cyan,
    /// Green success output.
    Green,
    /// Yellow warning output.
    Yellow,
    /// Red error output.
    Red,
    /// Dim secondary text.
    Muted,
}

/// Whether stdin and stdout are interactive terminals.
pub fn interactive() -> bool {
    io::stdin().is_terminal() && io::stdout().is_terminal()
}

/// Whether this process should emit ANSI colors.
pub fn colors_enabled() -> bool {
    interactive()
        && crate::std::env::var_os("NO_COLOR").is_none()
        && crate::std::env::var("CLICOLOR")
            .map(|value| value != "0")
            .unwrap_or(true)
        && crate::std::env::var("TERM")
            .map(|value| value != "dumb")
            .unwrap_or(true)
}

/// Apply a terminal color when output is interactive and colors are enabled.
pub fn paint(value: &str, color: Color) -> String {
    if !colors_enabled() {
        return String::from(value);
    }
    let code = match color {
        Color::Accent => "1;94",
        Color::Cyan => "1;36",
        Color::Green => "1;32",
        Color::Yellow => "1;33",
        Color::Red => "1;31",
        Color::Muted => "2;37",
    };
    crate::std::format!("\u{1b}[{code}m{value}\u{1b}[0m")
}

/// Format a cyan informational notice.
pub fn info_line(message: &str) -> String {
    crate::std::format!("{}  {message}", paint("INFO", Color::Cyan))
}

/// Format a command and description with terminal-width-aware dotted leaders.
pub fn command_entry(name: &str, description: &str) -> String {
    let width = columns();
    let name_width = name.chars().count() + 2;
    let description_width = description.chars().count();
    let dots = width.saturating_sub(name_width + description_width + 2);
    if dots >= 3 {
        return crate::std::format!(
            "  {} {} {}",
            paint(name, Color::Cyan),
            paint(&".".repeat(dots), Color::Muted),
            description
        );
    }

    let wrapped = wrap(description, width.saturating_sub(6).max(24));
    let mut lines = Vec::with_capacity(wrapped.len() + 1);
    lines.push(crate::std::format!("  {}", paint(name, Color::Cyan)));
    lines.extend(
        wrapped
            .into_iter()
            .map(|line| crate::std::format!("      {line}")),
    );
    lines.join("\n")
}

/// Current terminal width, honoring the conventional `COLUMNS` setting.
pub fn columns() -> usize {
    crate::std::env::var("COLUMNS")
        .ok()
        .and_then(|value| value.parse::<usize>().ok())
        .filter(|width| *width >= 40 && *width <= 300)
        .unwrap_or(80)
}

fn wrap(value: &str, width: usize) -> Vec<String> {
    let mut lines = Vec::new();
    let mut line = String::new();
    for word in value.split_whitespace() {
        let added = word.chars().count() + if line.is_empty() { 0 } else { 1 };
        if !line.is_empty() && line.chars().count() + added > width {
            lines.push(line);
            line = String::new();
        }
        if !line.is_empty() {
            line.push(' ');
        }
        line.push_str(word);
    }
    if !line.is_empty() {
        lines.push(line);
    }
    lines
}

/// Write a green success line.
pub fn success(message: &str) {
    println!("{}  {message}", paint("✓", Color::Green));
}

/// Write a cyan informational line.
pub fn info(message: &str) {
    println!("{}  {message}", info_line_label());
}

fn info_line_label() -> String {
    paint("INFO", Color::Cyan)
}

/// Write a yellow warning line to stderr.
pub fn warning(message: &str) {
    eprintln!("{}  {message}", paint("WARNING", Color::Yellow));
}

/// Write a red error line to stderr.
pub fn error(message: &str) {
    eprintln!("{}  {message}", paint("ERROR", Color::Red));
}

/// Display a titled callout using portable terminal formatting.
pub fn callout(label: &str, content: &str) {
    let width = columns();
    println!(
        "\n{}\n{}\n{content}\n",
        paint(label, Color::Accent),
        paint(
            &"─".repeat(width.min(label.chars().count().max(content.chars().count()))),
            Color::Muted
        )
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
        "{}{}{}: ",
        paint(label, Color::Cyan),
        if hint.is_empty() { "" } else { " (" },
        if hint.is_empty() {
            String::new()
        } else {
            crate::std::format!("{}{}", paint(hint, Color::Muted), ")")
        }
    );
    if !fallback.is_empty() {
        print!("[{}] ", paint(fallback, Color::Muted));
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
        &crate::std::format!("{label} [{}]", paint(marker, Color::Muted)),
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
    println!("{}", paint(label, Color::Accent));
    for (index, option) in options.iter().enumerate() {
        let number = paint(&crate::std::format!("{:>2}.", index + 1), Color::Cyan);
        let marker = if index == default {
            paint("›", Color::Green)
        } else {
            String::from(" ")
        };
        println!("  {marker} {number} {option}");
    }
    let answer = text(
        "Choice",
        Some("use the number shown"),
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
    let heading = headers.join("  |  ");
    println!("{}", paint(&heading, Color::Accent));
    println!(
        "{}",
        paint(&"─".repeat(heading.chars().count()), Color::Muted)
    );
    for row in rows {
        println!("{}", row.join("  |  "));
    }
}
