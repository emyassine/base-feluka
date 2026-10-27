#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]
#![cfg_attr(not(feature = "std"), no_std)]

//! Reusable command registration, profile selection, argument parsing and terminal I/O.
//!
//! Commands are ordinary compiled Rust functions. The registry sees only
//! commands that the containing product has compiled and linked.

extern crate alloc;
extern crate core;
pub extern crate inventory;
extern crate feluqa_console_macros;
#[cfg(feature = "std")]
extern crate std;

pub use feluqa_console_macros::command;

use alloc::string::{String, ToString};
use alloc::vec::Vec;
use core::any::Any;
use core::cmp::Ord;
use core::fmt;
use core::iter::{IntoIterator, Iterator};
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::{write, writeln};

/// Result returned by a command handler.
pub type CommandResult = Result<(), String>;

/// Arguments passed to a compiled console command.
pub struct CommandContext<'a> {
    profile: &'a str,
    arguments: &'a [String],
    host: &'a mut dyn Any,
}

impl<'a> CommandContext<'a> {
    /// Create a context for a product-specific command host.
    pub fn new(profile: &'a str, arguments: &'a [String], host: &'a mut dyn Any) -> Self {
        Self { profile, arguments, host }
    }

    /// Selected console profile.
    pub fn profile(&self) -> &str { self.profile }

    /// Positional arguments and options after the command path.
    pub fn arguments(&self) -> &[String] { self.arguments }

    /// Access product-specific state installed by the host application.
    pub fn host<T: Any>(&mut self) -> Option<&mut T> { self.host.downcast_mut::<T>() }
}

/// Metadata and handler registered by `#[feluqa::command]`.
pub struct CommandDescriptor {
    /// Canonical command path, with spaces between family words.
    pub name: &'static str,
    /// Short help description.
    pub description: &'static str,
    /// Optional complete usage string.
    pub usage: Option<&'static str>,
    /// Alternate command paths.
    pub aliases: &'static [&'static str],
    /// Profiles that expose this command; empty means every profile.
    pub profiles: &'static [&'static str],
    /// Product-defined execution context label, such as `global`, `workspace`, or `app`.
    pub context: &'static str,
    /// Omit this command from ordinary help while keeping it callable.
    pub hidden: bool,
    /// Compiled command implementation.
    pub handler: for<'a> fn(&mut CommandContext<'a>) -> CommandResult,
}

inventory::collect!(CommandDescriptor);

/// A selected CLI profile and the command set it enables.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Profile {
    /// Stable profile identifier.
    pub id: &'static str,
    /// Human-readable profile name.
    pub name: &'static str,
    /// Binary name that selects this profile automatically.
    pub binary_name: &'static str,
    /// Product-relative command source folder used by the product build script.
    pub commands_directory: &'static str,
    /// Multiline header printed before generated help.
    pub header: &'static str,
    /// Optional executable alias that selects this profile.
    pub launch_aliases: &'static [&'static str],
}

/// Error encountered while creating or querying a command registry.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RegistryError {
    /// Two commands or aliases resolve to the same path.
    DuplicatePath(String),
    /// No command matched the requested path.
    UnknownCommand(String),
    /// A supplied profile is not configured by the product.
    UnknownProfile(String),
}

impl fmt::Display for RegistryError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::DuplicatePath(path) => write!(formatter, "duplicate console command path `{path}`"),
            Self::UnknownCommand(path) => write!(formatter, "unknown command `{path}`"),
            Self::UnknownProfile(profile) => write!(formatter, "unknown console profile `{profile}`"),
        }
    }
}

/// Deterministic view over the linked command inventory.
pub struct CommandRegistry {
    commands: Vec<&'static CommandDescriptor>,
}

impl CommandRegistry {
    /// Collect, sort and validate every linked command descriptor.
    pub fn discover() -> Result<Self, RegistryError> {
        let mut commands: Vec<&'static CommandDescriptor> = inventory::iter::<CommandDescriptor>().collect();
        commands.sort_by(|left, right| left.name.cmp(right.name));
        let mut paths: Vec<&str> = Vec::new();
        for command in &commands {
            for path in core::iter::once(command.name).chain(command.aliases.iter().copied()) {
                if paths.iter().any(|known| *known == path) {
                    return Err(RegistryError::DuplicatePath(path.to_string()));
                }
                paths.push(path);
            }
        }
        Ok(Self { commands })
    }

    /// List commands visible in a profile, sorted by canonical name.
    pub fn commands(&self, profile: &str, include_hidden: bool) -> Vec<&'static CommandDescriptor> {
        self.commands.iter().copied().filter(|command| {
            (include_hidden || !command.hidden)
                && (command.profiles.is_empty() || command.profiles.contains(&profile))
        }).collect()
    }

    /// Resolve a canonical path or alias for the selected profile.
    pub fn resolve(&self, profile: &str, path: &str) -> Result<&'static CommandDescriptor, RegistryError> {
        self.commands.iter().copied().find(|command| {
            (command.profiles.is_empty() || command.profiles.contains(&profile))
                && (command.name == path || command.aliases.contains(&path))
        }).ok_or_else(|| RegistryError::UnknownCommand(path.to_string()))
    }

    /// Print generated root or command help to stdout.
    #[cfg(feature = "std")]
    pub fn print_help(&self, profile: &str, product: &str, topic: Option<&str>, include_hidden: bool) -> Result<(), RegistryError> {
        use std::io::{self, Write};
        let mut output = io::stdout().lock();
        if let Some(topic) = topic {
            if let Ok(command) = self.resolve(profile, topic) {
                writeln!(output, "{}", command.usage.unwrap_or(command.name)).map_err(io_error)?;
                writeln!(output, "\n{}", command.description).map_err(io_error)?;
                if !command.aliases.is_empty() { writeln!(output, "Aliases: {}", command.aliases.join(", ")).map_err(io_error)?; }
                writeln!(output, "Profile: {} · Context: {}", profile, command.context).map_err(io_error)?;
                return Ok(());
            }
            let children: Vec<&'static CommandDescriptor> = self.commands(profile, include_hidden).into_iter().filter(|command| command.name.starts_with(topic) && command.name.as_bytes().get(topic.len()) == Some(&b' ')).collect();
            if !children.is_empty() {
                writeln!(output, "{product} {topic}\n").map_err(io_error)?;
                for command in children { writeln!(output, "  {:<32} {}", command.name, command.description).map_err(io_error)?; }
                return Ok(());
            }
            return Err(RegistryError::UnknownCommand(topic.to_string()));
        }
        writeln!(output, "{product} · profile {profile}\n").map_err(io_error)?;
        writeln!(output, "Usage: {product} [--profile=<name>] <command> [arguments]\n").map_err(io_error)?;
        for command in self.commands(profile, include_hidden) {
            let aliases = if command.aliases.is_empty() { String::new() } else { alloc::format!(" (aliases: {})", command.aliases.join(", ")) };
            writeln!(output, "  {:<32} {}{}", command.name, command.description, aliases).map_err(io_error)?;
        }
        writeln!(output, "\nRun `{product} help <command>` for details.").map_err(io_error)?;
        Ok(())
    }

    /// Print the profile header followed by its generated help.
    #[cfg(feature = "std")]
    pub fn print_profile_help(&self, profile: &Profile, topic: Option<&str>, include_hidden: bool) -> Result<(), RegistryError> {
        use std::io::{self, Write};
        if !profile.header.is_empty() {
            let mut output = io::stdout().lock();
            writeln!(output, "{}\n", profile.header).map_err(io_error)?;
        }
        self.print_help(profile.id, profile.binary_name, topic, include_hidden)
    }
}

/// Parse a command path by selecting the longest registered path prefix.
pub fn parse<'a>(registry: &CommandRegistry, profile: &str, words: &'a [String]) -> Result<ParsedCommand<'a>, RegistryError> {
    let mut best: Option<(&'static CommandDescriptor, usize)> = None;
    for descriptor in registry.commands(profile, true) {
        for path in core::iter::once(descriptor.name).chain(descriptor.aliases.iter().copied()) {
            let parts: Vec<&str> = path.split(' ').collect();
            if parts.len() <= words.len() && parts.iter().zip(words.iter()).all(|(part, word)| *part == word.as_str()) {
                if best.map(|(_, length)| parts.len() > length).unwrap_or(true) {
                    best = Some((descriptor, parts.len()));
                }
            }
        }
    }
    match best {
        Some((descriptor, consumed)) => Ok(ParsedCommand { descriptor, arguments: &words[consumed..] }),
        None => Err(RegistryError::UnknownCommand(words.join(" "))),
    }
}

/// Parsed command and untouched argument tail.
pub struct ParsedCommand<'a> {
    /// Resolved canonical command.
    pub descriptor: &'static CommandDescriptor,
    /// Arguments after the longest command path.
    pub arguments: &'a [String],
}

/// Configured profile registry shared by products built on Feluqa Console.
pub struct Profiles {
    entries: &'static [Profile],
}

impl Profiles {
    /// Create a profile set and verify unique IDs and aliases.
    pub fn new(entries: &'static [Profile]) -> Result<Self, RegistryError> {
        for (index, profile) in entries.iter().enumerate() {
            if entries[..index].iter().any(|previous| previous.id == profile.id || previous.launch_aliases.iter().any(|alias| profile.launch_aliases.contains(alias))) {
                return Err(RegistryError::DuplicatePath(profile.id.to_string()));
            }
        }
        Ok(Self { entries })
    }

    /// Resolve an ID or executable alias; `default` is the first entry.
    pub fn select(&self, requested: Option<&str>, executable: Option<&str>) -> Result<&'static Profile, RegistryError> {
        let selected = requested.or_else(|| executable.and_then(|name| self.entries.iter().find(|profile| profile.binary_name == name || profile.launch_aliases.contains(&name)).map(|profile| profile.id))).unwrap_or("feluqa");
        self.entries.iter().find(|profile| profile.id == selected).ok_or_else(|| RegistryError::UnknownProfile(selected.to_string()))
    }
}

#[cfg(feature = "std")]
fn io_error(error: std::io::Error) -> RegistryError { RegistryError::UnknownCommand(error.to_string()) }

/// Terminal prompts and output helpers for console commands.
#[cfg(feature = "std")]
pub mod terminal {
    #![no_implicit_prelude]

    use crate::std::io::{self, IsTerminal, Write};
    use crate::std::convert::From;
    use crate::std::cmp::Ord;
    use crate::std::iter::Iterator;
    use crate::std::option::Option;
    use crate::std::option::Option::{None, Some};
    use crate::std::string::{String, ToString};
    use crate::std::vec::Vec;
    use crate::std::result::Result;
    use crate::std::result::Result::{Err, Ok};
    use crate::std::{eprintln, print, println};

    /// Whether stdin and stdout are interactive terminals.
    pub fn interactive() -> bool { io::stdin().is_terminal() && io::stdout().is_terminal() }
    /// Write a success line.
    pub fn success(message: &str) { println!("✓ {message}"); }
    /// Write an informational line.
    pub fn info(message: &str) { println!("{message}"); }
    /// Write a warning line to stderr.
    pub fn warning(message: &str) { eprintln!("Warning: {message}"); }
    /// Write an error line to stderr.
    pub fn error(message: &str) { eprintln!("Error: {message}"); }
    /// Display a titled callout using portable plain-text formatting.
    pub fn callout(label: &str, content: &str) { println!("\n{label}\n{}\n{content}\n", "─".repeat(label.len().max(content.len()))); }

    /// Ask for a required or optional text value with a default.
    pub fn text(label: &str, placeholder: Option<&str>, default: Option<&str>, required: bool) -> Result<String, String> {
        let hint = placeholder.unwrap_or("");
        let fallback = default.unwrap_or("");
        print!("{label}{}{}: ", if hint.is_empty() { "" } else { " (" }, if hint.is_empty() { "" } else { hint });
        if !fallback.is_empty() { print!("[{fallback}] "); }
        io::stdout().flush().map_err(|error| error.to_string())?;
        let mut value = String::new();
        io::stdin().read_line(&mut value).map_err(|error| error.to_string())?;
        let value = value.trim().to_string();
        let resolved = if value.is_empty() { fallback.to_string() } else { value };
        if required && resolved.is_empty() { return Err(String::from("a value is required")); }
        Ok(resolved)
    }

    /// Ask a yes/no question.
    pub fn confirm(label: &str, default: bool) -> Result<bool, String> {
        let marker = if default { "Y/n" } else { "y/N" };
        let answer = text(&crate::std::format!("{label} [{marker}]"), None, None, false)?;
        match answer.to_lowercase().as_str() { "y" | "yes" => Ok(true), "n" | "no" => Ok(false), "" => Ok(default), _ => Err(String::from("answer with yes or no")) }
    }

    /// Choose one option by its displayed number.
    pub fn select(label: &str, options: &[&str], default: usize) -> Result<usize, String> {
        if options.is_empty() { return Err(String::from("select requires at least one option")); }
        println!("{label}");
        for (index, option) in options.iter().enumerate() { println!("  {}. {}{}", index + 1, option, if index == default { " (default)" } else { "" }); }
        let answer = text("Choice", None, Some(&crate::std::format!("{}", default + 1)), true)?;
        let selected = answer.parse::<usize>().map_err(|error| error.to_string())?;
        if selected == 0 || selected > options.len() { return Err(String::from("choice is outside the available range")); }
        Ok(selected - 1)
    }

    /// Display a simple aligned table.
    pub fn table(headers: &[&str], rows: &[Vec<String>]) {
        println!("{}", headers.join("  |  "));
        println!("{}", "─".repeat(headers.join("  |  ").len()));
        for row in rows { println!("{}", row.join("  |  ")); }
    }
}
