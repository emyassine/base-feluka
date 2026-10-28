#![no_implicit_prelude]

extern crate feluqa_definitions;
extern crate std;

use crate::CommandContext;
use crate::CommandResult;
use crate::ConsoleHost;
use feluqa_definitions::{FeluqaContext, FeluqaProduct};
use std::convert::From;
use std::ffi::OsString;
use std::iter::Iterator;
use std::option::Option;
use std::option::Option::Some;
use std::path::{Path, PathBuf};
use std::process::ExitCode;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::{String, ToString};
use std::vec::Vec;

pub use feluqa_definitions::FeluqaProduct as Application;
pub use feluqa_definitions::{
    read_product as read_application, workspace_product as workspace_application,
};

/// Platform location classified for CLI command requirements.
pub enum Context {
    /// A product root.
    App(FeluqaProduct),
    /// A development workspace root.
    Workspace(PathBuf),
    /// No known Feluqa root.
    Global,
}

/// Shared Feluqa platform host used by command line products.
pub struct FeluqaHost {
    /// Process working directory.
    pub current: PathBuf,
    /// Classified platform ownership context.
    pub context: Context,
    /// Exit status selected by the command.
    pub exit_code: ExitCode,
}

impl FeluqaHost {
    /// Discover the current platform context.
    pub fn new(current: &Path) -> Result<Self, String> {
        let definition = FeluqaContext::discover(current)
            .map_err(|error| std::format!("could not discover Feluqa context: {error}"))?;
        let context = if let Some(root) = definition.product_root() {
            Context::App(feluqa_definitions::read_product(root).map_err(|error| error.to_string())?)
        } else if let Some(root) = definition.workspace_root() {
            Context::Workspace(root.to_path_buf())
        } else {
            Context::Global
        };
        Ok(Self {
            current: current.to_path_buf(),
            context,
            exit_code: ExitCode::SUCCESS,
        })
    }
}

impl ConsoleHost for FeluqaHost {
    fn create(current: &Path) -> Result<Self, String> {
        Self::new(current)
    }
    fn exit_code(&self) -> ExitCode {
        self.exit_code
    }
    fn command_context(&self) -> &'static str {
        match &self.context {
            Context::App(_) => "app",
            Context::Workspace(_) => "workspace",
            Context::Global => "global",
        }
    }
    fn context_notice(&self, _profile: &str) -> Option<&'static str> {
        match &self.context {
            Context::App(_) => Some("Feluqa application detected."),
            Context::Workspace(_) => Some("Feluqa workspace detected."),
            Context::Global => Some("No Feluqa application or workspace detected."),
        }
    }
}

/// Convert console arguments to operating-system arguments.
pub fn arguments(command: &CommandContext<'_>) -> Vec<OsString> {
    command
        .arguments()
        .iter()
        .map(|argument| OsString::from(argument.as_str()))
        .collect()
}

/// Get the shared platform host attached by Console.
pub fn host<'a, 'b>(command: &'a mut CommandContext<'b>) -> Result<&'a mut FeluqaHost, String> {
    command
        .host::<FeluqaHost>()
        .ok_or_else(|| String::from("Feluqa CLI context is unavailable"))
}

/// Require a product context for a product command.
pub fn application(host: &FeluqaHost) -> Result<&FeluqaProduct, String> {
    match &host.context {
        Context::App(product) => Ok(product),
        Context::Workspace(_) => Err(String::from(
            "this command requires an application directory",
        )),
        Context::Global => Err(String::from("this command requires a Feluqa application")),
    }
}

/// Store the operation result in the shared host.
pub fn finish(host: &mut FeluqaHost, result: Result<ExitCode, String>) -> CommandResult {
    host.exit_code = result?;
    Ok(())
}

/// Find a containing workspace.
pub fn find_workspace(current: &Path) -> Option<PathBuf> {
    FeluqaContext::discover(current)
        .ok()?
        .workspace_root()
        .map(Path::to_path_buf)
}

/// Resolve the configured product source root for a workspace.
pub fn workspace_products_root(workspace: &Path) -> Result<PathBuf, String> {
    FeluqaContext::discover(workspace)
        .map_err(|error| error.to_string())?
        .workspace_products_root()
        .map_err(|error| error.to_string())
}
