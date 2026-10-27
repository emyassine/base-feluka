#![no_implicit_prelude]

#[feluqa::command(name = "seed", description = "Run one registered application seeder", profiles = ["feluqa", "feluqa-dev"], context = "app-or-workspace")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/seed.rs")
}
