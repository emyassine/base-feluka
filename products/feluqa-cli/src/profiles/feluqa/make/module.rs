#![no_implicit_prelude]

#[feluqa::command(name = "make module", description = "Generate a Feluqa module source", usage = "feluqa make module <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/module.rs")
}
