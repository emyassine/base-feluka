#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "update", description = "Update Feluqa from its configured distribution source", profiles = ["feluqa"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::update(context)
}
