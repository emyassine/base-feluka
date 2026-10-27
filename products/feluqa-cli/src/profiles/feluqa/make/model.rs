#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "make model", description = "Generate a model", usage = "feluqa make model <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    crate::__feluqa_profile_feluqa::handlers::make_model(context)
}
