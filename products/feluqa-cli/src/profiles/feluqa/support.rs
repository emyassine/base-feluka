#![no_implicit_prelude]

#[path = "support/app.rs"]
pub(crate) mod app;
#[path = "support/global.rs"]
pub(crate) mod global;
#[path = "support/make.rs"]
pub(crate) mod make;
#[path = "support/context.rs"]
pub(crate) mod context;
#[path = "support/handlers.rs"]
pub(crate) mod handlers;

impl crate::feluqa::console::ConsoleHost for context::CliHost {
    fn create(current_directory: &crate::std::path::Path) -> crate::std::result::Result<Self, crate::std::string::String> {
        context::CliHost::new(current_directory)
    }

    fn exit_code(&self) -> crate::std::process::ExitCode {
        self.exit_code
    }
}
