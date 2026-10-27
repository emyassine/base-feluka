#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(
    name = "dev",
    description = "Build and run the current application with file watching",
    profiles = ["feluqa", "feluqa-dev"],
    context = "app"
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::dev(context)
}
