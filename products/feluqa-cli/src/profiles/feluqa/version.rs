#![no_implicit_prelude]

use crate::feluqa;

#[feluqa::command(name = "version", description = "Print the Feluqa CLI version", profiles = ["feluqa", "nadim", "feluqa-dev"], context = "any")]
pub(crate) fn run(context: &mut feluqa::console::CommandContext<'_>) -> feluqa::console::CommandResult {
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    host.exit_code = version();
    crate::std::result::Result::Ok(())
}

use crate::std::println;
use crate::std::process::ExitCode;

fn version() -> ExitCode {
    println!("feluqa {}", env!("CARGO_PKG_VERSION"));
    ExitCode::SUCCESS
}
