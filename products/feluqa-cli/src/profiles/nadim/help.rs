#![no_implicit_prelude]

use crate::feluqa;
use crate::std::string::ToString;

#[feluqa::command(
    name = "help",
    description = "Show commands available in the selected profile",
    context = "any",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let registry = feluqa::console::CommandRegistry::discover()
        .map_err(|error| error.to_string())?;
    let topic = context.arguments().join(" ");
    let topic = if topic.is_empty() {
        ::core::option::Option::None
    } else {
        ::core::option::Option::Some(topic.as_str())
    };
    registry
        .print_help_in_context_with_notice(
            context.profile(),
            "nadim",
            topic,
            false,
            context.command_context(),
            context.context_notice(),
        )
        .map_err(|error| error.to_string())
}
