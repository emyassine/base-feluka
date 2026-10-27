#![no_implicit_prelude]

#[feluqa::command(name = "make migration", description = "Generate dialect-specific ordered SQL migrations", usage = "feluqa make migration <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/migration.rs")
}
