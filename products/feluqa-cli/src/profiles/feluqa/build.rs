#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "build", description = "Build the current application for release", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::build(context)
}
