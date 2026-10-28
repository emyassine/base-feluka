#![no_implicit_prelude]

use crate::feluqa;
use crate::std::clone::Clone;
use crate::std::cmp::Ord;
use crate::std::convert::From;
use crate::std::path::Path;
use crate::std::println;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::{String, ToString};

#[feluqa::command(
    name = "list",
    description = "List applications in the current Feluqa workspace",
    context = "workspace",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    crate::feluqa::console::ensure_context("in_dev")?;

    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let workspace = match &host.context {
        crate::__feluqa_profile_feluqa::context::Context::Workspace(workspace) => workspace.clone(),
        crate::__feluqa_profile_feluqa::context::Context::App(application) => {
            crate::__feluqa_profile_feluqa::context::find_workspace(&application.directory)
                .ok_or_else(|| String::from("this app is not inside a Feluqa workspace"))?
        }
        crate::__feluqa_profile_feluqa::context::Context::Global => {
            return crate::std::result::Result::Err(String::from(
                "`feluqa list` needs a Feluqa workspace",
            ));
        }
    };
    let result = list_applications(&workspace);
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}
fn list_applications(workspace: &Path) -> Result<ExitCode, String> {
    let mut applications = crate::feluqa::definitions::list_workspace_products(workspace)
        .map_err(|error| error.to_string())?;
    applications.sort_by(|left, right| left.display_name.cmp(&right.display_name));
    for application in applications {
        println!("{}  ({})", application.display_name, application.profile);
    }
    Ok(ExitCode::SUCCESS)
}
