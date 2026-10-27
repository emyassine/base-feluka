#![no_implicit_prelude]

#[feluqa::command(name = "test", description = "Run the current application's tests", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../profiles-shared-commands/test.rs")
}
