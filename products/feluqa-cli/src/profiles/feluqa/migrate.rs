#![no_implicit_prelude]

#[feluqa::command(name = "migrate", description = "Apply application migrations", profiles = ["feluqa", "feluqa-dev"], context = "app-or-workspace")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../profiles-shared-commands/migrate.rs")
}
