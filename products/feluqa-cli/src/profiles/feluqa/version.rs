#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "version", description = "Print the Feluqa CLI version", profiles = ["feluqa", "nadim", "feluqa-dev"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::version(context)
}
