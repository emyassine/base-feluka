#![no_implicit_prelude]

#[feluqa::command(name = "check", description = "Check the current application", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/check.rs")
}
