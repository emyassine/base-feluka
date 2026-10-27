#![no_implicit_prelude]

#[feluqa::command(name = "make controller", description = "Generate a controller", usage = "feluqa make controller <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../../profiles-shared-commands/make-controller.rs")
}
