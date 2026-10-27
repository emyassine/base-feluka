#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "test", description = "Run the current application's tests", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::test(context)
}
