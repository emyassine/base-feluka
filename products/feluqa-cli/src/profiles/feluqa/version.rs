#![no_implicit_prelude]

#[feluqa::command(name = "version", description = "Print the Feluqa CLI version", profiles = ["feluqa", "nadim", "feluqa-dev"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../profiles-shared-commands/version.rs")
}
