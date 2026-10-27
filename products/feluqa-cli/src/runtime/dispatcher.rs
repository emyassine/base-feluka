#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate feluqa;
extern crate std;

use crate::context::CliHost;
use feluqa::console::{CommandContext, CommandRegistry, Profiles};
use std::convert::From;
use std::ffi::OsString;
use std::iter::{IntoIterator, Iterator};
use std::mem::drop;
use std::matches;
use std::option::Option;
use std::option::Option::{None, Some};
use std::path::Path;
use std::process::ExitCode;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;

pub(crate) fn run(arguments: Vec<OsString>, current: &Path, binary_name: &str) -> Result<ExitCode, String> {
    let (requested, arguments) = select_profile(arguments)?;
    let profiles = Profiles::new(crate::PROFILES).map_err(|error| error.to_string())?;
    let profile = profiles.select(requested.as_deref(), Some(binary_name)).map_err(|error| error.to_string())?;
    let registry = CommandRegistry::discover().map_err(|error| error.to_string())?;
    let words = arguments.iter().map(|argument| argument.to_str().map(String::from).ok_or_else(|| String::from("command names must be valid UTF-8"))).collect::<Result<Vec<_>, _>>()?;

    if words.is_empty() || matches!(words.first().map(String::as_str), Some("--help" | "-h")) {
        let show_hidden = words.iter().any(|word| word == "--all");
        registry.print_profile_help(profile, None, show_hidden).map_err(|error| error.to_string())?;
        return Ok(ExitCode::SUCCESS);
    }
    if words.first().is_some_and(|word| word == "help") {
        let topic = words.get(1..).unwrap_or_default().iter().filter(|word| word.as_str() != "--all").map(String::as_str).collect::<Vec<_>>().join(" ");
        let topic = if topic.is_empty() { None } else { Some(topic.as_str()) };
        registry.print_profile_help(profile, topic, words.iter().any(|word| word == "--all")).map_err(|error| error.to_string())?;
        return Ok(ExitCode::SUCCESS);
    }
    if let Some(help_at) = words.iter().position(|word| word == "--help" || word == "-h") {
        let topic = words[..help_at].iter().map(String::as_str).collect::<Vec<_>>().join(" ");
        let topic = if topic.is_empty() { None } else { Some(topic.as_str()) };
        registry.print_profile_help(profile, topic, false).map_err(|error| error.to_string())?;
        return Ok(ExitCode::SUCCESS);
    }

    let parsed = feluqa::console::parse(&registry, profile.id, &words).map_err(|error| {
        crate::std::format!("{error}; run `{} help` to list this profile's commands", profile.binary_name)
    })?;
    let mut host = CliHost::new(current)?;
    let mut command = CommandContext::new(profile.id, parsed.arguments, &mut host);
    (parsed.descriptor.handler)(&mut command)?;
    drop(command);
    Ok(host.exit_code)
}

fn select_profile(arguments: Vec<OsString>) -> Result<(Option<String>, Vec<OsString>), String> {
    let mut selected = None;
    let mut remaining = Vec::new();
    let mut iterator = arguments.into_iter();
    let mut before_command = true;
    while let Some(argument) = iterator.next() {
        let text = argument.to_str();
        if before_command && text.is_some_and(|value| value.starts_with("--profile=")) {
            let value = text.and_then(|value| value.strip_prefix("--profile=")).unwrap_or_default();
            if value.is_empty() { return Err(String::from("`--profile=` needs a profile name")); }
            selected = Some(String::from(value));
        } else if before_command && text == Some("--profile") {
            let value = iterator.next().ok_or_else(|| String::from("`--profile` needs a profile name"))?;
            selected = Some(value.into_string().map_err(|_| String::from("profile name must be valid UTF-8"))?);
        } else {
            before_command = false;
            remaining.push(argument);
        }
    }
    Ok((selected, remaining))
}
