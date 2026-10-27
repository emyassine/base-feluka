#![no_implicit_prelude]

use crate::std::path::Path;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

pub(crate) fn run(workspace: &Path) -> Result<ExitCode, String> {
    crate::__feluqa_profile_feluqa::context::list_applications(workspace)
}
