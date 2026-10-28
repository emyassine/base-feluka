#![no_implicit_prelude]

use crate::feluqa;
use crate::std::println;
use crate::std::process::ExitCode;

#[feluqa::command(
    name = "version",
    description = "Print the Feluqa CLI version",
    aliases = ["v", "--version", "-V"],
    context = "anywhere",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let host = crate::feluqa::console::platform::host(context)?;
    host.exit_code = version();
    crate::std::result::Result::Ok(())
}

fn version() -> ExitCode {
    println!("feluqa v{}", crate::feluqa::VERSION);
    ExitCode::SUCCESS
}
