#![no_implicit_prelude]

#[feluqa::command(name = "dev", description = "Build and run the current application with file watching", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/dev.rs")
}
