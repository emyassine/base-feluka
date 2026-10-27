#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "list", description = "List applications in the current Feluqa workspace", profiles = ["feluqa"], context = "workspace")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::list(context)
}
