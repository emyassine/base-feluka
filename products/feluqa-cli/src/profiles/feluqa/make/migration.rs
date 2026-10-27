#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "make migration", description = "Generate dialect-specific ordered SQL migrations", usage = "feluqa make migration <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::make_migration(context)
}
