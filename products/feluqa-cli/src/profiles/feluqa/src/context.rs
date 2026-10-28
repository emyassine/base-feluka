#![no_implicit_prelude]

pub(crate) use crate::feluqa::console::platform::Context;
pub(crate) use crate::feluqa::console::platform::FeluqaHost as CliHost;
pub(crate) use crate::feluqa::console::platform::arguments;
pub(crate) use crate::feluqa::console::platform::application;
pub(crate) use crate::feluqa::console::platform::finish;
pub(crate) use crate::feluqa::console::platform::find_workspace;
pub(crate) use crate::feluqa::console::platform::host;
pub(crate) use crate::feluqa::console::platform::workspace_products_root;
pub(crate) use crate::feluqa::console::platform::Application;
pub(crate) use crate::feluqa::console::platform::read_application;
pub(crate) use crate::feluqa::console::platform::workspace_application;

crate::feluqa::console::register_host!(feluqa_context_host, super::CliHost, crate::PROFILES);
