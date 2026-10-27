#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "make controller", description = "Generate a controller", usage = "feluqa make controller <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::make_controller(context)
}
