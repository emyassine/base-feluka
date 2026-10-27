#![no_implicit_prelude]

#[feluqa::command(name = "make service", description = "Generate a business service", usage = "feluqa make service <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../profiles-shared-commands/service.rs")
}
