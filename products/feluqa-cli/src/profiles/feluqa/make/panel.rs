#![no_implicit_prelude]

#[feluqa::command(name = "make panel", description = "Generate a panel provider", usage = "feluqa make panel <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../../profiles-shared-commands/make-panel.rs")
}
