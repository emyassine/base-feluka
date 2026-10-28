#![no_implicit_prelude]

use crate::core::sync::atomic::{AtomicBool, Ordering};
use crate::std::clone::Clone;
use crate::std::cmp::Ord;
use crate::std::convert::From;
use crate::std::io::{self, IsTerminal, Write};
use crate::std::iter::{Extend, IntoIterator, Iterator};
use crate::std::ops::Drop;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};
use crate::std::vec::Vec;
use crate::std::{eprint, matches, print, println, vec, write};

static PREVIOUS_STATUS_BLOCK: AtomicBool = AtomicBool::new(false);

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

/// Styling for the console's compact message output.
#[derive(Clone, Copy)]
pub enum OutputStyle {
    /// Blue informational badge.
    Info,
    /// Green success badge.
    Success,
    /// Yellow warning badge.
    Warning,
    /// Red error badge.
    Error,
    /// Plain message without a badge.
    Plain,
}

impl From<&str> for OutputStyle {
    fn from(value: &str) -> Self {
        match value.to_ascii_lowercase().as_str() {
            "success" | "ok" => Self::Success,
            "warning" | "warn" => Self::Warning,
            "error" | "danger" => Self::Error,
            "plain" | "line" => Self::Plain,
            _ => Self::Info,
        }
    }
}

/// Whether stdin and stdout are interactive terminals.
pub fn interactive() -> bool {
    io::stdin().is_terminal() && io::stdout().is_terminal()
}

fn cursor_controls_enabled() -> bool {
    interactive()
        && crate::std::env::var("TERM")
            .map(|value| value != "dumb")
            .unwrap_or(true)
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

/// Format a status message with a blank line before and after it.
pub fn status_block(message: &str, style: OutputStyle) -> String {
    let label = match style {
        OutputStyle::Info => "INFO",
        OutputStyle::Success => "SUCCESS",
        OutputStyle::Warning => "WARNING",
        OutputStyle::Error => "ERROR",
        OutputStyle::Plain => return crate::std::format!("{message}\n"),
    };
    crate::std::format!("\n{}  {message}\n\n", badge(label, style))
}

/// Return a colored label with a contrasting background.
pub fn badge(label: &str, style: OutputStyle) -> String {
    if !colors_enabled() {
        return String::from(label);
    }
    let colors = match style {
        OutputStyle::Info => "30;46",
        OutputStyle::Success => "30;102",
        OutputStyle::Warning => "30;103",
        OutputStyle::Error => "97;41",
        OutputStyle::Plain => return String::from(label),
    };
    crate::std::format!("\u{1b}[1;{colors}m {label} \u{1b}[0m")
}

/// Write a message with the selected Laravel-style status badge.
pub fn echo(message: &str, style: OutputStyle) {
    let label = match style {
        OutputStyle::Info => Some("INFO"),
        OutputStyle::Success => Some("SUCCESS"),
        OutputStyle::Warning => Some("WARNING"),
        OutputStyle::Error => Some("ERROR"),
        OutputStyle::Plain => None,
    };
    match label {
        Some(_) => emit_status(message, style, false),
        None => {
            PREVIOUS_STATUS_BLOCK.store(false, Ordering::Relaxed);
            println!("{message}");
        }
    }
}

fn emit_status(message: &str, style: OutputStyle, stderr: bool) {
    let block = status_block(message, style);
    let rendered = if PREVIOUS_STATUS_BLOCK.swap(true, Ordering::Relaxed) {
        block.strip_prefix('\n').unwrap_or(&block)
    } else {
        block.as_str()
    };
    if stderr {
        eprint!("{rendered}");
        let _ = io::stderr().flush();
    } else {
        print!("{rendered}");
        let _ = io::stdout().flush();
    }
}

/// Start a new status-message spacing sequence after output outside this module.
pub fn reset_status_spacing() {
    PREVIOUS_STATUS_BLOCK.store(false, Ordering::Relaxed);
}

/// Write a message using a built-in style name (`info`, `success`, `warning`, `error`, `plain`).
pub fn echo_kind(message: &str, style: &str) {
    echo(message, OutputStyle::from(style));
}

/// Write a blank line.
pub fn blankline() {
    println!();
}

/// Alias for [`blankline`].
pub fn blank_line() {
    blankline();
}

/// Format a command and description with terminal-width-aware dotted leaders.
pub fn command_entry(name: &str, description: &str) -> String {
    // Keep the same breathing room on the right that the two-space indent
    // creates on the left.
    let width = columns().saturating_sub(2);
    let name_width = name.chars().count() + 2;
    let description_width = description.chars().count();
    let dots = width.saturating_sub(name_width + description_width + 2);
    if dots >= 3 {
        return crate::std::format!(
            "  {} {} {}",
            paint(name, Color::Cyan),
            paint(&".".repeat(dots), Color::Muted),
            paint(description, Color::Muted)
        );
    }

    let wrapped = wrap(description, width.saturating_sub(6).max(10));
    let mut lines = Vec::with_capacity(wrapped.len() + 1);
    lines.push(crate::std::format!("  {}", paint(name, Color::Cyan)));
    lines.extend(
        wrapped
            .into_iter()
            .map(|line| crate::std::format!("      {}", paint(&line, Color::Muted))),
    );
    lines.join("\n")
}

/// Current terminal width, honoring the conventional `COLUMNS` setting.
pub fn columns() -> usize {
    let terminal_width = if io::stdout().is_terminal() {
        crate::crossterm::terminal::size()
            .ok()
            .map(|(width, _)| usize::from(width))
            .filter(|width| (20..=500).contains(width))
    } else {
        None
    };
    terminal_width.or_else(configured_columns).unwrap_or(80)
}

fn configured_columns() -> Option<usize> {
    crate::std::env::var("COLUMNS")
        .ok()
        .and_then(|value| value.parse::<usize>().ok())
        .filter(|width| (20..=500).contains(width))
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
    echo(message, OutputStyle::Success);
}

/// Write a cyan informational line.
pub fn info(message: &str) {
    emit_status(message, OutputStyle::Info, false);
}

/// Write a yellow warning line to stderr.
pub fn warning(message: &str) {
    emit_status(message, OutputStyle::Warning, true);
}

/// Write a red error line to stderr.
pub fn error(message: &str) {
    emit_status(message, OutputStyle::Error, true);
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
    reset_status_spacing();
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

/// Choose one option with arrow keys, or by number in a non-interactive terminal.
pub fn select(label: &str, options: &[&str], default: usize) -> Result<usize, String> {
    if options.is_empty() {
        return Err(String::from("select requires at least one option"));
    }
    if default >= options.len() {
        return Err(String::from(
            "default choice is outside the available range",
        ));
    }
    if cursor_controls_enabled() {
        return interactive_select(label, options, default);
    }
    println!("{}", paint(label, Color::Accent));
    for (index, option) in options.iter().enumerate() {
        println!(
            "  {}  {option}",
            paint(&crate::std::format!("{}.", index + 1), Color::Cyan)
        );
    }
    let answer = text(
        "Choice",
        Some("enter a number"),
        Some(&crate::std::format!("{}", default + 1)),
        true,
    )?;
    let selected = answer.parse::<usize>().map_err(|error| error.to_string())?;
    if selected == 0 || selected > options.len() {
        return Err(String::from("choice is outside the available range"));
    }
    Ok(selected - 1)
}

/// Choose any number of options with arrows and the space bar.
pub fn multiselect(
    label: &str,
    options: &[&str],
    defaults: &[usize],
) -> Result<Vec<usize>, String> {
    if options.is_empty() {
        return Err(String::from("multiselect requires at least one option"));
    }
    if !cursor_controls_enabled() {
        return Err(String::from(
            "multiselect requires an interactive terminal with cursor controls",
        ));
    }
    if defaults.iter().any(|index| *index >= options.len()) {
        return Err(String::from(
            "a default selection is outside the available range",
        ));
    }
    let mut selected = vec![false; options.len()];
    for index in defaults {
        if let Some(value) = selected.get_mut(*index) {
            *value = true;
        }
    }
    let _cursor = interactive_choices(label, options, 0, &mut selected, true)?;
    Ok(selected
        .iter()
        .enumerate()
        .filter_map(|(index, is_selected)| if *is_selected { Some(index) } else { None })
        .collect())
}

fn interactive_select(label: &str, options: &[&str], default: usize) -> Result<usize, String> {
    let mut selected = vec![false; options.len()];
    selected[default.min(options.len() - 1)] = true;
    let index = interactive_choices(
        label,
        options,
        default.min(options.len() - 1),
        &mut selected,
        false,
    )?;
    Ok(index)
}

fn interactive_choices(
    label: &str,
    options: &[&str],
    mut cursor: usize,
    selected: &mut [bool],
    multiple: bool,
) -> Result<usize, String> {
    use crate::crossterm::ExecutableCommand;
    use crate::crossterm::cursor::{MoveToColumn, MoveUp};
    use crate::crossterm::event::{self, Event, KeyCode, KeyEventKind, KeyModifiers};
    use crate::crossterm::terminal::{Clear, ClearType, enable_raw_mode};
    use crate::std::io::stdout;
    use crate::std::sync::Arc;
    use crate::std::sync::atomic::{AtomicUsize, Ordering};
    use crate::std::time::Duration;

    let mut signals = SignalGuard::new();
    enable_raw_mode().map_err(|error| error.to_string())?;
    let _raw_mode = RawMode;
    let interrupted = Arc::new(AtomicUsize::new(0));
    signals.register(crate::signal_hook::consts::SIGINT, &interrupted, 130)?;
    signals.register(crate::signal_hook::consts::SIGTERM, &interrupted, 143)?;
    let mut output = stdout();
    draw_choices(&mut output, label, options, cursor, selected, multiple)
        .map_err(|error| error.to_string())?;
    loop {
        let exit_status = interrupted.load(Ordering::SeqCst);
        if exit_status != 0 {
            finish_choices(&mut output).map_err(|error| error.to_string())?;
            return Err(if exit_status == 130 {
                String::from("interrupted")
            } else {
                String::from("terminated")
            });
        }
        if !event::poll(Duration::from_millis(100)).map_err(|error| {
            if error.kind() == crate::std::io::ErrorKind::Interrupted {
                if interrupted.load(Ordering::SeqCst) == 143 {
                    String::from("terminated")
                } else {
                    String::from("interrupted")
                }
            } else {
                error.to_string()
            }
        })? {
            continue;
        }
        match event::read().map_err(|error| {
            if error.kind() == crate::std::io::ErrorKind::Interrupted {
                if interrupted.load(Ordering::SeqCst) == 143 {
                    String::from("terminated")
                } else {
                    String::from("interrupted")
                }
            } else {
                error.to_string()
            }
        })? {
            Event::Key(key) if matches!(key.kind, KeyEventKind::Press | KeyEventKind::Repeat) => {
                match key.code {
                    KeyCode::Up => cursor = cursor.saturating_sub(1),
                    KeyCode::Down => cursor = (cursor + 1).min(options.len() - 1),
                    KeyCode::Home => cursor = 0,
                    KeyCode::End => cursor = options.len() - 1,
                    KeyCode::Char(' ') if multiple => selected[cursor] = !selected[cursor],
                    KeyCode::Enter => {
                        finish_choices(&mut output).map_err(|error| error.to_string())?;
                        if multiple {
                            return Ok(cursor);
                        }
                        selected.fill(false);
                        selected[cursor] = true;
                        return Ok(cursor);
                    }
                    KeyCode::Esc | KeyCode::Char('q') => {
                        finish_choices(&mut output).map_err(|error| error.to_string())?;
                        return Err(String::from("selection cancelled"));
                    }
                    KeyCode::Char('c') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                        finish_choices(&mut output).map_err(|error| error.to_string())?;
                        return Err(String::from("interrupted"));
                    }
                    KeyCode::Char('d') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                        finish_choices(&mut output).map_err(|error| error.to_string())?;
                        return Err(String::from("selection cancelled"));
                    }
                    KeyCode::Char(value) if !multiple && value.is_ascii_digit() => {
                        let index = value.to_digit(10).unwrap_or(0) as usize;
                        if index > 0 && index <= options.len() {
                            finish_choices(&mut output).map_err(|error| error.to_string())?;
                            return Ok(index - 1);
                        }
                    }
                    _ => {}
                }
                output
                    .execute(MoveToColumn(0))
                    .and_then(|stream| stream.execute(MoveUp((options.len() + 2) as u16)))
                    .and_then(|stream| stream.execute(Clear(ClearType::FromCursorDown)))
                    .map_err(|error| error.to_string())?;
                draw_choices(&mut output, label, options, cursor, selected, multiple)
                    .map_err(|error| error.to_string())?;
            }
            Event::Resize(_, _) => {
                output
                    .execute(MoveToColumn(0))
                    .and_then(|stream| stream.execute(MoveUp((options.len() + 2) as u16)))
                    .and_then(|stream| stream.execute(Clear(ClearType::FromCursorDown)))
                    .map_err(|error| error.to_string())?;
                draw_choices(&mut output, label, options, cursor, selected, multiple)
                    .map_err(|error| error.to_string())?;
            }
            _ => {}
        }
    }
}

fn draw_choices<W: Write>(
    output: &mut W,
    label: &str,
    options: &[&str],
    cursor: usize,
    selected: &[bool],
    multiple: bool,
) -> crate::std::io::Result<()> {
    write!(output, "{}\r\n", paint(label, Color::Accent))?;
    for (index, option) in options.iter().enumerate() {
        let option = truncate(option, columns().saturating_sub(10).max(10));
        let marker = if index == cursor {
            paint("›", Color::Green)
        } else {
            String::from(" ")
        };
        let check = if multiple {
            if selected[index] { "[x]" } else { "[ ]" }
        } else {
            "   "
        };
        let value = crate::std::format!("  {marker} {check} {option}");
        if index == cursor {
            write!(output, "{}", reverse_video(&value))?;
        } else {
            write!(output, "{value}")?;
        }
        output.write_all(b"\r\n")?;
    }
    write!(
        output,
        "{}\r\n",
        paint(
            if multiple {
                "↑/↓ move · space toggle · enter done · q cancel"
            } else {
                "↑/↓ move · enter select · number shortcut · q cancel"
            },
            Color::Muted
        )
    )?;
    output.flush()
}

fn finish_choices<W: Write>(output: &mut W) -> crate::std::io::Result<()> {
    output.write_all(b"\r\n")?;
    output.flush()
}

fn reverse_video(value: &str) -> String {
    if colors_enabled() {
        crate::std::format!("\u{1b}[7m{value}\u{1b}[0m")
    } else {
        String::from(value)
    }
}

fn truncate(value: &str, maximum: usize) -> String {
    if value.chars().count() <= maximum {
        return String::from(value);
    }
    let mut shortened = value
        .chars()
        .take(maximum.saturating_sub(1))
        .collect::<String>();
    shortened.push('…');
    shortened
}

struct RawMode;

impl Drop for RawMode {
    fn drop(&mut self) {
        let _ = crate::crossterm::terminal::disable_raw_mode();
    }
}

struct SignalGuard(Vec<crate::signal_hook::SigId>);

impl SignalGuard {
    fn new() -> Self {
        Self(Vec::new())
    }

    fn register(
        &mut self,
        signal: crate::std::os::raw::c_int,
        interrupted: &crate::std::sync::Arc<crate::std::sync::atomic::AtomicUsize>,
        exit_status: usize,
    ) -> Result<(), String> {
        let id = crate::signal_hook::flag::register_usize(
            signal,
            crate::std::sync::Arc::clone(interrupted),
            exit_status,
        )
        .map_err(|error| {
            crate::std::format!("could not register terminal signal handler: {error}")
        })?;
        self.0.push(id);
        Ok(())
    }
}

impl Drop for SignalGuard {
    fn drop(&mut self) {
        for signal in self.0.drain(..) {
            let _ = crate::signal_hook::low_level::unregister(signal);
        }
    }
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
