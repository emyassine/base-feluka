#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "check", description = "Check the current application", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::check(context)
}
