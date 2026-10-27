#![no_implicit_prelude]

#[feluqa::command(name = "make resource", description = "Generate a permission-aware CRUD resource", usage = "feluqa make resource <arguments>", profiles = ["feluqa", "feluqa-dev"], context = "app")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    include!("../../../../profiles-shared-commands/make-resource.rs")
}
