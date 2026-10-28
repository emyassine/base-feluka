#![no_implicit_prelude]

use crate::feluqa;
use crate::std::println;

#[feluqa::command(
    name = "version",
    description = "Print the Feluqa CLI version",
    aliases = ["v", "--version", "-V"],
    context = "any",
)]
pub(crate) fn run(
    _context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    println!("feluqa v{}", feluqa::VERSION);
    crate::std::result::Result::Ok(())
}
