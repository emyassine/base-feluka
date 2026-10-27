#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "migrate", description = "Apply application migrations", profiles = ["feluqa", "feluqa-dev"], context = "app-or-workspace")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::migrate(context)
}
