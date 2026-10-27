#![no_implicit_prelude]

#[feluqa::command(name = "list", description = "List applications in the current Feluqa workspace", profiles = ["feluqa"], context = "workspace")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../profiles-shared-commands/list.rs")
}
