#![no_implicit_prelude]

#[feluqa::command(name = "new", description = "Create a Feluqa application", profiles = ["feluqa"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../profiles-shared-commands/new.rs")
}
