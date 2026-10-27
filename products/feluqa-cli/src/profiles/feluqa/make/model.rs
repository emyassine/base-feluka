#![no_implicit_prelude]

#[feluqa::command(name = "make model", description = "Generate a model", usage = "feluqa make model <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../../profiles-shared-commands/make-model.rs")
}
