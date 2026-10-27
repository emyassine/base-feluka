#![no_implicit_prelude]

#[feluqa::command(name = "update", description = "Update Feluqa from its configured distribution source", profiles = ["feluqa"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../profiles-shared-commands/update.rs")
}
