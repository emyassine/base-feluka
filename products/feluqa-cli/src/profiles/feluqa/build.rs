#![no_implicit_prelude]

#[feluqa::command(name = "build", description = "Build the current application for release", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/build.rs")
}
